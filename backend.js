const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'templates'))

app.use('/static', express.static(path.join(__dirname, 'static')))

// All routes related to user
app.use('/', require('./routes/indexRoute'))
app.use('/recipe', require('./routes/recipeRoute'))
app.use('/about', require('./routes/aboutRoute'))

// All the routes related to super user
app.use('/admin', require('./routes/admin/adminRoute'))


app.listen(port, ()=>{
    console.log(`Server Running at http://localhost:${port}`)
})