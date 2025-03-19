import { z } from "zod"
const message = "Invalid format"
export const CreateUserSchema = z.object({
    username : z.string().min(7,{message}).max(20,{message}),
    password : z.string().min(5,{message}).max(20,{message}),
    name : z.string().min(3,{message}).max(20,{message})
})

export const SigninSchema = z.object({
    username : z.string().min(7,{message}).max(20,{message}),
    password : z.string().min(5,{message}).max(20,{message})
})

export const CreateChatSchema = z.object({
    name : z.string().length(5,{message}),
    persons : z.array(z.string().max(20).min(5))
})