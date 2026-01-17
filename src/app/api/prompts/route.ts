import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db.json");

// Lecture des prompts (GET)
export async function GET() {
  try {
    // Vérifier si le fichier existe
    try {
      await fs.access(dbPath);
    } catch {
      // S'il n'existe pas, retourner un tableau vide ou créer le fichier
      return NextResponse.json([]);
    }

    const data = await fs.readFile(dbPath, "utf-8");
    const prompts = JSON.parse(data);
    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Erreur lecture DB:", error);
    return NextResponse.json({ error: "Erreur lecture DB" }, { status: 500 });
  }
}

// Sauvegarde des prompts (POST)
// On envoie la liste complète des prompts pour écraser le fichier (méthode simple pour un fichier JSON)
export async function POST(req: Request) {
  try {
    const prompts = await req.json();
    
    // On formate le JSON avec une indentation de 2 espaces pour la lisibilité
    await fs.writeFile(dbPath, JSON.stringify(prompts, null, 2), "utf-8");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur écriture DB:", error);
    return NextResponse.json({ error: "Erreur sauvegarde DB" }, { status: 500 });
  }
}