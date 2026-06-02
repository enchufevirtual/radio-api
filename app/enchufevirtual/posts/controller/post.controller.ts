import { Request, Response, NextFunction as Next } from "express";
import { RequestWithUser } from "types/types";
import { PostService } from "../services/post.service";

const postService = new PostService();

const getPosts = async (req: Request, res: Response, next: Next) => {

  try {
    const posts = await postService.find(req.query);
    res.json(posts);
  } catch (error) {
    const err = error as Error & { name?: string; parent?: Error; sql?: string; errors?: Array<{ message: string; type: string }> };
    console.error('[getPosts] Failed to fetch posts', {
      method: req.method,
      path: req.path,
      query: req.query,
      errorName: err.name,
      errorMessage: err.message,
      // Sequelize wraps the original DB error — log it for connection/query issues
      parentError: err.parent?.message,
      // Log the raw SQL that failed, if Sequelize provides it
      sql: err.sql,
      // Sequelize ValidationError carries a per-field errors array
      validationErrors: err.errors,
      stack: err.stack,
    });
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