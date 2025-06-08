export const evaluateSignal = (signal, config) => {
  const isBuy =
    signal.plusDI > config.plusDIThreshold &&
    signal.minusDI < config.minusDIThreshold &&
    signal.adx > config.adxMinimum;
  const isSell =
    signal.plusDI < config.minusDIThreshold &&
    signal.minusDI > config.plusDIThreshold &&
    signal.adx > config.adxMinimum;

  if (isBuy) return 'BUY';
  if (isSell) return 'SELL';
  return null; // ignore
};