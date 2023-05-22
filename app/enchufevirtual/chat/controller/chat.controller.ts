import { Request, Response, NextFunction as Next } from "express";
import { ChatService } from "../services/chat.service";


const chatService = new ChatService();

export const getMessages = async (req: Request, res: Response, next: Next) => {
  try {
    const messages = await chatService.find();
    res.json(messages);
  } catch (error) {
    next(error);
  }
}