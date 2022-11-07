const express = require('express')
const cors = require('cors');



const port = process.env.PORT || 5000;
const app = express()


app.use(cors());
app.use(express.json());


app.get('/', (req,res) => {
    res.send('Cooking corner server is running successfully')
})


app.listen(port, ()=> {
    console.log("Cooking corner is running...");
})
