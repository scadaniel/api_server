#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <DHT.h>

const char* ssid = "BAMBY";
const char* password = "marielmariel2";
const char* server = "api-server-u8wj.onrender.com";
const int httpsPort = 443; // Puerto HTTPS estándar

#define DHTPIN D2         // Pin del sensor DHT
#define DHTTYPE DHT11     // Tipo de sensor
#define ANALOG_PIN A0     // Pin analógico para leer el valor del sensor

DHT dht(DHTPIN, DHTTYPE);

// Valores hardcodeados (excepto chip_id)
const char* cliente = "PEPE";
const char* descripcion = "Heladera comercial frio medio";

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Conexión a Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado a WiFi");
  Serial.print("Chip ID: ");
  Serial.println(ESP.getChipId()); // Muestra el chipId en el Monitor Serial
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Ignora certificados para pruebas (mejora en producción con certificado válido)
    HTTPClient http;

    // Leer datos del sensor DHT
    float temperature = dht.readTemperature(); // Temperatura en °C
    float humidity = dht.readHumidity();      // Humedad en %

    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("Error al leer el sensor DHT");
      delay(1000);
      return;
    }

    // Leer valor analógico del pin A0
    int sensorValue = analogRead(ANALOG_PIN); // Valor entre 0 y 1023

    // Obtener el chipId del ESP8266
    uint32_t chipId = ESP.getChipId();

    // Construir el JSON con los datos
    String postData = "{\"chip_id\":" + String(chipId) +
                      ",\"cliente\":\"" + String(cliente) + "\"," +
                      "\"descripcion\":\"" + String(descripcion) + "\"," +
                      "\"temperatura\":" + String(temperature) + "," +
                      "\"humedad\":" + String(humidity) + "," +
                      "\"sensor\":" + String(sensorValue) + "}";

    // Iniciar conexión HTTPS
    if (http.begin(client, "https://" + String(server) + "/espiot/input")) {
      http.addHeader("Content-Type", "application/json");

      // Enviar la solicitud POST
      int httpCode = http.POST(postData);

      // Verificar la respuesta
      if (httpCode == 200) {
        String payload = http.getString();
        Serial.println("Datos enviados con éxito. Respuesta: " + payload);
      } else {
        Serial.println("Error en la solicitud. Código: " + String(httpCode));
      }

      http.end(); // Cerrar conexión
    } else {
      Serial.println("Fallo al conectar al servidor");
    }
  } else {
    Serial.println("No conectado a WiFi");
  }

  delay(60000); // Esperar 1 minuto antes de la próxima lectura
}