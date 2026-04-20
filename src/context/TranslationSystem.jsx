import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { cn } from "src/lib/utils";
import { askAgiant } from "src/lib/ai-agiant";
// import { useLanguage as useLanguage2 } from "src/context/LanguageContext";

// ==============================
// Types
// ==============================

export const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

// ==============================
// Translation Utility
// ==============================

// In-memory cache for translations to reduce API calls
let translationCache = {};

// Load cache from localStorage on client side
if (typeof window !== "undefined") {
  try {
    const savedCache = localStorage.getItem("translationCache");
    if (savedCache) {
      translationCache = JSON.parse(savedCache);
    }
  } catch (error) {
    console.error("Failed to load translation cache:", error);
  }
}

// Save cache to localStorage
const saveCache = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "translationCache",
        JSON.stringify(translationCache),
      );
    } catch (error) {
      console.error("Failed to save translation cache:", error);
    }
  }
};

// Queue for pending translations
const translationQueue = [];

// Flag to track if the queue processor is running
let isProcessingQueue = false;

// Process the translation queue
const processQueue = async () => {
  if (isProcessingQueue || translationQueue.length === 0) return;

  isProcessingQueue = true;

  // Process up to 5 items at once (batch processing)
  const batchSize = 5;
  const batch = translationQueue.splice(0, batchSize);

  try {
    // Group by target language to reduce API calls
    const byLanguage = {};

    batch.forEach((item) => {
      if (!byLanguage[item.targetLanguage]) {
        byLanguage[item.targetLanguage] = {
          texts: [],
          resolvers: [],
          rejecters: [],
        };
      }

      byLanguage[item.targetLanguage].texts.push(item.text);
      byLanguage[item.targetLanguage].resolvers.push(item.resolve);
      byLanguage[item.targetLanguage].rejecters.push(item.reject);
    });

    // Process each language group
    await Promise.all(
      Object.entries(byLanguage).map(async ([language, group]) => {
        try {
          // If there's only one text, use single translation
          if (group.texts.length === 1) {
            const translatedText = await translateWithRetry(
              group.texts[0],
              language,
              3,
            );
            group.resolvers[0](translatedText);
          } else {
            // Otherwise use batch translation
            const translatedTexts = await batchTranslateWithRetry(
              group.texts,
              language,
              3,
            );
            translatedTexts.forEach((text, i) => group.resolvers[i](text));
          }
        } catch (error) {
          // If translation fails, reject all promises in this language group
          group.rejecters.forEach((reject) => reject(error));
        }
      }),
    );
  } catch (error) {
    console.error("Error processing translation queue:", error);
  } finally {
    isProcessingQueue = false;

    // If there are more items in the queue, process them after a short delay
    if (translationQueue.length > 0) {
      setTimeout(processQueue, 500);
    }
  }
};

// Function to translate with retry logic
const translateWithRetry = async (text, targetLanguage, maxRetries) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else.

Text to translate:
"${text}"`;

      const translatedText = await askAgiant(prompt);
      return translatedText.trim();
    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const waitTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      console.log(`Translation error, retrying in ${waitTime}ms:`, error);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      retries++;
    }
  }

  // If we get here, all retries failed
  throw new Error(`Failed to translate after ${maxRetries} retries`);
};

// Function to batch translate with retry logic
const batchTranslateWithRetry = async (texts, targetLanguage, maxRetries) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Validate input
      if (!Array.isArray(texts) || texts.length === 0) {
        return texts;
      }

      // Filter out empty texts
      const validTexts = texts.filter((text) => text && text.trim());

      if (validTexts.length === 0) {
        return texts;
      }

      // Build prompt for batch translation
      const prompt = `Translate the following texts to ${targetLanguage}.
Return the translations as a JSON array in the exact same order, with no additional text.

