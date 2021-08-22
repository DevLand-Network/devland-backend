// Imports:

import express from 'express';
import favicon from 'express-favicon';
import api from './lib/api/index.js'
import cors from 'cors';
import { dirname } from 'path'
import { fileURLToPath } from 'url';
import morgan from 'morgan'

// Declarations and app configuration:

const __dirname = dirname(fileURLToPath(import.meta.url)); // eslint-disable-line no-use-before-define

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(morgan('combined'));
app.use(favicon(__dirname + '/public/favicon-32x32.png'));
app.set('json spaces', 2)

// Main routing 


app.use(api);
app.use('/api', api);
app.use('/api/v1', api);

// Not found handler:

app.use((req, res, next) => res.status(404).render("./frontend/404"));

// Start server:

app.listen(3000);
