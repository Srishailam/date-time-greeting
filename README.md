# Date Time Greeting - Chrome Extension

Transform your Chrome new tab into a beautiful, functional dashboard! 

A Chrome extension that displays the current date, time, personalized greeting, and live weather with 5-day forecast **every time you open a new tab or window**.

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-blue)](https://chrome.google.com/webstore)
[![Version](https://img.shields.io/badge/version-1.0-green)](manifest.json)

## Features

- 🕐 Real-time clock with seconds
- 📅 Current day and full date display
- 👋 Dynamic greetings:
  - **Good Morning** (5:00 AM - 11:59 AM) 🌅
  - **Good Afternoon** (12:00 PM - 4:59 PM) ☀️
  - **Good Evening** (5:00 PM - 8:59 PM) 🌆
  - **Good Night** (9:00 PM - 4:59 AM) 🌙
- 🌤️ **Live Weather Information**:
  - 📍 Current location (city and country)
  - 🌡️ Current temperature in Celsius
  - ☀️ Weather condition with emoji icons
  - 💧 Humidity percentage
  - 💨 Wind speed in km/h
- 🎨 Beautiful gradient backgrounds that change with time of day
- ⚡ Smooth animations and modern UI
- 🪟 **Automatically appears on every new tab or window**

## Installation Steps

### Step 1: Navigate to Chrome Extensions
1. Open Google Chrome browser
2. Type `chrome://extensions/` in the address bar and press Enter
   - Or click the three dots menu → Extensions → Manage Extensions

### Step 2: Enable Developer Mode
1. Look for the **Developer mode** toggle in the top-right corner
2. Turn it **ON** (it should turn blue)

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. Navigate to this folder: `/Users/srishailam.dasari/Documents/Sri/date_time_greeting_extension`
3. Select the folder and click **"Select"** or **"Open"**

### Step 4: If Extension Was Previously Loaded
If you already had this extension loaded as a popup:
1. Go to `chrome://extensions/`
2. Find "Date Time Greeting" 
3. Click the **"Remove"** button to unload the old version
4. Then follow Step 3 above to load the new version

### Step 5: Configure (Optional)
**✅ No API Key Required!** Weather works out of the box using [Open-Meteo](https://open-meteo.com/) - a free, open-source weather API.

Optional: Edit `config.js` to customize:
- Location method (geolocation or IP-based)
- Temperature unit (Fahrenheit or Celsius)

### Step 6: Test It!
1. Open a **new tab** (Cmd+T on Mac, Ctrl+T on Windows)
2. **Allow location access** when prompted (for accurate weather)
3. Enjoy your beautiful dashboard with:
   - 👋 Personalized greeting
   - ⏰ Live clock (updates every second)
   - 📅 Current day and date
   - 🌤️ Your location and current weather
   - 📊 5-day weather forecast
   - 🌡️ Toggle between °F and °C
4. Weather updates automatically every 10 minutes
5. **No setup needed** - it just works! ✨

## Files Structure

- `manifest.json` - Extension configuration (uses chrome_url_overrides for new tab)
- `config.js` - Configuration file (location method, temperature unit)
- `newtab.html` - Full-page new tab interface
- `newtab.css` - Full-screen styling and animations
- `newtab.js` - Logic for time, date, greetings, and weather
- `README.md` - This file

## How It Works

- **New Tab Override**: Uses `chrome_url_overrides` API to replace Chrome's default new tab
- **Weather Data**: Powered by [Open-Meteo](https://open-meteo.com/) - free, open-source weather API (no API key needed!)
- **Location**: Uses browser geolocation or IP-based detection
- **Updates**: Time updates every second, weather every 10 minutes
- **Privacy**: Location data only sent to Open-Meteo for weather, nothing stored on external servers

## Troubleshooting

**Extension not showing up on new tab?**
- Make sure Developer mode is enabled
- Remove and reload the extension: Click the remove button, then load unpacked again
- Check for conflicts: Only one extension can override the new tab at a time

**New tab shows blank page?**
- Check the browser console for errors (F12)
- Make sure all files (newtab.html, newtab.css, newtab.js) are in the folder
- Try reloading the extension in chrome://extensions/

**Time not updating?**
- Refresh the tab (Cmd+R or Ctrl+R)
- Check browser console for JavaScript errors

**Want to go back to the default new tab?**
- Go to chrome://extensions/
- Find "Date Time Greeting" and click "Remove"

## Customization Ideas

- Change colors in `newtab.css` to match your preferences
- Modify greeting times in `newtab.js` (in the `getGreeting()` function)
- Add more greeting periods (like late night, early morning, etc.)
- Change the gradient backgrounds for different times
- Add additional features like bookmarks, search bar, weather, quotes, etc.

