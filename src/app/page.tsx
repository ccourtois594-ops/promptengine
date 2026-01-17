"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Prompt } from "../types/index";
import { PromptCard } from "@/components/prompt-card";
import { PromptFormDialog } from "@/components/prompt-form-dialog";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Search, Sparkles, Loader2, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

// Composant interne qui utilise useSearchParams (nécessite Suspense)
function PromptList() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const specialFilter = searchParams.get("filter"); // 'favorites'
  const tagFilter = searchParams.get("tag");

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // Charger les données au démarrage
  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/prompts");
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      const formattedData = data.map((p: any) => ({
        ...p,
        lastModified: new Date(p.lastModified)
      }));
      setPrompts(formattedData);
    } catch (error) {
      toast.error("Impossible de charger les prompts");
    } finally {
      setIsLoading(false);
    }
  };

  const savePromptsToDb = async (newPrompts: Prompt[]) => {
    setPrompts(newPrompts);
    try {
      await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPrompts),
      });
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde automatique");
    }
  };

  // Logique de filtrage combinée
  const filteredPrompts = prompts.filter((prompt) => {
    // 1. Filtre recherche textuelle
    const matchesSearch = 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Filtre Catégorie (URL)
    const matchesCategory = categoryFilter 
      ? prompt.category === categoryFilter 
      : true;

    // 3. Filtre Spécial (Favoris)
    const matchesSpecial = specialFilter === 'favorites' 
      ? prompt.isFavorite 
      : true;

    // 4. Filtre Tag (URL)
    const matchesTag = tagFilter
      ? prompt.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase())
      : true;

    return matchesSearch && matchesCategory && matchesSpecial && matchesTag;
  });

  const handleCreateOrUpdate = (values: any, id?: string) => {
    const tagsArray = values.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "");
    
    let newPromptsList: Prompt[];

    if (id) {
      newPromptsList = prompts.map(p => p.id === id ? {
        ...p,
        ...values,
        tags: tagsArray,
        lastModified: new Date()
      } : p);
      toast.success("Prompt mis à jour");
    } else {
      const newPrompt: Prompt = {
        id: Math.random().toString(36).substr(2, 9),
        title: values.title,
        content: values.content,
        category: values.category,
        tags: tagsArray,
        lastModified: new Date(),
        isFavorite: false,
      };
      newPromptsList = [newPrompt, ...prompts];
      toast.success("Nouveau prompt créé");
    }

    savePromptsToDb(newPromptsList);
    setEditingPrompt(null);
  };

  const handleDelete = (id: string) => {
    const newPromptsList = prompts.filter(p => p.id !== id);
    savePromptsToDb(newPromptsList);
    toast.success("Prompt supprimé");
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsDialogOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    const newPromptsList = prompts.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p);
    savePromptsToDb(newPromptsList);
  };

  const handleOptimize = async (prompt: Prompt) => {
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: prompt.content }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Une erreur est survenue");

      const newPromptsList = prompts.map(p => p.id === prompt.id ? {
        ...p,
        content: data.optimizedContent,
        lastModified: new Date()
      } : p);

      savePromptsToDb(newPromptsList);
      toast.success("Prompt optimisé par l'IA et sauvegardé !");
    } catch (error) {
      console.error("Erreur d'optimisation:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'optimisation");
    }
  };

  const openNewPromptDialog = () => {
    setEditingPrompt(null);
    setIsDialogOpen(true);
  };

  const getPageTitle = () => {
    if (categoryFilter) return `Catégorie : ${categoryFilter}`;
    if (specialFilter === 'favorites') return "Mes Favoris";
    if (tagFilter) return `Tag : #${tagFilter}`;
    return "Tous mes Prompts";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
              {(categoryFilter || specialFilter || tagFilter) && (
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                  <Link href="/">
                    <FilterX className="h-4 w-4 mr-1" /> Effacer filtre
                  </Link>
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">
              {filteredPrompts.length} prompt{filteredPrompts.length > 1 ? 's' : ''} trouvé{filteredPrompts.length > 1 ? 's' : ''}.
            </p>
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
            <p>
              {(categoryFilter || specialFilter || tagFilter || searchQuery) 
                ? "Aucun prompt ne correspond à vos critères." 
                : "Aucun prompt trouvé. Créez-en un nouveau !"}
            </p>
            {(categoryFilter || specialFilter || tagFilter) && (
              <Button variant="link" asChild>
                <Link href="/">Voir tous les prompts</Link>
              </Button>
            )}
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

// Wrapper principal avec Suspense pour éviter les erreurs de build Next.js avec useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <PromptList />
    </Suspense>
  );
}