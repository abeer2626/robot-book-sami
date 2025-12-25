# Responsive Layout Testing Guide

## Overview
This guide provides instructions for testing the responsive layout functionality of the Robotics Textbook platform.

## Key Features to Test

### 1. **Responsive Layout Components**
- **Desktop View** (1025px and above): Sidebar navigation visible
- **Tablet View** (769px - 1024px): Collapsible sidebar overlay
- **Mobile View** (768px and below): Mobile header with hamburger menu

### 2. **Testing Instructions**

#### A. Desktop Layout Testing
1. **Viewport Size**: Set browser width to 1025px or wider
2. **Expected Behavior**:
   - Fixed sidebar navigation on the left
   - Module navigation items visible
   - Main content area on the right
   - No mobile header visible
   - Hamburger menu hidden

3. **Test Cases**:
   - [ ] Verify sidebar displays all 5 modules
   - [ ] Check module progress indicators show correctly
   - [ ] Confirm main content has proper margins
   - [ ] Test navigation links work properly

#### B. Tablet Layout Testing
1. **Viewport Size**: Set browser width to 769px - 1024px
2. **Expected Behavior**:
   - Sidebar becomes collapsible overlay
   - Navigation triggered by clicking items
   - Smooth transition animations
   - Content layout adjusts accordingly

3. **Test Cases**:
   - [ ] Verify sidebar slides in/out when clicking modules
   - [ ] Check overlay appears correctly
   - [ ] Test close functionality
   - [ ] Verify content adjusts when sidebar is open

#### C. Mobile Layout Testing
1. **Viewport Size**: Set browser width to 768px or narrower
2. **Expected Behavior**:
   - Mobile header with hamburger menu visible
   - Full overlay navigation when menu is clicked
   - Content area reflowed for mobile
   - Touch-friendly interface

3. **Test Cases**:
   - [ ] Verify mobile header is visible
   - [ ] Test hamburger menu toggle
   - [ ] Check overlay navigation opens
   - [ ] Test navigation links in overlay
   - [ ] Verify content is mobile-friendly

### 3. **Interactive Elements to Test**

#### Navigation
- [ ] Module navigation links work on all screen sizes
- [ ] Current module highlighting works correctly
- [ ] Progress indicators display properly
- [ ] Module descriptions are readable

#### Transitions & Animations
- [ ] Sidebar slide animation (smooth)
- [ ] Overlay fade in/out effect
- [ ] Mobile menu transitions
- [ ] Loading states

#### Accessibility
- [ ] ARIA labels present on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader friendly

### 4. **Browser Testing**
Test on these browsers with responsive design tools:
- Chrome
- Firefox
- Safari
- Edge

### 5. **Device Testing**
- Desktop (1920x1080, 1366x768, 1536x864)
- Tablet (1024x768, 768x1024)
- Mobile (375x812, 414x736, 360x640)

### 6. **Breakpoint Testing**
- **1025px+**: Desktop layout
- **769px - 1024px**: Tablet layout
- **768px and below**: Mobile layout

### 7. **Common Issues to Watch For**
- [ ] Overlapping elements on resize
- [ ] Broken navigation links
- [ ] Incorrect rendering of CSS modules
- [ ] JavaScript errors in console
- [ ] Improper z-index layering
- [ ] Scroll behavior issues

### 8. **Testing Tools**
1. **Browser DevTools**: Device toolbar for testing different screen sizes
2. **Viewport Resizer**: Quick size switching
3. **Console**: Check for JavaScript errors
4. **Lighthouse**: Performance and accessibility audit

### 9. **Manual Test Checklist**

#### Before Testing
- [ ] Start the development server (`npm start`)
- [ ] Open browser and navigate to `http://localhost:3000`
- [ ] Open browser developer tools

#### Desktop View (1025px+)
- [ ] Sidebar displays modules correctly
- [ ] Module content loads properly
- [ ] Navigation links work
- [ ] Progress indicators show

#### Tablet View (769px - 1024px)
- [ ] Sidebar becomes overlay
- [ ] Hamburger menu appears
- [ ] Click modules to open overlay
- [ ] Close button works

#### Mobile View (768px-)
- [ ] Mobile header visible
- [ ] Hamburger menu works
- [ ] Full overlay navigation
- [ ] Content reflows correctly

#### During Resize
- [ ] Resize window through all breakpoints
- [ ] Verify smooth transitions
- [ ] Check no elements break layout
- [ ] Test navigation at each size

### 10. **Expected Outcomes**
- [ ] Consistent navigation across all screen sizes
- [ ] Smooth transitions between breakpoints
- [ ] Touch-friendly interface on mobile
- [ ] No broken links or missing content
- [ ] Proper accessibility support
- [ ] Fast loading and responsive performance

### 11. **Reporting Issues**
If you find any issues:
1. Note the viewport size
2. Describe the expected behavior
3. Explain the actual behavior
4. Check browser console for errors
5. Take screenshots if possible

### 12. **Testing Tips**
- Use browser dev tools device emulation
- Test real device rotation if possible
- Check high-contrast mode
- Test with reduced motion preferences
- Verify text remains readable at all sizes