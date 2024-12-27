import jwt from "jsonwebtoken"
import { envVariables } from "../config/envVariables.js";

const {SECRET_KEY,EXPIRATION_TIME} = envVariables
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
const authenticateToken = (req,res,next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token)
    console.log(req.headers)
    console.log(res.body)
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token was not provided' });
    }
    jwt.verify(token,SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Access denied, invalid token' });
        }

        req.user = user;
        next();
    })
}


export {
    createToken,
    authenticateToken
}