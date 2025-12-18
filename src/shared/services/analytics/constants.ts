export const ANALYTICS_EVENTS = {
  GAME_STARTED: "game_started",
  GAME_COMPLETED: "game_completed",
  MISTAKE_MADE: "mistake_made",
  ONE_AWAY_DETECTED: "one_away_detected",
  SHUFFLE_CLICKED: "shuffle_clicked",
  DESELECT_CLICKED: "deselect_clicked",
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
  PAGE_VIEW: "page_view",
} as const;

export interface GameEventParams {
  puzzle_id?: string;
  puzzle_date?: string;
  mistakes?: number;
  won?: boolean;
  total_attempts?: number;
  one_away?: boolean;
}

export interface PageViewParams {
  page_name: string;
  page_path: string;
}

export interface AuthEventParams {
  method?: string;
}
