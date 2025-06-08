import { getConfig } from '../repositories/configRepository.js';
import { signalSchema } from '../utils/validation.js';
import { evaluateSignal } from '../services/strategyService.js';
import { getLatestPrice } from '../services/binanceService.js';
import { appendOrder } from '../repositories/orderRepository.js';
import { calcTakeProfit, calcStopLoss } from '../utils/calculator.js';

export const handleWebhook = async (req, res, next) => {
  try {
    const { error, value: signal } = signalSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const cfg = await getConfig();

    const action = evaluateSignal(signal, cfg);
    if (!action) return res.status(200).json({ message: 'Signal ignored – conditions not met' });

    const entryPrice = await getLatestPrice(signal.symbol);

    const tp = calcTakeProfit(entryPrice, cfg.takeProfitPercent);
    const sl = calcStopLoss(entryPrice, cfg.stopLossPercent);

    const order = {
      symbol: signal.symbol,
      action,
      price_entry: entryPrice.toFixed(2),
      tp_price: tp.toFixed(2),
      sl_price: sl.toFixed(2),
      leverage: `${cfg.leverage}x`,
      timeframe: signal.timeframe,
      timestamp: new Date().toISOString()
    };

    await appendOrder(order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};