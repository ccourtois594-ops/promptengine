import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialisation du client OpenAI
// Cela fonctionnera automatiquement si OPENAI_API_KEY est défini dans les variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Le contenu du prompt est requis" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "La clé API OpenAI n'est pas configurée" },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Utilisation d'un modèle rapide et efficace
      messages: [
        {
          role: "system",
          content: `Tu es un expert mondial en Prompt Engineering. Ta mission est d'optimiser le prompt fourni par l'utilisateur.
          
          Règles d'optimisation :
          1. Clarifie l'objectif et le contexte.
          2. Structure le prompt (ex: Rôle, Tâche, Contraintes, Format de sortie).
          3. Utilise un langage précis et professionnel.
          4. Ajoute des techniques avancées si pertinent (Chain of Thought, Few-Shot, etc.).
          5. NE RÉPONDS QU'AVEC LE PROMPT OPTIMISÉ, sans texte d'introduction ou de conclusion.`
        },
        {
          role: "user",
          content: content,
        },
      ],
      temperature: 0.7,
    });

    const optimizedContent = completion.choices[0].message.content;

    return NextResponse.json({ optimizedContent });
  } catch (error) {
    console.error("Erreur lors de l'optimisation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la communication avec l'IA" },
      { status: 500 }
    );
  }
}