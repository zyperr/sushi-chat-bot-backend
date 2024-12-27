import { MongoClient } from "mongodb";
import { envVariables } from "../config/envVariables.js";


const {PORT_DB,DB_NAME} = envVariables




const url = `mongodb://localhost:${PORT_DB}`;
const client = new MongoClient(url);

client.connect((err) => {
    if(err){
        console.error(err);
    }
    console.log("Connected to MongoDB");
})


const clientDb = client.db(DB_NAME);

export {
    clientDb
}

