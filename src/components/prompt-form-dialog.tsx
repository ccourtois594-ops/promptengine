"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Prompt } from "../types/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  tags: z.string(),
});

interface PromptFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>, id?: string) => void;
  initialData?: Prompt | null;
}

export function PromptFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: PromptFormDialogProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
    },
  });

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Erreur chargement catégories", error);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category,
        tags: initialData.tags.join(", "),
      });
      setIsNewCategoryMode(false);
    } else {
      form.reset({
        title: "",
        content: "",
        category: "",
        tags: "",
      });
      setIsNewCategoryMode(false);
    }
  }, [initialData, form, open]);

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: newCategoryName.trim() }),
      });
      
      if (res.ok) {
        await fetchCategories(); // Recharger la liste
        form.setValue("category", newCategoryName.trim()); // Sélectionner la nouvelle
        setIsNewCategoryMode(false);
        setNewCategoryName("");
        toast.success("Catégorie ajoutée");
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la catégorie");
    }
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values, initialData?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier le prompt" : "Créer un nouveau prompt"}
          </DialogTitle>
          <DialogDescription>
            Ajoutez les détails de votre prompt ici. Vous pourrez l&apos;optimiser avec l&apos;IA par la suite.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Générateur de code Python..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                {!isNewCategoryMode ? (
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choisir..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setIsNewCategoryMode(true)}
                      title="Nouvelle catégorie"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Nom de la catégorie" 
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      size="sm"
                      onClick={handleAddNewCategory}
                    >
                      Ok
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsNewCategoryMode(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (séparés par des virgules)</FormLabel>
                    <FormControl>
                      <Input placeholder="python, script, automation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu du prompt</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Agis en tant qu'expert en..." 
                      className="min-h-[200px] font-mono text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {initialData ? "Mettre à jour" : "Créer le prompt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}