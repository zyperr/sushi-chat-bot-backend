import request from "supertest";
import app from "../../server.js";
import { clientDb } from "../config/db.js";
import { ObjectId } from "mongodb";

describe("GET /", () => {

    it('should return "Hello this is the server for sushi chat bot"', () => {
        return request(app)
            .get("/")
            .expect(200)
            .expect("Hello this is the server for sushi chat bot");
    })
})


describe("Test user flow authentication",() => {
    let token;
    let id;
    let productId
    it('Should register a new user and return a status code of 201 ', async () => {
        const response = await request(app).post("/v1/users/register").send({
            name:"UnUsuariomuyLoco20",
            email:"UnEmail@domino.com",
            password:"UnaContraseñaSegura200"
        })
        expect(response.status).toBe(201)
        expect(response.body.message).toBe("User created successfully")
    })
    it('Should log in a user and return a status code of 200', async () => {
        const response = await request(app).post("/v1/users/login").send({
            name:"UnUsuariomuyLoco20",
            password:"UnaContraseñaSegura200"
        })
        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined();
        token = response.body.token
        id = response.body.user
    })

    it('Should return authenticated user information and status code of 200',async () => {
        const response = await request(app).get("/v1/users/me").set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
    })
    it('Should return status code of 200 and body should be defined',async () => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:"hola"})
        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
    })
    it('Should return the menu when user asks to the bot for it', async () => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:"menu"});

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
    })
    it("Should return the time when store is open.When user asked for it",async () => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:"a que hora abren"});

        expect(response.status).toBe(200);
        expect(response.body.botResponse).toBeDefined()
    })
    it("Should return the location where the store is.When user asked for it",async () => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:"donde se encuentran?"});
        expect(response.status).toBe(200);
        expect(response.body.botResponse).toBeDefined()
    })
    it("Should return a status code of 200 when user asks the bot to create an order",async() => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:"agregar Maki Queso y Pepino 1"});

        expect(response.status).toBe(200)
        expect(response.body.botResponse).toBeDefined()
        productId = response.body.productId
    })
    it("should return a status code of 200 when user asks the bot to delete an order",async () => {
        const response = await request(app).post("/v1/bot").set('Authorization', `Bearer ${token}`).send({message:`borrar ${productId}`});

        expect(response.status).toBe(200)
        expect(response.body.botResponse).toBeDefined()
    })
    afterAll(async () => {
        const usersCollection = clientDb.collection("users")
        const result = await usersCollection.deleteOne({_id:ObjectId.createFromHexString(id)})
        if(!result.acknowledged){
            console.log("User was not deleted")
        }
        console.log("User deleted succesfuly")
    })
})
