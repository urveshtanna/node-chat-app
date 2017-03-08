const path = require('path');
const PUBLIC_PATH = path.join(__dirname,'../public')
const express = require('express')
const port = process.env.PORT || 3000;
console.log(PUBLIC_PATH);

var app = express();
app.use(express.static(PUBLIC_PATH));


app.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
})
