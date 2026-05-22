/**
 * Module : Relation de Chasles
 * Maths Spécialité — Terminale
 *
 * Relation : ∫_a^c f = ∫_a^b f + ∫_b^c f
 *
 * 3 variantes tirées aléatoirement :
 *   A — On donne ∫_a^b f = I et ∫_b^c f = J. Trouver ∫_a^c f.   → I + J
 *   B — On donne ∫_a^c f = I et ∫_a^b f = J. Trouver ∫_b^c f.   → I − J
 *   C — On donne ∫_a^c f = I et ∫_b^c f = J. Trouver ∫_a^b f.   → I − J
 */
MathsTrainer.register({
  id: 'integrale-chasles',

  chapitre: 'Relation de Chasles',

  notion: 'Décomposer ou recombiner une intégrale via $\\int_a^c f\\,dx = \\int_a^b f\\,dx + \\int_b^c f\\,dx$',

  methode: [
    'Écrire la <strong>relation de Chasles</strong> : $\\displaystyle\\int_a^c f\\,dx = \\int_a^b f\\,dx + \\int_b^c f\\,dx$ (valable pour tout réel $b$).',
    'Identifier quelle intégrale est <strong>inconnue</strong> et lesquelles sont données.',
    '<strong>Isoler</strong> l\'inconnue par soustraction si besoin : par exemple $\\int_a^b f = \\int_a^c f - \\int_b^c f$.',
    'Substituer les valeurs numériques et calculer.',
  ],

  generate() {
    // Trois bornes entières a < b < c
    const a = Engine.randInt(0, 2);
    const b = a + Engine.randInt(1, 3);
    const c = b + Engine.randInt(1, 3);

    // Valeurs entières non nulles pour les deux intégrales données
    const I = Engine.randIntWhere(-10, 10, v => v !== 0);
    const J = Engine.randIntWhere(-10, 10, v => v !== 0);

    const variant = Engine.randInt(1, 3);

    let enonce, correction;

    if (variant === 1) {
      // ── Variante A : ∫_a^b = I, ∫_b^c = J → ∫_a^c = I + J ─────────────
      const res = I + J;
      enonce =
        `On sait que $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${I}$ ` +
        `et $\\displaystyle\\int_{${b}}^{${c}} f(x)\\,dx = ${J}$.` +
        `<br><br>Calculer $\\displaystyle\\int_{${a}}^{${c}} f(x)\\,dx$.`;

      correction =
        `<p>D'après la <strong>relation de Chasles</strong> (avec le point intermédiaire $${b}$) :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_{${a}}^{${c}} f(x)\\,dx` +
        ` &= \\int_{${a}}^{${b}} f(x)\\,dx + \\int_{${b}}^{${c}} f(x)\\,dx \\\\` +
        ` &= ${I} + (${J}) \\\\` +
        ` &= ${res}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_{${a}}^{${c}} f(x)\\,dx = ${res}$$</div>`;

    } else if (variant === 2) {
      // ── Variante B : ∫_a^c = I, ∫_a^b = J → ∫_b^c = I − J ─────────────
      const res = I - J;
      enonce =
        `On sait que $\\displaystyle\\int_{${a}}^{${c}} f(x)\\,dx = ${I}$ ` +
        `et $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx = ${J}$.` +
        `<br><br>Calculer $\\displaystyle\\int_{${b}}^{${c}} f(x)\\,dx$.`;

      correction =
        `<p>La relation de Chasles donne :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\int_{${a}}^{${c}} f = \\int_{${a}}^{${b}} f + \\int_{${b}}^{${c}} f$$</div>` +
        `<p>On en déduit :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_{${b}}^{${c}} f(x)\\,dx` +
        ` &= \\int_{${a}}^{${c}} f(x)\\,dx - \\int_{${a}}^{${b}} f(x)\\,dx \\\\` +
        ` &= ${I} - (${J}) \\\\` +
        ` &= ${res}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_{${b}}^{${c}} f(x)\\,dx = ${res}$$</div>`;

    } else {
      // ── Variante C : ∫_a^c = I, ∫_b^c = J → ∫_a^b = I − J ─────────────
      const res = I - J;
      enonce =
        `On sait que $\\displaystyle\\int_{${a}}^{${c}} f(x)\\,dx = ${I}$ ` +
        `et $\\displaystyle\\int_{${b}}^{${c}} f(x)\\,dx = ${J}$.` +
        `<br><br>Calculer $\\displaystyle\\int_{${a}}^{${b}} f(x)\\,dx$.`;

      correction =
        `<p>La relation de Chasles donne :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\int_{${a}}^{${c}} f = \\int_{${a}}^{${b}} f + \\int_{${b}}^{${c}} f$$</div>` +
        `<p>On en déduit :</p>` +
        `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
        `\\int_{${a}}^{${b}} f(x)\\,dx` +
        ` &= \\int_{${a}}^{${c}} f(x)\\,dx - \\int_{${b}}^{${c}} f(x)\\,dx \\\\` +
        ` &= ${I} - (${J}) \\\\` +
        ` &= ${res}` +
        `\\end{aligned}$$</div>` +
        `<div class="result-highlight">$$\\int_{${a}}^{${b}} f(x)\\,dx = ${res}$$</div>`;
    }

    return { enonce, correction };
  },
});
