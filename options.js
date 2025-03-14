// options.js

document.addEventListener("DOMContentLoaded", () => {
    const defaultMode = document.getElementById("defaultMode");
    const defaultLanguage = document.getElementById("defaultLanguage");
    const saveOptionsBtn = document.getElementById("saveOptionsBtn");
  
    // Load existing preferences
    chrome.storage.sync.get(["defaultMode", "defaultLanguage"], (result) => {
      if (result.defaultMode) {
        defaultMode.value = result.defaultMode;
      }
      if (result.defaultLanguage) {
        defaultLanguage.value = result.defaultLanguage;
      }
    });
  
    // Save user preferences
    saveOptionsBtn.addEventListener("click", () => {
      chrome.storage.sync.set({
        defaultMode: defaultMode.value,
        defaultLanguage: defaultLanguage.value
      }, () => {
        alert("Options saved!");
      });
    });
  });
  