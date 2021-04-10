'use strict'

module.exports.evaluateGame = function evaluateGame(req, res, next) {

  let partidas = req.hand.value;
  let resultados = [];

  for (var i=0; i < partidas.length; i++) {
    let partida = partidas[i];
    let ganancia = parseInt(partida.bote);
    let jugadas = partida.jugadas;
    let manos = [];
    let trampas = false;
    let repetidas = [];
    let entradaInvalida = false;
    let entradasInvalidas = [];
    let cartasJugada = [];
    for (var j=0; j < jugadas.length; j++) {
      let jugada = jugadas[j];
      let apuesta = parseInt(jugada.apuesta);
      ganancia += apuesta;

      let manoString = jugada.cartas.map(carta => {
        let entrada = carta.valor.concat("-",carta.palo);
        if (!palosBaraja.includes(carta.palo) || !numerosBaraja.includes(carta.valor)) {
          entradaInvalida = true;
          entradasInvalidas.push(carta.valor.concat(carta.palo));
        } else if (cartasJugada.indexOf(entrada) != -1) {
          trampas = true;
          repetidas.push(carta.valor.concat(carta.palo));
        } else {
          cartasJugada.push(entrada);
        }
        return entrada;
      })

      let mano = new ManoPoker(jugada.jugador, manoString);
      manos.push(mano);
    }

    if (trampas) {
      resultados.push(new ResultadoRonda("Partida amañada", repetidas)); 
    } else if (entradaInvalida) {
      resultados.push(new ResultadoRonda("Entrada invalida", entradasInvalidas)); 
    } else {
      let ganador = this.ganadorRonda(manos);

      for (let m of ganador) {
        m.mano = m.mano.map(carta => carta.replace("-", ""));
      }
      ganador = ganador.map(mano => new ManoSinPropiedades(mano));

      let resultado = "Error";

      if (ganador.length > 1) {
        resultado = "Iguales";
      } else {
        resultado = ganador[0].jugador.concat(" gana ", ganancia);
      }
      resultados.push(new ResultadoRonda(resultado, ganador));
    }
  }

  res.send({
    resultados: resultados
  });
};

var ManoPoker = function(jugador, mano) {
  this.jugador = jugador;
  this.mano = mano;
  this.propiedades = {
    'vecesNumeroRepetido': Ayuda.vecesNumeroRepetido(mano),
    'numerosConsecutivos': Ayuda.compruebaNumerosConsecutivos(mano),
    'mismoPalo': Ayuda.compruebaMismoPalo(mano),
    'indiceCartaMasAlta': Ayuda.obtenerIndiceCartaMasAlta(mano),
    'valorParejaMasAlta': -1,
    'valorSegundaParejaMasAlta': -1,
    'valorTrio': -1,
    'valorEscaleraMasAlto': -1,
    'valorPoker': -1
  };
};

var ResultadoRonda = function(res, manoSinPropiedades) {
  this.resultado = res;
  this.mano = manoSinPropiedades;
};

var ManoSinPropiedades = function(mano) {
  this.jugador = mano.jugador;
  this.mano = mano.mano;
};

exports.ganadorRonda = function ganadorRonda(manos) {

  let ganador = [];
  let indiceGanador = -1;

  for (let mano of manos) {
    let resultado = Ayuda.obtenerResultado(mano);
    if (resultado > indiceGanador) {
      indiceGanador = resultado;
      ganador = [mano];
    } else if (resultado == indiceGanador) {
      ganador.push(mano);
    }
  }

  if (ganador.length > 1) {
    ganador = desempataRonda(ganador, indiceGanador);
  }

  return ganador;
}

function desempataRonda(posiblesGanadores, tipoDeEmpate) {

  let indiceMasAlto = -1;
  let ganadorDesempate = [];

  if (tipoDeEmpate == 8) {     // Poker 

    for (let mano of posiblesGanadores) {
      if (mano.propiedades.valorPoker > indiceMasAlto) {
        indiceMasAlto = mano.propiedades.valorPoker;
        ganadorDesempate = [mano];
      } else if (mano.propiedades.valorPoker == indiceMasAlto) {
        ganadorDesempate.push(mano);
      }
    }

  } else if (tipoDeEmpate == 7 ||tipoDeEmpate == 4) {     // Full o trio se desempatan en funcion del trio mas alto
    
    for (let mano of posiblesGanadores) {
      let valorTrioInt = parseInt(mano.propiedades.valorTrio);
      if (valorTrioInt > indiceMasAlto) {
        indiceMasAlto = valorTrioInt;
        ganadorDesempate = [mano];
      } else if (valorTrioInt == indiceMasAlto) {
        ganadorDesempate.push(mano);
      }
    }

  } else if (tipoDeEmpate == 3) {     // Doble pareja

    for (let mano of posiblesGanadores) {
      if (mano.propiedades.valorParejaMasAlta > indiceMasAlto) {
        indiceMasAlto = mano.propiedades.valorParejaMasAlta;
        ganadorDesempate = [mano];
      } else if (mano.propiedades.valorParejaMasAlta == indiceMasAlto) {
        ganadorDesempate.push(mano);
      }
    }

    if (ganadorDesempate.length > 1) {
      ganadorDesempate = [];
      indiceMasAlto = -1;
      for (let mano of posiblesGanadores) {
        if (mano.propiedades.valorSegundaParejaMasAlta > indiceMasAlto) {
          indiceMasAlto = mano.propiedades.valorSegundaParejaMasAlta;
          ganadorDesempate = [mano];
        } else if (mano.propiedades.valorSegundaParejaMasAlta == indiceMasAlto) {
          ganadorDesempate.push(mano);
        }
      }
    }

  } else if (tipoDeEmpate == 2) {     // Pareja

    for (let mano of posiblesGanadores) {
      if (mano.propiedades.valorParejaMasAlta > indiceMasAlto) {
        indiceMasAlto = mano.propiedades.valorParejaMasAlta;
        ganadorDesempate = [mano];
      } else if (mano.propiedades.valorParejaMasAlta == indiceMasAlto) {
        ganadorDesempate.push(mano);
      }
    }

  } else {      // Escalera de color, color, escalera y carta alta se desempatan igual:
                // En base a la carta mas alta

    let escaleraMasBaja = [];

    if (tipoDeEmpate == 5 || tipoDeEmpate == 9) {
      for (let mano of posiblesGanadores) {
        if ([12, 0, 1, 2, 3].every(num => cartasEnMano.getIndicesCartasEnMano(mano.mano).includes(num))) {
          escaleraMasBaja.push(posiblesGanadores.indexOf(mano));
        }
      }
    }

    if (escaleraMasBaja.length == posiblesGanadores.length) {
      ganadorDesempate = posiblesGanadores;
    } else {

      for (let indice of escaleraMasBaja) {
        posiblesGanadores.splice(indice,1);
      }

      for (let mano of posiblesGanadores) {
        if (mano.propiedades.indiceCartaMasAlta > indiceMasAlto) {
         indiceMasAlto = mano.propiedades.indiceCartaMasAlta;
         ganadorDesempate = [mano];
       } else if (mano.propiedades.indiceCartaMasAlta == indiceMasAlto) {
         ganadorDesempate.push(mano);
       }
     }
    }
  }

  return ganadorDesempate;
}

