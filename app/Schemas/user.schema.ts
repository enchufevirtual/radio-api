import Joi from 'joi';

const username = Joi.string().min(3).max(15);
const name = Joi.string().min(3).max(30);
const email = Joi.string().email();
const password = Joi.string();
const description = Joi.string().min(10);

const social = Joi.object({
  facebook: Joi.string().min(15).max(50),
  twitter: Joi.string().min(15).max(50),
  instagram: Joi.string().min(15).max(50),
  github: Joi.string().min(15).max(50),
});
const image = Joi.string().regex(/.(jpg|jpeg|png|gif)$/);

const getUserSchema = Joi.object({ username: Joi.string() });

const createUserSchema = Joi.object({
  username: username.required(),
  name: name.optional(),
  email: email.required(),
  password: password.required(),
  image: image.optional().allow('', null)
});

const updateUserDataSchema = Joi.object({
  name: name,
  email: email,
  description: description,
  social: social,
  image: image
});

export { getUserSchema, createUserSchema, updateUserDataSchema };
