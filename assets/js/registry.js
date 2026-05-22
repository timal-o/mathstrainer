/**
 * MathsTrainer — registre global des modules + arborescence des chapitres.
 *
 * - MathsTrainer.register(module) : appelé par chaque fichier de module
 * - MathsTrainer.getModule(id)    : renvoie un module ou null
 * - MathsTrainer.tree             : structure de la sidebar
 */
const MathsTrainer = {

  _modules: {},

  register(module) {
    if (!module.id) throw new Error('[MathsTrainer] Module sans id.');
    this._modules[module.id] = module;
    // console.log(`[MathsTrainer] ✓ ${module.id}`);
  },

  getModule(id) {
    return this._modules[id] || null;
  },

  /**
   * Arborescence des chapitres affichée dans la sidebar.
   *
   * Pour chaque chapitre :
   *   - id    : doit correspondre à l'id enregistré dans le module JS
   *   - label : texte affiché dans la sidebar
   *
   * open (true/false) contrôle l'état initial replié/déplié.
   */
  tree: [
    // ──────────────────────────────────────────────────────
    //  MATHS SPÉ — Terminale
    // ──────────────────────────────────────────────────────
    {
      id: 'spe',
      label: 'Maths Spé',
      sublabel: 'Terminale',
      icon: '📐',
      open: true,
      sections: [
        {
          id: 'spe-arith',
          label: 'Algèbre & Arithmétique',
          open: true,
          chapters: [
            { id: 'pgcd',   label: 'PGCD — Algorithme d\'Euclide' },
            { id: 'bezout', label: 'Théorème de Bézout — Remontée d\'Euclide' },
            { id: 'gauss',  label: 'Lemme de Gauss — Équation au + bv = c' },
          ],
        },
        {
          id: 'spe-analyse',
          label: 'Analyse',
          open: true,
          chapters: [
            { id: 'integrale-calcul',         label: 'Calcul direct d\'une intégrale' },
            { id: 'integrale-linearite',      label: 'Linéarité de l\'intégrale' },
            { id: 'integrale-chasles',        label: 'Relation de Chasles' },
            { id: 'integrale-valeur-moyenne', label: 'Valeur moyenne d\'une fonction' },
            { id: 'integrale-parties',        label: 'Intégration par parties' },
          ],
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    //  MATHS EXPERTES — Option Terminale
    // ──────────────────────────────────────────────────────
    {
      id: 'expertes',
      label: 'Maths Expertes',
      sublabel: 'Option Terminale',
      icon: '🔢',
      open: false,
      sections: [
        {
          id: 'exp-matrices',
          label: 'Matrices',
          open: true,
          chapters: [
            { id: 'gauss-jordan', label: 'Systèmes 3×3 — Méthode de Gauss-Jordan' },
          ],
        },
      ],
    },
  ],
};
