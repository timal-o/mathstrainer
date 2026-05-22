/**
 * Module : Valeur moyenne d'une fonction
 * Maths Spécialité — Terminale
 *
 * Formule : μ = 1/(b−a) · ∫_a^b f(x) dx
 *
 * Exercice : f(x) = p·x + q sur [a, b] (résultat toujours entier).
 * Contrainte : on choisit p pair ou (a+b) pair pour que μ soit entier.
 *
 * Interprétation géométrique rappelée : μ est la hauteur du rectangle
 * de base [a, b] ayant la même aire que la surface sous la courbe.
 */
MathsTrainer.register({
  id: 'integrale-valeur-moyenne',

  chapitre: 'Valeur moyenne d\'une fonction',

  notion: 'Calculer la valeur moyenne $\\mu = \\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx$',

  methode: [
    '<strong>Appliquer la formule</strong> : $\\mu = \\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx$.',
    'Calculer l\'intégrale $\\int_a^b f(x)\\,dx$ à l\'aide d\'une primitive $F$ : $= F(b) - F(a)$.',
    'Diviser le résultat par $(b - a)$ et simplifier.',
    '<em>Interprétation :</em> $\\mu$ est la hauteur du rectangle de largeur $(b-a)$ ayant la même aire que la surface sous la courbe de $f$.',
  ],

  generate() {
    // Bornes a < b, écart Δ = b - a ∈ {1, 2, 3, 4}
    const a  = Engine.randInt(0, 3);
    const dB = Engine.randInt(1, 4);
    const b  = a + dB;

    // f(x) = p·x + q
    // μ = (1/dB) · ∫_a^b (px+q)dx = (1/dB) · [px²/2 + qx]_a^b
    //   = (1/dB) · (p(b²-a²)/2 + q(b-a))
    //   = p(a+b)/2 + q
    // Pour μ entier : p·(a+b) pair, i.e. p pair OU (a+b) pair.

    let p, q;
    let attempts = 0;
    do {
      p = Engine.randInt(1, 4);
      q = Engine.randInt(0, 6);
      attempts++;
    } while (((p * (a + b)) % 2 !== 0) && attempts < 200);

    // Si p*(a+b) est impair (très rare), forcer p pair
    if ((p * (a + b)) % 2 !== 0) p = 2;

    const mu = p * (a + b) / 2 + q;

    // ── Primitive F(x) = p/2 · x² + q·x ─────────────────────────────────
    const primPCoef = Engine.latexFraction(p, 2);  // "p/2" ou "p" si pair
    const Fb = p * b * b / 2 + q * b;
    const Fa = p * a * a / 2 + q * a;
    const integral = Fb - Fa;   // = mu * dB

    // Formatage
    const pCoefTex = p === 1 ? '' : `${p}`;
    const qTex     = q === 0 ? '' : ` + ${q}`;
    const fTex     = `${pCoefTex}x${qTex}`;

    // Primitive en LaTeX
    const primTex  = `${primPCoef}x^2 + ${q}x`;

    // Valeurs en b et a
    const FbTex = `${primPCoef} \\times ${b}^2 + ${q} \\times ${b}`;
    const FaTex = a === 0
      ? '0'
      : `${primPCoef} \\times ${a}^2 + ${q} \\times ${a}`;

    const enonce =
      `Calculer la valeur moyenne de $f(x) = ${fTex}$ sur $[${a}\\,;\\,${b}]$.`;

    const correction =
      `<p>On applique la formule : $\\mu = \\dfrac{1}{b-a}\\displaystyle\\int_a^b f(x)\\,dx$.</p>` +
      `<p class="mt-2"><strong>Étape 1 — Calcul de l'intégrale</strong></p>` +
      `<p>La primitive de $f(x) = ${fTex}$ est $F(x) = ${primTex}$.</p>` +
      `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
      `\\int_{${a}}^{${b}} (${fTex})\\,dx` +
      ` &= \\Bigl[${primTex}\\Bigr]_{${a}}^{${b}} \\\\` +
      ` &= \\bigl(${FbTex}\\bigr) - \\bigl(${FaTex}\\bigr) \\\\` +
      ` &= ${Fb} - ${Fa} \\\\` +
      ` &= ${integral}` +
      `\\end{aligned}$$</div>` +
      `<p><strong>Étape 2 — Valeur moyenne</strong></p>` +
      `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
      `\\mu` +
      ` &= \\frac{1}{${b} - ${a}} \\times ${integral} \\\\` +
      ` &= \\frac{${integral}}{${dB}}` +
      `\\end{aligned}$$</div>` +
      `<div class="result-highlight">$$\\mu = ${mu}$$</div>`;

    return { enonce, correction };
  },
});
