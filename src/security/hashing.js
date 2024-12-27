import bscrypt from "bcrypt";
import {envVariables} from "../config/envVariables.js"


const {salt_Rounds} = envVariables


const hashPassword = async (password) => {
    const hash = bscrypt.hash(password, salt_Rounds);
    return hash;
}
const verifyHash = async (password,hash) => {
    const result = await bscrypt.compare(password,hash);
    return result
}



export {
    hashPassword,
    verifyHash
}