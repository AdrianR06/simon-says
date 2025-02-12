const botonIniciarJuego = document.getElementById('startButton');
const menuInicio = document.getElementById('menu-start');
const juegoArea = document.getElementById('game');
const botonVolverMenu = document.getElementById('backToMenu');
const nombreJugadorInput = document.getElementById('player-name'); // Obtener el input del nombre
const nombreJugadorDisplay = document.getElementById('playerNameDisplay'); // Obtener el h2 para mostrar el nombre


botonIniciarJuego.addEventListener('click', function() {
    const nombreJugador = nombreJugadorInput.value; // Obtener el valor del input
    nombreJugadorDisplay.textContent =  nombreJugador; // Mostrar el nombre en el div de juego

    menuInicio.style.display = 'none';
    juegoArea.style.display = 'block';
});

botonVolverMenu.addEventListener('click', function(){
    juegoArea.style.display = 'none';
    menuInicio.style.display = 'block';
})
