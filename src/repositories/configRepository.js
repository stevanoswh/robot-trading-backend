import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONFIG_PATH = path.resolve('src', 'config', 'defaultConfig.json');

export const getConfig = async () => {
  const data = await readFile(CONFIG_PATH, 'utf-8');
  return JSON.parse(data);
};

export const saveConfig = async (payload) => {
  await writeFile(CONFIG_PATH, JSON.stringify(payload, null, 2));
  return payload;
};