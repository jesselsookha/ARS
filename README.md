# ARS

## Website Structure

```
ars-compiler/
├── index.html
├── css/
│   ├── reset.css
│   └── styles.css
├── js/
│   ├── state.js          — central form state object
│   ├── sections.js       — section definitions (fields, labels, help)
│   ├── render.js         — renders form fields per section
│   ├── validate.js       — validation logic
│   ├── compile.js        — compiles state into ARS.md
│   └── app.js            — bootstrap, event wiring
├── fonts/                — (empty; Google Fonts via CDN)
├── CHANGELOG.md
├── ARS.md                — template reference (for comparison)
└── README.md
```