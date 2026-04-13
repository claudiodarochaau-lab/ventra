export async function onRequest(context) {
  const { env } = context;
  
  const hasKey = !!env.ANTHROPIC_API_KEY;
  const keyPrefix = env.ANTHROPIC_API_KEY ? env.ANTHROPIC_API_KEY.substring(0, 10) : "missing";
  
  return new Response(JSON.stringify({ 
    hasKey,
    keyPrefix,
    message: "API key check"
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
