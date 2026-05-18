

function calcularArea(a,b) {

    if ((a<=0) || (b<=0)) throw new Error('Valor Errado');
    return a * b;

}

function calcularPerimetro(a,b) {

    if ((a<=0) || (b<=0)) throw new Error('Valor Errado');
    return 2 * (a + b);

}

module.exports = { calcularArea, calcularPerimetro };