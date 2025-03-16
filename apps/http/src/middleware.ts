import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common_backend/config"

interface CustomRequest extends Request {
    userID?: string;
}

interface decodedToken {
    id : string;
}

function auth(req: CustomRequest,res: Response, next : NextFunction){
    const token = req.body.token ?? "";
    const decoded = jwt.verify(token,JWT_SECRET) as decodedToken;
    if(!decoded){
        res.status(400).json({error : "unauthorized | no token"})
        return
    }
    req.userID = decoded.id;
    next();
}

export default auth;