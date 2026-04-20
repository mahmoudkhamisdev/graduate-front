import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function askAgiant(question) {
  const response = await openai.chat.completions.create({
    model: "liquid/lfm-2.5-1.2b-instruct:free",
    messages: [{ role: "user", content: question }],
  });
  return response.choices[0].message.content;
}

export async function askAgiantWithMessages(messages) {
  const response = await openai.chat.completions.create({
    model: "liquid/lfm-2.5-1.2b-instruct:free",
    messages,
  });
  return response.choices[0].message.content;
}
