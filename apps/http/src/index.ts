import express, { Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import auth from "./middleware";
import { JWT_SECRET } from "@repo/common_backend/config"
import { CreateUserSchema, SigninSchema, CreateChatSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"; ``

interface CustomRequest extends Request {
    userId?: string;
}

const app = express();
app.use(express.json());

app.post("/signup",async (req: Request ,res: Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.status(200).json({
            msg : "Invalid inputs"
        })
        return
    }

    try {
        const response = await prismaClient.user.create({
            data:{
                name : parsedData.data?.name as string,
                username : parsedData.data?.username as string,
                password : parsedData.data?.password as string
            }
        })
        res.status(201).json({ user : response })
        return
    }catch(e){
        console.log("Error occured :", e);
    }
})

app.post("/signin",async (req: Request,res: Response) => {
    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            msg : "Invalid inputs"
        })
        return
    }

    try{
        const user = await prismaClient.user.findUnique({
            where :{
                username : parsedData.data?.username as string,
                password : parsedData.data?.password as string
            }
        })
        if(!user){
            res.status(411).json({
                err : "Username doesnt exist or incorrect password"
            });
            return
        }
        const token = jwt.sign({
            id: user.id
        },JWT_SECRET);
        res.send(200).json({ token })
        return
    }catch(e){
        console.log("Error occured: ", e);
        res.status(500).json({
            msg : "An error occured during signin"
        })
    }
})

app.post("/CreateChat", auth, async (req: CustomRequest, res: Response) => {
    const userId = req.userId;
    const parsedData = CreateChatSchema.safeParse(req.body);

    if(!parsedData.success){
        console.log(parsedData.error);
        res.json({
            msg : "Invalid inputs"
        })
        return
    }
    
    try {
        const chatResponse = await prismaClient.chat.create({
            data : {
                name : parsedData.data?.name as string
            }
        })
    
        const personsPromise = parsedData.data?.persons.map(async (person) => {
            const user = await prismaClient.user.findUnique({
                where : {
                    username : person
                }
            })
        
            if(!user){
                res.status(411).json({
                    err : "Person doesn't exist !!"
                });
                return
            }
    
            return prismaClient.chatmember.create({
                data : {
                    userId : user.id as string,
                    chatId : chatResponse.id
                }
            })
        })
        await Promise.all(personsPromise);
        res.status(201).json({ chat: chatResponse });
        return
    } catch (e) {
        console.error("Error Creating chat:", e);
        res.status(500).json({ msg: "An error occurred while creating chat" });
        return
    }
    
})

app.get("/chats",auth ,async (req : CustomRequest, res : Response) => {
    const userId = req.userId;

    try {
        const response = await prismaClient.chat.findMany({
            where : {
                members : {
                    some : { userId }
                }
            }
        })
        res.status(200).json({
            response
        })
        return
    } catch (e) {
        console.error("Error fetching chats:", e);
        res.status(500).json({ msg: "An error occurred while fetching chats" });
        return
    }
})

app.get("/chat/:id",auth, async (req : CustomRequest,res : Response) => {
    const userId = req.userId;
    const roomId = req.params["id"]

    if(!roomId){
        res.status(400).json({
            err : "Provide chat name"
        });
        return
    }
    try {

        const messages = await prismaClient.chat.findMany({
            where: { id: roomId },
            take: 50,
            orderBy: { id: 'desc' }
        });
        
        if (!messages || messages.length === 0) {
            res.status(400).json({ err: "Chat doesn't exist" });
            return
        }
        res.status(200).json({ messages });
        return

    } catch (e) {

        console.error("Error fetching chat messages:", e);
        res.status(500).json({ msg: "An error occurred while fetching chat messages" });
        return
    }
})

app.listen(3001);