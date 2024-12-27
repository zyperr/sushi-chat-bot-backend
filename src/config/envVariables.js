import dotenv from "dotenv";

dotenv.config();

const envVariables = {
    PORT: process.env.PORT,
    PORT_DB: process.env.PORT_DB,
    DB_NAME: process.env.DB_NAME,
    SECRET_KEY: process.env.SECRET_KEY,
    EXPIRATION_TIME: process.env.EXPIRATION_TIME,
    salt_Rounds: process.env.salt_Rounds
}

export {envVariables}