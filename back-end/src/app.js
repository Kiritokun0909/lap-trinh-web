const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const route = require('./routes/index.js');

require('dotenv').config(); // Load environment variables

// Middleware for parsing JSON
app.use(bodyParser.json());
app.use(morgan('combined'));

// Middleware for parsing cookies
app.use(cookieParser());

// Allow all requests from anywhere
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

const PORT = process.env.PORT || 6000;
const HOST = '0.0.0.0';

route(app);
// Start the server
app.listen(PORT, HOST, () => {
  console.log(`App listening at http://${HOST}:${PORT}`);
});
