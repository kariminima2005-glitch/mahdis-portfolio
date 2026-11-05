# Notes

## Design decisions
- **Backgrounds use the palette.** In Between `#5A4135`, Rasta `#304563`, Children Hospital `#535746`, Iran Pavilion `#776656`; intro and closing pages `#5A4135`. Text is cream `#FCF5EE`. Drawings sit on cream sheets so linework stays readable.
- **No Gendo watermarks.** All 29 watermarked renders from the original portfolio were swapped for the clean visualisation taken from the same angle. Clean originals (the In Between and Rasta opening aerials, the three In Between eye-level views, all drawings and sketches) are kept as they were.
- **Same layout as the original** for the PDF: the original PowerPoint was recoloured and re-exported, not rebuilt from scratch. 15 pages were added for the extra renders, model views, elevations and visualisations, and page numbers and contents ranges were updated to match.
- **Text is the original text.** The only wording change: the In Between credit now reads "enhanced using AI visualisation tools" instead of "Gendo AI", because the images are no longer Gendo renders.
- **Nothing invented.** Facts that don't exist in the folder (year, location, studio) are left out rather than guessed.
- **Contact details** (email, phone, Tehran) are on the website and in the PDF, as approved.

## Worth a look
- AI-assisted images are labelled as such on the site; fine details in them are illustrative, the drawings are authoritative.
- The three Pavilion reference photos (dunes, superadobe, Shahr-e Farang device) come from the original portfolio; if they're someone else's photos, credit or remove them.

## ASCII journey (home page)
- `assets/ascii.js` — shared coloured-ASCII renderer (no libraries). Also makes every photo on the project pages resolve out of characters the first time it scrolls into view, and scrambles headings into place.
- `assets/journey.js` — the home intro: `img/extra/portrait_ascii.webp` (the portrait with its plain background removed and contrast lifted) is drawn as characters; scroll zooms ~150× into her left eye, then the camera flies forward through every image of every project. The background colour follows the project palette (#5A4135 → #304563 → #535746 → #776656). The HUD buttons jump between projects.
- Every image used on a project page is included in the flight, in the same order (`In Between` 37, `Rasta` 29, `Children Hospital` 23, `Iran Pavilion` 25 = 114). AI-assisted visualisations are tagged.
- With "reduce motion" switched on in the operating system, the home page shows the same images as a still grid instead.
