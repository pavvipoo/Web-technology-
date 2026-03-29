async function test() {
  const key = "AIzaSyChzpzyO13IlkAry175RIyf7cdDdltb0v8";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Status:", response.status);
    if (data.models) {
      console.log("Model Names:", data.models.map(m => m.name));
    } else {
      console.log("Full Data:", JSON.stringify(data, null, 2));
    }
  } catch (e) {
    console.error("Fetch Error:", e.message);
  }
}

test();
