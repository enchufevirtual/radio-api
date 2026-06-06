import jwt from 'jsonwebtoken';
import { config } from '../config';

const generateJWT = (id: string | number) => {
  return jwt.sign({ id: String(id) }, config.jwtSecret, {
    expiresIn: '7d'
  });
}

export { generateJWT };