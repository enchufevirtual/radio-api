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

    const options: FindOptions =  {
      include: [
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

    console.log('[PostService.find] Executing findAll with options:', JSON.stringify({
      include: Array.isArray(options.include)
        ? options.include.map((inc: any) => ({
            model: inc.model?.name ?? inc.model,
            as: inc.as,
            attributes: inc.attributes,
          }))
        : options.include,
      order: options.order,
      limit: options.limit,
    }));

    let posts;
    try {
      posts = await this.post.findAll(options);
    } catch (error) {
      const err = error as Error & { name?: string; parent?: Error; sql?: string };
      console.error('[PostService.find] findAll query failed', {
        errorName: err.name,
        errorMessage: err.message,
        // Underlying DB driver error (e.g. ER_NO_SUCH_TABLE, ER_BAD_FIELD_ERROR)
        parentError: err.parent?.message,
        // Raw SQL Sequelize attempted to run
        sql: err.sql,
        stack: err.stack,
      });
      throw error;
    }

    console.log(`[PostService.find] Query succeeded — returned ${posts.length} post(s)`);

    // const hasMoreResults = totalCount > (Number(offset) + posts.length);
    return { posts };
   
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