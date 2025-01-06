import express, { json} from 'express';
import path,{ dirname } from "path";
import { fileURLToPath } from 'url';
import routerProducts from "./src/routes/products.js";
import routerUser from "./src/routes/users.js";
import routerOrder from "./src/routes/order.js";
import { envVariables } from './src/config/envVariables.js';
import routerBot from "./src/routes/bot.js";
import cors from "cors"
const app = express();

const {PORT,FRONTEND_URL} = envVariables

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(FRONTEND_URL)

app.use(cors({
    origin:[`${FRONTEND_URL}`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(json());
app.use(express.static(path.join(__dirname, "public/images")));
app.use(routerProducts)
app.use(routerUser)
app.use(routerOrder)
app.use(routerBot)

app.get("/",(req, res) => {
    res.send("Hello this is the server for sushi chat bot")
})



app.listen(PORT,() => {
    console.log(`Server running on port http://localhost:${PORT}`)
})