Texts to translate:
${JSON.stringify(validTexts)}`;

      const response = await askAgiant(prompt);

      // Parse the JSON array from the response
      let translatedTexts;
      try {
        // Strip any markdown code fences the model might add
        const clean = response.trim().replace(/^```[\s\S]*?\n|```$/g, "");
        translatedTexts = JSON.parse(clean);

        if (
          !Array.isArray(translatedTexts) ||
          translatedTexts.length !== validTexts.length
        ) {
          throw new Error("Invalid response format");
        }
      } catch (e) {
        console.error("Failed to parse batch translation response:", e);

        // Fallback: translate one by one
        translatedTexts = await Promise.all(
          validTexts.map(async (text) => {
            const singlePrompt = `Translate the following text to ${targetLanguage}. Only return the translated text, nothing else.

Text to translate:
"${text}"`;
            return (await askAgiant(singlePrompt)).trim();
          }),
        );
      }

      // Reconstruct the original array with translations
      const result_texts = [...texts];
      let validIndex = 0;

      for (let i = 0; i < texts.length; i++) {
        if (texts[i] && texts[i].trim()) {
          result_texts[i] = translatedTexts[validIndex++];
        }
      }

      return result_texts;
    } catch (error) {
      if (retries >= maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const waitTime = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      console.log(`Batch translation error, retrying in ${waitTime}ms:`, error);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      retries++;
    }
  }

  // If we get here, all retries failed
  throw new Error(`Failed to batch translate after ${maxRetries} retries`);
};

// Function to queue a translation request
const queueTranslation = (text, targetLanguage) => {
  return new Promise((resolve, reject) => {
    translationQueue.push({
      text,
      targetLanguage,
      resolve,
      reject,
      retries: 0,
    });

    // Start processing the queue if it's not already running
    if (!isProcessingQueue) {
      processQueue();
    }
  });
};

// ==============================
// Language Context
// ==============================

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();

  // Initialize language from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (language) => {
    setIsLoading(true);
    setCurrentLanguage(language);
    localStorage.setItem("preferredLanguage", language.code);

    // Force a refresh of the current page to apply translations
    // router.refresh();

    // Set a timeout to ensure the loading state is visible for a moment
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Function to translate text with caching
  const translateText = async (text) => {
    // Return original text if it's English or empty
    if (currentLanguage.code === "en" || !text || !text.trim()) {
      return text;
    }

    // Check if translation is in cache
    if (
      translationCache[currentLanguage.name] &&
      translationCache[currentLanguage.name][text]
    ) {
      return translationCache[currentLanguage.name][text];
    }

    try {
      // Queue the translation
      const translatedText = await queueTranslation(text, currentLanguage.name);

      // Cache the translation
      if (!translationCache[currentLanguage.name]) {
        translationCache[currentLanguage.name] = {};
      }
      translationCache[currentLanguage.name][text] = translatedText;

      // Save cache to localStorage
      saveCache();

      return translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  return (
    <LanguageContext.Provider
      value={{ currentLanguage, setLanguage, isLoading, translateText }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// ==============================
// Translatable Text Component
// ==============================

export function TranslatableText({ text, as: Component = "span", className }) {
  const { currentLanguage, isLoading, translateText } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    async function translate() {
      if (currentLanguage.code === "en") {
        setTranslatedText(text);
        return;
      }

      setIsTranslating(true);
      try {
        const result = await translateText(text);
        setTranslatedText(result);
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    }

    translate();
  }, [text, currentLanguage, translateText]);

  return (
    <Component className={className}>
      {isLoading || isTranslating ? (
        <span className="animate-pulse">{translatedText}</span>
      ) : (
        translatedText
      )}
    </Component>
  );
}

// ==============================
// Language Switcher Component
// ==============================

export function LanguageSwitcher({ children }) {
  const [open, setOpen] = React.useState(false);
  const { currentLanguage, setLanguage, isLoading } = useLanguage();
  // const { changeLanguage } = useLanguage2();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="px-2"
            disabled={isLoading}
          >
            {isLoading ? (
              "Translating..."
            ) : (
              <>
                <Globe className="h-4 w-4" />
                {currentLanguage.name}
              </>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={() => {
                    setLanguage(language);
                    setOpen(false);

                    // language.code === "en"
                    //   ? changeLanguage("en")
                    //   : language.code === "ar" && changeLanguage("ar");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentLanguage.code === language.code
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {language.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
