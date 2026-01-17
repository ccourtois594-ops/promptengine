# Prompt Manager AI

Une application moderne pour gérer, organiser et optimiser vos prompts pour LLM (ChatGPT, Claude, Gemini, etc.).

## 🚀 Fonctionnalités

- **Gestion complète** : Créer, lire, mettre à jour et supprimer des prompts.
- **Organisation** : Classement par catégories (Coding, Writing, Marketing, etc.) et système de tags.
- **Optimisation IA** : Amélioration automatique de vos prompts via l'API OpenAI. Le système agit comme un expert en "Prompt Engineering" pour structurer vos demandes (Contexte, Rôle, Tâche) sans les exécuter.
- **Favoris** : Mise en avant de vos prompts les plus utilisés.
- **Sauvegarde locale** : Persistance des données en temps réel dans un fichier JSON local (`db.json`).
- **Interface Moderne** : UI soignée avec Shadcn/UI, Tailwind CSS et animations fluides.

## 🛠️ Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **UI** : Shadcn/UI & Tailwind CSS
- **Icônes** : Lucide React
- **Validation** : Zod & React Hook Form
- **AI** : OpenAI API (gpt-4o-mini)

## 📦 Installation

1. **Installer les dépendances**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

2. **Configuration de l'IA**

Créez un fichier `.env.local` à la racine du projet et ajoutez votre clé API OpenAI :

```env
OPENAI_API_KEY=sk-votre-cle-api-openai-ici
```

> **Note** : Sans cette clé, les fonctionnalités de gestion de base fonctionneront, mais l'optimisation par IA retournera une erreur.

3. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 💾 Persistance des Données

Actuellement, l'application utilise un fichier `db.json` situé à la racine du projet pour stocker les données.

- **Avantage** : Aucune configuration de base de données complexe requise pour le développement local.
- **Fonctionnement** : L'API Next.js lit et écrit directement dans ce fichier via le système de fichiers (`fs`).
- **Limitation** : Ce système est conçu pour un usage local. Sur des hébergements "serverless" (comme Vercel), le système de fichiers est éphémère ou en lecture seule. Pour un déploiement en production, il est recommandé de migrer vers une base de données externe (Supabase, PostgreSQL, etc.).

## 🤖 Guide d'Optimisation

L'outil d'optimisation ne répond pas à votre question, il l'améliore.

**Exemple :**
*   *Entrée* : "Code une navbar"
*   *Sortie (Optimisée)* : "[CONTEXTE] Tu es un développeur expert React... [TACHE] Crée un composant de barre de navigation responsive... [CONTRAINTES] Utilise Tailwind CSS..."

---