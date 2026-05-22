# Guide : Créer un exercice sans coder
### Pour les profs qui n'ont jamais touché à de la programmation

---

> **Ce dont tu as besoin :**
> - Un accès à ChatGPT, Claude ou tout autre IA (gratuit suffit)
> - L'application **VS Code** (gratuit, à télécharger si pas installé)  
>   → https://code.visualstudio.com/
> - 15 minutes la première fois, 5 minutes ensuite

---

## ÉTAPE 1 — Préparer son chapitre (sur papier ou dans un doc)

Avant de parler à l'IA, tu dois avoir en tête :

**1. Le titre du chapitre**  
ex : *Calcul de limites de suites — forme 0·∞*

**2. La notion travaillée** (une phrase)  
ex : *Lever une forme indéterminée 0·∞ en factorisant*

**3. La méthode** — écrite comme tu l'écrirais au tableau, étape par étape  
ex :  
> Étape 1 — Repérer que la limite est de la forme 0·∞  
> Étape 2 — Factoriser par le terme dominant  
> Étape 3 — Simplifier et conclure

**4. Les variables** — quelles grandeurs sont aléatoires, dans quelle plage  
ex :  
> a : entier entre 2 et 8  
> n : l'indice (pas une variable, c'est l'indéterminée)

**5. Un exemple d'énoncé** avec des vraies valeurs  
ex : *Calculer la limite de (3n²) × (1/n³) quand n → +∞*

**6. Un exemple de correction complète** de cet énoncé, étape par étape

---

## ÉTAPE 2 — Donner tout ça à l'IA

### 2a. Copie ce mega-prompt

