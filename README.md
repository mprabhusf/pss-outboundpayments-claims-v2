# Integrated Eligibility (IE) V4 — Public Benefits Application

A multi-step, form-heavy government benefits application prototype for **National Benefits**.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Show the app in Cursor’s browser tab

1. Start the dev server (`npm run dev` or **Run Task → Start dev server**).
2. **Cmd+Shift+P** (Mac) or **Ctrl+Shift+P** (Windows/Linux) to open the Command Palette.
3. Run **“Simple Browser: Show”**.
4. Enter **http://localhost:5173** and press Enter.

The app opens in a browser tab inside Cursor.

## Build

```bash
npm run build
npm run preview   # preview production build
```

## Structure

- **Global layout**: Header (logo, nav, search, avatar), footer, breadcrumbs, application header with tabs, left section nav, bottom action bar, floating assistant.
- **Design system**: Warm amber primary, soft peach/beige secondary, Source Sans 3, cards and form controls in `src/styles/global.css`.
- **Screens**: Landing → Applicant Info → Household → Income → Expenses → Housing → Assets → Eligible Benefits → SNAP/TANF/Medicaid details → Acknowledgement & Signature → Confirmation.
- **State**: Step sync from URL, action bar set per screen, sequential unlock in left nav.

## Tech

- React 18, TypeScript, Vite, React Router 6.
