# 📐 Maths Trainer

Outil de révision interactif pour les lycéens de **Terminale** (et options).  
Génère des exercices aléatoires avec correction détaillée, 100 % en local — aucune donnée envoyée, aucun serveur requis.

---

## ✨ Fonctionnalités

- **Exercices générés aléatoirement** à chaque clic — jamais le même énoncé
- **Correction détaillée** affichée à la demande, étape par étape
- **Formules mathématiques** rendues par [KaTeX](https://katex.org/)
- **Sans installation** — ouvrir `index.html` dans n'importe quel navigateur suffit
- **Extensible** — chaque chapitre est un fichier JS indépendant, facile à ajouter

---

## 📚 Modules disponibles

### Maths Spécialité — Terminale
| Section | Chapitre |
|---|---|
| Algèbre & Arithmétique | PGCD — Algorithme d'Euclide |
| | Théorème de Bézout — Remontée d'Euclide |
| | Lemme de Gauss — Équation au + bv = c |
| Analyse | Calcul direct d'une intégrale |
| | Linéarité de l'intégrale |
| | Relation de Chasles |
| | Valeur moyenne d'une fonction |
| | Intégration par parties |

### Maths Expertes — Option Terminale
| Section | Chapitre |
|---|---|
| Matrices | Systèmes 3×3 — Méthode de Gauss-Jordan |

---

## 🚀 Utilisation

### Lancer l'application
Double-cliquer sur `index.html` — il s'ouvre directement dans le navigateur.

### Ajouter un module (pour les profs)
Deux méthodes :

**1. Script graphique Python (recommandé — sans toucher au code)**
```bash
python import_module.py
```
Formulaire en 3 clics : sélectionner le fichier JS → choisir la spécialité → choisir la section → importer.  
Le script crée automatiquement les dossiers, met à jour `registry.js` et `index.html`.

**2. Méthode manuelle (VS Code)**  
Voir [AJOUTER_MODULE.md](AJOUTER_MODULE.md) ou le [Wiki intégré](wiki.html).

### Créer un module avec l'IA
Voir [GUIDE_PROF.md](GUIDE_PROF.md) — contient le mega-prompt prêt à copier dans ChatGPT ou Claude pour générer un module JS complet depuis une description pédagogique.

---

## 🗂️ Structure du projet

```
Maths trainer/
├── index.html                          ← Application principale
├── wiki.html                           ← Documentation complète
├── import_module.py                    ← Script d'import graphique (Python 3)
├── GUIDE_PROF.md                       ← Guide : créer un module sans coder
├── AJOUTER_MODULE.md                   ← Référence technique du format module
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── engine.js                   ← Utilitaires maths (randInt, gcd…)
│       ├── registry.js                 ← Arborescence de la sidebar
│       └── app.js                      ← Logique Alpine.js
└── modules/
    ├── maths-spe/                      ← Modules Terminale Spécialité
    └── maths-expertes/                 ← Modules Maths Expertes
```

---

## 🔧 Format d'un module JS

```javascript
MathsTrainer.register({
  id: 'mon-module',
  chapitre: 'Titre du chapitre',
  notion: 'Ce que l\'élève apprend à faire',
  methode: [
    'Étape 1 — avec $LaTeX$ si besoin.',
    'Étape 2 — ...',
  ],
  generate() {
    const a = Engine.randInt(2, 10);
    const enonce = `Calculer $${a}^2$.`;
    const correction = `<p>On calcule :</p>
      <div class="result-highlight">$$${a}^2 = ${a*a}$$</div>`;
    return { enonce, correction };
  },
});
```

---

## 🛠️ Technologies

- [KaTeX](https://katex.org/) — rendu des formules mathématiques
- [Alpine.js](https://alpinejs.dev/) — réactivité de l'interface
- [Tailwind CSS](https://tailwindcss.com/) — mise en page utilitaire
- Python 3 + tkinter — script d'import graphique (bibliothèque standard, aucune installation)

---

## 📄 Licence

Projet open source — libre d'utilisation, de modification et de redistribution.
