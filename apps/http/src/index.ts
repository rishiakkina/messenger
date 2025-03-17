import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import auth from "./middleware";
import { JWT_SECRET } from "@repo/common_backend/config"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types"

interface CustomRequest extends Request {
    userID?: string;
}

const app = express();
app.use(express.json());

app.post("/signup",(req: Request ,res: Response): void => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            msg : "Invalid inputs"
        })
    }

    try {
        
    }catch(e){
        console.log("Error occured :", e);
    }
})

app.post("/signin", (req: Request,res: Response): void => {
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            msg : "Invalid inputs"
        })
    }

    try{
        const token = jwt.sign({
            id: parsedData.data?.username
        },JWT_SECRET);
        res.send(200).json({ token })
    }catch(e){
        console.log("Error occured: ", e);
    }
})

app.post("/room", auth, (req: CustomRequest, res: Response): void => {
    const userID = req.userID;
    const parsedData = CreateRoomSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            msg : "Invalid inputs"
        })
    }
    res.json({
        roomID : parsedData.data?.name
    })
})

app.listen(3001);