# Harsh's Portfolio v2 — Setup Guide

A rebuilt version of your portfolio: plain HTML, CSS and JavaScript
(no frameworks), with working tabs, a scroll-aware nav, animated skill
bars, and a contact form that actually sends mail.

## 1. Drop this into your existing repo (easiest option)

Your current site already has `PROJECT-IMAGES/`, `CERTIFICATES/` and
`cv.pdf` sitting in the repo — this new site reuses those exact same
file paths on purpose. So the fastest way to go live:

1. Open your `Personal-Portfolio-` repo.
2. Replace the old `index.html` with the one in this folder.
3. Add the `css/` and `js/` folders next to it.
4. Leave `PROJECT-IMAGES/`, `CERTIFICATES/` and `cv.pdf` exactly where they are.
5. Commit and push — GitHub Pages will pick it up automatically.

Everything (your photo, project screenshots, certificate, CV) will just
work immediately, no extra setup.

If any image path doesn't match, the page won't break — it shows a
small "add your image here" placeholder instead of a broken-image icon.

## 2. Make the contact form actually send you email

Static sites (GitHub Pages included) can't send email on their own, so
the form is wired to **Formspree** (free, no backend needed):

1. Go to [formspree.io](https://formspree.io) and create a free account.
2. Create a new form — you'll get an endpoint like
   `https://formspree.io/f/abcd1234`.
3. Open `js/script.js`, find this line near the top:
   ```js
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
4. Replace `YOUR_FORM_ID` with your real ID and save.

That's it — submissions will land in your inbox. Until you do this,
the form will show a friendly error pointing people to your email
instead of failing silently.

## 3. A couple of things worth a second look

- In the **Skills** tab, `React` and `Responsive Design` are shown at
  `0%` — carried over exactly as they were on your old site. Worth
  double-checking whether that was intentional or just never filled in.
- The **project "Code" links** (`github.com/ThatKunaal/Bhraman` and
  `.../Truck-Wala`) were inferred from your GitHub Pages URLs — quickly
  confirm they point to the right repos.
- **CodeChef** and **Codeforces** link to the general site (your old
  site didn't have real handles filled in either) — add your real
  profile URLs in `index.html` once you have them.

## 4. Where things live

```
index.html        → all content/structure
css/style.css      → design tokens + styling (edit --accent etc. in :root to retheme)
js/script.js       → tabs, nav, animations, form handling
assets/favicon.svg → browser tab icon
```

Skill bars, projects and certificates are plain HTML — to add a new
project or certificate, copy an existing `<article>` block in
`index.html` and edit the text/links.
