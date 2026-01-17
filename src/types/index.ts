export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastModified: Date;
  isFavorite: boolean;
}

export type Category = "General" | "Coding" | "Writing" | "Marketing" | "Data";