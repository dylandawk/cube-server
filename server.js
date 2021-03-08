const express = require("express");
const port = process.env.PORT || 8080;
const app = express();

const { MongoClient } = require("mongodb");

// mongo database info
const mdb_USER = "dylandawk";
const mdb_PASS = "PmpvT7DM9u2dg2Fy";
const mdb_URI = `mongodb+srv://${mdb_USER}:${mdb_PASS}@cluster0.j1urd.mongodb.net/test`;
let mdbClient;

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//  run webpack in dev mode
if(process.env.NODE_ENV === "development"){
    const webpack = require("webpack");
    const webpackDevMiddleware = require("webpack-dev-middleware");
    const config = require ('./webpack.dev.config.js');
    const compiler = webpack(config);

    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    }));
}

app.use(express.static('public'));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/app/index.html');
});

app.post("/api/data", (req, res) => {
    const body = req.body;
    const user = body.user;
    const message = body.message;
    if (!user || !message) {
        res.status(400).send("Missing user or message");
    } else {
        console.log({user, message});
        res.sendStatus(200);
    }
});

app.get("/api/database", async function(req,res){
    mdbClient = new MongoClient(mdb_URI,  {useUnifiedTopology: true });

    try{
        await mdbClient.connect();
        const collection = mdbClient.collection("pagemeta");
        const item = await collection.findOne({});
    } catch(err){
        res.status(500).send("Some error occurred.")
        console.log(err);
    }

    finally{
        await mdbClient.close();
    }
    res.sendFile(__dirname + '')
});

const listener = app.listen(port, function(){
    console.log('Your app is listening on port: ' + port);
});