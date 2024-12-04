import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Certifique-se de instalar o node-fetch

const app = express();

// Opções de CORS
const corsOptions = {
    origin: '*', // Permite requisições de qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para retornar os nomes dos países
app.get('/countries', async (req, res) => {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/population');
        const data = await response.json();

        // Extrair nomes dos países
        const countries = data.data.map(country => country.country);

        res.json(countries); // Enviar os nomes dos países como resposta
    } catch (error) {
        console.error('Erro ao buscar países:', error);
        res.status(500).json({ error: 'Erro ao buscar países' });
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.json('API BABAS');
});

// Porta do servidor
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
