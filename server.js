//Dependencies
const express = require('express');
const app = express();
const axios = require('axios')
const PORT = process.env.PORT || 3001;
const planets = require('./planets');
const people = require('./people')


//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/planets', planets);
app.use('/people', people);


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);

});





