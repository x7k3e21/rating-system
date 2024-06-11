
const express = require("express");

const application = express();

function handlerTimestamp(request, response, handler) {


    handler();
}

function handlerRoute(request, response, handler) {


    handler();
}

application.use(handlerTimestamp);
application.use(handlerRoute);

const mongodb = requrie("mongodb");

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS || "127.0.0.1";
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;

const mongoConnection = `mongodb://${MONGODB_ADDRESS}:${MONGODB_PORT}`;

const mongoClient = mongodb.MongoClient(mongoConnection);

application.get("/", (request, response) => {

});

const SERVER_PORT = process.env.SERVER_PORT || 3030;

function serverCallback() {
    const serverAddress = server.address().address;
    const serverPort = server.address().port;

    console.log(`${serverAddress}:${serverPort}`);
}

const server = application.listen(SERVER_PORT, serverCallback);