import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "categories.json");

// Lecture des catégories
export async function GET() {
  try {
    try {
      await fs.access(dbPath);
    } catch {
      // Valeurs par défaut si le fichier n'existe pas
      return NextResponse.json(["Général", "Coding", "Writing"]);
    }

    const data = await fs.readFile(dbPath, "utf-8");
    const categories = JSON.parse(data);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Erreur lecture catégories" }, { status: 500 });
  }
}

// Ajout d'une catégorie
export async function POST(req: Request) {
  try {
    const { category } = await req.json();
    
    if (!category) {
      return NextResponse.json({ error: "Catégorie requise" }, { status: 400 });
    }

    const data = await fs.readFile(dbPath, "utf-8");
    const categories: string[] = JSON.parse(data);

    // Éviter les doublons (insensible à la casse)
    if (!categories.some(c => c.toLowerCase() === category.toLowerCase())) {
      categories.push(category);
      await fs.writeFile(dbPath, JSON.stringify(categories, null, 2), "utf-8");
      return NextResponse.json({ success: true, categories });
    }
    
    return NextResponse.json({ success: true, message: "Catégorie existante" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur écriture catégories" }, { status: 500 });
  }
}