export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const body = await request.json();
    const { product, feature } = body;
    
    if (!product) {
      return new Response(JSON.stringify({ error: '请输入产品名' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 注意这里：必须用 env.，不能用 process.env.
        'Authorization': `Bearer ${env.SILICONFLOW_API_KEY}`
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
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ result: data.choices[0].message.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: '网络请求失败或解析错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
