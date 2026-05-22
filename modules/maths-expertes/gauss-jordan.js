/**
 * Module : Inverse d'une matrice 3×3 — Méthode de Gauss-Jordan
 * Maths Expertes — Terminale
 *
 * Construction garantissant des pivots toujours égaux à 1 (zéro fraction) :
 *
 *   M = L × U   avec
 *     L = [[1,0,0],[l21,1,0],[l31,l32,1]]  (triangulaire inférieure unité)
 *     U = [[1,u12,u13],[0,1,u23],[0,0,1]]  (triangulaire supérieure unité)
 *
 *   → det(M) = 1,  M⁻¹ = U⁻¹ × L⁻¹  avec entrées entières garanties.
 *
 * Algorithme affiché :
 *   Phase descendante  [M|I] → forme triangulaire supérieure
 *   Phase montante     → [I|M⁻¹]
 */
MathsTrainer.register({
  id: 'gauss-jordan',

  chapitre: 'Inverse d\'une matrice 3×3 — Méthode de Gauss-Jordan',

  notion: 'Calculer $M^{-1}$ en réduisant la matrice augmentée $[M \\mid I_3]$ jusqu\'à $[I_3 \\mid M^{-1}]$',

  methode: [
    'Écrire la <strong>matrice augmentée</strong> $[M \\mid I_3]$ : '
    + 'la matrice $M$ à gauche, l\'identité $I_3$ à droite.',

    '<strong>Phase descendante</strong> : utiliser le pivot de chaque colonne '
    + '(toujours non nul) pour mettre des $0$ en dessous, '
    + 'par des opérations $L_i \\leftarrow L_i - c \\cdot L_j$. '
    + 'On admet $\\det(M) \\neq 0$ — les pivots sont non nuls.',

    '<strong>Phase montante</strong> (spécificité de Gauss-Jordan) : '
    + 'mettre des $0$ au-dessus de chaque pivot, en remontant de droite à gauche. '
    + 'On n\'a pas besoin de résoudre un système : on lit $M^{-1}$ directement.',

    'Lire $M^{-1}$ dans la partie droite de la matrice réduite $[I_3 \\mid M^{-1}]$.',

    '<strong>Vérification</strong> : calculer $M \\times M^{-1}$ et vérifier qu\'on obtient $I_3$.',
  ],

  generate() {

    // ── 1. Construction M = L × U (pivots = 1 garantis) ──────────────────
    let l21, l31, l32, u12, u13, u23;
    let tries = 0;
    do {
      l21 = Engine.randIntWhere(-2, 2, v => v !== 0);
      l31 = Engine.randIntWhere(-2, 2, v => v !== 0);
      l32 = Engine.randIntWhere(-2, 2, v => v !== 0);
      u12 = Engine.randInt(-2, 2);
      u13 = Engine.randInt(-2, 2);
      u23 = Engine.randInt(-2, 2);
      tries++;
      // S'assurer que M n'est pas trop "simple" (pas trop d'entrées nulles)
    } while (
      [u12, u13, u23].filter(v => v === 0).length > 1 && tries < 100
    );

    // L
    const L = [
      [1,   0,   0],
      [l21, 1,   0],
      [l31, l32, 1],
    ];
    // U
    const U = [
      [1, u12, u13],
      [0, 1,   u23],
      [0, 0,   1  ],
    ];

    // M = L × U
    function matMul(A, B) {
      return A.map(row =>
        [0, 1, 2].map(j => row.reduce((s, v, k) => s + v * B[k][j], 0))
      );
    }
    const M = matMul(L, U);

    // ── 2. Matrice augmentée [M | I₃] ────────────────────────────────────
    const I3 = [[1,0,0],[0,1,0],[0,0,1]];
    let aug = M.map((row, i) => [...row, ...I3[i]]);  // 3×6

    // ── 3. Helpers ────────────────────────────────────────────────────────

    // Opération Li ← Li − coef × Lj  (retourne une nouvelle matrice)
    function rowOp(mat, i, coef, j) {
      const N = mat.map(r => [...r]);
      N[i] = N[i].map((v, k) => v - coef * mat[j][k]);
      return N;
    }

    // Rendu LaTeX d'une matrice augmentée 3×6
    function augTex(mat) {
      const rows = mat.map(r =>
        `${r[0]} & ${r[1]} & ${r[2]} & ${r[3]} & ${r[4]} & ${r[5]}`
      );
      return `\\left(\\begin{array}{rrr|rrr} ${rows.join(' \\\\ ')} \\end{array}\\right)`;
    }

    // Notation LaTeX de l'opération
    function opTex(i, coef, j) {
      const sign = coef > 0 ? '-' : '+';
      const abs  = Math.abs(coef);
      const cStr = abs === 1 ? '' : `${abs}\\,`;
      return `L_${i+1} \\leftarrow L_${i+1} ${sign} ${cStr}L_${j+1}`;
    }

    // ── 4. Déroulé de l'élimination ───────────────────────────────────────
    const steps = [];

    steps.push({ titre: 'Matrice augmentée $[M \\mid I_3]$', ops: null, mat: aug.map(r=>[...r]) });

    // ── Phase descendante ─────────────────────────────────────────────────

    // Colonne 0 : éliminer L1 et L2
    const opsD1 = [];
    if (aug[1][0] !== 0) { aug = rowOp(aug, 1, aug[1][0], 0); opsD1.push(opTex(1, M[1][0]/1, 0)); }
    if (aug[2][0] !== 0) { aug = rowOp(aug, 2, aug[2][0], 0); opsD1.push(opTex(2, M[2][0]/1, 0)); }
    // Recalcul propre : utiliser l21, l31 qui sont les vrais coefficients
    aug = M.map((row, i) => [...row, ...I3[i]]);
    {
      const ops2 = [];
      if (l21 !== 0) { aug = rowOp(aug, 1, l21, 0); ops2.push(opTex(1, l21, 0)); }
      if (l31 !== 0) { aug = rowOp(aug, 2, l31, 0); ops2.push(opTex(2, l31, 0)); }
      if (ops2.length) steps.push({ titre: 'Phase descendante — élimination sous le pivot de la colonne 1', ops: ops2, mat: aug.map(r=>[...r]) });
    }

    // Colonne 1 : éliminer L2 (le pivot est aug[1][1] = 1 garanti)
    {
      const c = aug[2][1];
      if (c !== 0) {
        aug = rowOp(aug, 2, c, 1);
        steps.push({ titre: 'Phase descendante — élimination sous le pivot de la colonne 2', ops: [opTex(2, c, 1)], mat: aug.map(r=>[...r]) });
      }
    }

    // ── Phase montante ────────────────────────────────────────────────────

    // Colonne 2 : éliminer L1 et L0
    {
      const ops = [];
      const c1 = aug[1][2];
      const c0 = aug[0][2];
      if (c1 !== 0) { aug = rowOp(aug, 1, c1, 2); ops.push(opTex(1, c1, 2)); }
      if (c0 !== 0) { aug = rowOp(aug, 0, c0, 2); ops.push(opTex(0, c0, 2)); }
      if (ops.length) steps.push({ titre: 'Phase montante — élimination au-dessus du pivot de la colonne 3', ops, mat: aug.map(r=>[...r]) });
    }

    // Colonne 1 : éliminer L0
    {
      const c0 = aug[0][1];
      if (c0 !== 0) {
        aug = rowOp(aug, 0, c0, 1);
        steps.push({ titre: 'Phase montante — élimination au-dessus du pivot de la colonne 2', ops: [opTex(0, c0, 1)], mat: aug.map(r=>[...r]) });
      }
    }

    // aug est maintenant [I₃ | M⁻¹]
    const inv = aug.map(r => r.slice(3));

    // ── 5. Vérification M × M⁻¹ = I₃ ────────────────────────────────────
    const check = matMul(M, inv);
    // check doit être I₃ (garanti par construction)

    // ── 6. Rendu LaTeX d'une matrice 3×3 seule ───────────────────────────
    function mat3Tex(mat) {
      const rows = mat.map(r => r.join(' & '));
      return `\\begin{pmatrix} ${rows.join(' \\\\ ')} \\end{pmatrix}`;
    }

    // ── 7. Énoncé ─────────────────────────────────────────────────────────
    const enonce =
      `Calculer l'inverse de la matrice $M$ par la méthode de Gauss-Jordan.` +
      `<div class="my-3">$$M = ${mat3Tex(M)}$$</div>`;

    // ── 8. Correction ─────────────────────────────────────────────────────
    let html = '';

    steps.forEach(({ titre, ops, mat }) => {
      html += `<p class="mt-4"><strong>${titre}</strong></p>`;
      if (ops && ops.length) {
        html += `<p class="text-slate-500 text-sm">` +
                ops.map(o => `$${o}$`).join(' &nbsp;&nbsp; ') +
                `</p>`;
      }
      html += `<div class="my-2 overflow-x-auto">$$${augTex(mat)}$$</div>`;
    });

    html +=
      `<p class="mt-4">La partie droite donne $M^{-1}$ :</p>` +
      `<div class="result-highlight mt-2">` +
      `$$M^{-1} = ${mat3Tex(inv)}$$` +
      `</div>` +
      `<p class="mt-4"><strong>Vérification</strong> : $M \\times M^{-1} = ?$</p>` +
      `<div class="my-2 overflow-x-auto">` +
      `$$${mat3Tex(M)} \\times ${mat3Tex(inv)} = ${mat3Tex(check)}$$` +
      `</div>`;

    return { enonce, correction: html };
  },
});
