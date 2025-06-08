export const calcTakeProfit = (entry, percent) => entry * (1 + percent / 100);
export const calcStopLoss = (entry, percent) => entry * (1 - percent / 100);