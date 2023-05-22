import jwt from 'jsonwebtoken';
import { config } from '../config';

const generateJWT = (id: string) => {
  
  return jwt.sign({id}, config.jwtSecret, {
    expiresIn: '7d'
  })
}

export { generateJWT };