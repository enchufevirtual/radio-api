import Joi from 'joi';

const email = Joi.string().email();
const role = Joi.string().min(5);

const updateDataAdminSchema = Joi.object({
  email: email,
  role: role
});

export { updateDataAdminSchema };

