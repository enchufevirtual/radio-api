import Joi from 'joi';

const username = Joi.string().min(5).max(15);
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

const getUserSchema = Joi.object({ username: Joi.string() });

const createUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  password: password.required(),
  repetir_password: Joi.string().valid(Joi.ref('password')).messages({
    'any.only': 'Las contraseñas no coinciden'
  }),
  description: description.optional(),
  role: role.optional(),
  image: image.optional()
});

const updateUserDataSchema = Joi.object({
  name: Joi.string().min(5).max(15),
  email: email,
  description: description,
  social: social,
  image: image
});

export { getUserSchema, createUserSchema, updateUserDataSchema };
