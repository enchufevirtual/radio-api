import boom from "@hapi/boom";
import { sequelize } from "../../../libs/sequelize";
import { SocialService} from '../../social/social.service';
import { hashPassword } from "../../../helpers/hashPassword";
import { generateId } from "../../../helpers/generateId";
import { Status } from "./types";
import { auth } from "../../../helpers/auth";
import { resetPassword } from "../../../helpers/resetPassword";
import { emailRegister } from "../../../helpers/emailRegister";
import { UpdateData } from "../../../../types/types";
import { getExistingImages } from "../../../helpers/getExistingImages";
import { arrayFiles } from "../../../helpers/arrayFiles";

const socialService = new SocialService();

interface NewPasswordTypes {
  id: number
  password: string,
  new_password: string
}

class UserService {

  private user;

  constructor () {
    this.user = sequelize.models.User;
  }
  
  async find() {
    const users = await this.user.findAll({
      include: ['social']
    })
    return users;
  }

  async findById(id: number | string) {
    const user = await this.user.findByPk(id, {
      // attributes: { exclude: ['password', 'confirm', 'token'] },
      include: ['social']
    });
    if (!user) {
      throw boom.notFound('User Not Found');
    }
    return user;
  }

  async findOneProperty(property: Record<string, string | number>) {
    const propertyFound = await this.user.findOne({ where: property, include: ['social'] });
    return propertyFound || null;
  }
  async findUser(username: string | number) {
    const strUsername = String(username);

    if (!isNaN(Number(strUsername))) {
      const user = await this.findById(Number(strUsername));
      if (user) {
        const existingImages = await getExistingImages() as string[];
        if (!existingImages.includes(user.image)) {
          user.image = '';
        }
        return user;
      }  
    }
    
    const user = await this.findOneProperty({ username: strUsername });
    if (user) {
      const existingImages = await getExistingImages() as string[];
      if (!existingImages.includes(user.image)) {
        user.image = '';
      }
      return user;
    }  
  
    throw boom.notFound('User Not Found');
  }

  async confirm(token: string) {
    try {
      const userConfirm = await this.findOneProperty({token});
      userConfirm.token = null;
      userConfirm.confirm = true;
      await userConfirm.save()
    } catch (error) {
      throw boom.notFound('Este token no es válido');
    }
  }

  async authenticate(email: string, password: string ) {
    // User Exists
    const userExists = await this.findOneProperty({email});
    // User it's not exists
    if (!userExists) {
      throw boom.notFound('Esta cuenta no existe');
    }
    // User is confirmed
    if (userExists.confirm == Status.PENDING) {
      throw boom.notFound('Tu cuenta no ha sido confirmada');
    }
    // Check Password
    if (await auth(password, userExists.password)) {
      // Authenticate
      return userExists;
    } else {
      throw boom.notFound('Lo siento, la contraseña que ha ingresado no es correcta.');
    }
  }

  async forgetPassword(verifyEmail: string) {
    const user = await this.findOneProperty({email: verifyEmail});
    
    if (!user) throw boom.notFound('Este usuario no existe');
    user.token = generateId();
    await user.save();

    const { name, email, token } = user;
    // send email to reset password
    resetPassword({name, email, token})
  }
  async checkToken(token: string) {
    const existsToken = await this.findOneProperty({token});
    if (!existsToken) throw boom.notFound('Este Token no es válido');
  }

  async newPassword(token: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const user = await this.findOneProperty({token});
    user.token = null;
    user.password = hashedPassword;
    await user.save();
  }

  async create({username, email, password, image}) {
    const hashedPassword = await hashPassword(password);
    const userExists = await this.findOneProperty({email});
    const userNameExists = await this.findOneProperty({username});

    if (userNameExists) throw boom.conflict(`${username} ya está registrado`);
    if (userExists) throw boom.conflict('Este correo ya está registrado');
    const newUser = await this.user.create({
      name: username,
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
      token: generateId(),
      image: image ? image.filename : null
    }, {
      include: ['social']
    })
    const { token } = newUser;
    // verify email account
    emailRegister({name: username, email, token})
    return newUser;
  }

  async update(data: UpdateData) {

    let imageFile = '';
    if (data.file) {
      const { image } = arrayFiles(data.file)
      imageFile = image;
    }
    const user = await this.findById(data.id);

    if (Number(user.id) !== Number(data.authId)) {
      throw boom.notFound('Esta acción no está permitida');
    }
    if (data.email && user.email !== data.email) {
      const userExists = await this.findOneProperty({email: data.email});
      if (userExists) throw boom.conflict('Este correo ya está registrado');
    }
 
    const userData = {
      name: data.name,
      email: data.email,
      description: data.description,
      social: JSON.parse(data.social)
    };

    if (data.username && user.username !== data.username) {
      const username = await this.findOneProperty({username: data.username});
      if (!username) {
        userData['username'] = data.username
      } else {
        userData['username'] = username
        throw boom.conflict('Este nombre de usuario no está disponible.');
      }
    }

    if (!imageFile) {
      const existingImages = await getExistingImages() as string[];
      if (!existingImages.includes(user.image)) {
        imageFile = '';
      } else {
        imageFile = user.image // Keep the user's existing image
      }
    } else {
      const existingImages = await getExistingImages() as string[];
      if (!existingImages.includes(imageFile)) {
        imageFile = '';
      }
    }  
    userData['image'] = imageFile;
   
    const rta = await user.update(userData);
    if (data.social) {
      await socialService.update(Number(data.id), JSON.parse(data.social));
    }
    return rta;
  }

  async updatePassword(data: NewPasswordTypes) {
    
    const hashedPassword = await hashPassword(data.new_password);

    const { id, password } = data;

    const userExists = await this.findById(id);
    if (!userExists) throw boom.conflict('Hubo un error');

    const existsPassword = this.findOneProperty({password});
    if (!existsPassword) throw boom.conflict('El password actual es incorrecto');

     // Check Password
     if (await auth(password, userExists.password)) {
      // Authenticate
      userExists.password = hashedPassword;
      userExists.save();
    } else {
      throw boom.notFound('Lo siento, la contraseña que ha ingresado no es correcta.');
    }
  }

  async delete(id: number | string, authId: number | string, ) {
    const user = await this.findById(id);

    if (user.id != authId) {
      throw boom.notFound('Esta acción no está permitida');
    }
    await user.destroy();
    return { id };
  }

}

export { UserService };