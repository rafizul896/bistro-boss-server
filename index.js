const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.y7qmkns.mongodb.net/?retryWrites=true&w=majority&appName=cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const menuCollection = client.db('bistroDB').collection('menu');
        const reviewsCollection = client.db('bistroDB').collection('reviews');
        const cartsCollection = client.db('bistroDB').collection('carts');

        app.get('/menus', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result);
        })

        // carts collection
        app.post('/carts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartsCollection.insertOne(cartItem);
            res.send(result);
        })

        app.get('/carts', async (req, res) => {
            const email = req.query?.email;
            const query = {
                email
            }
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/carts/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('bistro boss server is running..!')
})

app.listen(port, () => {
    console.log(`Bistro boss server is runnung port on : ${port}`)
})