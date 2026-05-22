/**
 * Module : Linéarité de l'intégrale
 * Maths Spécialité — Terminale
 *
 * Stratégie :
 *   On donne ∫_a^b f = I et ∫_a^b g = J (valeurs entières aléatoires).
 *   On demande de calculer ∫_a^b (α·f + β·g) dx = α·I + β·J.
 *
 * Propriétés rappelées dans la méthode :
 *   - Séparation d'une somme  ∫(f+g) = ∫f + ∫g
 *   - Mise en facteur         ∫(k·f) = k·∫f
 *   - Inégalités              f ≥ 0 ⟹ ∫f ≥ 0 ; f ≥ g ⟹ ∫f ≥ ∫g
 */
MathsTrainer.register({
  id: 'integrale-linearite',

  chapitre: 'Linéarité de l\'intégrale',

  notion: 'Utiliser $\\int_a^b (\\alpha\\,f + \\beta\\,g)\\,dx = \\alpha\\int_a^b f\\,dx + \\beta\\int_a^b g\\,dx$',

  methode: [
    '<strong>Séparation :</strong> $\\displaystyle\\int_a^b \\bigl(f(x)+g(x)\\bigr)\\,dx = \\int_a^b f(x)\\,dx + \\int_a^b g(x)\\,dx$.',
    '<strong>Homogénéité :</strong> $\\displaystyle\\int_a^b k\\,f(x)\\,dx = k\\int_a^b f(x)\\,dx$ pour tout réel $k$.',
    'Combiner les deux : $\\displaystyle\\int_a^b (\\alpha\\,f + \\beta\\,g)\\,dx = \\alpha\\int_a^b f\\,dx + \\beta\\int_a^b g\\,dx$.',
    '<em>Rappel inégalités :</em> si $f \\geq 0$ sur $[a,b]$ alors $\\int_a^b f\\,dx \\geq 0$ ; si $f \\geq g$ alors $\\int_a^b f\\,dx \\geq \\int_a^b g\\,dx$.',
  ],

  generate() {
    // Bornes d'intégration (affichage uniquement, pas de calcul nécessaire)
    const a = Engine.randInt(0, 2);
    const b = a + Engine.randInt(1, 4);

    // Valeurs données des deux intégrales (entiers non nuls)
    const I = Engine.randIntWhere(-8, 8, v => v !== 0);
    const J = Engine.randIntWhere(-8, 8, v => v !== 0);

    // Coefficients α et β (entiers non nuls, ≥ 2 en valeur absolue pour rendre l'exercice non trivial)
    const alpha = Engine.randIntWhere(-4, 4, v => Math.abs(v) >= 2);
    const beta  = Engine.randIntWhere(-4, 4, v => Math.abs(v) >= 2);

    const result = alpha * I + beta * J;

    // ── Mise en forme LaTeX ──────────────────────────────────────────────
    function signedCoef(c, first) {
      if (first) return c === 1 ? '' : c === -1 ? '-' : `${c}`;
      if (c ===  1) return '+';
      if (c === -1) return '-';
      return c > 0 ? `+${c}` : `${c}`;
    }

    // Ex : α = 3, β = -2 → "3f(x) - 2g(x)"
    const alphaDisp = alpha === 1 ? '' : alpha === -1 ? '-' : `${alpha}`;
    const betaDisp  = beta  > 0
      ? `+ ${beta === 1 ? '' : beta}`
      : `- ${Math.abs(beta) === 1 ? '' : Math.abs(beta)}`;

    const integrand = `${alphaDisp}f(x) ${betaDisp}g(x)`;

    // Affichage du calcul final : α·I + β·J
    const term1 = `${alpha} \\times (${I})`;
    const sign2 = beta >= 0 ? '+' : '';
    const term2 = `${sign2}${beta} \\times (${J})`;

    // Affichage résultat signé
    const resTex = `${result}`;

    // ── Énoncé ───────────────────────────────────────────────────────────
    const enonce =
      `On sait que $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$ ` +
      `et $\\displaystyle\\int_{${a}}^{${b}} g(x)\\,dx = ${J}$.` +
      `<br><br>Calculer $\\displaystyle\\int_{${a}}^{${b}} \\bigl(${integrand}\\bigr)\\,dx$.`;

    // ── Correction ───────────────────────────────────────────────────────
    const correction =
      `<p>Par <strong>linéarité</strong> de l'intégrale :</p>` +
      `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
      `\\int_{${a}}^{${b}} \\bigl(${integrand}\\bigr)\\,dx` +
      ` &= ${alpha}\\int_{${a}}^{${b}} f(x)\\,dx ${sign2 || ''}${beta}\\int_{${a}}^{${b}} g(x)\\,dx \\\\` +
      ` &= ${term1} ${term2} \\\\` +
      ` &= ${resTex}` +
      `\\end{aligned}$$</div>` +
      `<div class="result-highlight">$$\\int_{${a}}^{${b}} \\bigl(${integrand}\\bigr)\\,dx = ${resTex}$$</div>`;

    return { enonce, correction };
  },
});
