const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



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
        const reviewCollection = client.db('cookingCorner').collection('reviews')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/serviceslimit', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            // console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews/:email', async (req, res) => {
            const name = req.params.email;
            console.log(name);
            const query = {
                "$or": [
                    { "email": { $regex: req.params.email } }
                ]
            }
            const result = await reviewCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/all-reviews/:id', async (req, res) => {
            // const id = req.params.id;
            const query = {
                "$or": [
                    { "review_service": { $regex: req.params.id } }
                ]
            }
            const result = await reviewCollection.find(query).toArray();
            res.send(result)
        })

        app.delete('/reviews/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })




    }
    finally {

    }
}


run().catch(err => console.log(err))





app.get('/', (req, res) => {
    res.send('Cooking corner server is running successfully')
})


app.listen(port, () => {
    console.log("Cooking corner is running...");
})
