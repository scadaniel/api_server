<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$apiUrl = 'https://server-shrs.onrender.com'; // URL de tu API en Render con HTTPS

function getApiData($endpoint) {
    global $apiUrl;
    $url = $apiUrl . $endpoint;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Seguir redirecciones

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($httpCode >= 400 || $response === false) {
        return ['error' => "Error HTTP $httpCode: $error"];
    }

    echo "<pre>Respuesta cruda de $url: " . htmlspecialchars($response) . "</pre>";
    $data = json_decode($response, true);
    return $data ?: ['error' => 'Respuesta no válida'];
}

echo "<h1>Prueba de Conexión con API Node.js</h1>";

// Obtener temperatura
$dataTemp = getApiData('/temp');
echo "<p>Temperatura: " . ($dataTemp['error'] ?? ($dataTemp['message'] ?? 'Sin datos')) . "°C</p>";

// Obtener voltaje
$dataVolt = getApiData('/volt');
echo "<p>Voltaje: " . ($dataVolt['error'] ?? ($dataVolt['message'] ?? 'Sin datos')) . "V</p>";

// Obtener últimos 20 datos
$data20 = getApiData('/data20');
if (isset($data20['error'])) {
    echo "<p>Error: " . $data20['error'] . "</p>";
} else {
    echo "<h2>Últimos 20 datos:</h2>";
    echo "<table border='1' style='width: 50%; margin: 0 auto; text-align: center;'>";
    echo "<tr><th>ID</th><th>Type</th><th>Value</th><th>Timestamp</th></tr>";
    if (is_array($data20)) {
        foreach ($data20 as $row) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['id'] ?? 'N/A') . "</td>";
            echo "<td>" . htmlspecialchars($row['type'] ?? 'N/A') . "</td>";
            echo "<td>" . htmlspecialchars($row['value'] ?? 'N/A') . "</td>";
            echo "<td>" . htmlspecialchars($row['timestamp'] ?? 'N/A') . "</td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='4'>No hay datos disponibles</td></tr>";
    }
    echo "</table>";
}

// Enviar datos (POST)
$dataToSend = ['type' => 'test', 'value' => 15];
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl . '/data');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataToSend));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // Seguir redirecciones en POST
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);
echo "<p>Resultado POST: " . ($httpCode == 200 ? htmlspecialchars($response) : "Error HTTP $httpCode: $error") . "</p>";
?>