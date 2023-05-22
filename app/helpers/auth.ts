import bcrypt from 'bcrypt';

const auth = (verifyPassword: string, password: string): Promise<boolean> => {
  return bcrypt.compare(verifyPassword, password)
}

export { auth }