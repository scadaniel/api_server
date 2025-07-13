const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({ origin: 'http://scasoftw.com.ar' }));

const db = mysql.createConnection({
    host: 'mysql-scadaniel-scadaniel-db.e.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_idfwuYR-YBkXd0E5QEK',
    database: 'defaultdb',
    port: 19602,
    // ssl: {
    //     ca: fs.readFileSync(__dirname + '/ca.pem') // Ajustado para src/
    // }
    ssl: {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
});


// Manejo de conexión
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database at scadaniel');

    // Crear tabla sensor_data si no existe
    db.query(`
        CREATE TABLE IF NOT EXISTS sensor_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50),
            value DECIMAL(5,2),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating sensor_data table:', err.message);
        else {
            console.log('Tabla sensor_data lista');
            db.query('INSERT IGNORE INTO sensor_data (type, value) VALUES (?, ?), (?, ?)', ['temp', 32, 'volt', 220], (err) => {
                if (err) console.error('Error inserting test data:', err.message);
            });
        }
    });

    // Crear tabla esp_iot si no existe
    db.query(`
        CREATE TABLE IF NOT EXISTS esp_iot2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            chip_id DECIMAL(8),
            cliente VARCHAR(50),
            descripcion VARCHAR(50),
            temperatura DECIMAL(4,2),
            humedad DECIMAL(4,2),
            sensor DECIMAL(4,2),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating esp_iot table:', err.message);
        else {
            console.log('Tabla esp_iot2 lista');
            db.query('INSERT IGNORE INTO esp_iot2 (chip_id, cliente, descripcion, temperatura, humedad, sensor) VALUES (?, ?, ?, ?, ?, ?)',
                [8123456, 'TEST', 'TEST heladera comercial frio medio', 6, 50, 1], (err) => {
                    if (err) console.error('Error inserting test data:', err.message);
                });
        }
    });
});

// Endpoints estáticos
app.get('/temp', (req, res) => {
    res.json({ "message": "32" });
});

app.get('/hum', (req, res) => {
    res.json({ "message": "90" });
});

// Endpoints para sensor_data
app.get('/test', (req, res) => {
    db.query('INSERT IGNORE INTO sensor_data (type, value) VALUES (?, ?)', ['temp', 5], (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Test data inserted' }); // Respuesta después de insertar
    });
});

app.get('/data', (req, res) => {
    db.query('SELECT * FROM sensor_data', (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(results);
    });
});

app.get('/data20', (req, res) => {
    db.query('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 20', (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(results);
    });
});

app.get('/data/:type', (req, res) => {
    const { type } = req.params;
    db.query('SELECT * FROM sensor_data WHERE type = ? ORDER BY timestamp DESC LIMIT 1', [type], (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!results.length) return res.status(404).json({ error: 'No data found' });
        res.json(results[0]);
    });
});

app.post('/data', (req, res) => {
    const { type, value } = req.body;
    if (!type || value === undefined) {
        return res.status(400).json({ error: 'Type and value are required' });
    }
    db.query('INSERT INTO sensor_data (type, value) VALUES (?, ?)', [type, value], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: result.insertId, type, value });
    });
});

// Endpoints para esp_iot
app.get('/espiot/test', (req, res) => {
    db.query('INSERT IGNORE INTO esp_iot2 (chip_id, cliente, descripcion, temperatura, humedad, sensor) VALUES (?, ?, ?, ?, ?, ?)',
        [7123456, 'TEST2', 'TEST2 heladera comercial frio medio', 2, 22, 0], (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: 'Test data inserted' }); // Respuesta después de insertar
        });
});

app.get('/espiot/data', (req, res) => {
    db.query('SELECT * FROM esp_iot2', (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(results);
    });
});

app.get('/espiot/data20', (req, res) => {
    db.query('SELECT * FROM esp_iot2 ORDER BY timestamp DESC LIMIT 20', (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(results);
    });
});





app.post('/espiot/input', (req, res) => {
    const { chip_id, cliente, descripcion, temperatura, humedad, sensor } = req.body;
    if (chip_id === undefined || !cliente || !descripcion || temperatura === undefined || humedad === undefined || sensor === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    db.query('INSERT INTO esp_iot2 (chip_id, cliente, descripcion, temperatura, humedad, sensor) VALUES (?, ?, ?, ?, ?, ?)',
        [chip_id, cliente, descripcion, temperatura, humedad, sensor], (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: result.insertId, chip_id, cliente, descripcion, temperatura, humedad, sensor });
        });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor API funcionando en http://localhost:${port}`);
});