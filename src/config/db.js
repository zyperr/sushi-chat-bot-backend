import { MongoClient } from "mongodb";
const PORT_DB = process.env.PORT_DB || 27017
const dbName = process.env.DB_NAME || "sushi-db"




const url = `mongodb://localhost:${PORT_DB}`;
const client = new MongoClient(url);

client.connect((err) => {
    if(err){
        console.error(err);
    }
    console.log("Connected to MongoDB");
})


const clientDb = client.db(dbName);

export {
    clientDb
}

