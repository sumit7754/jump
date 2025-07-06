import { useState, useEffect } from 'react';

function App() {
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [conversion, setConversion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // To show result to user

  const currencies = ['EUR', 'INR', 'JPY', 'GBP', 'CAD', 'AUD', 'CNY'];

  useEffect(() => {
    fetchConversionHistory();
  }, []);

  const fetchConversionHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/conversions');
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setConversion(data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch history");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const ratesData = await res.json();
      const rate = ratesData.rates[targetCurrency];
      const result = Number(amount) * rate;
      setResult(result);

      const conversionData = {
        amount: Number(amount),
        targetCurrency,
        result,
        timeStamp: new Date().toISOString()
      };

      await fetch('http://localhost:5000/api/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversionData)
      });

      fetchConversionHistory();
      setLoading(false);
    } catch (error) {
      setError("Conversion failed");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Currency Converter</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Amount in USD"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={targetCurrency}
          onChange={(e) => setTargetCurrency(e.target.value)}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <button type="submit">Convert</button>
      </form>

      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {result && <div>Converted Amount: {result.toFixed(2)} {targetCurrency}</div>}
       {console.log(conversion)}
      <h2>Conversion History</h2>
      <ul>
        {conversion.map((item, index) => (
          <li key={index}>
            {item.amount} USD ➡️ {item.result} {item.targetCurrency} on {item.timeStamp}
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
