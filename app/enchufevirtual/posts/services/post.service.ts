// import boom from "@hapi/boom";
import { FindOptions } from "sequelize";
import { QueryParams } from "types/types";
import { arrayFiles } from "../../../helpers/arrayFiles";
import { sequelize } from "../../../libs/sequelize";


class PostService {

  private post;

  constructor () {
    this.post = sequelize.models.Post;
  }
  
  async find(query: QueryParams) {

    const options: FindOptions =  {
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
      order: [['id', 'DESC']]
    }
    const { limit } = query;
    if (limit) {
      options.limit = Number(limit)
    }

    // const totalCount = await this.post.count();

    const posts = await this.post.findAll(options);

    // const hasMoreResults = totalCount > (Number(offset) + posts.length);
    return { posts };
   
  }

  async findOne({id}) {

    const audio = await this.post.findByPk(id);
    // eslint-disable-next-line no-console
    console.log(audio)

  }

  async create({content, files, userId}) {
    
    const { image, audio, nameAudio } = arrayFiles(files);

    const createPost = await this.post.create({
      content, 
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