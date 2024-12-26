import express, { json} from 'express';
import {newProduct,getProducts,getProduct} from "./src/services/service.js"
import multer from 'multer';
import path,{ dirname } from "path";
import { fileURLToPath } from 'url';
const app = express();
const port= process.env.PORT || 5000;
const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/images')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
    
const upload = multer({ storage: storage,dest: './public/images',
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error("File type must be jpg, jpeg, png or webp"));
        }
        cb(undefined, true);
    }});
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(json());
app.use(express.static(path.join(__dirname, "public/images")));


app.get("/",(req, res) => {
    res.send("Hello this is the server for sushi chat bot")
})

app.get("/products",async(req,res) => {
    try{
        const products = await getProducts(res);
        return res.status(200).send(products);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
app.get("/products/:id",async (req,res) => {
    try{
        const id = req.params?.id
        if(!id){
            return res.status(400).send("Missing required fields id")
        }

        return await getProduct(id,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
app.post("/products",upload.single("picture"),async (req,res) => {
    try{
        const name= req.body?.name;
        const price= req.body?.price;
        const picture= req.file?.filename
        const pieces = req.body?.pieces
        
        if (!name || !price || !picture || !pieces) {
            return res.status(400).send("Missing required fields")
        }
        const product = {name,price,picture,pieces};
        return newProduct(product,res);
    }catch(err){
        console.log('Error', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

app.listen(port,() => {
    console.log(`Server running on port localhost:${port}`)
})