# 📊 Meta Pixel Setup Guide for Kids Fashion Store

## Overview
Meta Pixel (formerly Facebook Pixel) is now integrated into your Kids Fashion store to track customer behavior, optimize ads, and measure conversions.

## 🔧 Setup Instructions

### 1. Get Your Meta Pixel ID
1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager**
3. Create a new Pixel or select an existing one
4. Copy your **Pixel ID** (a 15-16 digit number)

### 2. Configure Environment Variables
Add your Meta Pixel ID to your `.env` file:
```bash
NEXT_PUBLIC_META_PIXEL_ID=your-actual-pixel-id-here
```

### 3. Restart Your Application
After adding the Pixel ID, restart your development server:
```bash
npm run dev
```

## 📈 Events Being Tracked

### Automatic Events
- **PageView**: Tracked on every page load
- **Route Changes**: Tracked when users navigate between pages

### E-commerce Events
- **ViewContent**: When a product page is viewed
- **AddToCart**: When items are added to cart
- **InitiateCheckout**: When checkout page is accessed
- **Purchase**: When an order is successfully placed

### Lead Generation Events
- **Lead**: When contact form is submitted
- **ContactFormSubmit**: Custom event for form submissions

## 🧪 Testing Your Integration

### 1. Meta Pixel Helper Browser Extension
- Install the [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
- Navigate to your website
- The extension will show if events are firing correctly

### 2. Events Manager Test Events
- Go to Events Manager in Meta Business
- Click on your Pixel
- Use "Test Events" to see real-time event data

### 3. Browser Console Logs
- Open browser Developer Tools (F12)
- Check console for Meta Pixel tracking logs
- Events will be logged when they fire

## 🎯 Events Details

### ViewContent Event
**Triggers**: Product page view
**Data Sent**:
- Product ID
- Product Name
- Category
- Price
- Currency (BDT)

### AddToCart Event
**Triggers**: Add to cart button click
**Data Sent**:
- Product ID
- Product Name
- Price
- Currency (BDT)

### InitiateCheckout Event
**Triggers**: Checkout page load with items in cart
**Data Sent**:
- Array of product IDs
- Cart contents
- Total value
- Number of items

### Purchase Event
**Triggers**: Successful order placement
**Data Sent**:
- Order number (transaction_id)
- Product IDs
- Cart contents
- Total amount
- Currency (BDT)

### Lead Event
**Triggers**: Contact form submission
**Data Sent**:
- Content name
- Source
- Lead type

## 🔍 Debugging

### Common Issues

1. **Events Not Firing**
   - Check if `NEXT_PUBLIC_META_PIXEL_ID` is set correctly
   - Ensure the environment variable starts with `NEXT_PUBLIC_`
   - Restart the development server

2. **Pixel ID Not Found Warning**
   - Add your actual Pixel ID to `.env`
   - Make sure there are no extra spaces or quotes

3. **Events Firing but Not in Meta**
   - Wait 15-20 minutes for events to appear in Meta Events Manager
   - Check if your Pixel ID is correct
   - Verify the Pixel is active in Meta Business

### Console Debugging
Events are logged to the browser console with this format:
```
Meta Pixel tracking: EventName {eventData}
```

## 📱 Mobile App Events (Future)
If you plan to create a mobile app, you can use the same event structure with the Meta SDK for iOS/Android.

## 🚀 Advanced Features

### Custom Audiences
Use the tracked events to create custom audiences in Meta Ads Manager:
- Website visitors
- Product viewers
- Cart abandoners
- Past purchasers

### Conversion Optimization
Set up conversion campaigns in Meta Ads Manager using:
- Purchase events for sales campaigns
- Lead events for lead generation campaigns
- AddToCart events for retargeting campaigns

### Lookalike Audiences
Create lookalike audiences based on:
- Your customer data (purchasers)
- High-value customers
- Engaged users

## 📊 Recommended Meta Ads Strategy

1. **Traffic Campaigns**: Use ViewContent events
2. **Conversion Campaigns**: Use Purchase events
3. **Lead Generation**: Use Lead events
4. **Retargeting**: Use AddToCart and InitiateCheckout events

## 🛡️ Privacy Compliance

### GDPR/Privacy Considerations
- The integration respects user privacy
- Consider adding cookie consent banners
- Events only track when users interact with your site
- No personal data is sent in events (only IDs and values)

### Data Retention
- Meta retains event data according to their data policy
- You can configure data retention settings in Events Manager

## 📞 Support

If you need help with Meta Pixel setup:
1. Check Meta Business Help Center
2. Use Meta Pixel Helper extension for debugging
3. Test events in Events Manager
4. Review browser console logs

## 🔄 Updates

This integration will automatically track new events as you add them to the codebase. All e-commerce events are standard Meta events for optimal performance.
