/**
 * Module : Intégration par parties (IPP)
 * Maths Spécialité — Terminale
 *
 * Formule : ∫_a^b u(x)·v'(x) dx = [u(x)·v(x)]_a^b − ∫_a^b u'(x)·v(x) dx
 *
 * 4 scénarios « propres » tirés aléatoirement, avec multiplicateur k ∈ {1,2,3} :
 *   1. ∫_0^1 k·x·eˣ dx = k
 *   2. ∫_0^π k·x·sin x dx = k·π
 *   3. ∫_0^{π/2} k·x·cos x dx = k·(π/2 − 1)
 *   4. ∫_1^e k·ln x dx = k
 */
MathsTrainer.register({
  id: 'integrale-parties',

  chapitre: 'Intégration par parties',

  notion: 'Calculer $\\int_a^b u(x)\\,v\'(x)\\,dx = \\Bigl[u(x)\\,v(x)\\Bigr]_a^b - \\int_a^b u\'(x)\\,v(x)\\,dx$',

  methode: [
    '<strong>Identifier</strong> le produit $u \\cdot v\'$ : choisir $u$ = polynôme ou $\\ln$, et $v\'$ = $e^x$, $\\sin x$, $\\cos x$ ou $1$.',
    '<strong>Calculer</strong> $u\'(x)$ (dérivée) et $v(x)$ (une primitive de $v\'$).',
    '<strong>Appliquer</strong> la formule : $\\displaystyle\\int_a^b u\\,v\'\\,dx = \\Bigl[u\\,v\\Bigr]_a^b - \\int_a^b u\'\\,v\\,dx$.',
    '<strong>Évaluer</strong> $\\bigl[u(x)\\,v(x)\\bigr]_a^b = u(b)\\,v(b) - u(a)\\,v(a)$, puis calculer l\'intégrale restante (souvent immédiate).',
  ],

  generate() {
    const scenario = Engine.randInt(1, 4);
    const k        = Engine.randInt(1, 3);
    const kTex     = k === 1 ? '' : `${k}`;

    // ── Scénario 1 : ∫_0^1 k·x·eˣ dx = k ────────────────────────────────
    if (scenario === 1) {
      const fTex = `${kTex}x\\,e^x`;

      const enonce = `Calculer $\\displaystyle\\int_0^1 ${fTex}\\,dx$.`;

      const multStep = k > 1
        ? `<p class="mt-3">On factorise par $${k}$ :</p>` +
          `<div class="my-3 overflow-x-auto">` +
          `$$\\int_0^1 ${fTex}\\,dx = ${k}\\int_0^1 x\\,e^x\\,dx = ${k} \\times 1 = ${k}$$` +
          `</div>`
        : '';

      const correction =
        `<p>On pose $u(x) = x$, $\\;v'(x) = e^x$, donc $u'(x) = 1$, $\\;v(x) = e^x$.</p>` +
        `<p class="mt-2">Par IPP sur $\\int_0^1 x\\,e^x\\,dx$ :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^1 x\\,e^x\\,dx` +
        ` &= \\Bigl[x\\,e^x\\Bigr]_0^1 - \\int_0^1 1 \\cdot e^x\\,dx \\\\` +
        ` &= \\Bigl[x\\,e^x\\Bigr]_0^1 - \\Bigl[e^x\\Bigr]_0^1 \\\\` +
        ` &= (1 \\cdot e - 0 \\cdot 1) - (e - 1) \\\\` +
        ` &= e - e + 1 = 1` +
        `\\end{aligned}$$</div>` +
        multStep +
        `<div class="result-highlight">$$\\int_0^1 ${fTex}\\,dx = ${k}$$</div>`;

      return { enonce, correction };
    }

    // ── Scénario 2 : ∫_0^π k·x·sin x dx = k·π ───────────────────────────
    if (scenario === 2) {
      const fTex   = `${kTex}x\\sin x`;
      const resTex = k === 1 ? `\\pi` : `${k}\\pi`;

      const enonce = `Calculer $\\displaystyle\\int_0^{\\pi} ${fTex}\\,dx$.`;

      const multStep = k > 1
        ? `<p class="mt-3">On factorise par $${k}$ :</p>` +
          `<div class="my-3 overflow-x-auto">` +
          `$$\\int_0^{\\pi} ${fTex}\\,dx = ${k}\\int_0^{\\pi} x\\sin x\\,dx = ${k} \\times \\pi = ${k}\\pi$$` +
          `</div>`
        : '';

      const correction =
        `<p>On pose $u(x) = x$, $\\;v'(x) = \\sin x$, donc $u'(x) = 1$, $\\;v(x) = -\\cos x$.</p>` +
        `<p class="mt-2">Par IPP sur $\\int_0^{\\pi} x\\sin x\\,dx$ :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^{\\pi} x\\sin x\\,dx` +
        ` &= \\Bigl[-x\\cos x\\Bigr]_0^{\\pi} - \\int_0^{\\pi} (-\\cos x)\\,dx \\\\` +
        ` &= \\Bigl[-x\\cos x\\Bigr]_0^{\\pi} + \\Bigl[\\sin x\\Bigr]_0^{\\pi} \\\\` +
        ` &= \\bigl(-\\pi\\cos\\pi - 0\\bigr) + (\\sin\\pi - \\sin 0) \\\\` +
        ` &= (-\\pi)(-1) + (0 - 0) \\\\` +
        ` &= \\pi` +
        `\\end{aligned}$$</div>` +
        multStep +
        `<div class="result-highlight">$$\\int_0^{\\pi} ${fTex}\\,dx = ${resTex}$$</div>`;

      return { enonce, correction };
    }

    // ── Scénario 3 : ∫_0^{π/2} k·x·cos x dx = k·(π/2 − 1) ──────────────
    if (scenario === 3) {
      const fTex   = `${kTex}x\\cos x`;
      const resTex = k === 1
        ? `\\dfrac{\\pi}{2} - 1`
        : `${k}\\!\\left(\\dfrac{\\pi}{2} - 1\\right)`;

      const enonce = `Calculer $\\displaystyle\\int_0^{\\pi/2} ${fTex}\\,dx$.`;

      const multStep = k > 1
        ? `<p class="mt-3">On factorise par $${k}$ :</p>` +
          `<div class="my-3 overflow-x-auto">` +
          `$$\\int_0^{\\pi/2} ${fTex}\\,dx = ${k}\\int_0^{\\pi/2} x\\cos x\\,dx = ${k}\\left(\\dfrac{\\pi}{2}-1\\right)$$` +
          `</div>`
        : '';

      const correction =
        `<p>On pose $u(x) = x$, $\\;v'(x) = \\cos x$, donc $u'(x) = 1$, $\\;v(x) = \\sin x$.</p>` +
        `<p class="mt-2">Par IPP sur $\\int_0^{\\pi/2} x\\cos x\\,dx$ :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_0^{\\pi/2} x\\cos x\\,dx` +
        ` &= \\Bigl[x\\sin x\\Bigr]_0^{\\pi/2} - \\int_0^{\\pi/2} \\sin x\\,dx \\\\` +
        ` &= \\Bigl[x\\sin x\\Bigr]_0^{\\pi/2} - \\Bigl[-\\cos x\\Bigr]_0^{\\pi/2} \\\\` +
        ` &= \\left(\\frac{\\pi}{2}\\sin\\frac{\\pi}{2} - 0\\right)` +
        ` - \\left(-\\cos\\frac{\\pi}{2} + \\cos 0\\right) \\\\` +
        ` &= \\frac{\\pi}{2} \\times 1 - (0 + 1) \\\\` +
        ` &= \\frac{\\pi}{2} - 1` +
        `\\end{aligned}$$</div>` +
        multStep +
        `<div class="result-highlight">$$\\int_0^{\\pi/2} ${fTex}\\,dx = ${resTex}$$</div>`;

      return { enonce, correction };
    }

    // ── Scénario 4 : ∫_1^e k·ln x dx = k ────────────────────────────────
    {
      const fTex = k === 1 ? `\\ln x` : `${k}\\ln x`;

      const enonce = `Calculer $\\displaystyle\\int_1^{\\mathrm{e}} ${fTex}\\,dx$.`;

      const multStep = k > 1
        ? `<p class="mt-3">On factorise par $${k}$ :</p>` +
          `<div class="my-3 overflow-x-auto">` +
          `$$\\int_1^{\\mathrm{e}} ${fTex}\\,dx = ${k}\\int_1^{\\mathrm{e}} \\ln x\\,dx = ${k} \\times 1 = ${k}$$` +
          `</div>`
        : '';

      const correction =
        `<p>On pose $u(x) = \\ln x$, $\\;v'(x) = 1$, donc $u'(x) = \\dfrac{1}{x}$, $\\;v(x) = x$.</p>` +
        `<p class="mt-2">Par IPP sur $\\int_1^{\\mathrm{e}} \\ln x\\,dx$ :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_1^{\\mathrm{e}} \\ln x\\,dx` +
        ` &= \\Bigl[x\\ln x\\Bigr]_1^{\\mathrm{e}} - \\int_1^{\\mathrm{e}} x \\cdot \\frac{1}{x}\\,dx \\\\` +
        ` &= \\Bigl[x\\ln x\\Bigr]_1^{\\mathrm{e}} - \\int_1^{\\mathrm{e}} 1\\,dx \\\\` +
        ` &= (\\mathrm{e}\\ln\\mathrm{e} - 1 \\cdot \\ln 1) - \\Bigl[x\\Bigr]_1^{\\mathrm{e}} \\\\` +
        ` &= (\\mathrm{e} \\cdot 1 - 0) - (\\mathrm{e} - 1) \\\\` +
        ` &= \\mathrm{e} - \\mathrm{e} + 1 = 1` +
        `\\end{aligned}$$</div>` +
        multStep +
        `<div class="result-highlight">$$\\int_1^{\\mathrm{e}} ${fTex}\\,dx = ${k}$$</div>`;

      return { enonce, correction };
    }
  },
});
