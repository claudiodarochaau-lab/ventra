export async function onRequest(context) {
  return new Response(JSON.stringify({ response: "hello world" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
