const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 10000; 

app.use(cors()); 
app.use(express.json()); 

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
        url: `https://numerical-method-web-app.onrender.com`, 
        description: 'Render server'
      },
      {
        url: `http://localhost:${port}`,
        description: 'Local server'
      }
    ],
  },
  apis: ['./server.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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


//Root of Equation
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



//Linear Algebra
let linearAlgebraData = [];
db.query('SELECT * FROM linear_algebra_data', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    linearAlgebraData = res.rows;
  }
});

// 3. GET Linear Algebra Data
/**
 * @swagger
 * components:
 *   schemas:
 *     LinearAlgebraData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the linear algebra record
 *           example: 1
 *         dimension:
 *           type: integer
 *           description: The dimension of the matrices
 *           example: 4
 *         matrix_a:
 *           type: array
 *           description: 2D array representing matrix A
 *           items:
 *             type: array
 *             items:
 *               type: number
 *               format: float
 *           example: [[5, 2, 0, 0], [2, 5, 2, 0], [0, 2, 5, 2], [0, 0, 2, 5]]
 *         matrix_b:
 *           type: array
 *           description: 1D array representing matrix B
 *           items:
 *             type: number
 *             format: float
 *           example: [12, 17, 14, 7]
 *         matrix_ini:
 *           type: array
 *           description: 1D array representing the initial matrix
 *           items:
 *             type: number
 *             format: float
 *           example: [0, 0, 0, 0]
 *
 * /linearAlgebraData:
 *   get:
 *     summary: Retrieve all matrix data
 *     responses:
 *       200:
 *         description: A list of matrix data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LinearAlgebraData'
 */
app.get("/linearAlgebraData", (req, res) => {
  //const randomIndex = Math.floor(Math.random() * linearAlgebraData.length);
  res.json(linearAlgebraData);
});

// 4. GET Random Linear Algebra Data with filtering
/**
 * @swagger
 * components:
 *   schemas:
 *     LinearAlgebraData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the linear algebra record
 *           example: 1
 *         dimension:
 *           type: integer
 *           description: The dimension of the matrices
 *           example: 4
 *         matrix_a:
 *           type: array
 *           description: 2D array representing matrix A
 *           items:
 *             type: array
 *             items:
 *               type: number
 *               format: float
 *           example: [[5, 2, 0, 0], [2, 5, 2, 0], [0, 2, 5, 2], [0, 0, 2, 5]]
 *         matrix_b:
 *           type: array
 *           description: 1D array representing matrix B
 *           items:
 *             type: number
 *             format: float
 *           example: [12, 17, 14, 7]
 *         matrix_ini:
 *           type: array
 *           description: 1D array representing the initial matrix
 *           items:
 *             type: number
 *             format: float
 *           example: [0, 0, 0, 0]
 *
 * /linearAlgebraData/filter:
 *   get:
 *     summary: Retrieve one randomly matrix filtered by data_id and dimension
 *     parameters:
 *       - name: data_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: dimension
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: A matrix data entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/LinearAlgebraData'
 */
app.get("/linearAlgebraData/filter", (req, res) => {
  const dataId = parseInt(req.query.data_id); 
  const dimension = parseInt(req.query.dimension);

  if (isNaN(dataId) || isNaN(dimension)) {
    return res.status(400).json({ error: "Invalid data_id or dimension" });
  }
  
  const filteredData = linearAlgebraData.filter(equation => 
    equation.data_id === dataId && equation.dimension === dimension
  );

  if (filteredData.length === 0) {
    return res.status(404).json({ error: "No data found for the given data_id and dimension" });
  }

  const randomIndex = Math.floor(Math.random() * filteredData.length);
  res.json(filteredData[randomIndex]);
});



//Interpolation & Extrapolation
let interExtraData = [];
db.query('SELECT * FROM inter_extra_data', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    interExtraData = res.rows;
  }
});

