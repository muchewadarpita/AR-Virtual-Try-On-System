# Testing Guide - AR Virtual Dress Try-On

## 🧪 Quick Test Checklist

### Initial Load
- [ ] Loading screen appears
- [ ] Camera permission prompt shows
- [ ] After granting permission, video feed appears
- [ ] Pose detection initializes
- [ ] Loading screen fades out
- [ ] Status shows "Ready!"

### Body Detection
- [ ] Green skeleton appears on body
- [ ] Skeleton tracks body movements smoothly
- [ ] All 33 landmarks detected
- [ ] Tracking remains stable during movement
- [ ] Skeleton visible from 1-2 meters away

### Dress Try-On
- [ ] First dress auto-selects on load
- [ ] Dress appears over body
- [ ] Dress scales to body proportions
- [ ] Dress follows body movement
- [ ] Dress stays aligned with shoulders/hips
- [ ] Dress rendering is smooth (no jitter)

### Dress Selection
- [ ] Can see all 8 dresses in carousel
- [ ] Clicking dress changes it instantly
- [ ] Active dress is highlighted
- [ ] Carousel scrolls smoothly
- [ ] Previous/Next buttons work
- [ ] Status updates with dress name

### Controls
- [ ] Skeleton toggle on/off works
- [ ] Size slider adjusts dress scale
- [ ] Changes apply in real-time
- [ ] FPS counter updates
- [ ] All buttons are clickable

### Photo Capture
- [ ] Camera button works
- [ ] Photo modal appears
- [ ] Captured photo shows correctly
- [ ] Download button works
- [ ] Downloaded file is valid PNG
- [ ] Share button works (if supported)
- [ ] Modal close button works

### Performance
- [ ] FPS is 30+ consistently
- [ ] No lag during dress changes
- [ ] Smooth video rendering
- [ ] Responsive to user input
- [ ] No memory leaks (test 5+ minutes)

---

## 🖥️ Browser Testing

### Chrome (Desktop)
```bash
# Open Chrome
# Navigate to http://localhost:8000
# Grant camera permission
# Test all features
```

Expected: ✅ All features work perfectly

### Firefox (Desktop)
Expected: ✅ All features work

### Safari (Desktop)
Expected: ✅ All features work (may need HTTPS)

### Edge (Desktop)
Expected: ✅ All features work

### Chrome (Mobile)
Expected: ✅ All features work (may need HTTPS)

### Safari (Mobile - iPhone)
Expected: ✅ All features work (HTTPS required)

---

## 📱 Device Testing

### Desktop (Windows)
- Resolution: 1920x1080
- Expected FPS: 60
- Status: Should work perfectly

### Desktop (Mac)
- Resolution: 2560x1440
- Expected FPS: 60
- Status: Should work perfectly

### Laptop
- Resolution: 1366x768
- Expected FPS: 45-60
- Status: Should work well

### iPad/Tablet
- Resolution: Various
- Expected FPS: 30-45
- Status: Should work well

### iPhone (Modern)
- Resolution: Various
- Expected FPS: 30-45
- Status: HTTPS required, works well

### Android Phone
- Resolution: Various
- Expected FPS: 30-45
- Status: Performance varies by device

---

## 🔍 Detailed Test Cases

### Test Case 1: Initial Setup
**Steps:**
1. Open app in browser
2. Observe loading screen
3. Grant camera permission
4. Wait for initialization

**Expected:**
- Loading screen visible
- Camera permission requested
- Video feed appears
- Pose detection starts
- First dress auto-selected
- Status: "Ready!"

**Pass Criteria:** All steps complete within 5 seconds

---

### Test Case 2: Body Tracking
**Steps:**
1. Stand 1-2 meters from camera
2. Ensure full upper body visible
3. Observe skeleton overlay
4. Move arms up/down
5. Move side to side
6. Rotate body slightly

**Expected:**
- Skeleton appears immediately
- 33 landmarks visible
- Skeleton follows movements smoothly
- No significant lag
- Tracking remains stable

**Pass Criteria:** Skeleton tracks accurately 95%+ of time

---

### Test Case 3: Dress Rendering
**Steps:**
1. Observe initial dress
2. Check alignment with shoulders
3. Check alignment with hips
4. Move around
5. Check dress follows body

**Expected:**
- Dress centered on body
- Dress width matches shoulder width
- Dress height proportional to torso
- Dress moves with body
- No clipping or artifacts

**Pass Criteria:** Dress stays aligned during movement

---

### Test Case 4: Dress Selection
**Steps:**
1. Click on Red Dress
2. Click on Blue Gown
3. Click on Green Dress
4. Use Next button
5. Use Previous button

**Expected:**
- Each dress appears instantly
- Previous dress removed
- Active dress highlighted
- Status updates
- Smooth transitions

**Pass Criteria:** All dresses selectable and render correctly

---

### Test Case 5: Size Adjustment
**Steps:**
1. Set slider to minimum (0.8)
2. Observe dress size
3. Set slider to maximum (1.2)
4. Observe dress size
5. Set slider to middle (1.0)

**Expected:**
- Dress shrinks at 0.8
- Dress enlarges at 1.2
- Changes apply immediately
- Proportions maintained

