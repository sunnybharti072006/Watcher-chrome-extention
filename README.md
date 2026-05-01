# 🚀 Watcher Chrome Extension

<div align="center">

<!-- TODO: Add project logo (e.g., an icon from the `icons` directory) -->

[![GitHub stars](https://img.shields.io/github/stars/sunnybharti072006/Watcher-chrome-extention?style=for-the-badge)](https://github.com/sunnybharti072006/Watcher-chrome-extention/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sunnybharti072006/Watcher-chrome-extention?style=for-the-badge)](https://github.com/sunnybharti072006/Watcher-chrome-extention/network)
[![GitHub issues](https://img.shields.io/github/issues/sunnybharti072006/Watcher-chrome-extention?style=for-the-badge)](https://github.com/sunnybharti072006/Watcher-chrome-extention/issues)
[![GitHub license](https://img.shields.io/github/license/sunnybharti072006/Watcher-chrome-extention?style=for-the-badge)](LICENSE) <!-- TODO: Add a LICENSE file and update badge -->

**A powerful Chrome Extension to monitor and manage your active and watched tabs effortlessly.**

</div>

## 📖 Overview

The Watcher Chrome Extension is designed to enhance your browsing experience by providing robust tab monitoring and management capabilities. It allows you to keep a close eye on your active browser tabs, save important ones to a persistent watch list, and easily navigate back to them. Whether you're juggling multiple projects, conducting research, or simply want to organize your browsing, Watcher helps you stay on top of your tab activity with an intuitive and efficient interface.

## ✨ Features

-   🎯 **Tab Activity Monitoring:** The background script automatically detects and logs changes in your active browser tabs, providing a foundation for usage insights.
-   📌 **Persistent Tab Watching:** Easily add the current tab's URL and title to a dedicated watch list, ensuring you never lose track of important pages.
-   📋 **Intuitive Popup UI:** Access and manage your watched tabs directly from the extension's popup, offering a clear overview and quick actions.
-   🚀 **Quick Navigation:** Click on any watched tab in the list to instantly open it in a new tab.
-   🗑️ **Individual Tab Management:** Remove specific tabs from your watch list when they are no longer needed.
-   🧹 **Bulk Management:** Clear all watched tabs with a single action, ideal for starting fresh.
-   💾 **Local Storage Persistence:** All watched tabs are securely saved and retrieved locally using Chrome's `storage.local` API, ensuring your list persists across browser sessions.

## 🖥️ Screenshots

<!-- TODO: Add actual screenshots of the extension popup and its functionality -->
<!-- ![Screenshot of Watcher Extension Popup](path-to-popup-screenshot.png) -->
<!-- ![Screenshot of Watcher Extension with watched tabs](path-to-watched-tabs-screenshot.png) -->

## 🛠️ Tech Stack

**Frontend:**
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

**Browser APIs:**
[![Chrome Extensions](https://img.shields.io/badge/Chrome_Extensions-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)

## 🚀 Quick Start

This section will guide you through installing the Watcher Chrome Extension locally from its source code.

### Prerequisites

-   Google Chrome Browser

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sunnybharti072006/Watcher-chrome-extention.git
    cd Watcher-chrome-extention
    ```

2.  **Open Chrome Extensions page**
    -   Open your Google Chrome browser.
    -   Navigate to `chrome://extensions/` in the address bar, or go to `Menu (⋮) > More tools > Extensions`.

3.  **Enable Developer Mode**
    -   Toggle on the "Developer mode" switch located in the top-right corner of the Extensions page.

4.  **Load the unpacked extension**
    -   Click on the "Load unpacked" button that appears.
    -   A file dialog will open. Navigate to and select the `Watcher-chrome-extention` directory you cloned in step 1.

5.  **Extension is now active!**
    -   The Watcher extension should now appear in your list of extensions.
    -   You will see its icon in your browser's toolbar. Click on it to open the popup.

## 📁 Project Structure

```
Watcher-chrome-extention/
├── README.md           # Project documentation (this file)
├── background.js       # Background service worker for monitoring tab events
├── icons/              # Directory containing extension icons (16, 48, 128 sizes)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json       # Chrome Extension manifest file, defining metadata and permissions
├── popup.html          # HTML structure for the extension's popup UI
└── popup.js            # JavaScript logic for the popup's functionality and interactions
```

## ⚙️ Configuration

The primary configuration for the Watcher extension is handled within the `manifest.json` file.

### manifest.json
This file defines crucial aspects of the extension:
-   **`name`**: "Watcher" - The name displayed for the extension.
-   **`description`**: "A Chrome Extension to monitor various activities on websites." - A brief overview.
-   **`version`**: "1.0" - The current version of the extension.
-   **`manifest_version`**: 3 - Indicates it's a Manifest V3 extension.
-   **`icons`**: Specifies paths to various icon sizes used throughout Chrome.
-   **`action`**: Defines the popup UI (`popup.html`) and default icon.
-   **`background`**: Points to `background.js` as the service worker for background tasks.
-   **`permissions`**: Requests necessary API access:
    -   `storage`: To use `chrome.storage.local` for persistent data storage.
    -   `activeTab`: To interact with the currently active tab (e.g., get its URL/title).
    -   `scripting`: To inject scripts into web pages if needed (though not heavily used in current version for direct page interaction).
-   **`host_permissions`**: `<all_urls>` - Allows the extension to interact with all URLs.

## 🔧 Development

Development involves modifying the HTML, CSS, and JavaScript files directly. After making changes, you'll need to refresh the extension in Chrome.

### Development Workflow

1.  Modify any of the `.html`, `.css`, or `.js` files.
2.  Go to `chrome://extensions/`.
3.  Locate the "Watcher" extension.
4.  Click the "Refresh" button (circular arrow icon) on the extension's card to apply your changes.

## 🚀 Deployment

The Watcher Chrome Extension is deployed by loading it as an unpacked extension. For distribution to a wider audience, it can be published to the Chrome Web Store.

### Publishing to Chrome Web Store (Future Consideration)

To publish the extension:
1.  Ensure all features are stable and tested.
2.  Create a ZIP file of the extension's root directory (excluding `node_modules` if it were present).
3.  Visit the Chrome Web Store Developer Dashboard and follow the submission process.

## 🤝 Contributing

We welcome contributions to the Watcher Chrome Extension! If you have suggestions for improvements, bug fixes, or new features, please feel free to:

1.  **Fork the repository.**
2.  **Create a new branch** for your changes.
3.  **Make your modifications** and ensure they align with the project's purpose.
4.  **Test your changes** by loading the extension locally.
5.  **Submit a pull request** with a clear description of your contributions.

## 📄 License

This project is currently without an explicit license. Please refer to the repository owner for licensing information.
<!-- TODO: Add a LICENSE file (e.g., MIT, Apache 2.0) to clarify usage terms. -->

## 🙏 Acknowledgments

-   The Chrome Extension developer documentation for guidance on building browser extensions.

## 📞 Support & Contact

-   🐛 Issues: [GitHub Issues](https://github.com/sunnybharti072006/Watcher-chrome-extention/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [sunnybharti072006](https://github.com/sunnybharti072006)

</div>
