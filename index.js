const express = require("express");
const bodyParser = require('body-parser')
const app = express();

const port = process.env.START_PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended:true}))


require('./app/routes')(app)

app.listen(port,()=>{
    console.log('application start at port ',port)
})
