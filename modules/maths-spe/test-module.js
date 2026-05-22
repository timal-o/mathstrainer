MathsTrainer.register({
  id: 'test-module',

  chapitre: 'Module de test — Puissances entières',

  notion: 'Calculer $a^n$ pour des entiers $a$ et $n$ donnés',

  methode: [
    'Rappeler la définition : $a^n = a \\times a \\times \\cdots \\times a$ ($n$ fois).',
    'Calculer $a^n$ en effectuant les multiplications successives.',
    'Cas particuliers : $a^0 = 1$, $a^1 = a$, $(-a)^n = a^n$ si $n$ pair, $-a^n$ si $n$ impair.',
  ],

  generate() {
    const a = Engine.randInt(2, 7);
    const n = Engine.randInt(2, 4);

    const result = Math.pow(a, n);

    // Développement : a × a × ... × a
    const product = Array(n).fill(a).join(' \\times ');

    const enonce = `Calculer $${a}^{${n}}$.`;

    const correction =
      `<p>On développe la puissance :</p>` +
      `<div class="my-4 overflow-x-auto">$$\\begin{aligned}` +
      `${a}^{${n}} &= ${product} \\\\` +
      `&= ${result}` +
      `\\end{aligned}$$</div>` +
      `<div class="result-highlight">$$${a}^{${n}} = ${result}$$</div>`;

    return { enonce, correction };
  },
});
