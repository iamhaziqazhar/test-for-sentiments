import { positiveFeel } from './positiveFeel';
import { negativeFeel } from './negativeFeel';

export function sentiments(text) {
  if (!text || text.trim() === '') {
    return {
      sentiment: 'Neutral',
      score: 0,
      positiveCount: 0,
      negativeCount: 0,
      totalWords: 0
    };
  }
  const lowerText = text.toLowerCase();
  const cleanText = lowerText.replace(/[.,!?;:'"]/g, '');
  const words = cleanText.split(' ');
  const filteredWords = words.filter(word => word.length > 0);
  const totalWords = filteredWords.length;
  let positiveCount = 0;
  let negativeCount = 0;
  for (let i = 0; i < filteredWords.length; i++) {
    const word = filteredWords[i];
    if (positiveFeel.includes(word)) {
      positiveCount = positiveCount + 1;
    }    if (negativeFeel.includes(word)) {
      negativeCount = negativeCount + 1;
    }
  }  const score = positiveCount - negativeCount;
  let sentiment = 'Neutral';
  if (score > 0) {
    sentiment = 'Positive';
  } else if (score < 0) {
    sentiment = 'Negative';
  }

  return {
    sentiment: sentiment,
    score: score,
    positiveCount: positiveCount,
    negativeCount: negativeCount,
    totalWords: totalWords
  };
}