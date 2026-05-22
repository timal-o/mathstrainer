/**
 * Module : Théorème de Bézout — Remontée de l'algorithme d'Euclide
 * Maths Spécialité — Terminale
 *
 * Stratégie de génération :
 *   - d ∈ [1, 5], paire (p, q) copremière avec p > q ≥ 2
 *   - a = d·p, b = d·q  →  pgcd(a, b) = d garanti
 *   - Contrainte : au moins 3 divisions pour que la remontée soit instructive
 *
 * Algorithme de remontée :
 *   On maintient l'invariant  d = coef1 · val1 + coef2 · val2
 *   en substituant val2 à chaque étape grâce à la division précédente.
 */
MathsTrainer.register({
  id: 'bezout',

  chapitre: 'Théorème de Bézout — Remontée d\'Euclide',

  notion: 'Trouver des coefficients entiers $u, v$ tels que $au + bv = \\operatorname{pgcd}(a, b)$',

  methode: [
    'Appliquer l\'<strong>algorithme d\'Euclide</strong> à $(a, b)$ et <strong>numéroter</strong> chaque division $(1), (2), \\ldots$',

    'Repartir de l\'<strong>avant-dernière division numérotée</strong> pour exprimer '
    + '$d = \\operatorname{pgcd}(a,b)$ comme différence : '
    + '$d = r_k - q \\times r_{k+1}$.',

    'Remonter ligne par ligne : à chaque étape, <strong>substituer le dernier reste</strong> '
    + 'en utilisant la division qui l\'introduit.',

    'Arrêter quand $d$ ne contient plus que $a$ et $b$ : '
    + 'on lit directement $u$ et $v$ dans $d = u \\cdot a + v \\cdot b$.',
  ],

  generate() {
    // ── 1. Génération de valeurs propres ──────────────────────────────────
    let a, b, pgcd, steps;
    let attempts = 0;

    do {
      const d = Engine.randInt(1, 5);
      const { p, q } = Engine.coprimePair(2, 13);
      a = d * p;
      b = d * q;
      ({ steps, pgcd } = Engine.euclidSteps(a, b));
      attempts++;
    } while (steps.length < 3 && attempts < 200);

    // ── 2. Remontée de Bézout ─────────────────────────────────────────────
    // Invariant : d = coef1 * val1 + coef2 * val2
    const n = steps.length;

    // Point de départ : avant-dernière division (steps[n-2], dont le reste = pgcd)
    let coef1 = 1;
    let coef2 = -steps[n - 2].quotient;
    // val1 = steps[n-2].dividend, val2 = steps[n-2].divisor  (implicite, suivi ci-dessous)

    // On enregistre chaque état pour affichage :
    //   { coef1, val1, coef2, val2, lineRef }
    //   lineRef = numéro (1-indexé) de la division euclide utilisée à cette étape
    const backSteps = [];
    backSteps.push({
      coef1,
      val1:  steps[n - 2].dividend,
      coef2,
      val2:  steps[n - 2].divisor,
      lineRef: n - 1,   // on lit la relation dans la division n-1
    });

    // Remontée : de steps[n-3] jusqu'à steps[0]
    for (let i = n - 3; i >= 0; i--) {
      const nc1 = coef2;
      const nc2 = coef1 - coef2 * steps[i].quotient;
      coef1 = nc1;
      coef2 = nc2;
      backSteps.push({
        coef1,
        val1:  steps[i].dividend,
        coef2,
        val2:  steps[i].divisor,
        lineRef: i + 1,   // on a substitué grâce à la division i+1
      });
    }

    // Résultat final
    const u = coef1;  // coeff de a
    const v = coef2;  // coeff de b

    // ── 3. Helpers LaTeX ──────────────────────────────────────────────────

    // Formate un terme  coef × val  pour une somme algébrique
    function termTex(coef, val) {
      if (coef === 1)  return `${val}`;
      if (coef === -1) return `(-1) \\times ${val}`;
      if (coef > 0)   return `${coef} \\times ${val}`;
      return `(${coef}) \\times ${val}`;   // coef < -1 : parenthèses
    }

    // Formate  pgcd = coef1·val1 + coef2·val2
    function eqTex(c1, v1, c2, v2) {
      const t1 = termTex(c1, v1);
      let t2;
      if (c2 >= 0) {
        t2 = `+ ${termTex(c2, v2)}`;
      } else {
        const abs = Math.abs(c2);
        t2 = abs === 1 ? `- ${v2}` : `- ${abs} \\times ${v2}`;
      }
      return `${pgcd} = ${t1} \\; ${t2}`;
    }

    // ── 4. Énoncé ─────────────────────────────────────────────────────────
    const enonce =
      `Calculer $\\operatorname{pgcd}(${a},\\; ${b})$ par l'algorithme d'Euclide, ` +
      `puis déterminer des entiers $u$ et $v$ tels que ` +
      `$$${a}u + ${b}v = \\operatorname{pgcd}(${a},\\; ${b}).$$`;

    // ── 5. Correction ─────────────────────────────────────────────────────

    // — Tableau de l'algorithme d'Euclide (numérotation sauf dernière ligne) —
    const euclidLines = steps.map(({ dividend, divisor, quotient, remainder }, idx) => {
      const label = idx < n - 1 ? `\\quad (${idx + 1})` : '';
      return `${dividend} - ${quotient} \\times ${divisor} &= ${remainder}${label}`;
    });

    let html =
      `<p><strong>Étape 1 — Algorithme d'Euclide</strong></p>` +
      `<div class="my-4 overflow-x-auto">` +
      `$$\\begin{aligned} ${euclidLines.join(' \\\\ ')} \\end{aligned}$$` +
      `</div>` +
      `<p>Le dernier reste non nul est $${pgcd}$, donc ` +
      `$\\operatorname{pgcd}(${a},\\; ${b}) = ${pgcd}$.</p>`;

    // — Remontée —
    html += `<p class="mt-5"><strong>Étape 2 — Remontée</strong></p>`;

    // Première ligne : on part de la division (lineRef) pour écrire pgcd
    const bs0 = backSteps[0];
    const eq0 = eqTex(bs0.coef1, bs0.val1, bs0.coef2, bs0.val2);
    html +=
      `<p>D'après $(${bs0.lineRef})$, on exprime $${pgcd}$ directement :</p>` +
      `<p class="ml-5">$${eq0}$</p>`;

    // Substitutions suivantes
    for (let k = 1; k < backSteps.length; k++) {
      const bs   = backSteps[k];
      const prev = backSteps[k - 1];
      // La division qu'on utilise pour substituer prev.val2
      const s   = steps[bs.lineRef - 1];
      // prev.val2 = s.remainder = s.dividend - s.quotient × s.divisor
      const sub = `${prev.val2} = ${s.dividend} - ${s.quotient} \\times ${s.divisor}`;
      const newEq = eqTex(bs.coef1, bs.val1, bs.coef2, bs.val2);

      html +=
        `<p class="mt-3">D'après $(${bs.lineRef})$, ` +
        `$${sub}$, donc en substituant $${prev.val2}$ :</p>` +
        `<p class="ml-5">$${newEq}$</p>`;
    }

    // — Résultat final —
    const bezoutEq = eqTex(u, a, v, b);
    html +=
      `<div class="result-highlight mt-5">` +
      `$$\\operatorname{pgcd}(${a},\\; ${b}) = ${bezoutEq}$$` +
      `</div>` +
      `<p class="mt-3 text-xs text-slate-500">` +
      `Vérification&nbsp;: $${u < 0 ? `(${u})` : u} \\times ${a} ` +
      `${v >= 0 ? '+' : ''} ${v < 0 ? `(${v})` : v} \\times ${b} ` +
      `= ${u * a + v * b} = ${pgcd}$ ✓` +
      `</p>`;

    return { enonce, correction: html };
  },
});
