import { Request, Response, NextFunction as Next } from "express";
import { RequestWithUser } from "types/types";
import { PostService } from "../services/post.service";

const postService = new PostService();

const getPosts = async (req: Request, res: Response, next: Next) => {

  try {
    const posts = await postService.find(req.query);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

const getAudio = async (req: Request, res: Response, next: Next) => {

  try {
    const { id } = req.body;
    const posts = await postService.findOne({id});
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

const createPost = async (req: RequestWithUser, res: Response, next: Next) => {

  try {
    const { content, userId } = req.body;
    const files = req.files;
    const newPost = await postService.create({content, files, userId});
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
}

const updatePost = async (req: RequestWithUser, res: Response, next: Next) => {

  try {
    console.log(req.body)
  } catch (error) {
    next(error);
  }
}


export { getPosts, getAudio, createPost, updatePost }