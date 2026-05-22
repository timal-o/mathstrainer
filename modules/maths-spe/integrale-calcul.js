/**
 * Module : Calcul direct d'une intégrale
 * Maths Spécialité — Terminale
 *
 * 5 types tirés aléatoirement :
 *   1. Polynôme      f(x) = a·xⁿ sur [0, k]       → résultat a·kⁿ⁺¹/(n+1)
 *   2. Sinus         f(x) = a·sin x sur [0, π]     → résultat 2a
 *   3. Cosinus       f(x) = a·cos x sur [0, π/2]   → résultat a
 *   4. Exponentielle f(x) = a·eˣ sur [0, 1]        → résultat a(e−1)
 *   5. Logarithme    f(x) = a·ln x sur [1, e]      → résultat a
 *      (primitive : x·ln x − x, avec ln(e)=1 et ln(1)=0)
 */
MathsTrainer.register({
  id: 'integrale-calcul',

  chapitre: 'Calcul direct d\'une intégrale',

  notion: 'Calculer $\\int_a^b f(x)\\,dx = \\bigl[F(x)\\bigr]_a^b = F(b) - F(a)$ en déterminant une primitive $F$ de $f$',

  methode: [
    'Reconnaître le <strong>type de $f$</strong> : polynôme, $\\sin$, $\\cos$, $\\mathrm{e}^x$…',
    'Trouver une <strong>primitive $F$</strong> vérifiant $F\'(x) = f(x)$ (tableau des primitives usuelles).',
    'Écrire $\\displaystyle\\int_a^b f(x)\\,dx = \\Bigl[F(x)\\Bigr]_a^b$.',
    'Calculer $F(b) - F(a)$ en substituant les bornes, puis <strong>simplifier</strong>.',
  ],

  generate() {
    const type = Engine.randInt(1, 5);

    // ── Type 1 : polynôme a·xⁿ sur [0, k] ────────────────────────────────
    if (type === 1) {
      const a = Engine.randInt(1, 5);
      const n = Engine.randInt(2, 4);
      const k = Engine.randInt(1, 3);

      const kpow     = Math.pow(k, n + 1);
      const resTex   = Engine.latexFraction(a * kpow, n + 1);
      const primCoef = Engine.latexFraction(a, n + 1);

      const fTex = a === 1 ? `x^{${n}}`         : `${a}x^{${n}}`;
      const FTex = `${primCoef}\\,x^{${n + 1}}`;

      const enonce = `Calculer $\\displaystyle\\int_0^{${k}} ${fTex}\\,dx$.`;

      const correction =
        `<p>La primitive de $f(x) = ${fTex}$ est $F(x) = ${FTex}$.</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^{${k}} ${fTex}\\,dx` +
        ` &= \\Bigl[${FTex}\\Bigr]_0^{${k}} \\\\` +
        ` &= ${primCoef} \\times ${k}^{${n + 1}} - 0 \\\\` +
        ` &= ${resTex}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_0^{${k}} ${fTex}\\,dx = ${resTex}$$</div>`;

      return { enonce, correction };
    }

    // ── Type 2 : sinus — ∫₀^π a·sin x dx = 2a ───────────────────────────
    if (type === 2) {
      const a   = Engine.randInt(2, 5);
      const res = 2 * a;

      const fTex = `${a}\\sin x`;
      const FTex = `-${a}\\cos x`;

      const enonce = `Calculer $\\displaystyle\\int_0^{\\pi} ${fTex}\\,dx$.`;

      const correction =
        `<p>La primitive de $f(x) = ${fTex}$ est $F(x) = ${FTex}$.</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^{\\pi} ${fTex}\\,dx` +
        ` &= \\Bigl[${FTex}\\Bigr]_0^{\\pi} \\\\` +
        ` &= (-${a}\\cos\\pi) - (-${a}\\cos 0) \\\\` +
        ` &= (-${a})\\times(-1) - (-${a})\\times 1 \\\\` +
        ` &= ${a} + ${a}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_0^{\\pi} ${fTex}\\,dx = ${res}$$</div>`;

      return { enonce, correction };
    }

    // ── Type 3 : cosinus — ∫₀^{π/2} a·cos x dx = a ──────────────────────
    if (type === 3) {
      const a = Engine.randInt(2, 5);

      const fTex = `${a}\\cos x`;
      const FTex = `${a}\\sin x`;

      const enonce = `Calculer $\\displaystyle\\int_0^{\\pi/2} ${fTex}\\,dx$.`;

      const correction =
        `<p>La primitive de $f(x) = ${fTex}$ est $F(x) = ${FTex}$.</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^{\\pi/2} ${fTex}\\,dx` +
        ` &= \\Bigl[${FTex}\\Bigr]_0^{\\pi/2} \\\\` +
        ` &= ${a}\\sin\\tfrac{\\pi}{2} - ${a}\\sin 0 \\\\` +
        ` &= ${a} \\times 1 - ${a} \\times 0` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_0^{\\pi/2} ${fTex}\\,dx = ${a}$$</div>`;

      return { enonce, correction };
    }

    // ── Type 4 : exponentielle — ∫₀¹ a·eˣ dx = a(e−1) ───────────────────
    if (type === 4) {
      const a = Engine.randInt(1, 5);

      const fTex   = a === 1 ? `e^x`   : `${a}e^x`;
      const FTex   = a === 1 ? `e^x`   : `${a}e^x`;
      const step3  = a === 1 ? `e^1 - e^0`       : `${a}e^1 - ${a}e^0`;
      const step4  = a === 1 ? `e - 1`           : `${a}e - ${a}`;
      const resTex = a === 1 ? `e - 1`           : `${a}(e - 1)`;

      const enonce = `Calculer $\\displaystyle\\int_0^1 ${fTex}\\,dx$.`;

      const correction =
        `<p>La primitive de $f(x) = ${fTex}$ est $F(x) = ${FTex}$.</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^1 ${fTex}\\,dx` +
        ` &= \\Bigl[${FTex}\\Bigr]_0^1 \\\\` +
        ` &= ${step3} \\\\` +
        ` &= ${step4}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_0^1 ${fTex}\\,dx = ${resTex}$$</div>`;

      return { enonce, correction };
    }

    // ── Type 5 : logarithme — ∫₁ᵉ a·ln x dx = a ─────────────────────────
    // Primitive de ln x : F(x) = x·ln x − x
    // F(e) = e·1 − e = 0  ;  F(1) = 1·0 − 1 = −1  →  F(e)−F(1) = 0+1 = 1
    {
      const a = Engine.randInt(1, 5);

      const fTex  = a === 1 ? `\\ln x`           : `${a}\\ln x`;
      const FTex  = a === 1 ? `x\\ln x - x`      : `${a}(x\\ln x - x)`;
      const resTex = `${a}`;

      const enonce = `Calculer $\\displaystyle\\int_1^{\\mathrm{e}} ${fTex}\\,dx$.`;

      // Évaluation en e et en 1
      const Fe = a === 1 ? `(\\mathrm{e}\\ln\\mathrm{e} - \\mathrm{e})` : `${a}(\\mathrm{e}\\ln\\mathrm{e} - \\mathrm{e})`;
      const F1 = a === 1 ? `(1 \\cdot \\ln 1 - 1)` : `${a}(1 \\cdot \\ln 1 - 1)`;

      const correction =
        `<p>La primitive de $\\ln x$ est $F(x) = x\\ln x - x$` +
        (a > 1 ? `, donc ici $F(x) = ${FTex}$.` : `.`) +
        `</p>` +
        `<p class="mt-1 text-xs text-slate-500">On utilise $\\ln\\mathrm{e} = 1$ et $\\ln 1 = 0$.</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_1^{\\mathrm{e}} ${fTex}\\,dx` +
        ` &= \\Bigl[${FTex}\\Bigr]_1^{\\mathrm{e}} \\\\` +
        ` &= ${Fe} - ${F1} \\\\` +
        ` &= ${a}(1 - 1) - ${a}(0 - 1) \\\\` +
        ` &= 0 + ${a}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_1^{\\mathrm{e}} ${fTex}\\,dx = ${resTex}$$</div>`;

      return { enonce, correction };
    }
  },
});
