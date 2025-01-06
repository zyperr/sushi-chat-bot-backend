import dotenv from "dotenv";

dotenv.config();

const envVariables = {
    PORT: process.env.PORT || 3000,
    PORT_DB: process.env.PORT_DB || 27017,
    DB_NAME: process.env.DB_NAME || "sushi",
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRATION_TIME: process.env.EXPIRATION_TIME || "1h",
    salt_Rounds: parseInt(process.env.salt_Rounds) ||   10,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
}

export {envVariables}