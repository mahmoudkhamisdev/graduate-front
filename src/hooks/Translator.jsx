import { askAgiant } from "src/lib/ai-agiant";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

async function translateTextBatch(texts, targetLang) {
  const prompt = `You are a translation engine. Translate the following sentences into ${targetLang}.
Return ONLY a JSON array of translated strings in the same order, with no extra text.

Sentences to translate:
${JSON.stringify(texts)}`;

  const responseContent = await askAgiant(prompt);

  // Try to parse as JSON array first
  try {
    const parsed = JSON.parse(responseContent);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {
    // fallback: split by newlines
  }

  const lines = responseContent.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((l) => l.replace(/^\d+\.\s*/, "").trim());
}

export default function Translator({ targetLang = "en", batchSize = 20 }) {
  const { pathname } = useLocation();
  const cache = useRef({});

  useEffect(() => {
    // hide body to prevent flash
    document.body.style.visibility = "hidden";

    const els = Array.from(
      document.querySelectorAll("body *:not(script):not(style)"),
    );
    const toTranslate = [];
    const mapping = [];

    els.forEach((el) => {
      const txt = el.innerText?.trim();
      if (!txt || el.dataset.translated) return;
      if (cache.current[txt]) {
        el.innerText = cache.current[txt];
        el.dataset.translated = "true";
      } else {
        toTranslate.push(txt);
        mapping.push(el);
      }
    });

    async function runBatches() {
      for (let i = 0; i < toTranslate.length; i += batchSize) {
        const batch = toTranslate.slice(i, i + batchSize);
        try {
          const translated = await translateTextBatch(batch, targetLang);
          translated.forEach((t, idx) => {
            const original = batch[idx];
            const el = mapping[i + idx];
            el.innerText = t;
            el.dataset.translated = "true";
            cache.current[original] = t;
          });
        } catch (err) {
          console.error("Batch translation failed", err);
        }
      }
      // reveal page
      document.body.style.visibility = "visible";
    }

    runBatches();
  }, [pathname, targetLang, batchSize]);

  return null;
}
