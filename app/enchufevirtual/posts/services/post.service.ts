// import boom from "@hapi/boom";
import { FindOptions } from "sequelize";
import { QueryParams } from "types/types";
import { arrayFiles } from "../../../helpers/arrayFiles";
import { sanitizeText } from "../../../helpers/sanitizeText";
import { sequelize } from "../../../libs/sequelize";


class PostService {

  private post;

  constructor () {
    this.post = sequelize.models.Post;
  }
  
  async find(query: QueryParams) {

  const { limit = 4, offset = 0 } = query;

  const totalCount = await this.post.count();

  const posts = await this.post.findAll({
    include: [
      {
        model: sequelize.models.Comment,
        as: 'comments',
      },
      {
        model: sequelize.models.User,
        as: 'user',
        attributes: ['image', 'name', 'username']
      }
    ],
    order: [['id', 'DESC']],
    limit: Number(limit),
    offset: Number(offset),
  });

  return {
  posts,
  hasMoreResults: totalCount > Number(offset) + posts.length,
  version: "v2-offset-pagination"
};
}

  async findOne({id}) {

    const audio = await this.post.findByPk(id);
    // eslint-disable-next-line no-console
    console.log(audio)

  }

  async create({content, files, userId}) {
    const sanitizedContent = sanitizeText(content ?? '', 1000);
    const { image, audio, nameAudio } = arrayFiles(files);

    const createPost = await this.post.create({
      content: sanitizedContent,
      image: image ?? "",
      audio: audio ?? "",
      nameAudio: nameAudio ?? "", 
      userId
    });
    return createPost;
  }

  async update() {

  }

  async delete() {

  }
}

export { PostService };