**Pass Criteria:** Size changes smoothly and proportionally

---

### Test Case 6: Photo Capture
**Steps:**
1. Select a dress
2. Click camera button
3. Observe modal
4. Click download
5. Check downloaded file

**Expected:**
- Modal appears immediately
- Photo shows current view
- Download starts
- File is valid PNG
- Photo includes dress overlay

**Pass Criteria:** Photo captures and downloads successfully

---

### Test Case 7: Responsive Design
**Steps:**
1. Open on desktop (wide screen)
2. Resize browser window
3. Test on tablet
4. Test on mobile phone

**Expected:**
- Layout adapts to screen size
- Controls remain accessible
- Video scales appropriately
- No horizontal scroll
- Touch controls work on mobile

**Pass Criteria:** Usable on all screen sizes

---

### Test Case 8: Performance
**Steps:**
1. Open app
2. Monitor FPS counter
3. Change dresses rapidly (10 times)
4. Move around quickly
5. Use app for 5 minutes
6. Check browser memory usage

**Expected:**
- FPS: 30+ consistently
- No FPS drops during dress changes
- No lag during movement
- Memory usage stable
- No browser warnings

**Pass Criteria:** FPS ≥30, no memory leaks

---

## 🐛 Common Issues & Solutions

### Issue: Camera not working
**Symptoms:** Black screen, no video feed
**Solution:**
- Check camera permissions in browser
- Ensure no other app using camera
- Try different browser
- Ensure HTTPS (for production)
- Check browser console for errors

### Issue: Pose detection not working
**Symptoms:** No skeleton visible
**Solution:**
- Check internet connection (MediaPipe loads from CDN)
- Ensure good lighting
- Stand 1-2 meters from camera
- Check browser console
- Try refreshing page

### Issue: Dress not appearing
**Symptoms:** Skeleton visible but no dress
**Solution:**
- Click on a dress to select
- Check browser console for errors
- Ensure pose landmarks detected
- Try different dress

### Issue: Low FPS
**Symptoms:** Choppy video, slow tracking
**Solution:**
- Close other browser tabs
- Close other applications
- Reduce MediaPipe complexity (edit code)
- Use newer device
- Lower video resolution

### Issue: Dress misaligned
**Symptoms:** Dress not centered on body
**Solution:**
- Adjust distance from camera
- Ensure full upper body visible
- Use size slider to adjust
- Improve lighting
- Stand against plain background

---

## 📊 Performance Benchmarks

### Desktop (High-end)
- FPS: 60
- Load Time: 2-3 seconds
- Response: Instant

### Desktop (Mid-range)
- FPS: 45-60
- Load Time: 3-4 seconds
- Response: Very fast

### Laptop
- FPS: 30-45
- Load Time: 4-5 seconds
- Response: Fast

### Mobile (High-end)
- FPS: 30-45
- Load Time: 4-6 seconds
- Response: Fast

### Mobile (Mid-range)
- FPS: 20-30
- Load Time: 6-8 seconds
- Response: Acceptable

---

## 🧰 Testing Tools

### Browser DevTools
```
F12 or Cmd+Option+I

Useful tabs:
- Console: Check for errors
- Network: Monitor MediaPipe loading
- Performance: Profile FPS
- Application: Check camera permissions
```

### FPS Monitoring
- Use built-in FPS counter in app
- Chrome DevTools → Performance
- Stats.js (if integrated)

### Camera Testing
- Test different lighting
- Test different backgrounds
- Test different distances
- Test different angles

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] All features tested on Chrome
- [ ] All features tested on Firefox
- [ ] All features tested on Safari
- [ ] Mobile testing complete
- [ ] HTTPS configured
- [ ] Performance acceptable (FPS ≥30)
- [ ] No console errors
- [ ] Photo capture works
- [ ] All 8 dresses render correctly
- [ ] Size slider works
- [ ] Skeleton toggle works
- [ ] Carousel navigation works
- [ ] Loading screen works
- [ ] Error handling tested
- [ ] README updated
- [ ] Demo video created
- [ ] Screenshots taken

---

## 🚀 Acceptance Criteria

### Minimum Requirements
✅ Camera access works
✅ Body detection works
✅ At least 5 dresses available
✅ Dress overlay functional
✅ Dress changes work
✅ Basic UI controls work

### Full Requirements
✅ All minimum requirements
✅ 8+ dresses available
✅ Photo capture works
✅ Size adjustment works
✅ Smooth performance (30+ FPS)
✅ Mobile responsive
✅ Error handling
✅ Professional UI

### Bonus Features
⭐ Photo download
⭐ Photo share
⭐ Multiple patterns (floral)
⭐ Dress details/decoration
⭐ Skeleton visualization
⭐ FPS counter
⭐ Status updates

---

## 📝 Bug Report Template

If you find bugs, document them:

```markdown
### Bug: [Short Description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
- Screen: 1920x1080

**Console Errors:**
[Paste any console errors]

**Screenshots:**
[Attach if applicable]

**Severity:**
- [ ] Critical (app doesn't work)
- [ ] High (major feature broken)
- [ ] Medium (feature partially works)
- [ ] Low (minor issue)
```

---

**Happy Testing! 🧪**

Remember: Good testing ensures a great user experience! 



