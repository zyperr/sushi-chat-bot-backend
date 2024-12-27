import bscrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {envVariables} from "../config/envVariables.js"


const {SECRET_KEY,EXPIRATION_TIME,salt_Rounds} = envVariables


const hashPassword = async (password) => {
    const hash = bscrypt.hash(password, salt_Rounds);
    return hash;
}
const verifyHash = async (password,hash) => {
    const result = await bscrypt.compare(password,hash);
    return result
}

const createToken = (id) => {
    const token = jwt.sign(
        {
            id
        },
        SECRET_KEY
        ,
        {
            expiresIn:EXPIRATION_TIME
        }
    )
    return token
}

export {
    hashPassword,
    verifyHash,
    createToken
}