import Joi from 'joi';

export const configSchema = Joi.object({
  symbol: Joi.string().required(),
  timeframe: Joi.string().required(),
  plusDIThreshold: Joi.number().positive().required(),
  minusDIThreshold: Joi.number().positive().required(),
  adxMinimum: Joi.number().positive().required(),
  takeProfitPercent: Joi.number().positive().required(),
  stopLossPercent: Joi.number().positive().required(),
  leverage: Joi.number().positive().required()
});

export const signalSchema = Joi.object({
  symbol: Joi.string().required(),
  plusDI: Joi.number().required(),
  minusDI: Joi.number().required(),
  adx: Joi.number().required(),
  timeframe: Joi.string().required()
});