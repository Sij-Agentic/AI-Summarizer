
```md
# 📝 AI-Powered Quick Summarizer - Chrome Extension 🚀

The **AI-Powered Quick Summarizer** is a Chrome extension that provides instant **AI-generated summaries** of web pages using **Google Gemini AI**. It helps users quickly grasp key information by summarizing content in **bullet points, paragraphs, or tweet-sized summaries**.

---
![Image](https://github.com/user-attachments/assets/ad10c75a-dab4-4ce0-bca5-f709123cf095)

## 🎯 Features

✅ **Instant AI Summarization**
   - 🔹 Bullet Points Mode  
   - 🔹 Paragraph Mode  
   - 🔹 Tweet Mode (280 characters)

✅ **Customizable Summary Length**
   - 🔹 Short (~50 words)  
   - 🔹 Medium (~100 words)  
   - 🔹 Long (~250 words)  

✅ **Multi-Language Support**
   - Summarize content in different languages (English, French, German, etc.)

✅ **Topic Tagging & Categorization**
   - Automatically detects the main topic (e.g., Technology, Science, Business)

✅ **Interactive UI**
   - 🌟 Right-click to "Summarize This Section"
   - 🌟 Hover over links to preview summaries
   - 📋 Copy summary to clipboard
   - 📥 Download summary as `.txt` or `.md` file

---

## 🛠 Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/ai-quick-summarizer.git
cd ai-quick-summarizer
```

### **2️⃣ Setup Your API Key**
- Open the project folder and **copy `config.example.js` to `config.js`**:
```sh
cp config.example.js config.js
```
- Open `config.js` and **replace `"your-api-key-here"`** with your Google Gemini API key:
```js
const CONFIG = {
  GEMINI_API_KEY: "your-api-key-here"
};
export default CONFIG;
```

### **3️⃣ Load the Extension in Chrome**
1. Open `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top right corner)
3. Click **Load Unpacked**
4. Select the **project folder (`ai-quick-summarizer/`)**
5. Click **Open** – the extension is now installed!

---

## 🖥 Usage Instructions

### **🔹 Method 1: Using the Popup**
1. Click on the **extension icon** in Chrome.
2. Choose a **summary mode** (Bullet, Paragraph, or Tweet).
3. Select a **language** (English, French, etc.).
4. Click **"Summarize Current Page"**.
5. The summary will appear inside the popup.

### **🔹 Method 2: Right-Click to Summarize Selected Text**
1. Highlight any text on a webpage.
2. Right-click → Select **"Summarize This Section"**.
3. The AI will generate a summary for the selected text.

### **🔹 Method 3: Hover Over Links for Summaries**
1. Hover over a link before clicking.
2. The extension will show a **preview summary** of the page.
3. Decide if you want to visit the page.

---

---

## 📂 Project Structure
```
ai-quick-summarizer/
│── manifest.json       # Chrome extension manifest
│── background.js       # Handles AI API calls & messaging
│── content_script.js   # Extracts page text for summarization
│── popup.html          # UI popup for summarization
│── popup.js            # Logic for popup interactions
│── config.example.js   # Example file for API key setup
│── config.js           # API key (not included in Git)
│── .gitignore          # Prevents sensitive files from being pushed
│── css/style.css       # Styling for popup
└── icons/              # Icons for the extension
```

---

## 🔄 Future Improvements

📌 **Improve summarization accuracy** by fine-tuning AI prompts.  
📌 **Add offline summarization** with on-device models.  
📌 **Allow saving summaries to Notion, Evernote, or Google Docs.**  
📌 **Introduce voice summaries** for accessibility.  

---

## 📜 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute this project as long as you include the original license.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork this repository**.
2. Create a **new feature branch**:  
   ```sh
   git checkout -b feature-new-summary-mode
   ```
3. Commit your changes:  
   ```sh
   git commit -m "Added new summary mode"
   ```
4. Push to GitHub:  
   ```sh
   git push origin feature-new-summary-mode
   ```
5. Open a **Pull Request (PR)**.

---

## 📞 Support

💡 Have a question? **Open an issue** in GitHub!  
📬 Need help? **Email** me at `cydalsij@outlook.com`.  

---

🚀 **Enjoy your AI-powered quick summarizer!** 🚀
```