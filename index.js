const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;


//midelware
app.use(cors());
app.use(express.json());

//DB Connection
const uri = `mongodb+srv://${process.env.MONGDB_USERNAM}:${process.env.MONGDB_USERPAS}@cluster0.x6o4r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const main = async () => {
    try {
        await client.connect();
        const database = client.db("theblogclub");
        const blogsDataCollection = database.collection("blogPosts");
/*         const usersDataCollection = database.collection("usersData");
        const productsDataCollection = database.collection("productsData");
        const ordersDataCollection = database.collection("ordersData");
        const reviewsDataCollection = database.collection("reviewsData"); */



        // Add new blog post
        app.post('/addnewpost', async (req, res) => {
            const blogDetails = req.body
            const result = await blogsDataCollection.insertOne(blogDetails)
            res.send(result)
        })

        // Add new blog post
        app.get('/blogposts', async (req, res) => {
            const data = blogsDataCollection.find({})
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const count = await data.count()
            const allPosts = await data.skip(page * size).limit(size).toArray();

            res.send({
                count,
                allPosts
            })
        })

    }
    finally {
    }
}

main().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello from backend')
})

app.listen(port, () => {
    console.log(`listening Port:${port}`)
})