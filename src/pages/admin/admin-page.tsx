import { useState, useEffect } from "react";
import { useAuth } from "@/shared/hooks";
import { puzzleService } from "@/shared/services";
import type { Puzzle } from "@/shared/types";
import { Button, Alert, Loader } from "@/shared/ui";
import { PuzzleTable, PuzzleForm, DeleteDialog } from "./components";
import { INITIAL_CATEGORIES } from "./constants";
import type { CategoryForm, ValidationErrors } from "./types";
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
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);
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
    setValidationErrors(null);
    setFormData({
      title: "",
      date: getInitialFormDate(),
      categories: INITIAL_CATEGORIES,
    });
    setIsDialogOpen(true);
  }

  function openEditDialog(puzzle: Puzzle) {
    setEditingPuzzle(puzzle);
    setValidationErrors(null);
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
      setValidationErrors(null);

      const errors: ValidationErrors = {
        categories: formData.categories.map(() => ({ words: [] })),
      };

      let hasErrors = false;

      if (!formData.title.trim()) {
        errors.title = "Title is required";
        hasErrors = true;
      }

      const selectedDate = new Date(formData.date).toDateString();
      const conflictingPuzzle = puzzles.find((puzzle) => {
        if (editingPuzzle?.id && puzzle.id === editingPuzzle.id) {
          return false;
        }
        return new Date(puzzle.date).toDateString() === selectedDate;
      });

      if (conflictingPuzzle) {
        errors.date = `A puzzle already exists for this date: ${conflictingPuzzle.title || "Untitled"}`;
        hasErrors = true;
      }

      const allInputs: Map<string, { catIndex: number; wordIndex?: number }[]> = new Map();

      formData.categories.forEach((category, catIndex) => {
        const categoryErrors = errors.categories[catIndex];
        if (!categoryErrors) return;

        if (!category.name.trim()) {
          categoryErrors.name = "Category name is required";
          hasErrors = true;
        } else {
          const normalized = category.name.trim().toLowerCase();
          if (!allInputs.has(normalized)) {
            allInputs.set(normalized, []);
          }
          allInputs.get(normalized)!.push({ catIndex });
        }

        category.words.forEach((word, wordIndex) => {
          if (!word.trim()) {
            categoryErrors.words[wordIndex] = "Word is required";
            hasErrors = true;
          } else {
            const normalized = word.trim().toLowerCase();
            if (!allInputs.has(normalized)) {
              allInputs.set(normalized, []);
            }
            allInputs.get(normalized)!.push({ catIndex, wordIndex });
          }
        });
      });

      allInputs.forEach((locations, value) => {
        if (locations.length > 1) {
          locations.forEach(({ catIndex, wordIndex }) => {
            const categoryErrors = errors.categories[catIndex];
            if (!categoryErrors) return;

            if (wordIndex !== undefined) {
              categoryErrors.words[wordIndex] = "Duplicate value";
            } else {
              categoryErrors.name = "Duplicate value";
            }
          });
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setValidationErrors(errors);
        return;
      }

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

  function handleCategoryMoveUp(index: number) {
    if (index === 0) return;
    const newCategories = [...formData.categories];
    const current = newCategories[index];
    const previous = newCategories[index - 1];
    if (!current || !previous) return;
    newCategories[index - 1] = current;
    newCategories[index] = previous;
    setFormData({ ...formData, categories: newCategories });
  }

  function handleCategoryMoveDown(index: number) {
    if (index === 3) return;
    const newCategories = [...formData.categories];
    const current = newCategories[index];
    const next = newCategories[index + 1];
    if (!current || !next) return;
    newCategories[index] = next;
    newCategories[index + 1] = current;
    setFormData({ ...formData, categories: newCategories });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
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
        validationErrors={validationErrors}
        onOpenChange={setIsDialogOpen}
        onTitleChange={(title) => setFormData({ ...formData, title })}
        onDateChange={(date) => setFormData({ ...formData, date })}
        onCategoryNameChange={handleCategoryNameChange}
        onCategoryWordChange={handleCategoryWordChange}
        onCategoryMoveUp={handleCategoryMoveUp}
        onCategoryMoveDown={handleCategoryMoveDown}
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
