import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import auth from "./middleware";
import { JWT_SECRET } from "@repo/common_backend/config"

interface CustomRequest extends Request {
    userID?: string;
}

const app = express();
app.use(express.json());

app.post("/signup",(req: Request ,res: Response): void => {
    const { username , password } = req.body;

    if(!username || !password){
        res.status(400).json({ error : "Both password and username are required"})
        return
    }

    try {
        
    }catch(e){
        console.log("Error occured :", e);
    }
})

app.post("/signin", (req: Request,res: Response): void => {
    const { username , password } = req.body;

    if(!username || !password){
        res.status(400).json({ error : "Both password and username are required"});
        return
    }

    try{
        const token = jwt.sign({
            id: username
        },JWT_SECRET);
        res.send(200).json({ token })
    }catch(e){
        console.log("Error occured: ", e);
    }
})

app.post("/room", auth, (req: CustomRequest, res: Response): void => {
    const userID = req.userID;
    res.json({
        roomID : "123123"
    })
})

app.listen(3001);