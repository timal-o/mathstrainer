/**
 * Module : PGCD — Algorithme d'Euclide
 * Maths Spécialité — Terminale
 *
 * Stratégie de génération "propre" :
 *   1. Tirer d ∈ [2, 10]  (le PGCD cible)
 *   2. Tirer p, q premiers entre eux avec p > q ≥ 2
 *   3. Poser a = d·p, b = d·q  → pgcd(a, b) = d garanti
 *   4. Contrôle : au moins 2 divisions non triviales pour que l'exercice
 *      soit intéressant (sinon on régénère).
 */
MathsTrainer.register({
  id: 'pgcd',

  chapitre: 'PGCD — Algorithme d\'Euclide',

  notion: 'Calculer le PGCD de deux entiers en effectuant des divisions euclidiennes successives',

  methode: [
    'Écrire la <strong>division euclidienne</strong> de $a$ par $b$ : '
    + '$a = b \\times q_1 + r_1$ avec $0 \\leq r_1 < b$.',

    'Remplacer le couple $(a,\\, b)$ par $(b,\\, r_1)$ et recommencer : '
    + '$b = r_1 \\times q_2 + r_2$, etc.',

    'S\'arrêter dès que le reste est <strong>nul</strong>.',

    'Le <strong>dernier reste non nul</strong> est le $\\operatorname{pgcd}(a, b)$.',
  ],

  generate() {
    // ── 1. Générer des valeurs "propres" ──────────────────────────────────
    let a, b, steps, pgcd;
    let attempts = 0;

    do {
      const d = Engine.randInt(2, 10);
      const { p, q } = Engine.coprimePair(2, 14);
      a = d * p;  // toujours > b
      b = d * q;
      ({ steps, pgcd } = Engine.euclidSteps(a, b));
      attempts++;
      // On veut au moins 2 étapes pour que ce soit instructif
    } while (steps.length < 2 && attempts < 50);

    // ── 2. Énoncé ─────────────────────────────────────────────────────────
    const enonce =
      `Calculer $\\operatorname{pgcd}(${a},\\; ${b})$ en détaillant toutes les étapes ` +
      `de l'<strong>algorithme d'Euclide</strong>.`;

    // ── 3. Correction ─────────────────────────────────────────────────────
    // Lignes de l'environnement aligned : "dividend = divisor × quotient + remainder"
    const lignes = steps.map(({ dividend, divisor, quotient, remainder }) =>
      `${dividend} &= ${divisor} \\times ${quotient} + ${remainder}`
    );

    // Dernière ligne : mettre "0" en évidence si souhaité
    // (déjà inclus dans la map ci-dessus via remainder = 0)

    const correction =
      `<p>On effectue des <strong>divisions euclidiennes successives</strong> ` +
      `jusqu'à obtenir un reste nul :</p>` +

      `<div class="my-4 overflow-x-auto">` +
      `$$\\begin{aligned} ${lignes.join(' \\\\ ')} \\end{aligned}$$` +
      `</div>` +

      `<p>Le dernier reste non nul est $${pgcd}$, donc :</p>` +

      `<div class="result-highlight">` +
      `$$\\operatorname{pgcd}(${a},\\;${b}) \\;=\\; ${pgcd}$$` +
      `</div>`;

    return { enonce, correction };
  },
});
