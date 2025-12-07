  # 👗 AR Virtual Dress Try-On

A WebAR application that allows users to try on virtual dresses in real-time using their device camera. Built with MediaPipe Pose Detection and vanilla JavaScript.

![AR Try-On Demo](https://img.shields.io/badge/Platform-WebAR-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Real-time Body Tracking**: Uses MediaPipe Pose to detect and track 33 body landmarks
- **Multiple Dress Options**: 8 different dresses to choose from with various colors and styles
- **Smart Overlay**: Dresses automatically scale and position based on body proportions
- **Photo Capture**: Take photos and download/share your virtual try-on
- **Adjustable Settings**: Control dress size and skeleton visibility
- **Responsive Design**: Works on desktop and mobile browsers
- **Smooth Performance**: Optimized rendering with FPS monitoring

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Camera access
- HTTPS connection (required for camera access)

### Installation

1. **Clone or download this repository**

```bash
git clone <repository-url>
cd ar-virtual-tryon
```

2. **Serve the application over HTTPS**

   **Option 1: Using Python (Simple)**

   ```bash
   # Python 3
   python -m http.server 8000
   ```

   Then visit: `http://localhost:8000`

   **Option 2: Using Node.js (http-server)**

   ```bash
   npm install -g http-server
   http-server -p 8000
   ```

   **Option 3: Using VS Code Live Server**

   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

   **Option 4: For Production/HTTPS**

   ```bash
   npm install -g http-server
   http-server -p 8000 -S -C cert.pem -K key.pem
   ```

3. **Open in browser**
   - Navigate to the served URL
   - Allow camera permissions when prompted
   - Start trying on dresses!


## 📱 How to Use

1. **Grant Camera Access**: Allow browser to access your camera
2. **Position Yourself**: Stand in front of camera with full upper body visible
3. **Select a Dress**: Click on any dress from the carousel at the bottom
4. **Adjust**: Use the size slider to adjust dress fit
5. **Capture**: Click the camera button to take a photo
6. **Share**: Download or share your photo directly

## 🛠️ Technical Details

### Technologies Used

- **MediaPipe Pose**: Real-time body landmark detection (33 points)
- **Canvas API**: 2D rendering for dress overlay
- **WebRTC**: Camera access via getUserMedia
- **Vanilla JavaScript**: No framework dependencies
- **HTML5 & CSS3**: Modern, responsive UI

### Architecture

```
┌─────────────────┐
│   Camera Input  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MediaPipe Pose │
│   Detection     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pose Landmarks │ (33 body points)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dress Overlay  │
│    Renderer     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Canvas Output  │
└─────────────────┘
```

### Key Components

**ARDressTryOn Class**

- `setupCamera()`: Initializes webcam stream
- `setupPose()`: Configures MediaPipe Pose detector
- `onPoseResults()`: Processes pose landmarks each frame
- `drawDress()`: Renders dress overlay based on body proportions
- `drawSkeleton()`: Visualizes body tracking (optional)
- `capturePhoto()`: Takes snapshot of current view

**Dress Rendering Algorithm**

1. Detect key body landmarks (shoulders, hips)
2. Calculate body proportions (width, height)
3. Scale dress to fit user's body
4. Position dress using shoulder and hip centers
5. Apply gradient and styling
6. Add patterns and details

### Performance Optimizations

- Efficient canvas rendering
- Landmark smoothing for stable tracking
- Optimized MediaPipe settings (model complexity: 1)
- FPS monitoring and display
- Minimal DOM manipulation

## 🎨 Customization

### Adding New Dresses

Edit `app.js` and add to the `dresses` array:

```javascript
{
    id: 9,
    name: 'Custom Dress',
    icon: '👗',
    color: '#YOUR_COLOR',
    style: 'your-style',
    pattern: null // or 'floral'
}
```

### Changing Colors

Modify the `color` property in dress objects. Supports hex colors: `#FF0000`

### Adding Patterns

Create custom pattern functions in `app.js`:

```javascript
drawCustomPattern(centerX, centerY, width, height) {
    // Your pattern drawing code
}
```

### Adjusting Dress Shape

Modify the `drawDress()` method to change the dress silhouette.

## 📊 Browser Compatibility

| Browser | Desktop | Mobile |
| ------- | ------- | ------ |
| Chrome  | ✅ Yes  | ✅ Yes |
| Firefox | ✅ Yes  | ✅ Yes |
| Safari  | ✅ Yes  | ✅ Yes |
| Edge    | ✅ Yes  | ✅ Yes |

**Note**: HTTPS required for camera access on all platforms

## 🐛 Known Issues

1. **Lighting**: Poor lighting may affect body detection accuracy
2. **Distance**: User should be 1-2 meters from camera for best results
3. **Background**: Cluttered backgrounds may reduce tracking performance
4. **Mobile**: Performance varies on lower-end devices
5. **Camera Quality**: Better camera = better tracking

## 🔧 Troubleshooting

**Camera not working?**

- Ensure HTTPS is enabled
- Check browser permissions
- Try different browser
- Restart browser/device

**Poor tracking?**

- Improve lighting
- Stand against plain background
- Ensure full body visible
- Check camera focus

**Low FPS?**

- Close other browser tabs
- Reduce video quality in code
- Use desktop instead of mobile
- Clear browser cache

## 📈 Future Enhancements

- [ ] 3D dress models using Three.js
- [ ] Cloth physics simulation
- [ ] Multiple dress styles (casual, formal, traditional)
- [ ] Accessory try-on (hats, glasses, jewelry)
- [ ] Full-body try-on with pants/skirts
- [ ] Virtual fitting room with backgrounds
- [ ] Social sharing integration
- [ ] AR effects and filters
- [ ] Size recommendation based on measurements
- [ ] Multiple users support
