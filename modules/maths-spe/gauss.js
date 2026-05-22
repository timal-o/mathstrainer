/**
 * Module : Lemme de Gauss — Résolution de au + bv = c dans ℤ²
 * Maths Spécialité — Terminale
 *
 * Stratégie de génération :
 *   - a, b premiers entre eux (pgcd = 1), avec au moins 3 divisions d'Euclide
 *   - c ∈ [2, 7], petit pour que la solution particulière reste lisible
 *
 * Méthode :
 *   1. Euclide → pgcd(a,b) = 1
 *   2. Remontée → trouver (u₀, v₀) avec a·u₀ + b·v₀ = 1
 *   3. Solution particulière : (c·u₀, c·v₀)
 *   4. Gauss : a(u₀−u) = b(v−v₀), pgcd=1 → a | (v−v₀) → paramétrer
 *   5. Vérification
 */
MathsTrainer.register({
  id: 'gauss',

  chapitre: 'Lemme de Gauss — Équation $au + bv = c$',

  notion: 'Trouver toutes les solutions entières de $au + bv = c$ par Bézout puis le lemme de Gauss',

  methode: [
    'Calculer $d = \\operatorname{pgcd}(a, b)$ par l\'algorithme d\'Euclide. '
    + 'Vérifier $d \\mid c$ ; si $d > 1$ diviser toute l\'équation par $d$ '
    + 'pour se ramener à des <strong>coefficients premiers entre eux</strong>.',

    'Trouver $(u_0, v_0) \\in \\mathbb{Z}^2$ vérifiant $au_0 + bv_0 = 1$ '
    + 'par <strong>remontée de l\'algorithme d\'Euclide</strong>.',

    'En déduire la <strong>solution particulière</strong> : '
    + '$(cu_0,\\; cv_0)$ vérifie $a(cu_0) + b(cv_0) = c$.',

    'Pour les <strong>solutions générales</strong> : partant de '
    + '$au_0 + bv_0 = au + bv = c$, regrouper : '
    + '$a(u_0 - u) = b(v - v_0)$.',

    'Le <strong>lemme de Gauss</strong> (puisque $\\operatorname{pgcd}(a,b)=1$) '
    + 'donne $a \\mid (v - v_0)$. '
    + 'Il existe $k \\in \\mathbb{Z}$ tel que $v - v_0 = ka$, d\'où $u = u_0 - kb$.',

    'Vérifier la solution générale en la réinjectant dans l\'équation initiale.',
  ],

  generate() {
    // ── 1. Générer a, b premiers entre eux, au moins 3 étapes d'Euclide ───
    let a, b, steps;
    let att = 0;
    do {
      const { p, q } = Engine.coprimePair(2, 11);
      a = p; b = q;
      ({ steps } = Engine.euclidSteps(a, b));
      att++;
    } while (steps.length < 3 && att < 200);

    const n = steps.length;
    const c = Engine.randInt(2, 7);

    // ── 2. Bézout par remontée ────────────────────────────────────────────
    // Invariant : a·coef1·val1 + b·coef2·val2 = 1
    let coef1 = 1, coef2 = -steps[n - 2].quotient;
    const backSteps = [{
      coef1, val1: steps[n - 2].dividend,
      coef2, val2: steps[n - 2].divisor,
      lineRef: n - 1,
    }];
    for (let i = n - 3; i >= 0; i--) {
      const nc1 = coef2, nc2 = coef1 - coef2 * steps[i].quotient;
      coef1 = nc1; coef2 = nc2;
      backSteps.push({
        coef1, val1: steps[i].dividend,
        coef2, val2: steps[i].divisor,
        lineRef: i + 1,
      });
    }
    const bezU = coef1; // a·bezU + b·bezV = 1
    const bezV = coef2;

    // ── 3. Solution particulière ──────────────────────────────────────────
    const u0 = c * bezU;
    const v0 = c * bezV;

    // ── 4. Helpers LaTeX ─────────────────────────────────────────────────
    function termTex(coef, val) {
      if (coef === 1)  return `${val}`;
      if (coef === -1) return `(-1) \\times ${val}`;
      if (coef > 0)   return `${coef} \\times ${val}`;
      return `(${coef}) \\times ${val}`;
    }
    // Formate : coef1·val1 + coef2·val2 = 1
    function eqTex(c1, v1, c2, v2) {
      const t1 = termTex(c1, v1);
      let t2;
      if (c2 >= 0) {
        t2 = `+ ${termTex(c2, v2)}`;
      } else {
        const abs = Math.abs(c2);
        t2 = abs === 1 ? `- ${v2}` : `- ${abs} \\times ${v2}`;
      }
      return `${t1} \\; ${t2} = 1`;
    }
    // Formate un entier potentiellement négatif dans un produit : (−5) × 4
    function signedProd(coef, val) {
      return coef < 0 ? `(${coef}) \\times ${val}` : `${coef} \\times ${val}`;
    }

    // ── 5. Énoncé ─────────────────────────────────────────────────────────
    const enonce =
      `Résoudre dans $\\mathbb{Z}^2$ l'équation ` +
      `$$${a}u + ${b}v = ${c}$$`;

    // ── 6. Correction ─────────────────────────────────────────────────────

    // Tableau d'Euclide (format "a − q×b = r")
    const euclidLines = steps.map(({ dividend, divisor, quotient, remainder }, idx) => {
      const label = idx < n - 1 ? `\\quad (${idx + 1})` : '';
      return `${dividend} - ${quotient} \\times ${divisor} &= ${remainder}${label}`;
    });

    let html =
      `<p><strong>Étape 1 — Algorithme d'Euclide</strong></p>` +
      `<div class="my-3 overflow-x-auto">` +
      `$$\\begin{aligned} ${euclidLines.join(' \\\\ ')} \\end{aligned}$$` +
      `</div>` +
      `<p>Donc $\\operatorname{pgcd}(${a},\\, ${b}) = 1$, ` +
      `et $1 \\mid ${c}$ : l'équation admet des solutions entières.</p>`;

    // ── Remontée de Bézout
    html += `<p class="mt-4"><strong>Étape 2 — Relation de Bézout</strong></p>`;

    html += `<p>D'après $(${backSteps[0].lineRef})$ : ` +
            `$${eqTex(backSteps[0].coef1, backSteps[0].val1,
                      backSteps[0].coef2, backSteps[0].val2)}$</p>`;

    for (let k = 1; k < backSteps.length; k++) {
      const bs   = backSteps[k];
      const prev = backSteps[k - 1];
      const s    = steps[bs.lineRef - 1];
      const sub  = `${prev.val2} = ${s.dividend} - ${s.quotient} \\times ${s.divisor}`;
      html +=
        `<p class="mt-2">D'après $(${bs.lineRef})$, $${sub}$, donc :</p>` +
        `<p class="ml-5">$${eqTex(bs.coef1, bs.val1, bs.coef2, bs.val2)}$</p>`;
    }

    html += `<p class="mt-2">On retient : ` +
            `$${a} \\cdot (${bezU}) + ${b} \\cdot (${bezV}) = 1$.</p>`;

    // ── Solution particulière
    html +=
      `<p class="mt-4"><strong>Étape 3 — Solution particulière</strong></p>` +
      `<p>On multiplie la relation de Bézout par $${c}$ :</p>` +
      `<div class="my-2">` +
      `$$${a} \\cdot ${signedProd(bezU, c)} + ${b} \\cdot ${signedProd(bezV, c)} = ${c}$$` +
      `</div>` +
      `<p>Donc $(u_0,\\, v_0) = (${u0},\\, ${v0})$ est une solution particulière.</p>`;

    // ── Lemme de Gauss
    html +=
      `<p class="mt-4"><strong>Étape 4 — Solutions générales</strong></p>` +
      `<p>Soit $(u, v) \\in \\mathbb{Z}^2$ une solution quelconque. ` +
      `De $${a}u_0 + ${b}v_0 = ${a}u + ${b}v = ${c}$, on tire :</p>` +
      `<div class="my-2">$$${a}(u_0 - u) = ${b}(v - v_0)$$</div>` +
      `<p>Puisque $\\operatorname{pgcd}(${a},\\, ${b}) = 1$, ` +
      `le <strong>lemme de Gauss</strong> donne $${a} \\mid (v - v_0)$.</p>` +
      `<p class="mt-2">Il existe donc $k \\in \\mathbb{Z}$ tel que ` +
      `$v - v_0 = k \\cdot ${a}$, soit $v = v_0 + ${a}k$.</p>` +
      `<p class="mt-2">En substituant dans $${a}(u_0 - u) = ${b} \\cdot ${a}k$ :</p>` +
      `<div class="my-1">$$u_0 - u = ${b}k \\implies u = u_0 - ${b}k$$</div>`;

    // ── Résultat
    html +=
      `<div class="result-highlight mt-3">` +
      `$$\\begin{cases} u = ${u0} - ${b}k \\\\ v = ${v0} + ${a}k \\end{cases}` +
      `\\quad k \\in \\mathbb{Z}$$` +
      `</div>`;

    // ── Vérification
    const prodab = a * b;
    const au0tex = signedProd(u0 < 0 ? u0 : u0, a).replace(`${a} \\times ${u0}`, `${a} \\times ${u0 < 0 ? `(${u0})` : u0}`);
    // Calcul brut : a*u0 + b*v0 = c (garanti par construction)
    html +=
      `<p class="mt-4"><strong>Vérification</strong></p>` +
      `<div class="my-2 overflow-x-auto">` +
      `$$${a}(${u0} - ${b}k) + ${b}(${v0} + ${a}k) ` +
      `= \\underbrace{${a} \\times ${u0 < 0 ? `(${u0})` : u0} ` +
      `+ ${b} \\times ${v0 < 0 ? `(${v0})` : v0}}_{= ${c}} ` +
      `+ k\\underbrace{(-${prodab} + ${prodab})}_{= 0} ` +
      `= ${c} \\checkmark$$` +
      `</div>`;

    return { enonce, correction: html };
  },
});
