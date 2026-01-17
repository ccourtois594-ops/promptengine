"use client";

import React, { useState } from "react";
import { Prompt } from "../types/index";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Star, 
  Wand2, 
  Trash2, 
  Edit 
} from "lucide-react";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onEdit: (prompt: Prompt) => void;
  onOptimize: (prompt: Prompt) => void;
  onToggleFavorite: (id: string) => void;
}

export function PromptCard({ 
  prompt, 
  onDelete, 
  onEdit, 
  onOptimize,
  onToggleFavorite 
}: PromptCardProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    toast.success("Prompt copié dans le presse-papier");
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulation du délai d'optimisation
    await onOptimize(prompt);
    setIsOptimizing(false);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {prompt.title}
            </CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {prompt.category}
              </Badge>
              {prompt.isFavorite && (
                <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-xs">
                  Favori
                </Badge>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className={prompt.isFavorite ? "text-yellow-500" : "text-muted-foreground"}
            onClick={() => onToggleFavorite(prompt.id)}
          >
            <Star className="h-4 w-4 fill-current" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap bg-muted/50 p-3 rounded-md font-mono">
          {prompt.content}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {prompt.tags.map((tag: string) => (
            <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t flex justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" /> Copier
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            <Wand2 className={`h-4 w-4 mr-1 ${isOptimizing ? 'animate-spin' : ''}`} /> 
            {isOptimizing ? "IA..." : "Optimiser"}
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(prompt)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(prompt.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}