
const express = require("express");

const application = express();

function handlerTimestamp(request, response, handler) {
    console.log(`Request timestamp: ${new Date(Date.now()).toUTCString()}`);

    handler();
}

function handlerRoute(request, response, handler) {
    console.log(`Request route: ${request.baseUrl}`);

    handler();
}

application.use(handlerTimestamp);
application.use(handlerRoute);

application.set("view engine", "hbs");

const bodyParser = require("body-parser");

const URLencodedParser = bodyParser.urlencoded({extended: false});

const mongodb = require("mongodb");

const MONGODB_ADDRESS = process.env.MONGODB_ADDRESS || "127.0.0.1";
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;

const mongoConnection = `mongodb://${MONGODB_ADDRESS}:${MONGODB_PORT}`;

const mongoClient = new mongodb.MongoClient(mongoConnection);

const MONGODB_DBNAME = "liceum";

const mongoDatabase = mongoClient.db(MONGODB_DBNAME);

async function dbPingDatabase(database) {
    const dbPingResult = await database.command({ping: 1});

    console.log(dbPingResult);
}

dbPingDatabase(mongoDatabase);

const MONGODB_COLLECTION_STUDENTS = "students";

const mongodbCollectionStudents = mongoDatabase.collection(MONGODB_COLLECTION_STUDENTS);

application.get("/", (request, response) => {
    response.send("Hello, world!");
});

application.get("/addUser", (request, response) => {
    response.sendFile(__dirname + "/static/addUser.html");
});

application.post("/addUser", URLencodedParser, async (request, response) => {
    if(!request.body.userName || !request.body.userMidname || !request.body.userSurname || !request.body.userTicketID || !request.body.userGrade) {
        return response.sendStatus(400);
    }

    const newUser = {
        id: request.body.userTicketID,
        surname: request.body.userSurname,
        name: request.body.userName,
        midname: request.body.userMidname,
        grade: request.body.userGrade,
        rating: 0
    };

    const appendRequestResult = await mongodbCollectionStudents.insertOne(newUser);

    console.log(appendRequestResult);

    response.redirect("back");
});

application.get("/updateRating", (request, response) => {
    response.sendFile(__dirname + "/static/updateRating.html");
});

application.post("/updateRating", URLencodedParser, async (request, response) => {
    if(!request.body.userTicketID || !request.body.ratingChange) {
        return response.sendStatus(400);
    }

    const updateResult = await mongodbCollectionStudents.findOneAndUpdate(
        {id: request.body.userTicketID}, 
        {$inc: {rating: Number(request.body.ratingChange)}}
    );

    console.log(updateResult);

    response.redirect("back");
});

const SERVER_PORT = process.env.SERVER_PORT || 3030;

function serverCallback() {
    const serverAddress = server.address().address;
    const serverPort = server.address().port;

    console.log(`${serverAddress}:${serverPort}`);
}

const server = application.listen(SERVER_PORT, serverCallback);