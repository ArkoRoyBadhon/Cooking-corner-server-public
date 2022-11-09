const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()



const app = express()
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.et115mk.mongodb.net/?retryWrites=true&w=majority`;
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
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    service_name: user.service_name,
                    email: user.email,
                    photourl: user.photourl,
                    rating: user.rating,
                    textarea: user.textarea,
                    time: user.time
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser, option);
            res.send(result);
        })

        app.get('/reviews/:email', async (req, res) => {
            const name = req.params.email;
            // console.log(name);
            const query = {
                "$or": [
                    { "email": { $regex: req.params.email } }
                ]
            }
            const result = await reviewCollection.find(query).sort({ time: -1 }).toArray()
            res.send(result)
        })

        app.get('/all-reviews/:id', async (req, res) => {
            // const id = req.params.id;
            const query = {
                "$or": [
                    { "review_service": { $regex: req.params.id } }
                ]
            }
            const result = await reviewCollection.find(query).sort({ time: -1 }).toArray();
            res.send(result)
        })

        app.get('/review-one/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            // const query = {
            //     "$or": [
            //         { "review_service": { $regex: req.params.id } }
            //     ]
            // }
            const gotIt = await reviewCollection.findOne(query);
            res.send(gotIt)
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/add-service', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service)
            res.send(result);
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