const numerosBaraja = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const palosBaraja = ['H', 'C', 'D', 'S'];

var Ayuda = {
  vecesNumeroRepetido: (mano) => {
    let aparacionesNumeros = {};

    cartasEnMano.getIndicesCartasEnMano(mano).map(numero => {
        typeof aparacionesNumeros[numero] === "undefined" ? (aparacionesNumeros[numero] = 1) : aparacionesNumeros[numero]++;
    });
    return aparacionesNumeros;
  },

  compruebaNumerosConsecutivos: (mano) => {
    let indices = cartasEnMano.getIndicesCartasEnMano(mano);
    let numerosConsecutivos = true;

    if (![12,0,1,2,3].every(indice => indices.includes(indice))) {

      for (let i = 1; i < indices.length; i++) {
        if (indices[i - 1] != indices[i] - 1) {
          numerosConsecutivos = false;
        }
      }
    }

    return numerosConsecutivos;
  },

  compruebaMismoPalo: (mano) => {
    const palosEnmano = cartasEnMano.getPalosMano(mano);
    const palo = palosEnmano.shift();
    let contador = 0;

    palosEnmano.map(ele => {
      if (ele === palo) {
        contador++;
      }
    });

    return contador === 4 ? true : false;
  },
  obtenerIndiceCartaMasAlta: (mano) => {
    let indiceCartaMasAlta = 0;

    cartasEnMano.getIndicesCartasEnMano(mano).map(numero => {
      if (numero > indiceCartaMasAlta) {
        indiceCartaMasAlta = numero;
      }
    });

    return indiceCartaMasAlta;
  },
  obtenerResultado: (mano) => {
    const numerosMano = cartasEnMano.getIndicesCartasEnMano(mano.mano);

    // Escalera de color
    if (mano.propiedades.numerosConsecutivos && mano.propiedades.mismoPalo) {
      return 9;
    }

    // Poker
    let repeticiones = {};

    for (const numeroRepetido in mano.propiedades.vecesNumeroRepetido) {
      if (mano.propiedades.vecesNumeroRepetido[numeroRepetido] === 4) {
        mano.propiedades.valorPoker = numeroRepetido;
        return 8;
      } else {
        repeticiones[mano.propiedades.vecesNumeroRepetido[numeroRepetido]] = numeroRepetido;
      }
    }

    // Full
    let repeticiones0 = parseInt(Object.keys(repeticiones)[0]); 
    let repeticiones1 = parseInt(Object.keys(repeticiones)[1]); 

    if (repeticiones0 == 3 && repeticiones1 == 2 || repeticiones0 == 2 && repeticiones1 == 3){
      mano.propiedades.valorTrio = numerosBaraja.indexOf(repeticiones[3]);
      mano.propiedades.valorParejaMasAlta = numerosBaraja.indexOf(repeticiones[2]);
      return 7;
    }

    // Color
    if (mano.propiedades.mismoPalo) {
      return 6;
    }

    // Escalera
    if (mano.propiedades.numerosConsecutivos) {
      return 5;
    }

    // Trio
    for (const numeroRepetido in mano.propiedades.vecesNumeroRepetido) {
      if (mano.propiedades.vecesNumeroRepetido[numeroRepetido] === 3) {
        mano.propiedades.valorTrio = numeroRepetido;
        return 4;
      }
    }

    const parejas = numerosMano.filter((num, i) => numerosMano[i] === numerosMano[i + 1]);

    // Doble pareja
    if (parejas.length === 2) {
      mano.propiedades.valorParejaMasAlta = parejas[1];
      mano.propiedades.valorSegundaParejaMasAlta = parejas[0];
      return 3;
    // Pareja
    } else if (parejas.length === 1) {
      mano.propiedades.valorParejaMasAlta = parejas[0];
      return 2;
    }

    // Carta alta
    return 1;
  }
};

var cartasEnMano = {
  // Obtener los numeros de la mano
  getIndicesCartasEnMano: (cartas) => {
    return cartas.map(carta => numerosBaraja.indexOf(carta.split("-")[0])).sort((a,b) => a-b);
  },

  // Obetenr los palos de la mano
  getPalosMano: (cartas) => {
    return cartas.map(carta => carta.split("-")[1]).sort();
  }

}