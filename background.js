// background.js
console.log("Background service worker started");

import CONFIG from "./config.js";

const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

async function summarizeWithGemini(text, mode = "paragraph", language = "en") {
  try {
    console.log(`Summarizing text (${text.length} chars) in ${mode} mode, language: ${language}`);
    
    let prompt = `Summarize the following text in ${mode} format, in ${language} language. Keep it concise and informative: \n\n${text}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40
        }
      })
    });

    const data = await response.json();
    console.log("API response:", data);
    
    if (data && data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API returned unexpected format:", data);
      if (data.error) {
        return `Error: ${data.error.message || "API error"}`;
      }
      return "Error: Unable to generate summary.";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Gemini API request failed: " + error.message;
  }
}

// Handle summary requests from popup or context menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received message:", request.type);
  
  if (request.type === "SUMMARIZE_PAGE") {
    summarizeWithGemini(request.payload, request.mode, request.language)
      .then(summary => {
        console.log("Summary generated successfully");
        sendResponse({ success: true, summary });
      })
      .catch(error => {
        console.error("Summarization error:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true; 
  }
  return false;
});

console.log("Background service worker initialized");