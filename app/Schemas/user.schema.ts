import Joi from 'joi';

const id = Joi.number().integer();
const name = Joi.string().min(5).max(15);
const email = Joi.string().email();
const password = Joi.string();
const description = Joi.string().min(10);
const role = Joi.string().min(5);

const socialMedia = Joi.object({
  facebook: Joi.string().min(15).max(50),
  twitter: Joi.string().min(15).max(50),
  instagram: Joi.string().min(15).max(50),
  github: Joi.string().min(15).max(50),
});
const image = Joi.string().uri();

const getUserSchema = Joi.object({ id: id.required() });

const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  description: description,
  role: role,
  socialMedia: socialMedia,
  image: image
});
const updateUserDataSchema = Joi.object({
  email: email,
  role: role
});

export { getUserSchema, createUserSchema, updateUserDataSchema };
