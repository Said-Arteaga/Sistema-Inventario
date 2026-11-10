import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/data-source.js'; // Asegúrate de que la ruta sea correcta

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola desde tu propio servidor Express!' });
});

AppDataSource.initialize()
    .then(() => {
        console.log("¡Conexión exitosa a la Base de Datos con TypeORM!");
        
        app.listen(PORT, () => {
            console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error crítico al conectar a la Base de Datos:", error);
    });
