# Deployment Guide

This guide covers multiple deployment options for the AR Virtual Dress Try-On application.

## Option 1: GitHub Pages (Free & Easy)

### Steps:
1. Create a GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ar-virtual-tryon.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Select branch: `main`, folder: `/ (root)`
5. Click Save
6. Your site will be live at: `https://yourusername.github.io/ar-virtual-tryon`

**Pros:**
- Free
- Automatic HTTPS
- Easy updates (just push to main)
- Custom domain support

**Cons:**
- Public repositories only (unless GitHub Pro)

---

## Option 2: Netlify (Recommended)

### Steps:
1. Create account at [netlify.com](https://www.netlify.com)
2. **Drag & Drop Method:**
   - Drag your project folder to Netlify dashboard
   - Site goes live instantly
3. **Git Method:**
   - Connect your GitHub/GitLab repository
   - Netlify auto-deploys on every push

**Pros:**
- Instant deployment
- Free HTTPS
- Custom domains
- Continuous deployment
- Edge functions support

**Cons:**
- None for basic usage

**Custom Domain:**
1. Go to Domain Settings
2. Add your domain
3. Update DNS records

---

## Option 3: Vercel

### Steps:
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```
3. Follow prompts
4. Site goes live with HTTPS automatically

**Or use Vercel Dashboard:**
1. Create account at [vercel.com](https://vercel.com)
2. Import Git repository
3. Deploy automatically

**Pros:**
- Excellent performance
- Global CDN
- Instant deployments
- Great developer experience

---

## Option 4: Firebase Hosting

### Steps:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Login:
   ```bash
   firebase login
   ```
3. Initialize:
   ```bash
   firebase init hosting
   ```
   - Select: Use existing project or create new
   - Public directory: `.` (current directory)
   - Single-page app: No
   - GitHub deploys: Optional
4. Deploy:
   ```bash
   firebase deploy
   ```

**Pros:**
- Google infrastructure
- Free tier available
- Custom domains
- Analytics included

---

## Option 5: AWS S3 + CloudFront

### Steps:
1. Create S3 bucket
2. Enable static website hosting
3. Upload files
4. Create CloudFront distribution for HTTPS
5. Point to S3 bucket

**Pros:**
- Highly scalable
- Professional-grade
- Full AWS integration

**Cons:**
- More complex setup
- Costs can add up

---

## Option 6: Local Development Server

### Python (Built-in):
```bash
# Python 3
python -m http.server 8000

# Access at: http://localhost:8000
```

### Node.js (http-server):
```bash
npm install -g http-server
http-server -p 8000
```

### VS Code Live Server:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## HTTPS for Local Development

Camera access requires HTTPS. For local testing:

### Using http-server with SSL:
```bash
# Generate self-signed certificate
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

# Start server with HTTPS
http-server -p 8000 -S -C cert.pem -K key.pem
```

### Using mkcert (Recommended for local):
```bash
# Install mkcert
brew install mkcert  # macOS
choco install mkcert # Windows

# Create local CA
mkcert -install

# Generate certificates
mkcert localhost 127.0.0.1 ::1

# Use with http-server
http-server -p 8000 -S -C localhost.pem -K localhost-key.pem
```

---

## Testing the Deployment

After deployment, verify:

1. ✅ Camera access works (HTTPS required)
2. ✅ Pose detection initializes
3. ✅ Dresses render correctly
4. ✅ Photo capture works
5. ✅ Mobile responsive
6. ✅ Performance (check FPS)

### Mobile Testing:
- Use browser dev tools → Device mode
- Test on actual mobile device
- Check different browsers (Chrome, Safari, Firefox)

---

## Troubleshooting

### Camera Not Working:
- Ensure HTTPS is enabled
- Check browser permissions
- Try different browser
- Clear cache

### MediaPipe Loading Issues:
- Check CDN availability
- Verify internet connection
- Check browser console for errors

### Performance Issues:
- Use production mode
- Enable CDN caching
- Optimize images
- Reduce MediaPipe complexity

---

## Production Checklist

Before going live:

- [ ] Test on multiple devices
- [ ] Test on multiple browsers
- [ ] Verify HTTPS is working
- [ ] Check camera permissions
- [ ] Test photo capture/download
- [ ] Verify responsive design
- [ ] Check performance (FPS)
- [ ] Add analytics (optional)
- [ ] Set up error logging
- [ ] Test share functionality
- [ ] Update README with live URL
- [ ] Add demo video/screenshots

---

## Recommended Setup

**For Demo/Portfolio:**
→ **Netlify** or **Vercel** (easiest, free HTTPS)

**For Learning/Development:**
→ **Live Server** or **http-server**

**For Production App:**
→ **Vercel** or **Firebase Hosting**

**For Enterprise:**
→ **AWS S3 + CloudFront**

---

## Need Help?

1. Check browser console for errors
2. Verify HTTPS is enabled
3. Test camera permissions
4. Review deployment platform docs
5. Check network requests in DevTools

---

**Happy Deploying! 🚀**



