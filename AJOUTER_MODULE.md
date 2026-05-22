# Ajouter un nouveau module d'exercice

## Résumé des étapes

1. Créer le fichier `modules/<spécialité>/<id>.js`
2. Ajouter le chapitre dans `assets/js/registry.js` (s'il n'y est pas)
3. Ajouter `<script src="...">` dans `index.html` dans le bloc MODULES

---

## Format du fichier module

```javascript
MathsTrainer.register({
  // ── Identifiant ───────────────────────────────────────────────
  // Doit correspondre à l'id dans registry.js
  id: 'mon-module',

  // ── Affiché dans l'interface ──────────────────────────────────
  chapitre: 'Nom complet du chapitre',
  notion:   'Une phrase : ce que l\'élève apprend à faire',

  // ── Méthode de résolution ─────────────────────────────────────
  // Tableau d'étapes. Supporte HTML et LaTeX entre $...$.
  methode: [
    'Étape 1 — description avec $formule$ si besoin.',
    'Étape 2 — description.',
    // ...
  ],

  // ── Générateur d'exercice ─────────────────────────────────────
  // Doit renvoyer { enonce, correction }.
  // enonce     : chaîne de texte/HTML avec LaTeX entre $...$ / $$...$$
  // correction : chaîne HTML avec LaTeX entre $...$ / $$...$$
  generate() {
    const a = Engine.randInt(2, 20);
    // ...

    const enonce =
      `Calculer $f(${a})$ sachant que ...`;

    const correction =
      `<p>On applique la définition : ...</p>` +
      `<div class="my-3">$$f(${a}) = ...$$</div>` +
      `<div class="result-highlight">$$f(${a}) = \\text{résultat}$$</div>`;

    return { enonce, correction };
  },
});
```

---

## LaTeX dans les chaînes JavaScript

Dans une chaîne JS, chaque `\` LaTeX s'écrit `\\`.

| Tu veux                    | Tu écris dans JS           |
|----------------------------|----------------------------|
| `\frac{a}{b}`              | `\\frac{a}{b}`             |
| `\times`                   | `\\times`                  |
| `\begin{aligned}...\end{}` | `\\begin{aligned}...\\end{aligned}` |
| `\\` (saut de ligne LaTeX) | `\\\\`                     |
| `\operatorname{pgcd}`      | `\\operatorname{pgcd}`     |

**Inline** : `$formule$`  
**Bloc display** : `$$formule$$`  
**Colonnes alignées** :

```javascript
`$$\\begin{aligned} a &= b + c \\\\ x &= y \\end{aligned}$$`
```

### Macros pré-définies (utilisables directement)

| Macro     | Rendu        |
|-----------|--------------|
| `\\pgcd`  | pgcd (romain) |
| `\\ppcm`  | ppcm (romain) |
| `\\N`     | ℕ            |
| `\\Z`     | ℤ            |
| `\\R`     | ℝ            |
| `\\Q`     | ℚ            |
| `\\C`     | ℂ            |

---

## Utilitaires Engine disponibles

| Appel                              | Résultat                                          |
|------------------------------------|---------------------------------------------------|
| `Engine.randInt(min, max)`         | Entier aléatoire dans [min, max]                  |
| `Engine.gcd(a, b)`                 | PGCD                                              |
| `Engine.lcm(a, b)`                 | PPCM                                              |
| `Engine.coprimePair(minQ, maxP)`   | `{ p, q }` premiers entre eux, p > q ≥ minQ       |
| `Engine.euclidSteps(a, b)`         | `{ steps, pgcd }` — cf. pgcd.js pour l'usage      |
| `Engine.reduceFraction(n, d)`      | `{ num, den }` fraction réduite                   |
| `Engine.latexFraction(n, d)`       | `"\\dfrac{n}{d}"` ou `"n"` si dénominateur = 1    |
| `Engine.randIntWhere(min, max, fn)`| Entier satisfaisant une condition `fn(v) === true` |
| `Engine.shuffle(array)`            | Copie mélangée du tableau                         |

---

## Classe CSS utile dans la correction

```html
<div class="result-highlight">$$...$$</div>
```
Encadre le résultat final avec un fond jaune.

---

## Bloc à me fournir pour que je génère le module

```
CHAPITRE: [nom du chapitre]
NOTION: [ce qu'on cherche à faire travailler]

MÉTHODE:
Étape 1 — [description, formules LaTeX entre $...$]
Étape 2 — [...]
...

VARIABLES:
[nom]: type (entier/réel/fraction), plage [min, max], contrainte éventuelle
[...]

ÉNONCÉ_TEMPLATE:
[Énoncé avec {{variable}} à substituer, LaTeX entre $...$]

CORRECTION_TEMPLATE:
[Correction étape par étape avec {{variable}}, LaTeX entre $...$]
```

Je génère alors le fichier JS complet prêt à être branché, **sans inventer la méthode** — j'implémente exactement celle que tu fournis.
