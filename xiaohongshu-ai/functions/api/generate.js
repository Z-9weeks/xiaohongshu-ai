export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { product, feature } = JSON.parse(event.body);

  if (!product) {
    return { statusCode: 400, body: JSON.stringify({ error: '请输入产品名' }) };
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          { role: 'system', content: '你是小红书爆款文案写手。只能使用用户提供的产品名和卖点信息，绝对不能自己编造细节。输出带emoji、口语化、有钩子的种草文案，300字以内。' },
          { role: 'user', content: `产品：${product}，卖点：${feature}` }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
      return { statusCode: 500, body: JSON.stringify({ error: data.error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result: data.choices[0].message.content })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: '网络请求失败' }) };
  }
};
