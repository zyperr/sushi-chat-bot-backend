import express, { json} from 'express';
import path,{ dirname } from "path";
import { fileURLToPath } from 'url';

import routerProducts from "./src/routes/products.js";


const app = express();
const port= process.env.PORT || 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(json());
app.use(express.static(path.join(__dirname, "public/images")));
app.use("/products",routerProducts)

app.get("/",(req, res) => {
    res.send("Hello this is the server for sushi chat bot")
})



app.listen(port,() => {
    console.log(`Server running on port localhost:${port}`)
})