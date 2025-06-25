const joi = require('@hapi/joi');


const loginValidtion = (data)=>{
  const schema = joi.object({
  id: joi.number().integer().min(7).required(true),
  password: joi.string().required(true).min(6)
  })
  return schema.validate(data);
}

module.exports = loginValidtion;