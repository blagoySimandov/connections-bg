import { useState, useEffect } from "react";
import { useAuth } from "@/shared/hooks";
import { puzzleService } from "@/shared/services";
import type { Puzzle } from "@/shared/types";
import { Button, Alert } from "@/shared/ui";
import { PuzzleTable, PuzzleForm, DeleteDialog } from "./components";
import { INITIAL_CATEGORIES } from "./constants";
import type { CategoryForm } from "./types";
import {
  buildSolutionFromCategories,
  buildCategoriesFromSolution,
  updateCategoryName,
  updateCategoryWord,
  getInitialFormDate,
  formatDateForInput,
} from "./utils";

interface FormData {
  title: string;
  date: string;
  categories: CategoryForm[];
}

export function AdminPage() {
  const { user } = useAuth();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState<Puzzle | null>(null);
  const [deletingPuzzle, setDeletingPuzzle] = useState<Puzzle | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: getInitialFormDate(),
    categories: INITIAL_CATEGORIES,
  });

  useEffect(() => {
    loadPuzzles();
  }, []);

  async function loadPuzzles() {
    try {
      setLoading(true);
      const data = await puzzleService.getAll();
      setPuzzles(data);
    } catch (err) {
      setError("Failed to load puzzles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setEditingPuzzle(null);
    setFormData({
      title: "",
      date: getInitialFormDate(),
      categories: INITIAL_CATEGORIES,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(puzzle: Puzzle) {
    setEditingPuzzle(puzzle);
    setFormData({
      title: puzzle.title || "",
      date: formatDateForInput(puzzle.date),
      categories: buildCategoriesFromSolution(puzzle.solution),
    });
    setIsDialogOpen(true);
  }

  function openDeleteDialog(puzzle: Puzzle) {
    setDeletingPuzzle(puzzle);
    setIsDeleteDialogOpen(true);
  }

  async function handleSave() {
    try {
      setError(null);

      const solution = buildSolutionFromCategories(formData.categories);

      if (Object.keys(solution).length !== 4) {
        setError("All 4 categories must have a name");
        return;
      }

      const puzzle: Puzzle = {
        title: formData.title,
        solution,
        date: new Date(formData.date),
      };

      if (editingPuzzle?.id) {
        await puzzleService.update(editingPuzzle.id, puzzle);
      } else {
        await puzzleService.create(puzzle, user!.uid);
      }

      await loadPuzzles();
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save puzzle");
      console.error(err);
    }
  }

  async function handleDelete() {
    if (!deletingPuzzle?.id) return;

    try {
      setError(null);
      await puzzleService.delete(deletingPuzzle.id);
      await loadPuzzles();
      setIsDeleteDialogOpen(false);
      setDeletingPuzzle(null);
    } catch (err) {
      setError("Failed to delete puzzle");
      console.error(err);
    }
  }

  function handleCategoryNameChange(index: number, name: string) {
    setFormData({
      ...formData,
      categories: updateCategoryName(formData.categories, index, name),
    });
  }

  function handleCategoryWordChange(
    catIndex: number,
    wordIndex: number,
    value: string,
  ) {
    setFormData({
      ...formData,
      categories: updateCategoryWord(
        formData.categories,
        catIndex,
        wordIndex,
        value,
      ),
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage connections and puzzles
          </p>
        </div>
        <Button onClick={openCreateDialog}>Add New Puzzle</Button>
      </div>

      {error && (
        <Alert className="mb-4 border-destructive bg-destructive/10">
          <div className="text-destructive">{error}</div>
        </Alert>
      )}

      <PuzzleTable
        puzzles={puzzles}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <PuzzleForm
        open={isDialogOpen}
        isEditing={!!editingPuzzle}
        title={formData.title}
        date={formData.date}
        categories={formData.categories}
        onOpenChange={setIsDialogOpen}
        onTitleChange={(title) => setFormData({ ...formData, title })}
        onDateChange={(date) => setFormData({ ...formData, date })}
        onCategoryNameChange={handleCategoryNameChange}
        onCategoryWordChange={handleCategoryWordChange}
        onSave={handleSave}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        puzzle={deletingPuzzle}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}