// 5. GET Interpolation & Extrapolation Data
/**
 * @swagger
 * components:
 *   schemas:
 *     InterExtraData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the interpolation/extrapolation record
 *           example: 1
 *         data_id:
 *           type: integer
 *           description: The reference ID for the related data
 *           example: 1
 *         point_amount:
 *           type: integer
 *           description: The number of points in the dataset
 *           example: 5
 *         x_amount:
 *           type: integer
 *           description: The number of x values, if applicable
 *           example: 3
 *         x:
 *           type: array
 *           description: 2D array representing matrix X values
 *           items:
 *             type: array
 *             items:
 *               type: number
 *               format: float
 *           example: [[2, 4, 6, 8, 10], [10, 15, 20, 25, 30], [1, 0, 2, 3, 4]]
 *         fx:
 *           type: array
 *           description: 1D array representing matrix FX values
 *           items:
 *             type: number
 *             format: float
 *           example: [3.5, 8, 10.5, 39.5, 72]
 *
 * /interExtraData:
 *   get:
 *     summary: Retrieve all interpolation and extrapolation data
 *     responses:
 *       200:
 *         description: A list of interpolation/extrapolation data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterExtraData'
 */
app.get("/interExtraData", (req, res) => {
  res.json(interExtraData);
});


// 6. GET Interpolation & Extrapolation Data with filtering
/**
 * @swagger
 * components:
 *   schemas:
 *     InterExtraData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the interpolation/extrapolation record
 *           example: 1
 *         data_id:
 *           type: integer
 *           description: The reference ID for the related data
 *           example: 1
 *         point_amount:
 *           type: integer
 *           description: The number of points in the dataset
 *           example: 5
 *         x_amount:
 *           type: integer
 *           description: The number of x values
 *           example: 3
 *         x:
 *           type: array
 *           description: 2D array representing matrix X values
 *           items:
 *             type: array
 *             items:
 *               type: number
 *               format: float
 *           example: [[2, 4, 6, 8, 10]]
 *         fx:
 *           type: array
 *           description: 1D array representing matrix FX values
 *           items:
 *             type: number
 *             format: float
 *           example: [3.5, 8, 10.5, 39.5, 72]
 *
 * /interExtraData/filter:
 *   get:
 *     summary: Retrieve one randomly filtered data entry by data_id
 *     parameters:
 *       - name: data_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A filtered data entry
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterExtraData'
 *       400:
 *         description: Invalid data_id
 *       404:
 *         description: No data found for the given criteria
 */
app.get("/interExtraData/filter", (req, res) => {
  const dataId = parseInt(req.query.data_id); 
  if (isNaN(dataId)) {
    return res.status(400).json({ error: "Invalid data_id" });
  }
  const filteredData = interExtraData.filter(equation => equation.data_id === dataId);
  const randomIndex = Math.floor(Math.random() * filteredData.length);
  res.json(filteredData[randomIndex]);
});





let integrateData = [];
db.query('SELECT * FROM integrate_data', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    integrateData = res.rows;
  }
});
// 7. GET All Integrate Data 
/**
 * @swagger
 * components:
 *   schemas:
 *     InterExtraData:
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
 *           example: "x^3 - 6x^2 + 4x + 20"
 *         a:
 *           type: number
 *           format: double
 *           example: -0.5
 *         b:
 *           type: number
 *           format: double
 *           example: 4.5
 *         n:
 *           type: number
 *           format: double
 *           example: 10
 *
 * /integrateData:
 *   get:
 *     summary: Retrieve all integrate data
 *     responses:
 *       200:
 *         description: A list of interpolation/extrapolation data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterExtraData'
 */
app.get("/integrateData", (req, res) => {
  res.json(integrateData);
});

// 8. GET Integrate Data randomly
/**
 * @swagger
 * components:
 *   schemas:
 *     InterExtraData:
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
 *           example: "x^3 - 6x^2 + 4x + 20"
 *         a:
 *           type: number
 *           format: double
 *           example: -0.5
 *         b:
 *           type: number
 *           format: double
 *           example: 4.5
 *         n:
 *           type: number
 *           format: double
 *           example: 10
 *
 * /integrateData/random:
 *   get:
 *     summary: Retrieve one integrate data randomly
 *     responses:
 *       200:
 *         description: A list of interpolation/extrapolation data entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InterExtraData'
 */
app.get("/integrateData/random", (req, res) => {
  const randomIndex = Math.floor(Math.random() * integrateData.length);
  res.json(integrateData[randomIndex]);
});





app.listen(port,'0.0.0.0', () => {
  console.log(`Successfully started server on port ${port}.`);
});
