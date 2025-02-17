import { Router } from "express";   
import { handleBotMessage } from "../services/botService.js";
import { authenticateToken } from "../security/token.js";


const router = Router();
const endpoint = "/v1/bot"


router.post(endpoint, authenticateToken, async (req, res) => {
    const { message } = req.body;
    const page = parseInt(req.query?.page, 10) || 1;
    const limit = parseInt(req.query?.limit, 10) || 10;

    if (!message) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const id = req.user?.id;

    if (!id) {
        return res.status(403).json({ message: "Access denied user not authenticated" });
    }

    try {
        const response = await handleBotMessage(id, message, page, limit);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error handling bot message:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});





export default router