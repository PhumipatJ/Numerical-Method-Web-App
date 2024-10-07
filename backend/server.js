const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Make sure to load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use environment port or fallback to 5000

app.use(cors()); // Enable CORS for all routes

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Use OpenAPI 3.0
    info: {
      title: 'Equation API',
      version: '1.0.0',
      description: 'API for getting equations',
    },
    servers: [
      {
        url: process.env.SWAGGER_URL || `http://localhost:${port}`, // Use the environment variable for production
        description: 'API server',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Database connection using environment variables
const db = new Client({
  user: process.env.DB_USER || "phumipat33628",
  host: process.env.DB_HOST || "dpg-cs1cqslds78s73b5glh0-a.singapore-postgres.render.com",
  database: process.env.DB_NAME || "numerical_method",
  password: process.env.DB_PASSWORD || "ehUNfB7RQ1YcI5dUFzwbRb2jgx3HCkuk",
  port: process.env.DB_PORT || 5432,
  ssl: {
    require: process.env.DB_SSL === 'true',
    rejectUnauthorized: process.env.DB_SSL === 'true',
  },
});

db.connect();

// Array to hold equations
let rootOfEquationData = [];

// Fetch equations data
db.query('SELECT * FROM root_of_equation_data', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    rootOfEquationData = res.rows;
  }
});

// Parse JSON requests
app.use(express.json());

// 1. GET Root of Equation Data
/**
 * @swagger
 * /rootOfEquationData:
 *   get:
 *     summary: Retrieve all equations
 *     responses:
 *       200:
 *         description: A list of equations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   data_id:
 *                     type: integer
 *                   fx:
 *                     type: string
 *                   xl:
 *                     type: number
 *                   xr:
 *                     type: number
 *                   initial_x:
 *                     type: number
 *                     nullable: true
 *                   initial_first_x:
 *                     type: number
 *                     nullable: true
 *                   initial_second_x:
 *                     type: number
 *                     nullable: true
 */
app.get('/rootOfEquationData', (req, res) => {
  res.json(rootOfEquationData);
});

// 2. GET Root of Equation Data with filtering
/**
 * @swagger
 * /rootOfEquationData/filter:
 *   get:
 *     summary: Retrieve one randomly filtered equation by data_id
 *     parameters:
 *       - name: data_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A filtered equation
 *       400:
 *         description: Invalid data_id
 */
app.get('/rootOfEquationData/filter', (req, res) => {
  const dataId = parseInt(req.query.data_id);
  if (isNaN(dataId)) {
    return res.status(400).json({ error: 'Invalid data_id' });
  }
  const filteredData = rootOfEquationData.filter(equation => equation.data_id === dataId);
  const randomIndex = Math.floor(Math.random() * filteredData.length);
  res.json(filteredData[randomIndex]);
});

// Start server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
