import Joi from 'joi';

const id = Joi.number().integer();
const name = Joi.string().min(5).max(15);
const email = Joi.string().email();
const password = Joi.string();
const description = Joi.string().min(10);
const role = Joi.string().min(5);

const social = Joi.object({
  facebook: Joi.string().min(15).max(50),
  twitter: Joi.string().min(15).max(50),
  instagram: Joi.string().min(15).max(50),
  github: Joi.string().min(15).max(50),
});
const image = Joi.string().regex(/.(jpg|jpeg|png|gif)$/);

const getUserSchema = Joi.object({ id: id.required() });

const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  description: description,
  role: role,
  social: social,
  image: image
}).options({ stripUnknown: true });

const createRestrictedUserSchema = Joi.object({
  name: createUserSchema.extract('name'),
  email: createUserSchema.extract('email'),
  password: createUserSchema.extract('password'),
  description: createUserSchema.extract('description'),
  social: createUserSchema.extract('social'),
  image: createUserSchema.extract('image'),
}).unknown(false);

const updateUserDataSchema = Joi.object({
  name: name,
  email: email,
  description: description,
  social: social,
  image: image
});

export { getUserSchema, createRestrictedUserSchema, updateUserDataSchema };
