import './App.css';
import { useState } from 'react';
import { sentiments } from './sentiments';
import { colors } from './colors';

function App() {
  const [inputText, setInputText] = useState('');

  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    const analysis = sentiments(inputText);
    setResult(analysis);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAnalyze();
    }
  };

  let resultColor = colors.neutral;
  if (result) {
    if (result.sentiment === 'Positive') {
      resultColor = colors.positive;
    } else if (result.sentiment === 'Negative') {
      resultColor = colors.negative;
    } else {
      resultColor = colors.neutral;
    }
  }

  return (
    <div className="App">
      <h1>Sentiment Checker And Words Count</h1>

      <div className="input-section">
        <label htmlFor="textInput">Enter your text:</label>
        <textarea
          id="textInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type something here..."
          rows="6"
        />
      </div>

      <button onClick={handleAnalyze} className="analyze-button">
        Analyze Sentiment
      </button>

      {result && (
        <div
          className="result-box"
          style={{ backgroundColor: resultColor }}
        >
          <h2>{result.sentiment}</h2>
          <p>Score: {result.score}</p>
          <div className="details">
            <span>Total words: {result.totalWords}</span>
            <span>Positive words: {result.positiveCount}</span>
            <span>Negative words: {result.negativeCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;