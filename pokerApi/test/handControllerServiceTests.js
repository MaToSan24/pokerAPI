var assert = require("chai").assert;
var expect = require("chai").expect;
var should = require("chai").should();
var handControllerService = require("../controllers/handControllerService");

var cartaAltaK;
var cartaAltaA;

describe("Tests del servicio HandControllerService para la API de poker: ", function () {

    before(function () {
        cartaAltaK = {
            jugador: "Cristiano",
            mano: ["2-H", "3-D", "5-S", "9-C", "K-D"],
            propiedades: {
                'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 1, 9: 1, 'K': 1 },
                'numerosConsecutivos': false,
                'mismoPalo': false,
                'indiceCartaMasAlta': 11,
                'valorParejaMasAlta': -1,
                'valorSegundaParejaMasAlta': -1,
                'valorTrio': -1,
                'valorEscaleraMasAlto': -1,
                'valorPoker': -1
            }
        },

            cartaAltaA = {
                jugador: "Neymar",
                mano: ["2-H", "3-D", "5-S", "9-C", "A-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 1, 9: 1, 'A': 1 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            parejaA = {
                jugador: "Cristiano",
                mano: ["J-H", "3-D", "5-S", "9-C", "J-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 3: 1, 5: 1, 9: 1, 'J': 2 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 9,
                    'valorParejaMasAlta': 9,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            pareja5 = {
                jugador: "Cristiano",
                mano: ["2-H", "3-D", "5-S", "5-C", "A-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 2, 'A': 1 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': 3,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            doblePareja10yJ = {
                jugador: "Cristiano",
                mano: ["10-H", "A-D", "J-S", "10-C", "J-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 3: 1, 10: 2, 'J':2 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': 9,
                    'valorSegundaParejaMasAlta': 8,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            doblePareja5yK = {
                jugador: "Neymar",
                mano: ["5-H", "3-D", "K-S", "5-C", "K-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 3: 1, 5: 2, 'K':2 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 11,
                    'valorParejaMasAlta': 11,
                    'valorSegundaParejaMasAlta': 3,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            trio5 = {
                jugador: "Cristiano",
                mano: ["2-H", "3-D", "5-S", "5-C", "5-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 3 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 3,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': 3,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            trio10 = {
                jugador: "Neymar",
                mano: ["2-H", "3-D", "10-S", "10-C", "10-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 10: 3 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 8,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': 8,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            escalera5 = {
                jugador: "Cristiano",
                mano: ["2-H", "3-D", "A-S", "4-C", "5-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 'A': 1, 2: 1, 3: 1, 4: 1, 5: 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 3,
                    'valorPoker': -1
                }
            },

            escalera10 = {
                jugador: "Neymar",
                mano: ["7-H", "8-D", "10-S", "9-C", "6-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 8,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 8,
                    'valorPoker': -1
                }
            },

            escaleraA = {
                jugador: "Maradona",
                mano: ["A-H", "J-D", "10-S", "Q-C", "K-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 10: 1, 'J': 1, 'Q': 1, 'K': 1, 'A': 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 12,
                    'valorPoker': -1
                }
            },

            colorD = {
                jugador: "Cristiano",
                mano: ["2-D", "3-D", "5-D", "9-D", "K-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 1, 9: 1, 'K': 1 },
                    'numerosConsecutivos': false,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 11,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            colorS = {
                jugador: "Neymar",
                mano: ["2-S", "3-S", "5-S", "9-S", "K-S"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 1, 9: 1, 'K': 1 },
                    'numerosConsecutivos': false,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 11,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            colorC = {
                jugador: "Maradona",
                mano: ["2-S", "3-S", "5-S", "9-S", "A-S"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 1, 3: 1, 5: 1, 9: 1, 'A': 1 },
                    'numerosConsecutivos': false,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            full2yA = {
                jugador: "Cristiano",
                mano: ["2-H", "2-D", "A-S", "A-C", "A-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 2: 2, 'A': 3 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': 0,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': 12,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            full10yK = {
                jugador: "Neymar",
                mano: ["10-H", "10-D", "K-S", "K-C", "K-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 10: 2, 'K': 3 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 11,
                    'valorParejaMasAlta': 8,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': 11,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': -1
                }
            },

            poker10 = {
                jugador: "Cristiano",
                mano: ["10-H", "A-D", "10-S", "10-C", "10-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 3: 1, 10: 4 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': 8
                }
            },

            pokerA = {
                jugador: "Neymar",
                mano: ["A-H", "3-D", "A-S", "A-C", "A-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 3: 1, 'A': 4 },
                    'numerosConsecutivos': false,
                    'mismoPalo': false,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': -1,
                    'valorPoker': 12
                }
            },
            
            escaleraColor5 = {
                jugador: "Cristiano",
                mano: ["2-H", "3-H", "A-H", "4-H", "5-H"],
                propiedades: {
                    'vecesNumeroRepetido': { 'A': 1, 2: 1, 3: 1, 4: 1, 5: 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 3,
                    'valorPoker': -1
                }
            },

            escaleraColor10 = {
                jugador: "Neymar",
                mano: ["7-C", "8-C", "10-C", "9-C", "6-C"],
                propiedades: {
                    'vecesNumeroRepetido': { 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 8,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 8,
                    'valorPoker': -1
                }
            },

            escaleraColorA = {
                jugador: "Maradona",
                mano: ["A-D", "J-D", "10-D", "Q-D", "K-D"],
                propiedades: {
                    'vecesNumeroRepetido': { 10: 1, 'J': 1, 'Q': 1, 'K': 1, 'A': 1 },
                    'numerosConsecutivos': true,
                    'mismoPalo': true,
                    'indiceCartaMasAlta': 12,
                    'valorParejaMasAlta': -1,
                    'valorSegundaParejaMasAlta': -1,
                    'valorTrio': -1,
                    'valorEscaleraMasAlto': 12,
                    'valorPoker': -1
                }
            }
    });

    describe('Comprobacion de la funcion "ganadorRonda", la cual incluye a la funcion "desempataRonda", ' +
    '\n\ten casos donde ambos jugadores tienen el mismo tipo de resultado: ', function () {
        it("Comprueba que gana Neymar por 'Carta alta (A)': ", function () {
            let result = handControllerService.ganadorRonda([cartaAltaK, cartaAltaA]);
            let resultadoEsperado = [cartaAltaA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Pareja mas alta (J)': ", function () {
            let result = handControllerService.ganadorRonda([parejaA, pareja5]);
            let resultadoEsperado = [parejaA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Doble pareja (5 y K)': ", function () {
            let result = handControllerService.ganadorRonda([doblePareja10yJ, doblePareja5yK]);
            let resultadoEsperado = [doblePareja5yK];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Trio mas alto (10)': ", function () { // Gracias a este test he detectado un error
            let result = handControllerService.ganadorRonda([trio5, trio10]);    // debido a que valorTrio se detectaba como string
            let resultadoEsperado = [trio10];                                    // entonces al comparar "5" > "10"  daba true
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Escalera mas alta (10)': ", function () {
            let result = handControllerService.ganadorRonda([escalera5, escalera10]);
            let resultadoEsperado = [escalera10];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Maradona por 'Escalera mas alta (A)': ", function () {
            let result = handControllerService.ganadorRonda([escaleraA, escalera10]);
            let resultadoEsperado = [escaleraA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que hay empate entre Cristiano y Neymar por 'Color (D y S)': ", function () {
            let result = handControllerService.ganadorRonda([colorD, colorS]);
            let resultadoEsperado = [colorD, colorS];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Maradona por 'Color (C) con kicker de A': ", function () {
            let result = handControllerService.ganadorRonda([colorD, colorC]);
            let resultadoEsperado = [colorC];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Full mas alto (A)': ", function () { // Este test me ha hecho descubrir que los fulles se evaluaban mal
            let result = handControllerService.ganadorRonda([full2yA, full10yK]);
            let resultadoEsperado = [full2yA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Poker (A)': ", function () {
            let result = handControllerService.ganadorRonda([poker10, pokerA]);
            let resultadoEsperado = [pokerA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Escalera de color mas alta (10)': ", function () {
            let result = handControllerService.ganadorRonda([escaleraColor5, escaleraColor10]);
            let resultadoEsperado = [escaleraColor10];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Maradona por 'Escalera de color mas alta (A)': ", function () {
            let result = handControllerService.ganadorRonda([escaleraColorA, escaleraColor10]);
            let resultadoEsperado = [escaleraColorA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
    });

    describe('Comprobacion de la funcion "ganadorRonda", la cual incluye a la funcion "desempataRonda", ' + 
    '\n\ten casos donde ambos jugadores no tienen el mismo tipo de resultado: ', function () {
        it("Comprueba que gana Cristiano por 'Poker (10)': ", function () {
            let result = handControllerService.ganadorRonda([poker10, trio10]);
            let resultadoEsperado = [poker10];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Color (A)': ", function () {
            let result = handControllerService.ganadorRonda([colorD, escaleraA]);
            let resultadoEsperado = [colorD];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Poker (A)': ", function () {
            let result = handControllerService.ganadorRonda([poker10, pokerA]);
            let resultadoEsperado = [pokerA];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Trio (10)': ", function () {
            let result = handControllerService.ganadorRonda([doblePareja5yK, trio10]);
            let resultadoEsperado = [trio10];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Neymar por 'Escalera (10)': ", function () {
            let result = handControllerService.ganadorRonda([escalera10, cartaAltaA]);
            let resultadoEsperado = [escalera10];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Escalera de color (5)': ", function () {
            let result = handControllerService.ganadorRonda([escaleraColor5, pokerA]);
            let resultadoEsperado = [escaleraColor5];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
        it("Comprueba que gana Cristiano por 'Escalera de color (5)': ", function () {
            let result = handControllerService.ganadorRonda([full10yK, colorS]);
            let resultadoEsperado = [full10yK];
            assert.deepEqual(result, resultadoEsperado);
            result.forEach(res => { console.log(res.jugador) });
        });
    });
});