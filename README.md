# Scent & Soul — Perfume Shop Website

A beautiful, mobile-first perfume e-commerce website with a swipe carousel, WhatsApp ordering, and a secure manager panel.

## Files
- `index.html` — Main website
- `style.css` — All styling
- `app.js` — All logic

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `my-perfume-shop`)
2. Upload all 3 files: `index.html`, `style.css`, `app.js`
3. Go to **Settings → Pages**
4. Under **Source**, select **Deploy from a branch**
5. Choose `main` branch and `/ (root)` folder → click **Save**
6. Your site will be live at: `https://yourusername.github.io/my-perfume-shop`

## First-Time Setup (After Deployment)

1. Visit your live site
2. Click **Manage** in the top-right corner
3. Enter your passcode on the phone keypad
4. Go to the **Settings** tab
5. Enter your WhatsApp number with country code (e.g. `2348012345678`)
6. Save — then start adding your perfumes!

## Manager Passcode

The passcode is entered using the phone-style keypad. Each button shows a number and its letters (like a real phone):

```
Password: ohtun03ola
```

On the keypad, type the digit that corresponds to each letter:
- o → 6
- h → 4
- t → 8
- u → 8
- n → 6
- 0 → 0
- 3 → 3
- o → 6
- l → 5
- a → 2

**So press: 6 4 8 8 6 0 3 6 5 2**

## Features

- ✦ Swipe carousel (touch/drag on mobile, arrow keys on desktop)
- ✦ Up to 5 images per perfume with inner image slider
- ✦ WhatsApp CTA with auto-filled perfume name in message
- ✦ Manager panel: Add, Edit, Delete products
- ✦ Settings: configure WhatsApp number and store name
- ✦ All data saved in browser localStorage (no backend needed)
- ✦ Fully responsive: mobile, tablet, desktop

## Notes

- Product data is stored in the visitor's browser localStorage. Since this is a static site, each device/browser will have its own storage. **Add your products once from your device after deployment** — visitors will see whatever is in their local storage after your initial setup.

> **Tip for consistent product display:** For best results across all visitors, consider hardcoding your initial products in `app.js` inside the `getProducts()` function as a default return value if localStorage is empty. This way, all new visitors see your products automatically.
