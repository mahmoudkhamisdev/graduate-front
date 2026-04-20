import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

async function run() {
  const prompt = `
Create a presentation based on this plan:
TEST PLAN

Generate more than 15 slides using the provided templates and structure.
Use these templates: [{"id": "t1", "name": "foo"}]

IMPORTANT: Return ONLY a valid JSON array of slide objects with unique IDs like { id: "slide-1", title: "Title", content: "..." }
`;

  try {
    const response = await openai.chat.completions.create({
      model: "liquid/lfm-2.5-1.2b-instruct:free",
      messages: [{ role: "user", content: prompt }],
    });
    console.log("RESPONSE FROM AI:\n", response.choices[0].message.content);
  } catch(e) {
    console.error("AI EXT ERROR:", e.message);
  }
}
run();
