import boom from "@hapi/boom";
import { sequelize } from "../../../libs/sequelize";

class ChatService {

  private chat;

  constructor () {
    this.chat = sequelize.models.Chat;
  }
  
  async find() {
    const userMessages = await this.chat.findAll({
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: { exclude: ['password', 'token', 'confirm', 'role', 'createAt', 'description', 'email', 'image'] },
        },
      ],
    })
    return userMessages;
  }

  async create({username, message, image, userId}) {

    const userExists = await sequelize.models.User.findByPk(userId);

    if ( userExists ) {
      const newMessage = await this.chat.create({username, message, image, userId});
      return newMessage
    } else {
      throw boom.notFound('Hubo error al crear mensaje');
    }
    
  }

  async update(data) {

  }

  async delete(id: number | string, authId: number | string, ) {

  }
}

export { ChatService };