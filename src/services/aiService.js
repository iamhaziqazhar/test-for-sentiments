// AI Service - Handles all 4 AI API calls

export async function callAIAPI(apiType, message, apiKey) {
  try {
    let response;

    switch (apiType) {
      case 'openai':
        response = await callOpenAI(message, apiKey);
        break;
      case 'anthropic':
        response = await callAnthropic(message, apiKey);
        break;
      case 'deepseek':
        response = await callDeepseek(message, apiKey);
        break;
      case 'grok':
        response = await callGrok(message, apiKey);
        break;
      default:
        throw new Error('Unknown API type');
    }

    // Track API usage
    trackAPIUsage(apiType, response);

    return response;
  } catch (error) {
    throw new Error(`${apiType} API error: ${error.message}`);
  }
}

async function callOpenAI(message, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(message, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callDeepseek(message, apiKey) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`Deepseek API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGrok(message, apiKey) {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function trackAPIUsage(apiType, response) {
  const stats = JSON.parse(localStorage.getItem('apiStats')) || {
    openai: { calls: 0, tokens: 0 },
    anthropic: { calls: 0, tokens: 0 },
    deepseek: { calls: 0, tokens: 0 },
    grok: { calls: 0, tokens: 0 },
  };

  stats[apiType].calls += 1;
  // Rough token count (estimate based on response length)
  stats[apiType].tokens += Math.ceil(response.length / 4);

  localStorage.setItem('apiStats', JSON.stringify(stats));
}

export function getAPIStats() {
  return JSON.parse(localStorage.getItem('apiStats')) || {
    openai: { calls: 0, tokens: 0 },
    anthropic: { calls: 0, tokens: 0 },
    deepseek: { calls: 0, tokens: 0 },
    grok: { calls: 0, tokens: 0 },
  };
}