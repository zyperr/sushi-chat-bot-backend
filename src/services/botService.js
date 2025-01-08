import { getByName, getProducts } from "./service.js";
import { createOrder } from "./orderService.js";
import {readFile} from "fs/promises"
import { deleteOrderFromUser } from "./userService.js";
import { ObjectId } from "mongodb";
const file = await readFile("./src/config/intents.json","utf-8")
const intents = JSON.parse(file)


const handleBotMessage = async (userId,userMessage,page,limit) => {
    if (!userMessage || typeof userMessage !== 'string') {
        return { botResponse: "Lo siento no entendí tu mensaje." };
    }
    const formatedMessage = userMessage.toLowerCase().trim();
    for (const [intent, keywords] of Object.entries(intents)) {

        const { words, message: botResponse } = keywords;

        if (words?.some((keyword) => formatedMessage.includes(keyword))) {
            switch (intent) {
                case "hello":
                    return { botResponse};
                case "menu":
                    try {
                        const menu = await handleMenu(page,limit);
                        return {
                            botResponse,
                            ...menu
                        };
                    } catch (err) {
                        console.error('Error getting the menu:', err);
                        return { botResponse: "Lo siento no entendí  tu mensaje." };
                    }
                case "order":
                    return { botResponse };
                case "create_order": {
                    try {
                        const { a, bot } = await handleOrder(userMessage);
                        if (!a) {
                            return { botResponse: "Lo siento no entendí  tu mensaje." };
                        }
                        const newOrder = {
                            userId,
                            products: [
                                {
                                    productId: a.productId,
                                    quantity: a.quantity,
                                    state: "pendiente"
                                }
                            ]
                        }
                        
                        const order = await createOrder(newOrder);
                        console.log(order);

                        if(!order.acknowledged){
                            return {
                                botResponse: "Algo salio mal creando tu pedido",
                            }
                        }

                        return {
                            botResponse: bot,
                            productId:a.productId
                        }
                    } catch (error) {
                        console.error("Error creating order:", error);
                        return { botResponse: "Lo siento no entendí  tu mensaje." };
                    }
                }
                case "delete_order": {
                    return { botResponse };
                }
                case "confirm_delete": {
                    const [_,orderId] = userMessage.split(" ");
                    const {botResponse} = await handleDeleteOrder(userId,orderId);

                    return { botResponse };
                }
                case "open_hours":
                    return { botResponse };
                case "thank_you":
                    return { botResponse };
                case "where":
                    return { botResponse };
                default:
                    break;
            }
        }
    }
    return { message: "Lo siento no entendí  tu mensaje." };
};


const handleMenu = async (page,limit) => {
    return await getProducts(page,limit);
} 

const handleOrder = async (message) => {
    const r = new RegExp(/agregar (.+) (\d+)/i);
    const match = r.test(message);
    if(!match){
        return;
    }
    const [,product,quantity] = r.exec(message);
    const productFound = await getByName(product);

    return {
        bot: ` Agregando ${productFound.name} ${quantity} al pedido\n ID: ${productFound._id}`,
        a:{
            productId:productFound._id.toString(),
            quantity:parseInt(quantity)
        }
    };
}

const handleDeleteOrder = async (id,orderId) => {
    const valid = ObjectId.isValid(orderId)
    if(!valid){
        return {
            botResponse: "El id de tu pedido no es valido"
        }
    }
    const response = await deleteOrderFromUser(id,orderId)

    if(!response.data){
        return {
            botResponse: "Algo salio mal eliminando tu pedido"
        }
    }
    return {
        botResponse: "Se ha eliminado tu pedido con exito",
    }
}


export {handleBotMessage}