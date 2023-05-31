import boom from "@hapi/boom";
import { sequelize } from "../../../libs/sequelize";
import { getExistingImages } from "../../../helpers/getExistingImages";

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
          attributes: { exclude: ['password', 'token', 'confirm', 'role', 'createAt', 'description', 'email'] },
        },
      ],
    });
    try {
      const existingImages = await getExistingImages() as string[];
      for (const message of userMessages) {
        if (!existingImages.includes(message.user.image)) {
          message.user.image = null;
        }
      }
      return userMessages;
    } catch (err) {
      throw boom.badImplementation('Error al obtener las imágenes existentes');
    }
  }
  async create({message, userId}) {

    const userExists = await sequelize.models.User.findByPk(userId);

    if ( userExists ) {
      const newMessage = await this.chat.create({message, userId});
      return newMessage
    } else {
      throw boom.notFound('Hubo error al crear mensaje');
    }
    
  }

  async update() {

  }

  async delete() {

  }
}

export { ChatService };