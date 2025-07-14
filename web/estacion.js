var botontemperatura = document.getElementById("btemperatura");
var botonhumedad = document.getElementById("bhumedad");
var botonpresion = document.getElementById("bpresion");

var temperatura = document.getElementById("valortemperatura");
var humedad = document.getElementById("valorhumedad");
var presion = document.getElementById("valorpresion");



botontemperatura.addEventListener("click", funcion1);
botonhumedad.addEventListener("click", funcion2);
botonpresion.addEventListener("click", funcion3);


function funcion1() {
    // Hacer solicitud a la API
    fetch('https://api-server-u8wj.onrender.com/temp')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el valor de temperatura con el mensaje de la API
            const temperatura = document.getElementById('valortemperatura');
            temperatura.textContent = data.message || 'Sin datos'; // Asegúrate de que 'message' coincide con el formato de la API
            alert("Se presionó el botón nuevo. Temperatura actualizada a: " + data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar la temperatura');
        });
}


function funcion2() {
    // Hacer solicitud a la API
    fetch('https://api-server-u8wj.onrender.com/hum')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Actualizar el valor de humedad con el mensaje de la API
            const humedad = document.getElementById('valorhumedad');
            humedad.textContent = data.message || 'Sin datos'; // Asegúrate de que 'message' coincide con el formato de la API
            alert("Se presionó el botón nuevo. Humedad actualizada a: " + data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar la humedad');
        });
}


function funcion3(){
    presion.textContent = "44";
    alert("se presionó en boton nuevo");
}


// Añadir evento al botón
document.getElementById('btemperatura').addEventListener('click', funcion1);

