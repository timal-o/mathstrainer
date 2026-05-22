/**
 * Engine — utilitaires mathématiques pour la génération d'exercices contraints.
 * Disponible globalement dans tous les modules via l'objet Engine.
 */
const Engine = {

  /** Entier aléatoire dans [min, max] inclus. */
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** PGCD de a et b (algorithme d'Euclide). */
  gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) { [a, b] = [b, a % b]; }
    return a;
  },

  /** PPCM de a et b. */
  lcm(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  },

  /**
   * Tire un entier dans [min, max] satisfaisant predicate.
   * Essai aléatoire d'abord, puis parcours exhaustif en fallback.
   */
  randIntWhere(min, max, predicate, maxAttempts = 200) {
    for (let i = 0; i < maxAttempts; i++) {
      const v = this.randInt(min, max);
      if (predicate(v)) return v;
    }
    for (let v = min; v <= max; v++) {
      if (predicate(v)) return v;
    }
    throw new Error(`Engine.randIntWhere : aucune valeur trouvée dans [${min}, ${max}]`);
  },

  /**
   * Renvoie une paire { p, q } avec p > q >= minQ, pgcd(p, q) = 1.
   * Utilisé pour construire a = d*p, b = d*q de sorte que pgcd(a,b) = d.
   */
  coprimePair(minQ = 2, maxP = 15) {
    let p, q, tries = 0;
    do {
      p = this.randInt(minQ + 1, maxP);
      q = this.randInt(minQ, p - 1);
      if (++tries > 400) return { p: 7, q: 4 }; // fallback garanti coprime
    } while (this.gcd(p, q) !== 1);
    return { p, q };
  },

  /**
   * Exécute l'algorithme d'Euclide sur (a, b) et renvoie les étapes.
   * Chaque étape : { dividend, divisor, quotient, remainder }.
   * Renvoie aussi le pgcd final.
   */
  euclidSteps(a, b) {
    const steps = [];
    let x = Math.max(a, b), y = Math.min(a, b);
    while (y !== 0) {
      const q = Math.floor(x / y);
      const r = x % y;
      steps.push({ dividend: x, divisor: y, quotient: q, remainder: r });
      x = y; y = r;
    }
    return { steps, pgcd: x };
  },

  /** Réduit la fraction num/den, renvoie { num, den }. */
  reduceFraction(num, den) {
    const g = this.gcd(Math.abs(num), Math.abs(den));
    return { num: num / g, den: den / g };
  },

  /**
   * Formate une fraction en LaTeX.
   * Renvoie "n" si den = 1, sinon "\\dfrac{n}{d}".
   */
  latexFraction(num, den) {
    const { num: n, den: d } = this.reduceFraction(num, den);
    if (d === 1)  return `${n}`;
    if (d === -1) return `${-n}`;
    const sign = (n < 0) !== (d < 0) ? '-' : '';
    return `${sign}\\dfrac{${Math.abs(n)}}{${Math.abs(d)}}`;
  },

  /**
   * Formate un entier pour une expression algébrique.
   * isFirst = true  →  "3"   ou "-3"
   * isFirst = false →  "+3"  ou "-3"
   */
  signedInt(n, isFirst = false) {
    if (isFirst) return `${n}`;
    return n >= 0 ? `+${n}` : `${n}`;
  },

  /** Mélange un tableau (Fisher-Yates) — utile pour des QCM. */
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = this.randInt(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
};
