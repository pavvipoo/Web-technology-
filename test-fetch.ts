async function test() {
  const key = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Status:", response.status);
    if (data.models) {
      console.log("Model Names:", data.models.map((m: any) => m.name));
    } else {
      console.log("Full Data:", JSON.stringify(data, null, 2));
    }
  } catch (e: any) {
    console.error("Fetch Error:", e.message);
  }
}

test();
