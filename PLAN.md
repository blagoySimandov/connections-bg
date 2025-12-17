# Game History Sync Implementation Plan

## Overview
Sync game results to Firebase when a game ends (won or lost). Store user history for statistics and track global puzzle stats.

## Goals
- Save game history to Firebase for logged-in users under `users/{userId}/history/{puzzleId}`
- Update puzzle stats (played count, solved count) for all users (logged in or not)
- Minimal changes, clean code, good readability
- Remove unnecessary useEffects where possible

## Current State Analysis

### Game End Detection
- Location: `src/pages/game/components/connections-game.tsx:52-53`
- Variables: `gameWon` (boolean), `gameLost` (boolean)
- Calculated every render based on `solvedGroups.length === 4` or `mistakes >= MAX_MISTAKES`

### Game State
- Managed in `use-game-state.ts`
- Available data:
  - `mistakes`: number of mistakes made
  - `solvedGroups`: array of solved groups with categories and words
  - `attemptHistory`: array of all attempts with category info
  - `words`: current word arrangement
  - `puzzle.date`: puzzle date
  - `puzzle.id`: puzzle identifier

### Auth State
- Available via `useAuth()` hook
- Provides `user` (Firebase User | null) and `userData` (UserData | null)

### Firebase Setup
- Uses Firestore Lite SDK
- Existing services: UserService, PuzzleService
- Collections: `users`, `connections`

## Implementation Steps

### 1. Create GameHistoryService
**File**: `src/shared/services/game-history.service.ts`

Methods:
- `saveGameHistory(userId, puzzleId, historyData)`: Save user game history
  - Path: `users/{userId}/history/{puzzleId}`
  - Data model:
    ```typescript
    {
      puzzleId: string
      puzzleDate: string (ISO)
      completed: boolean (always true when saving)
      won: boolean
      mistakes: number
      solvedGroups: SolvedGroup[]
      attemptHistory: AttemptHistory[]
      completedAt: string (ISO timestamp)
    }
    ```

- `updatePuzzleStats(puzzleId, won)`: Update puzzle statistics
  - Path: `connections/{puzzleId}`
  - Increments: `stats.playedCount` (always), `stats.solvedCount` (if won)
  - Use Firestore increment for atomic updates

### 2. Add Types
**File**: `src/shared/types.ts`

Add:
```typescript
export interface GameHistory {
  puzzleId: string;
  puzzleDate: string;
  completed: boolean;
  won: boolean;
  mistakes: number;
  solvedGroups: SolvedGroup[];
  attemptHistory: AttemptHistory[];
  completedAt: string;
}

export interface PuzzleStats {
  playedCount: number;
  solvedCount: number;
}
```

Update Puzzle interface to include optional stats field:
```typescript
export interface Puzzle {
  id?: string;
  title?: string;
  solution: Record<string, PuzzleTheme>;
  author?: string;
  date: Date;
  stats?: PuzzleStats; // Add this
}
```

### 3. Update Firestore Rules
**File**: `firestore.rules`

Add rules for:
- Users can write to their own history subcollection
- Anyone can update stats on connections (for anonymous play tracking)

```javascript
match /users/{userId}/history/{puzzleId} {
  allow write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null && request.auth.uid == userId;
}

match /connections/{connectionId} {
  allow read: if true;
  allow create, delete: if isAdmin();
  allow update: if isAdmin() ||
                   (request.resource.data.diff(resource.data).affectedKeys()
                    .hasOnly(['stats']));
}
```

### 4. Integrate into Game Component
**File**: `src/pages/game/components/connections-game.tsx`

Changes:
- Import `useAuth` hook
- Import `gameHistoryService`
- Add `useEffect` to detect game end and sync to Firebase
- Track if sync has already happened (use ref to prevent double-syncing)

Logic:
```typescript
const { user } = useAuth();
const hasSyncedRef = useRef(false);

useEffect(() => {
  if ((gameWon || gameLost) && !hasSyncedRef.current) {
    hasSyncedRef.current = true;

    // Update puzzle stats (always, for all users)
    gameHistoryService.updatePuzzleStats(puzzle.id!, gameWon);

    // Save user history (only if logged in)
    if (user) {
      gameHistoryService.saveGameHistory(
        user.uid,
        puzzle.id!,
        {
          puzzleId: puzzle.id!,
          puzzleDate: puzzle.date.toISOString(),
          completed: true,
          won: gameWon,
          mistakes,
          solvedGroups,
          attemptHistory,
          completedAt: new Date().toISOString(),
        }
      );
    }
  }
}, [gameWon, gameLost, user, puzzle, mistakes, solvedGroups, attemptHistory]);
```

### 5. Export Service
**File**: `src/shared/services/index.ts`

Add:
```typescript
import { GameHistoryService } from "./game-history.service";
export const gameHistoryService = new GameHistoryService(db);
```

## Implementation Notes

### Why useEffect Here is Appropriate
- This is synchronizing with an external system (Firebase)
- Cannot be done during render
- Depends on state changes (gameWon/gameLost)
- Uses a ref to prevent duplicate syncing

### Error Handling
- Wrap Firebase calls in try-catch
- Log errors to console (don't block user experience)
- Don't show errors to user (game already completed locally)

### Performance
- Firebase calls are fire-and-forget (don't await in component)
- Use Firestore increment for atomic stat updates
- History writes are document sets (simple and fast)

### Data Integrity
- LocalStorage remains source of truth for game state
- Firebase sync is supplementary (for stats/history)
- If sync fails, user can still play

## Files to Create
1. `src/shared/services/game-history.service.ts`

## Files to Modify
1. `src/shared/types.ts` - Add GameHistory and PuzzleStats types
2. `src/pages/game/components/connections-game.tsx` - Add sync logic
3. `src/shared/services/index.ts` - Export new service
4. `firestore.rules` - Update security rules

## Testing Checklist
- [ ] Logged-in user completes game (win) - history saved, stats updated
- [ ] Logged-in user completes game (loss) - history saved, stats updated (played only)
- [ ] Anonymous user completes game - only stats updated (no history)
- [ ] Game end sync only happens once (not on re-renders)
- [ ] No errors in console for anonymous users
- [ ] Firestore rules allow expected operations
