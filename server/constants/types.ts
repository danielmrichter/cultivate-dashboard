import { Request } from "express";

export interface IAUser extends Request {
    user: IUser
}

export interface IUser {
    id: number
}