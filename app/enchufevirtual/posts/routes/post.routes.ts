import express from "express";
import { getPosts, createPost } from "../controller/post.controller";
import { createNameAudio } from "../../../middlewares/createNameAudio";

const router = express.Router();

router.route('/').get(getPosts).post(createNameAudio, createPost);


export default router;