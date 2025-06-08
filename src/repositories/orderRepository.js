import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ORDERS_PATH = path.resolve('/tmp', 'orders.json'); // ✅ ganti path ke /tmp

const ensureFile = async () => {
  try {
    await readFile(ORDERS_PATH);
  } catch (_) {
    await writeFile(ORDERS_PATH, '[]');
  }
};

export const listOrders = async () => {
  await ensureFile();
  const data = await readFile(ORDERS_PATH, 'utf-8');
  return JSON.parse(data);
};

export const appendOrder = async (order) => {
  const orders = await listOrders();
  orders.push(order);
  await writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));
  return order;
};
