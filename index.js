const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');



const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.et115mk.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://cookingUser:Jc9K1yPHlzAjq9MM@cluster0.et115mk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollection = client.db('cookingCorner').collection('services')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
    }
    finally {

    }
}


run().catch(err => console.log(err))





app.get('/', (req,res) => {
    res.send('Cooking corner server is running successfully')
})


app.listen(port, ()=> {
    console.log("Cooking corner is running...");
})
