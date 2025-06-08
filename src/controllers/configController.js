import { getConfig, saveConfig } from '../repositories/configRepository.js';
import { configSchema } from '../utils/validation.js';

export const postConfig = async (req, res, next) => {
  try {
    const { error, value } = configSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const payload = await saveConfig(value);
    res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
};

export const getConfigHandler = async (_req, res, next) => {
  try {
    const cfg = await getConfig();
    res.json(cfg);
  } catch (err) {
    next(err);
  }
};