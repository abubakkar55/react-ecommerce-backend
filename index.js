const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require('dotenv').config();

const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const database = client.db("ecommerce");
        const ecommerce_collection = database.collection("products_collection");

        // get all the prodcuts from db  =============> start
        app.get("/products", async (req, res) => {
            const cursor = ecommerce_collection.find({});
            const page = req.query.page;
            const size = parseFloat(req.query.size);
            const counts = await cursor.count();
            let result;
            page ? result = await cursor.skip(page * size).limit(size).toArray() : result = await cursor.toArray();

            res.send({ counts, result });
        });
        // get all the prodcuts from db  =============> End


        // get products from db using an field ===========> Start
        app.post("/clicked/products", async (req, res) => {
            const clickedPd = req.body;
            const data = await ecommerce_collection.find({ id: { $in: clickedPd } }).toArray();
            //const data = await ecommerce_collection.find({ id: clickedPd  }).toArray();
            res.json(data);
        });
        // get products from db using an field ===========> End


        // get a specific products =============> Start
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const result = await ecommerce_collection.findOne({ _id: ObjectId(id) });
            res.json(result);
        });
        // get a specific products =============> End


    }

    finally {


    }

}
run().catch(console.dir());

app.listen(port, () => {
    console.log("Listening Man!");
});