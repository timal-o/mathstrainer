/**
 * Application Alpine.js — Maths Trainer
 *
 * Dépend (dans l'ordre de chargement) :
 *   KaTeX + auto-render → engine.js → registry.js → modules/*.js → app.js → Alpine.js
 */
document.addEventListener('alpine:init', () => {
  Alpine.data('mathsApp', () => ({

    // ── État ───────────────────────────────────────────────────────────────
    tree:           MathsTrainer.tree,
    openSpecs:      {},   // { specId: bool }
    openSections:   {},   // { sectionId: bool }
    selectedId:     null,
    exercise:       null, // { enonce, correction } généré par le module
    showCorrection: false,

    // ── Options KaTeX ──────────────────────────────────────────────────────
    katexOptions: {
      delimiters: [
        { left: '$$', right: '$$', display: true  },
        { left: '$',  right: '$',  display: false },
      ],
      macros: {
        '\\pgcd': '\\operatorname{pgcd}',
        '\\ppcm': '\\operatorname{ppcm}',
        '\\N':    '\\mathbb{N}',
        '\\Z':    '\\mathbb{Z}',
        '\\R':    '\\mathbb{R}',
        '\\Q':    '\\mathbb{Q}',
        '\\C':    '\\mathbb{C}',
      },
      throwOnError: false,
    },

    // ── Initialisation ─────────────────────────────────────────────────────
    init() {
      // Initialiser l'état ouvert/fermé depuis les défauts du registre
      this.tree.forEach(spec => {
        this.openSpecs[spec.id] = spec.open ?? true;
        spec.sections.forEach(sec => {
          this.openSections[sec.id] = sec.open ?? true;
        });
      });

      // Déclencher le rendu KaTeX à chaque changement d'exercice ou de correction
      this.$watch('exercise',       () => this.$nextTick(() => this._renderKaTeX()));
      this.$watch('showCorrection', () => this.$nextTick(() => this._renderKaTeX()));

      // Sélectionner PGCD par défaut après initialisation DOM
      this.$nextTick(() => this.selectChapter('pgcd'));
    },

    // ── Propriétés calculées ───────────────────────────────────────────────
    get currentModule() {
      return this.selectedId ? MathsTrainer.getModule(this.selectedId) : null;
    },

    // ── Actions ────────────────────────────────────────────────────────────
    isAvailable(id) {
      return MathsTrainer.getModule(id) !== null;
    },

    selectChapter(id) {
      if (this.selectedId === id) return;
      this.selectedId     = id;
      this.showCorrection = false;
      this.exercise       = null;
      const mod = MathsTrainer.getModule(id);
      if (mod) this.exercise = mod.generate();
      // _renderKaTeX est déclenché par $watch sur exercise
    },

    newExercise() {
      if (!this.currentModule) return;
      this.showCorrection = false;
      this.exercise       = this.currentModule.generate();
    },

    toggleCorrection() {
      this.showCorrection = !this.showCorrection;
    },

    // ── KaTeX ──────────────────────────────────────────────────────────────
    _renderKaTeX() {
      if (!this.exercise) return;
      const el = document.getElementById('exercise-container');
      if (el && typeof renderMathInElement === 'function') {
        renderMathInElement(el, this.katexOptions);
      }
    },

  }));
});
