"use client";

import React, { useEffect } from "react";
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

const formSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  content: z.string().min(10, "Le contenu doit contenir au moins 10 caractères"),
  category: z.string(),
  tags: z.string(), // On gérera les tags comme une string séparée par des virgules pour simplifier
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "General",
      tags: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        content: initialData.content,
        category: initialData.category,
        tags: initialData.tags.join(", "),
      });
    } else {
      form.reset({
        title: "",
        content: "",
        category: "General",
        tags: "",
      });
    }
  }, [initialData, form, open]);

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
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General">Général</SelectItem>
                        <SelectItem value="Coding">Développement</SelectItem>
                        <SelectItem value="Writing">Rédaction</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Data">Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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