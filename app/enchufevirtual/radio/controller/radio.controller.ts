import { Request, Response, NextFunction as Next } from "express";
import { RadioService } from "../services/radio.service";

const radioService = new RadioService();

export const getCurrentSong = async (req: Request, res: Response, next: Next) => {
  try {
    const song = await radioService.find();
    res.json(song);
  } catch (error) {
    next(error);
  }
}