// Lightweight BYO-key AI client. All keys live in localStorage on the user's device.
// We never proxy through any server — calls go straight from the browser to the
// chosen provider so the system stays local-first.

export type AiProviderId =
  | "openai"
  | "gemini"
  | "anthropic"
  | "deepseek"
  | "groq"
  | "xai";

export interface AiProvider {
  id: AiProviderId;
  name: string;
  defaultModel: string;
  webUrl: string;
  keyHint: string;
  accent: string; // tailwind gradient classes
  icon: string; // emoji or short label
}

export const AI_PROVIDERS: AiProvider[] = [
  {
    id: "openai",
    name: "ChatGPT",
    defaultModel: "gpt-4o-mini",
    webUrl: "https://chat.openai.com/",
    keyHint: "sk-...  •  platform.openai.com/api-keys",
    accent: "from-emerald-500 to-teal-500",
    icon: "✦",
  },
  {
    id: "gemini",
    name: "Gemini",
    defaultModel: "gemini-2.0-flash",
    webUrl: "https://gemini.google.com/",
    keyHint: "AIza...  •  aistudio.google.com/apikey",
    accent: "from-sky-500 to-indigo-500",
    icon: "✺",
  },
  {
    id: "anthropic",
    name: "Claude",
    defaultModel: "claude-3-5-sonnet-latest",
    webUrl: "https://claude.ai/",
    keyHint: "sk-ant-...  •  console.anthropic.com",
    accent: "from-orange-500 to-amber-500",
    icon: "✶",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    defaultModel: "deepseek-chat",
    webUrl: "https://chat.deepseek.com/",
    keyHint: "sk-...  •  platform.deepseek.com",
    accent: "from-blue-500 to-cyan-500",
    icon: "◈",
  },
  {
    id: "groq",
    name: "Groq",
    defaultModel: "llama-3.3-70b-versatile",
    webUrl: "https://groq.com/",
    keyHint: "gsk_...  •  console.groq.com/keys",
    accent: "from-rose-500 to-pink-500",
    icon: "⚡",
  },
  {
    id: "xai",
    name: "Grok",
    defaultModel: "grok-2-latest",
    webUrl: "https://grok.com/",
    keyHint: "xai-...  •  console.x.ai",
    accent: "from-zinc-700 to-zinc-900",
    icon: "𝕏",
  },
];

// Legacy plaintext storage from v1. We proactively wipe it on load so any
// previously-saved unencrypted keys don't linger in localStorage. New keys
// flow exclusively through the encrypted vault in `aiKeyVault.ts`.
const LEGACY_KEYS_STORAGE = "elephant.ai.keys.v1";
try {
  if (typeof localStorage !== "undefined" && localStorage.getItem(LEGACY_KEYS_STORAGE)) {
    localStorage.removeItem(LEGACY_KEYS_STORAGE);
  }
} catch {}


export const callAi = async (
  provider: AiProviderId,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<string> => {
  const p = AI_PROVIDERS.find((x) => x.id === provider)!;
  const model = p.defaultModel;

  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
      }),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  }

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data?.content?.[0]?.text ?? "";
  }

  // OpenAI-compatible providers: OpenAI, DeepSeek, Groq, xAI
  const endpoints: Record<string, string> = {
    openai: "https://api.openai.com/v1/chat/completions",
    deepseek: "https://api.deepseek.com/chat/completions",
    groq: "https://api.groq.com/openai/v1/chat/completions",
    xai: "https://api.x.ai/v1/chat/completions",
  };
  const res = await fetch(endpoints[provider], {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`${p.name} ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
};

// Try to extract JSON from a model response that may be wrapped in markdown fences.
export const extractJson = (text: string): any => {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced ? fenced[1] : text).trim();
  // Find first { or [
  const start = candidate.search(/[\[{]/);
  if (start < 0) throw new Error("No JSON found in response");
  const slice = candidate.slice(start);
  return JSON.parse(slice);
};
