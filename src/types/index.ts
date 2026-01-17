export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastModified: Date;
  isFavorite: boolean;
}

// Category est maintenant une string car l'utilisateur peut en créer
export type Category = string;