import type { Puzzle } from "@/shared/types";
import { Button } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { formatDateForDisplay } from "../utils";

interface PuzzleTableProps {
  puzzles: Puzzle[];
  onEdit: (puzzle: Puzzle) => void;
  onDelete: (puzzle: Puzzle) => void;
}

export function PuzzleTable({ puzzles, onEdit, onDelete }: PuzzleTableProps) {
  if (puzzles.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-8"
              >
                No puzzles yet. Create your first one!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {puzzles.map((puzzle) => (
            <TableRow key={puzzle.id}>
              <TableCell className="font-medium">
                {formatDateForDisplay(puzzle.date)}
              </TableCell>
              <TableCell>{puzzle.title || "Untitled"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(puzzle)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDelete(puzzle)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
