const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/',require('./routes/scrapeRoutes'));

const port = 8000;

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});