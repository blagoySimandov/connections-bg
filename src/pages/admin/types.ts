export interface CategoryForm {
  name: string;
  words: [string, string, string, string];
}

export interface ValidationErrors {
  title?: string;
  date?: string;
  categories: Array<{
    name?: string;
    words: [string?, string?, string?, string?];
  }>;
}
