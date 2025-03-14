console.log("AI Summarizer content script loaded");

window.aiSummarizerLoaded = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request.type);
  
  if (request.type === "EXTRACT_PAGE_TEXT") {
    console.log("Content script: Extracting page text...");
    
    let pageText = "";
    
    const articleElements = document.querySelectorAll('article, [role="article"], .article, .post, .content');
    if (articleElements.length > 0) {
      pageText = articleElements[0].innerText;
    } else {
      const mainElement = document.querySelector('main, #main, .main');
      if (mainElement) {
        pageText = mainElement.innerText;
      } else {
        const body = document.body;
        const excludeSelectors = 'nav, header, footer, aside, .sidebar, .menu, .navigation, .ad, .advertisement';
        const excludeElements = document.querySelectorAll(excludeSelectors);
        
        const bodyClone = body.cloneNode(true);
        
        excludeElements.forEach(el => {
          const matchingElements = bodyClone.querySelectorAll(el.tagName + (el.className ? '.' + el.className.replace(/ /g, '.') : ''));
          matchingElements.forEach(match => {
            if (match.parentNode) {
              match.parentNode.removeChild(match);
            }
          });
        });
        
        pageText = bodyClone.innerText;
      }
    }
    
    // Trim and clean up the text
    pageText = pageText.trim().replace(/\s+/g, ' ');
    
    const maxChars = 10000;
    if (pageText.length > maxChars) {
      pageText = pageText.substring(0, maxChars) + "...";
    }
    
    console.log("Content script: Text extracted successfully, length:", pageText.length);
    sendResponse({ text: pageText });
    return true; // Keep the message channel open
  }

  if (request.type === "SHOW_SUMMARY") {
    const { summary } = request;
    
    console.log("Received summary:", summary);
    showSummaryOverlay(summary);
    return true;
  }
});

/**
 * Creates a simple overlay to display the summary.
 */
function showSummaryOverlay(summary) {
  // Remove any existing overlay
  const existingOverlay = document.getElementById('ai-summarizer-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }

  const overlay = document.createElement("div");
  overlay.id = 'ai-summarizer-overlay';
  overlay.style.position = "fixed";
  overlay.style.top = "10px";
  overlay.style.right = "10px";
  overlay.style.padding = "15px";
  overlay.style.backgroundColor = "white";
  overlay.style.border = "2px solid #4285f4";
  overlay.style.borderRadius = "8px";
  overlay.style.zIndex = 999999;
  overlay.style.maxWidth = "350px";
  overlay.style.maxHeight = "80vh";
  overlay.style.overflow = "auto";
  overlay.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  overlay.style.fontSize = "14px";
  overlay.style.lineHeight = "1.4";

  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.innerText = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.border = "none";
  closeButton.style.background = "none";
  closeButton.style.fontSize = "18px";
  closeButton.style.cursor = "pointer";
  closeButton.style.color = "#666";
  closeButton.onclick = () => overlay.remove();
  
  // Add title
  const title = document.createElement("h3");
  title.innerText = "AI Summary";
  title.style.margin = "0 0 10px 0";
  title.style.color = "#4285f4";
  
  // Add content
  const content = document.createElement("div");
  content.innerText = summary;
  
  overlay.appendChild(closeButton);
  overlay.appendChild(title);
  overlay.appendChild(content);
  document.body.appendChild(overlay);
}

// Announce that the content script is ready
console.log("AI Summarizer content script ready to receive messages");