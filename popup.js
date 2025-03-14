// Ensure the popup script only runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Popup loaded"); // Debugging step

  const summarizeBtn = document.getElementById("summarizeBtn");
  const summaryModeSelect = document.getElementById("summaryMode");
  const languageSelect = document.getElementById("languageSelect");
  const resultContainer = document.getElementById("resultContainer");
  const loadingIndicator = document.createElement("div");
  
  loadingIndicator.id = "loadingIndicator";
  loadingIndicator.innerText = "Generating summary...";
  loadingIndicator.style.display = "none";
  resultContainer.parentNode.insertBefore(loadingIndicator, resultContainer);

  // Ensure all elements exist before proceeding
  if (!summarizeBtn || !summaryModeSelect || !languageSelect || !resultContainer) {
    console.error("Popup: One or more elements not found.");
    return;
  }

  // Load default settings from storage
  try {
    const result = await chrome.storage.sync.get(["defaultMode", "defaultLanguage"]);
    if (result.defaultMode) {
      summaryModeSelect.value = result.defaultMode;
    }
    if (result.defaultLanguage) {
      languageSelect.value = result.defaultLanguage;
    }
  } catch (error) {
    console.error("Failed to load default settings:", error);
  }

  summarizeBtn.addEventListener("click", async () => {
    console.log("Summarize button clicked"); // Debugging step
    
    // Show loading indicator
    loadingIndicator.style.display = "block";
    resultContainer.innerText = "";
    summarizeBtn.disabled = true;

    try {
      // Get the currently active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        console.error("Popup: No active tab found.");
        resultContainer.innerText = "Error: No active tab.";
        loadingIndicator.style.display = "none";
        summarizeBtn.disabled = false;
        return;
      }

      try {
        // Try to inject the content script programmatically
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content_script.js"]
        });
        console.log("Content script injected successfully");
      } catch (injectionError) {
        console.log("Content script may already be loaded or couldn't be injected:", injectionError);
      }

      console.log("Popup: Sending request to extract page text..."); // Debugging step

      setTimeout(async () => {
        try {
          const extracted = await chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_PAGE_TEXT" });

          if (!extracted || !extracted.text) {
            console.error("Popup: Text extraction failed.");
            resultContainer.innerText = "Could not extract text. Make sure you're on a webpage.";
            loadingIndicator.style.display = "none";
            summarizeBtn.disabled = false;
            return;
          }

          const pageText = extracted.text;
          const summaryMode = summaryModeSelect.value;
          const language = languageSelect.value;

          console.log("Popup: Sending request to background.js for summarization...");

          chrome.runtime.sendMessage(
            {
              type: "SUMMARIZE_PAGE",
              payload: pageText,
              mode: summaryMode,
              language: language
            },
            (response) => {
              loadingIndicator.style.display = "none";
              summarizeBtn.disabled = false;
              
              if (chrome.runtime.lastError) {
                console.error("Popup: Error in runtime.sendMessage", chrome.runtime.lastError);
                resultContainer.innerText = "Failed to communicate with background script.";
                return;
              }

              if (response && response.success) {
                resultContainer.innerText = response.summary;
              } else {
                console.error("Popup: Summarization failed", response);
                resultContainer.innerText = "Failed to generate summary.";
              }
            }
          );
        } catch (messageError) {
          console.error("Error sending message to content script:", messageError);
          loadingIndicator.style.display = "none";
          summarizeBtn.disabled = false;
          resultContainer.innerText = "Failed to communicate with the page. Try refreshing the page.";
        }
      }, 500);
    } catch (error) {
      loadingIndicator.style.display = "none";
      summarizeBtn.disabled = false;
      
      console.error("Popup: Unexpected error", error);
      resultContainer.innerText = "An error occurred: " + error.message;
    }
  });
});