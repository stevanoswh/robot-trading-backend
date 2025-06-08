import axios from 'axios';

const BASE_URL = process.env.BINANCE_TESTNET_URL || 'https://testnet.binance.vision';

export const getLatestPrice = async (symbol) => {
  const { data } = await axios.get(`${BASE_URL}/api/v3/ticker/price`, {
    params: { symbol }
  });
  return parseFloat(data.price);
};