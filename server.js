require('dotenv').config();
const express = require('express');
const cors = require('cors')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const helmet = require('helmet');
const xss = require("xss-clean");
const hpp = require("hpp");

const router = require('./routes');

// Create a server
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(xss());
app.use(hpp());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
};

// Routes
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
