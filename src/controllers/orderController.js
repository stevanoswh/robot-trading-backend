import { listOrders } from '../repositories/orderRepository.js';

export const getOrders = async (_req, res, next) => {
  try {
    const orders = await listOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};