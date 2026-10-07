import Joi from "joi";
import { Request, ResponseToolkit } from "@hapi/hapi";

const itemSchema = Joi.object({
  name: Joi.string().required().min(1).messages({
    "any.required": 'Field "name" is required',
    "string.empty": 'Field "name" cannot be an empty string',
    "string.base": 'Field "name" must be a string',
  }),
  price: Joi.number().required().min(0).messages({
    "any.required": 'Field "price" is required',
    "number.base": 'Field "price" must be a number',
    "number.min": 'Field "price" cannot be negative',
  }),
});

export const itemIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const validateItem = (
  request: Request,
  h: ResponseToolkit,
  schema: Joi.ObjectSchema
) => {
  const { error } = schema.validate(request.payload, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context?.key,
      message: detail.message,
    }));

    return h.response({ errors }).code(400).takeover();
  }

  return h.continue;
};

export const validateCreateItem = (request: Request, h: ResponseToolkit) => {
  return validateItem(request, h, itemSchema);
};

export const validateUpdateItem = (request: Request, h: ResponseToolkit) => {
  return validateItem(request, h, itemSchema);
};

export const validateItemId = (request: Request, h: ResponseToolkit) => {
  const { error } = itemIdSchema.validate(request.params, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.context?.key,
      message: detail.message,
    }));

    return h.response({ errors }).code(400).takeover();
  }

  return h.continue;
};
