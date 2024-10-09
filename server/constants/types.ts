import { Request } from "express";

export interface expReqWithUser extends Request {
    user: IUser
}

export interface IUser {
    id: number
}