Copie **tout** le texte ci-dessous (depuis la ligne `===` jusqu'à la prochaine ligne `===`) :

```
===========================================================================
Tu es un développeur JavaScript spécialisé en mathématiques de lycée (Terminale française).

Je veux que tu génères un module d'exercice pour un outil web de révision.
L'outil utilise les bibliothèques déjà chargées (KaTeX, Alpine.js).
Un objet global `Engine` est disponible avec ces utilitaires :

  Engine.randInt(min, max)           → entier aléatoire dans [min, max]
  Engine.gcd(a, b)                   → PGCD de a et b
  Engine.lcm(a, b)                   → PPCM de a et b
  Engine.reduceFraction(num, den)    → {num, den} fraction irréductible
  Engine.latexFraction(num, den)     → chaîne LaTeX : "\dfrac{n}{d}" ou "n"
  Engine.randIntWhere(min, max, fn)  → entier satisfaisant fn(v) === true
  Engine.coprimePair(minQ, maxP)     → {p, q} avec pgcd(p,q)=1 et p>q≥minQ
  Engine.euclidSteps(a, b)           → {steps, pgcd} de l'algorithme d'Euclide
  Engine.shuffle(array)              → copie mélangée du tableau

FORMAT OBLIGATOIRE — le fichier doit contenir exactement ceci :

MathsTrainer.register({
  id: 'identifiant-sans-espaces-ni-accents',
  chapitre: 'Titre affiché',
  notion: 'Une phrase décrivant ce que l\'élève apprend à faire',
  methode: [
    'Étape 1 avec $LaTeX$ si besoin.',
    'Étape 2...',
    // autant d'étapes que nécessaire
  ],
  generate() {
    // Variables aléatoires générées avec Engine.*
    // Contrainte essentielle : valeurs "propres" (pas de fractions
    // dans les calculs intermédiaires sauf si c'est l'objet de l'exercice)

    const enonce = `...texte avec $LaTeX$ inline et $$LaTeX$$ en bloc...`;
    const correction = `...HTML avec $LaTeX$ et $$LaTeX$$...`;

    return { enonce, correction };
  },
});

RÈGLES LATEX DANS LES CHAÎNES JAVASCRIPT :
- Formule inline       : $formule$
- Bloc display centré  : $$formule$$
- Tout \ LaTeX devient \\ en JS  (ex: \frac → \\frac, \times → \\times)
- Saut de ligne dans aligned : \\\\ en JS
- Macros disponibles sans les redéfinir : \\pgcd  \\ppcm  \\N  \\Z  \\R  \\Q  \\C

HTML AUTORISÉ dans la correction :
  <p>texte</p>
  <strong>texte</strong>
  <div class="my-4 overflow-x-auto">$$...$$</div>      ← pour un bloc display
  <div class="result-highlight">$$résultat final$$</div>  ← encadre le résultat

STRUCTURE TYPE DE LA CORRECTION :
  1. <p>Phrase d'introduction décrivant la démarche.</p>
  2. Le développement des calculs en LaTeX
  3. <div class="result-highlight">$$...résultat final...$$</div>

IMPORTANT :
- N'invente PAS la méthode : implémente EXACTEMENT les étapes que je fournis
- Génère UNIQUEMENT le contenu du fichier JS, sans explications avant ni après
- L'id doit être en minuscules, sans espaces, sans accents (tirets autorisés)

VOICI LE CHAPITRE À IMPLÉMENTER :

CHAPITRE: [écrire le nom du chapitre ici]
NOTION: [une phrase]

MÉTHODE:
Étape 1 — [ta description]
Étape 2 — [ta description]
Étape 3 — [ta description]
(ajouter autant d'étapes que nécessaire)

VARIABLES:
[nom]: entier, plage [min, max]
[nom]: entier, plage [min, max], contrainte : [décrire]
(etc.)

ÉNONCÉ EXEMPLE (avec des vraies valeurs) :
[coller ici un exemple d'énoncé complet avec des valeurs concrètes]

CORRECTION EXEMPLE (de l'énoncé ci-dessus) :
[coller ici la correction complète, étape par étape]
===========================================================================
```

### 2b. Remplis les parties entre crochets `[...]`

Remplace chaque `[...]` par ton contenu. Exemple rempli :

```
CHAPITRE: Suites géométriques — terme général
NOTION: Calculer un terme u_n d'une suite géométrique connaissant u_0 et la raison q

MÉTHODE:
Étape 1 — Rappeler la formule du terme général : u_n = u_0 × q^n
Étape 2 — Substituer les valeurs de u_0, q et n
Étape 3 — Calculer q^n puis multiplier par u_0

VARIABLES:
u0 : entier, plage [1, 10]
q  : entier, plage [2, 5]
n  : entier, plage [2, 5]
(résultat = u0 × q^n doit rester ≤ 10 000 pour rester lisible)

ÉNONCÉ EXEMPLE :
Soit (u_n) une suite géométrique de premier terme u_0 = 3 et de raison q = 2.
Calculer u_4.

CORRECTION EXEMPLE :
On applique la formule du terme général : u_n = u_0 × q^n
Donc u_4 = 3 × 2^4 = 3 × 16 = 48
```

### 2c. Colle tout dans ChatGPT ou Claude et envoie

Tu devrais recevoir un bloc de code qui ressemble à ceci :

```javascript
MathsTrainer.register({
  id: 'suites-geo-terme-general',
  chapitre: 'Suites géométriques — terme général',
  ...
  generate() {
    ...
    return { enonce, correction };
  },
});
```

---

## ÉTAPE 3 — Vérifier le résultat de l'IA

Avant d'implémenter, lis rapidement le code généré et vérifie :

- ✅ Il commence par `MathsTrainer.register({`
- ✅ Il contient `id:`, `chapitre:`, `notion:`, `methode:`, `generate()`
- ✅ Il se termine par `});`
- ✅ La méthode correspond à CE QUE TU AS ÉCRIT (pas une méthode inventée)

Si quelque chose cloche, dis à l'IA : *"Relance la génération en respectant exactement la méthode que j'ai fournie, et génère uniquement le code JS sans commentaires autour."*

---

## ÉTAPE 4 — Créer le fichier dans l'outil

### 4a. Ouvre le dossier du projet dans VS Code

1. Lance VS Code
2. Clique sur **Fichier → Ouvrir un dossier** (ou *File → Open Folder*)
3. Navigue jusqu'au dossier **Maths trainer** sur ton Bureau
4. Clique **Sélectionner le dossier**

Tu vois l'arborescence à gauche :
```
📁 modules/
   📁 maths-spe/
      📄 pgcd.js
📁 assets/
📄 index.html
...
```

### 4b. Crée le nouveau fichier

1. Dans VS Code, **clic droit** sur le dossier `modules/maths-spe/`
   *(ou `modules/maths-expertes/` selon la spécialité)*
2. Clique **Nouveau fichier** (*New File*)
3. Tape le nom du fichier : `suites-geo.js` *(même chose que l'`id` du module)*
4. Appuie sur **Entrée**

Le fichier s'ouvre vide dans l'éditeur.

### 4c. Colle le code généré

1. Copie **tout** le code que l'IA t'a donné
2. Clique dans la zone blanche de l'éditeur (le fichier vide)
3. Colle : **Ctrl+V** (Windows) ou **Cmd+V** (Mac)
4. Sauvegarde : **Ctrl+S** (Windows) ou **Cmd+S** (Mac)

### 4d. Déclare le fichier dans `index.html`

**C'est l'étape la plus délicate — lis attentivement.**

1. Dans la barre de gauche de VS Code, clique sur `index.html`
2. Appuie sur **Ctrl+F** (recherche) et tape : `/MODULES`
3. Tu devrais voir ces lignes :

```html
  <script src="modules/maths-spe/pgcd.js"></script>
  <!-- /MODULES -->
```

4. Clique juste **avant** la ligne `<!-- /MODULES -->`
5. Appuie sur **Entrée** pour créer une nouvelle ligne
6. Tape exactement (en remplaçant par ton nom de fichier) :

```html
  <script src="modules/maths-spe/suites-geo.js"></script>
```

7. Sauvegarde : **Ctrl+S**

### 4e. Ajoute le chapitre dans la sidebar (si pas déjà présent)

1. Dans VS Code, ouvre `assets/js/registry.js`
2. Appuie sur **Ctrl+F** et cherche le nom de section où doit apparaître ton chapitre  
   *(ex : cherche `spe-arith` pour la section Algèbre)*
3. Dans la liste `chapters:` de cette section, ajoute une ligne comme ceci :

```javascript
{ id: 'suites-geo', label: 'Suites géométriques — terme général' },
```

   L'`id` doit être **exactement le même** que dans ton fichier JS.

4. Sauvegarde : **Ctrl+S**

---

## ÉTAPE 5 — Tester

1. Dans le dossier **Maths trainer**, double-clique sur `index.html`
2. Il s'ouvre dans ton navigateur
3. Dans la sidebar, cherche ton chapitre — il doit apparaître (sans le badge "bientôt")
4. Clique dessus — l'exercice se génère

**Si le chapitre apparaît avec "bientôt"** : l'`id` dans registry.js et dans ton fichier JS ne sont pas identiques. Vérifie qu'ils sont exactement pareils (majuscules, tirets…).

**Si tu vois une page blanche ou une erreur** : ouvre la console du navigateur avec **F12**, clique sur l'onglet **Console**, lis le message d'erreur rouge. Transmets-le à l'IA avec : *"J'ai ce message d'erreur, corrige le fichier JS : [message]"*.

**Si les formules ne s'affichent pas** (tu vois `$\frac{a}{b}$` au lieu d'une belle fraction) : vérifie que tu as bien une connexion internet (KaTeX et Alpine.js se chargent via internet).

---

## Récapitulatif express

```
1. Préparer : titre, notion, méthode, variables, exemple énoncé + correction
2. Mega-prompt → ChatGPT/Claude → obtenir le code JS
3. VS Code → créer modules/maths-spe/mon-module.js → coller le code
4. index.html → ajouter <script src="modules/maths-spe/mon-module.js"></script>
5. registry.js → ajouter { id: 'mon-module', label: '...' } dans la bonne section
6. Ouvrir index.html dans le navigateur → tester
```

---

## Conseils pour des exercices de qualité

| À faire | À éviter |
|---|---|
| Donner une méthode précise, étape par étape | Laisser l'IA inventer la méthode |
| Fournir un exemple de correction complète | Dire juste "fais une correction" |
| Préciser les contraintes sur les valeurs | Laisser l'IA choisir les plages |
| Relire la méthode dans le code généré | Implémenter sans vérifier |
| Tester avec 5-6 "Nouvel exercice" | Tester une seule fois |

---

*Guide rédigé pour une utilisation avec l'outil Maths Trainer (100% client, fichier:// compatible).*
