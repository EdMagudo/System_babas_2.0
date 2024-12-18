import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import axios from 'axios';
import { initializeDatabase } from '../BackEnd/Models/index.js'; // Adjust the path as needed
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import fs from "fs";



const app = express();

// CORS options
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//Rotas
import routerAdmin from './Routes/adminRoutes.js';
import routerUser from './Routes/usersRouter.js';
import UserLanguage from './Routes/userLanguageRouter.js';
import NannyChildAgeExperience from './Routes/nannyChildAgeExperienceRouter.js';
import NannyChildWorkPreference from './Routes/nannyChildWorkPreferenceRouter.js';
import ServiceRequests from './Routes/serviceRequestsRouter.js';


app.use('/admin', routerAdmin);
app.use('/user', routerUser);
app.use('/lang',UserLanguage);
app.use('/experienceAge',NannyChildAgeExperience);
app.use('/experienceWork', NannyChildWorkPreference);
app.use('/requestServices',ServiceRequests)


  

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Route to fetch countries
app.get('/countries', async (req, res) => {
    try {
        const response = await axios.get('https://countriesnow.space/api/v0.1/countries/info?returns=name');

        // Extract country names
        const countries = response.data.data.map(country => country.name);

        res.json(countries);
    } catch (error) {
        console.error('Detailed error:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        
        res.status(500).json({ 
            error: 'Error fetching countries', 
            details: error.message 
        });
    }
});

// Route to fetch provinces/states for a specific country
app.get('/provinces/:country', async (req, res) => {
    try {
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/states', {
            country: req.params.country
        });

        // Extract province/state names
        const provinces = response.data.data.states.map(state => state.name);

        res.json(provinces);
    } catch (error) {
        console.error('Detailed error:', error.message);
        console.error('Error details:', error.response ? error.response.data : 'No response data');
        
        res.status(500).json({ 
            error: 'Error fetching provinces', 
            details: error.message 
        });
    }
});

app.get('/languages', async (req, res) => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');

        // Extrair idiomas de todos os países
        const languages = new Set();
        response.data.forEach(country => {
            if (country.languages) {
                Object.values(country.languages).forEach(lang => languages.add(lang));
            }
        });

        res.json([...languages]); // Retornar os idiomas como uma lista única
    } catch (error) {
        console.error('Erro ao buscar idiomas:', error.message);
        res.status(500).json({ error: 'Erro ao buscar idiomas', details: error.message });
    }
});

app.post('/send-email', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Criação do transporte Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Ou qualquer outro serviço de e-mail
        auth: {
            user: 'ediltonmagudo@gmail.com',  // Seu e-mail
            pass: 'unom owtx nfvr faqj'     // Senha de aplicativo (não a senha do Gmail)
        }
    });

    // Configuração do e-mail
    const mailOptions = {
        from: email, // E-mail do remetente
        to: 'ediltonmagudo@gmail.com', // E-mail do destinatário
        subject: subject,
        text: `Mensagem de ${name} (${email}):\n\n${message}` // Corpo do e-mail
    };

    try {
        // Enviar o e-mail
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        res.status(500).json({ error: 'Erro ao enviar o e-mail', details: error.message });
    }
});


// Test route
app.get('/', (req, res) => {
    res.json('Countries API');
});

// Initialize database before starting the server
const startServer = async () => {
    try {
        // Initialize the database
        await initializeDatabase();

        // Start the server
        const PORT = process.env.PORT || 3005;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Call the function to start the server
startServer();