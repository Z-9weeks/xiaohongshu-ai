export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, feature } = req.body;

  if (!product) {
    return res.status(400).json({ error: '请输入产品名' });
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Key 从环境变量读取，不在代码里暴露
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3',
        messages: [
          { role: 'system', content: '你是小红书爆款文案写手，输出带emoji、口语化、有钩子的种草文案，300字以内。' },
          { role: 'user', content: `产品：${product}，卖点：${feature}` }
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ 
      result: data.choices[0].message.content 
    });

  } catch (err) {
    return res.status(500).json({ error: '网络请求失败' });
  }
}