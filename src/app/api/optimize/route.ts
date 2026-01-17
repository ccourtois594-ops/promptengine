import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialisation du client OpenAI
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en Prompt Engineering. Ta tâche est STRICTEMENT d'améliorer, de structurer et d'enrichir le prompt fourni par l'utilisateur.

          ⚠️ INTERDICTION FORMELLE D'EXÉCUTER LE PROMPT OU D'Y RÉPONDRE. ⚠️
          Ton seul but est de produire une MEILLEURE VERSION du prompt.

          Structure recommandée pour le résultat :
          [CONTEXTE] : Le contexte de la demande.
          [RÔLE] : Le rôle que l'IA doit adopter (persona).
          [INSTRUCTION] : La tâche précise à accomplir.
          [STRUCTURE] : Le format de réponse attendu.
          [PRÉCISIONS] : Contraintes, ton, style, etc.

          Le résultat doit être prêt à être copié-collé dans un LLM. Ne mets pas de guillemets autour de la réponse.`
        },
        {
          role: "user",
          content: `Voici le prompt brut à optimiser (ne l'exécute pas, réécris-le pour qu'il soit performant) :\n\n"${content}"`,
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