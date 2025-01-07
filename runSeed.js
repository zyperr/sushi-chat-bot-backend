import { clientDb,client } from "./src/config/db.js";
import { envVariables } from "./src/config/envVariables.js";


const {PORT} = envVariables

const seedDb = async () => {
    try{
        const configCollection = clientDb.collection("config");
        const shushis = [
        
            {
                name:"Maki Queso y Pepino",
                price:4.0,
                picture:`http://localhost:${PORT}/12446.webp`,
                pieces:6
            },
            {
                name:"Maki Salmón Roll",
                price:6.90,
                picture:`http://localhost:${PORT}/12161.webp`,
                pieces:6
            },
            {
                name:"Salmon Roll Aguacate",
                price:7.00,
                picture:`http://localhost:${PORT}/12162.webp`,
                pieces:10,
                category:"sushi"
            },
            {
                name:"Box By you",
                price:47.00,
                picture:`http://localhost:${PORT}/12303.webp`,
                pieces:42,
                category:"sushi"
            },
            {
                name:"Salmon Aburi Roll",
                price:7.50,
                picture:`http://localhost:${PORT}/12182.webp`,
                pieces:6,
                category:"sushi"
            },
            {
                name:"Maki Queso y Pepino",
                price:4.0,
                picture:`http://localhost:${PORT}/12446.webp`,
                pieces:6,
                category:"sushi"
            },
            {
                name:"Chicken curry",
                price:6.90,
                picture:`http://localhost:${PORT}/12917.webp`,
                pieces:6,
                category:"sushi"
            },
            {
                name:"California Tuna Kumquat",
                price:7.00,
                picture: `http://localhost:${PORT}/14024.webp`,
                pieces:6,
                category:"sushi"
            },
            {
                name:"Super Salmon",
                price:21.20,
                picture:`http://localhost:${PORT}/12225.webp`,
                pieces:24,
                category:"sushi"
            },
            {
                name:"California Dream",
                price:21.20,
                picture:`http://localhost:${PORT}/12228.webp`,
                pieces:24,
                category:"sushi"
            }
        ]
        const user = [
            {
                name:"admin",
                email:"admin@localhost",
                password:"admin",
                role:"admin"
            },
            {
                name:"user",
                email:"user@localhost",
                password:"user",
                role:"user"
            }
        ]
        const flag = await configCollection.findOne({ key: 'productsInitialized' });
        
        if (flag) {
            console.log("Database was already initialized");
            return;
        }
        const products = clientDb.collection("products");
        const users = clientDb.collection("users");

        
        const result = await products.insertMany(shushis);
        const resultUser = await users.insertMany(user);
        console.log(`inserted ${result.insertedCount} shushis into the collection`);
        console.log(`inserted ${resultUser.insertedCount} users into the collection`);
        
        await configCollection.insertOne({ key: 'productsInitialized', value: true })
        console.log("Database initialized");
    }catch(err){
        console.log(err)
    }finally{
        await client.close();
    }
}

seedDb();