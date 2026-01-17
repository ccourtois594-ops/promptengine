"use client";

import React, { useState } from "react";
import { Prompt } from "../types/index";
import { PromptCard } from "@/components/prompt-card";
import { PromptFormDialog } from "@/components/prompt-form-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock data initial
const initialPrompts: Prompt[] = [
  {
    id: "1",
    title: "Expert React/Next.js",
    content: "Tu es un expert senior en React et Next.js 15. Tu privilégies toujours les Server Components, TypeScript strict, et Tailwind CSS. Tes réponses doivent être concises et inclure des exemples de code complets.",
    category: "Coding",
    tags: ["react", "nextjs", "typescript"],
    lastModified: new Date(),
    isFavorite: true,
  },
  {
    id: "2",
    title: "Correction orthographique",
    content: "Corrige ce texte en français. Améliore le style pour qu'il soit professionnel, supprime les répétitions et assure-toi que la grammaire est parfaite. Ne change pas le sens du message original.",
    category: "Writing",
    tags: ["correction", "email", "pro"],
    lastModified: new Date(),
    isFavorite: false,
  },
  {
    id: "3",
    title: "Stratégie Marketing Instagram",
    content: "Crée un calendrier éditorial de 5 posts pour Instagram pour une marque de café artisanal. Inclus les légendes, les suggestions visuelles et les hashtags pertinents pour une audience jeune et urbaine.",
    category: "Marketing",
    tags: ["instagram", "social-media", "café"],
    lastModified: new Date(),
    isFavorite: false,
  },
];

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateOrUpdate = (values: any, id?: string) => {
    const tagsArray = values.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "");
    
    if (id) {
      // Update
      setPrompts(prompts.map(p => p.id === id ? {
        ...p,
        ...values,
        tags: tagsArray,
        lastModified: new Date()
      } : p));
      toast.success("Prompt mis à jour avec succès");
    } else {
      // Create
      const newPrompt: Prompt = {
        id: Math.random().toString(36).substr(2, 9),
        title: values.title,
        content: values.content,
        category: values.category,
        tags: tagsArray,
        lastModified: new Date(),
        isFavorite: false,
      };
      setPrompts([newPrompt, ...prompts]);
      toast.success("Nouveau prompt créé");
    }
    setEditingPrompt(null);
  };

  const handleDelete = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast.success("Prompt supprimé");
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts(prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const handleOptimize = async (prompt: Prompt) => {
    // Simulation d'un appel API IA
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const enhancedContent = `[OPTIMISÉ PAR IA ✨]\n\n${prompt.content}\n\nInstructions additionnelles suggérées :\n- Ajoute "Réponds étape par étape" pour plus de clarté.\n- Spécifie le format de sortie désiré (Markdown, JSON, etc.).`;
        
        setPrompts(prompts.map(p => p.id === prompt.id ? {
          ...p,
          content: enhancedContent,
          lastModified: new Date()
        } : p));
        
        toast.success("Prompt optimisé par l'IA !");
        resolve();
      }, 1500);
    });
  };

  const openNewPromptDialog = () => {
    setEditingPrompt(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mes Prompts</h1>
            <p className="text-muted-foreground">Gérez et optimisez votre bibliothèque de prompts.</p>
          </div>
        </div>
        <Button onClick={openNewPromptDialog} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nouveau Prompt
        </Button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Rechercher par titre ou tag..." 
          className="pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onOptimize={handleOptimize}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucun prompt trouvé. Créez-en un nouveau !</p>
          </div>
        )}
      </div>

      <PromptFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateOrUpdate}
        initialData={editingPrompt}
      />
    </div>
  );
}