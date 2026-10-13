# Zaika Express

A colourful food-delivery website (Zomato-style) with a built-in Business Analyst lab.
Plain HTML, CSS and JavaScript. No build step, no installs.

## Run it

Option 1: double-click `index.html`. It opens in your browser.

Option 2: run a small local server (recommended while editing):

    cd zaika-express
    python -m http.server 8000

Then open http://localhost:8000

Stay online the first time so the fonts and the diagram library can load.

## Project structure

    index.html      page structure (storefront and BA lab sections)
    css/style.css   all colours, layout and dark mode (edit the :root block to re-theme)
    js/app.js       data, cart, coupons, checkout, dashboard, SQL console, Excel pivot

## What is inside

Storefront: search, cuisine chips, filters, menus, cart, coupons (ZAIKA50, NEWBITE, FREEDEL), demo checkout, order tracker.

BA lab: KPI dashboard, conversion funnel, retention cohorts, delivery-time chart, SQL console, Excel pivot with formulas, user stories (MoSCoW), order flow and ER diagrams.

## Where to change things

- Site name: search for "Zaika Express" in index.html, and the logo text in the header.
- Restaurants and menus: the `R` list at the top of js/app.js.
- Coupons: the `COUPONS` object in js/app.js.
- Sample orders for the dashboard: the `while(O.length<N)` loop in js/app.js. These are demo data, not real sales.
- Colours and fonts: the `:root` block in css/style.css.

## Notes

Orders and payments are demo only. Nothing is sent anywhere. Check that the name "Zaika Express" is free as a domain and trademark before using it for a real business.
