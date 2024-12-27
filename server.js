import express, { json} from 'express';
import path,{ dirname } from "path";
import { fileURLToPath } from 'url';
import routerProducts from "./src/routes/products.js";
import routerUser from "./src/routes/users.js";
import { envVariables } from './src/config/envVariables.js';



const app = express();

const {PORT} = envVariables

const __dirname = dirname(fileURLToPath(import.meta.url));


app.use(json());
app.use(express.static(path.join(__dirname, "public/images")));
app.use(routerProducts)
app.use(routerUser)

app.get("/",(req, res) => {
    res.send("Hello this is the server for sushi chat bot")
})



app.listen(PORT,() => {
    console.log(`Server running on port http://localhost:${PORT}`)
})