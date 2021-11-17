const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectID = require('mongodb').ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0txs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const databse = client.db('DroneBd');
        const dronesCollection = await databse.collection('drones');
        const reviewsCollection = await databse.collection('reviews');
        const usersCollection = await databse.collection('users');
        const ordersCollection = await databse.collection('orders');

        app.get('/drones', async (req, res) => {
            const quantity = parseInt(req.query.homeQtity);
            const cursor = dronesCollection.find({}).limit(quantity);
            const drones = await cursor.toArray();
            res.send(drones);
        });

        app.get('/alldrones', async (req, res) => {
            const cursor = dronesCollection.find({});
            const drones = await cursor.toArray();
            res.send(drones);
        });

        app.get('/drone/:id', async (req, res) => {
            const droneId = req.params.id;
            const result = await dronesCollection.find({ "_id": ObjectID(droneId) }).toArray();
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const body = req.body;
            const result = await usersCollection.insertOne(body);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/orders', async (req, res) => {
            const body = req.body;
            const result = await ordersCollection.insertOne(body);
            res.send(result);
        });


    } finally {

    }
}

run().catch(console.dir());

app.get('/', (req, res) => {
    res.send("Drone BD is live now");
});

app.listen(port, () => {
    console.log('Server is running at port', port);
});