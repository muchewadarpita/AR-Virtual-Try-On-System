# ⚡ Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run the Server

**Windows:**
```bash
# Double-click start.bat
# OR run in terminal:
python -m http.server 8000
```

**Mac/Linux:**
```bash
# Make executable and run:
chmod +x start.sh
./start.sh

# OR run directly:
python3 -m http.server 8000
```

**Node.js (Any OS):**
```bash
npx http-server -p 8000
```

---

### Step 2: Open in Browser

```
http://localhost:8000
```

**Grant camera permission when prompted!**

---

### Step 3: Try It Out!

1. ✅ Stand 1-2 meters from camera
2. ✅ Select a dress from the carousel
3. ✅ See it on you in real-time!
4. ✅ Adjust size with slider
5. ✅ Take a photo! 📸

---

## 📱 Test on Mobile

1. Find your computer's IP address:
   - **Windows:** `ipconfig` → Look for IPv4
   - **Mac/Linux:** `ifconfig` → Look for inet

2. On your phone (same WiFi):
   ```
   http://YOUR_IP_ADDRESS:8000
   ```

3. Grant camera access and enjoy!

---

## 🌐 Deploy Online (Free)

### Netlify (Easiest):
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your project folder
3. Done! ✅

### GitHub Pages:
```bash
git init
git add .
git commit -m "Initial commit"
git push -u origin main
# Then enable Pages in repository settings
```

### Vercel:
```bash
npx vercel
# Follow prompts
```

---

## 🎯 Features Overview

| Feature | Description |
|---------|-------------|
| 📷 Camera | Real-time video feed |
| 🤖 AI Tracking | MediaPipe pose detection (33 points) |
| 👗 8 Dresses | Multiple styles and colors |
| 📏 Size Adjust | Slider to fit perfectly |
| 🎨 Patterns | Including floral designs |
| 📸 Photo | Capture and download |
| 📱 Mobile | Works on phones and tablets |
| ⚡ Fast | 30-60 FPS performance |

---

## 🆘 Troubleshooting

**Camera not working?**
→ Check permissions in browser settings

**Slow performance?**
→ Close other tabs, use Chrome

**Not detecting body?**
→ Ensure good lighting and distance

**HTTPS errors?**
→ Normal for localhost; deploy for production

---

## 📚 Need More Help?

- **Full Guide:** See `README.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Testing:** See `TESTING_GUIDE.md`
- **Demo Tips:** See `DEMO_GUIDE.md`

---

## 🎉 You're All Set!

Enjoy your AR Virtual Try-On experience!

**Questions?** Check the documentation files above.

**Ready to customize?** Edit `app.js` to add more dresses!

---

**Made with ❤️ using MediaPipe & JavaScript**



