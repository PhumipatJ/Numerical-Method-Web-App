const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { Client } = require('pg');
const cors = require('cors');
require('dotenv').config(); // Make sure to load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use environment port or fallback to 5000

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON requests

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Use OpenAPI 3.0
    info: {
      title: 'Equatione API',
      version: '1.0.0',
      description: 'API for get equation'
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local server'
      }
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

db.query('SELECT * FROM root_of_equation_data', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    rootOfEquationData = res.rows;
  }
});


// 1. GET Root of Rquation Data
/**
 * @swagger
 * components:
 *   schemas:
 *     Equation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         data_id:
 *           type: integer
 *           example: 1
 *         fx:
 *           type: string
 *           example: "x^3 - 6x^2 + 4x + 12"
 *         xl:
 *           type: number
 *           format: double
 *           example: 1.0000000000
 *         xr:
 *           type: number
 *           format: double
 *           example: 5.0000000000
 *         initial_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *         initial_first_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *         initial_second_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *
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
 *                 $ref: '#/components/schemas/Equation'
 */
app.get("/rootOfEquationData", (req, res) => {
  //const randomIndex = Math.floor(Math.random() * rootOfEquationData.length);
  res.json(rootOfEquationData);
});

// 2. GET Root of Equation Data with filtering
/**
 * @swagger
 * components:
 *   schemas:
 *     Equation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         data_id:
 *           type: integer
 *           example: 1
 *         fx:
 *           type: string
 *           example: "x^3 - 6x^2 + 4x + 12"
 *         xl:
 *           type: number
 *           format: double
 *           example: 1.0000000000
 *         xr:
 *           type: number
 *           format: double
 *           example: 5.0000000000
 *         initial_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *         initial_first_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *         initial_second_x:
 *           type: number
 *           format: double
 *           nullable: true
 *           example: null
 *
 * /rootOfEquationData/filter:
 *   get:
 *     summary: Retrieve one randomly equations filtered by data_id
 *     parameters:
 *       - name: data_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of equations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equation'
 */
app.get("/rootOfEquationData/filter", (req, res) => {
  const dataId = parseInt(req.query.data_id); 
  if (isNaN(dataId)) {
    return res.status(400).json({ error: "Invalid data_id" });
  }
  const filteredData = rootOfEquationData.filter(equation => equation.data_id === dataId);
  const randomIndex = Math.floor(Math.random() * filteredData.length);
  res.json(filteredData[randomIndex]);
});


app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
