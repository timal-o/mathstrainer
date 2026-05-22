MathsTrainer.register({
id: 'suite-geometrique-terme-general',
chapitre: 'Suites géométriques — terme général',
notion: "Calculer un terme u_n d'une suite géométrique connaissant u_0 et la raison q",
methode: [
'Étape 1 avec $u_n = u_0 \times q^n$.',
'Étape 2 : remplacer $u_0$, $q$ et $n$.',
'Étape 3 : calculer $q^n$ puis multiplier par $u_0$.'
],
generate() {
let u0, q, n, result;

do {
  u0 = Engine.randInt(1, 10);
  q = Engine.randInt(2, 5);
  n = Engine.randInt(2, 5);
  result = u0 * Math.pow(q, n);
} while (result > 10000);

const enonce = `Soit $(u_n)$ une suite géométrique de premier terme $u_0 = ${u0}$ et de raison $q = ${q}$.

Calculer $u_${n}$.`;

const correction = `
<p>On applique la formule du terme général d'une suite géométrique.</p> <div class="my-4 overflow-x-auto">$$u_n = u_0 \\times q^n$$</div> <p>On remplace avec les valeurs données :</p> <div class="my-4 overflow-x-auto">$$u_${n} = ${u0} \\times ${q}^${n}$$</div> <p>On calcule la puissance puis on multiplie :</p> <div class="my-4 overflow-x-auto">$$${q}^${n} = ${Math.pow(q, n)} \\quad \\Rightarrow \\quad u_${n} = ${u0} \\times ${Math.pow(q, n)} = ${result}$$</div> <div class="result-highlight">$$u_${n} = ${result}$$</div> `;
return { enonce, correction };

},
});