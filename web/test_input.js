document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dataForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Recoger los datos del formulario
        const formData = new FormData(form);
        const data = {
            chip_id: formData.get('chip_id'),
            cliente: formData.get('cliente'),
            descripcion: formData.get('descripcion'),
            temperatura: parseFloat(formData.get('temperatura')),
            humedad: parseFloat(formData.get('humedad')),
            sensor: parseInt(formData.get('sensor'))
        };

        // Validar que los campos requeridos no estén vacíos
        if (!data.chip_id || !data.cliente || !data.descripcion || isNaN(data.temperatura) || isNaN(data.humedad) || isNaN(data.sensor)) {
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = '<p>Error: All fields are required</p>';
            return;
        }

        // URL de la API
        const apiUrl = 'https://api-server-u8wj.onrender.com/espiot/input';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = `<p>Respuesta: ${JSON.stringify(result)}</p>`;
        } catch (error) {
            responseDiv.style.display = 'block';
            responseDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});