import axios from 'axios';

const exchangeApiUrl = 'http://localhost:8000/api/exchange-rates';

export const getExchangeRates = async () => {
    const response = await axios.get(exchangeApiUrl);
    return response.data;
};