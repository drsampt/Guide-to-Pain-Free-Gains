# Lead Magnet Funnel — Top Performance Physical Therapy

**Live URL:** https://drsampt.github.io/lead-magnet-funnel/

A complete lead capture funnel for serious strength athletes. Visitors enter their contact info to receive *"The Lifter's Guide to Pain-Free Gains: Scale It, Don't Stop It"* — a 7-protocol PDF playbook for training through pain.

---

## Features

- Landing page with animated hero, value cards, social proof, and lead capture form
- Thank-you / access page with PDF download and CTAs
- Client-side form validation (inline errors, phone auto-format)
- Slack `#leads` notification on every form submission (via Zapier webhook)
- Responsive, mobile-first design — Poppins font, brand colors
- Pure HTML/CSS/JS — no build step, no dependencies, instant GitHub Pages deploy

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | GitHub Pages |
| Frontend | Vanilla HTML, CSS, JavaScript |
| Font | Poppins (Google Fonts) |
| Form backend | Zapier Catch Hook → Slack |
| Lead magnet PDF | Canva (exported at pro quality) |

---

## Project Structure

```
lead-magnet-funnel/
├── index.html                          # Landing / lead capture page
├── access.html                         # Thank you + PDF download page
├── css/
│   └── style.css                       # All styles (mobile-first)
├── js/
│   └── form.js                         # Form validation + Zapier submission
├── public/
│   └── downloads/
│       └── Scale_It_Dont_Stop_It.pdf   # Lead magnet PDF
├── .gitignore
└── README.md
```

---

## Setup: Slack Notifications via Zapier (Required)

The form posts JSON to a Zapier "Catch Hook" webhook, which sends a formatted message to Slack `#leads`.

### Step 1 — Create the Zap

1. Go to [zapier.com](https://zapier.com) → **Create Zap**
2. **Trigger:** Search "Webhooks by Zapier" → Choose **Catch Hook** → Continue
3. Copy the webhook URL (looks like `https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/`)
4. Click **Test trigger** (you can skip or send a test POST later)

### Step 2 — Add the Slack Action

1. **Action app:** Slack
2. **Action event:** Send Channel Message
3. **Channel:** `#leads`
4. **Message text:** (map from trigger data — example below)

```
🎯 New Lead Captured
Name: {{firstName}} {{lastName}}
Email: {{email}}
Phone: {{phone}}
Timestamp: {{timestamp}}
Source: {{source}}
```

5. Turn on the Zap and publish it.

### Step 3 — Add the Webhook URL to form.js

Open `js/form.js` and replace the placeholder:

```js
// Before
const FORM_ENDPOINT = 'REPLACE_WITH_ZAPIER_WEBHOOK_URL';

// After
const FORM_ENDPOINT = 'https://hooks.zapier.com/hooks/catch/XXXXXXX/YYYYYYY/';
```

Commit and push. Done — every form submission now posts to Slack `#leads` in real time.

---

## Deployment (GitHub Pages)

```bash
# Clone
git clone https://github.com/drsampt/lead-magnet-funnel.git
cd lead-magnet-funnel

# Push changes
git add .
git commit -m "Your message"
git push origin main
```

GitHub Pages auto-deploys on every push to `main`.

**Enable Pages** (first time only):
`Settings → Pages → Source: Deploy from branch → Branch: main → / (root) → Save`

---

## Customization

| Change | Where |
|---|---|
| Headline / copy | `index.html`, `access.html` |
| Brand colors | `css/style.css` (find/replace `#CFB87C`) |
| CTA links | `access.html` (href attributes) |
| PDF file | Replace `public/downloads/Scale_It_Dont_Stop_It.pdf` |
| Webhook URL | `js/form.js` → `FORM_ENDPOINT` constant |
| Form fields | `index.html` form + `js/form.js` validateForm() + Zapier field mapping |

---

## Brand Colors

| Name | Hex |
|---|---|
| Gold | `#CFB87C` |
| Gold Dark | `#a89860` |
| Black | `#000000` |
| White | `#ffffff` |
| Grey | `#808080` |
| Error | `#dc2626` |
| Success | `#10b981` |

---

## Contact

Dr. Sam Englander, PT, DPT  
Top Performance Physical Therapy  
Denver, CO
