document.addEventListener('DOMContentLoaded', function() {
    actualizarTablaPuntajes();
});

const botonIniciarJuego = document.getElementById('startButton');
const menuInicio = document.getElementById('menuStart');
const juegoArea = document.getElementById('game');
const botonVolverMenu = document.getElementById('backToMenu');
const botonVolverMenuOverlay = document.getElementById('overlayBackToMenu');
const nombreJugadorInput = document.getElementById('playerName'); // Obtener el input del nombre
const nombreJugadorDisplay = document.getElementById('playerNameDisplay'); // Obtener el h2 para mostrar el nombre
const puntuacion = document.getElementById('score');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreDisplay = document.getElementById('finalScore');
const botonJugarDeNuevo = document.getElementById('playAgainButton');
const scoreBoard = document.getElementById('scoreBoard');

// Sonido
const sonidos = {
    red: new Audio('red.mp3'),
    green: new Audio('green.mp3'),
    blue: new Audio('blue.mp3'),
    yellow: new Audio('yellow.mp3')
};

// Event Listeners 
botonIniciarJuego.addEventListener('click', function() {
    const nombreJugador = nombreJugadorInput.value.trim(); // Obtener el valor del input
    if (nombreJugador ===''){
        alert('Por favor, introduce tu nombre.');
    } else {
        nombreJugadorDisplay.textContent =  nombreJugador; // Mostrar el nombre en el div de juego
        menuInicio.style.display = 'none';
        juegoArea.style.display = 'block';
        iniciarJuego();
    }
});

botonVolverMenu.addEventListener('click', function(){
    juegoArea.style.display = 'none';
    menuInicio.style.display = 'block';
    reiniciarJuego();
    actualizarTablaPuntajes();
})

botonVolverMenuOverlay.addEventListener('click', function(){
    gameOverOverlay.style.display = 'none';
    juegoArea.style.display = 'none';
    menuInicio.style.display = 'block';
    reiniciarJuego(); 
    actualizarTablaPuntajes();
});

botonJugarDeNuevo.addEventListener('click', function(){
    gameOverOverlay.style.display = 'none';
    iniciarJuego();
});

// Variables para el juego
const colores = ['red', 'green', 'blue', 'yellow']
let secuenciaMaquina = [];
let secuenciaJugador = [];
let nivel = 1;
let esperandoSecuencia = false;

// Obtener los botones de colores
const cuadrantes = document.querySelectorAll('.colorButton');

// Funciones del juego

function iniciarJuego(){
    secuenciaMaquina = [];
    nivel = 0;
    puntuacion.textContent = 'Puntos: 0';
    siguienteNivel();
}

function siguienteNivel() {
    nivel++;
    puntuacion.textContent = 'Puntos: ' + (nivel - 1);
    secuenciaJugador = [];
    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    secuenciaMaquina.push(colorAleatorio);
    reproducirSecuencia();
}

function reproducirSecuencia(){
    esperandoSecuencia = true; // Bloqueamos la interaccion hasta que la secuencia termine
    let delay = 0;
    secuenciaMaquina.forEach((color, index) => {
        setTimeout(() => { 
            activarCuadrante(color);
            sonidos[color].currentTime = 0; //Reinicia el sonido
            sonidos[color].play();
            if (index === secuenciaMaquina.length - 1) {
                setTimeout(() => {
                    esperandoSecuencia = false; // Desbloqueamos la interacción
                }, 100);
            }
        }, delay);
        delay += 1300;
    });
}

function activarCuadrante(color){
    const cuadrante = document.getElementById(color);
    cuadrante.classList.add('active');
    //sonidos[color].play();
    setTimeout(() => {
        cuadrante.classList.remove('active');
    }, 1000);
}

cuadrantes.forEach(cuadrante => {
    cuadrante.addEventListener('click', e => {
        if (esperandoSecuencia) return; // Evitamos que el jugador interactúe durante la reproducción de la secuencia
        const colorSeleccionado = e.target.id;
        secuenciaJugador.push(colorSeleccionado);
        activarCuadrante(colorSeleccionado);
        sonidos[colorSeleccionado].currentTime = 0; 
        sonidos[colorSeleccionado].play();
        verificarRespuesta(secuenciaJugador.length - 1);
    });
});

function verificarRespuesta(indice) {
    if (secuenciaJugador[indice] === secuenciaMaquina[indice]) {
        if (secuenciaJugador.length === secuenciaMaquina.length) {
            setTimeout(() => {
                siguienteNivel();
            }, 1500);
        }
    } else {
        guardarPuntaje();
        mostrarGameOver();
    }
}

function mostrarGameOver() {
    finalScoreDisplay.textContent = `Llegaste al nivel ${nivel}`; // Corrected template literal
    gameOverOverlay.style.display = 'flex';
    actualizarTablaPuntajes();
}

function reiniciarJuego() {
    secuenciaMaquina = [];
    secuenciaJugador = [];
    nivel = 1;
    puntuacion.textContent = 'Puntos: 0';
    esperandoSecuencia = false;
}

function guardarPuntaje(){
    let nombre = nombreJugadorDisplay.textContent;
    let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    let puntajeActual = nivel - 1;
    if (!puntajes[nombre] || puntajeActual > puntajes[nombre]){
        puntajes[nombre] = puntajeActual;
    }
    localStorage.setItem('puntajes', JSON.stringify(puntajes));
    console.log('Puntajes guardados:', puntajes);
}

function actualizarTablaPuntajes() {
    let puntajes = JSON.parse(localStorage.getItem('puntajes')) || {};
    console.log('Puntajes recuperados:', puntajes);
    scoreBoard.innerHTML = '';

    // Convertir el objeto de puntaje en un array
    let puntajesArray = Object.entries(puntajes);

    // Ordenar el array de puntajes de mayor a menor
    puntajesArray.sort((a,b) => b[1] - a[1]);
    
    // Crear elementos para mostrar los puntos en orden
    puntajesArray.forEach(([jugador, puntaje]) => {
        let p = document.createElement('p');
        p.textContent = `${jugador}: ${puntajes[jugador]} puntos`;
        scoreBoard.appendChild(p);
    });
}