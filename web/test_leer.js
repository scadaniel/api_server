document.addEventListener('DOMContentLoaded', () => {
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const dataTable = document.getElementById('dataTable');
    const dataBody = document.getElementById('dataBody');

    async function fetchData() {
        loadingDiv.style.display = 'block';
        dataTable.style.display = 'none';
        errorDiv.style.display = 'none';

        try {
            const response = await fetch('https://api-server-u8wj.onrender.com/espiot/data20', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No se encontraron registros');
            }

            // Limpiar y llenar la tabla
            dataBody.innerHTML = '';
            data.slice(0, 20).forEach(row => { // Tomar solo los primeros 20 si hay más
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.chip_id || 'N/A'}</td>
                    <td>${row.cliente || 'N/A'}</td>
                    <td>${row.descripcion || 'N/A'}</td>
                    <td>${row.temperatura || 'N/A'}</td>
                    <td>${row.humedad || 'N/A'}</td>
                    <td>${row.sensor || 'N/A'}</td>
                    <td>${row.timestamp || 'N/A'}</td>
                `;
                dataBody.appendChild(tr);
            });

            dataTable.style.display = 'table';
        } catch (error) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Error: ${error.message}`;
        } finally {
            loadingDiv.style.display = 'none';
        }
    }

    fetchData(); // Cargar datos al iniciar
    setInterval(fetchData, 30000); // Actualizar cada 30 segundos
});