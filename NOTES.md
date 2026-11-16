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

## Home page: her face → her eye → a flower → the projects
- `assets/journey.js` draws her portrait (`img/extra/portrait_ascii.webp`) in coloured characters. Scrolling is one continuous camera move: her face, her right eye (iris redrawn in characters, with her catchlight), a pink dahlia inside her pupil, then on into the heart of the flower, which thins away into the first project's colour.
- The flower (`img/extra/flower.webp`) is a real photo — "Dahlia" by vultilion on Flickr, CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/), from scikit-learn's sample images — cut out, recoloured pink and contrast-lifted. The credit shows on screen while the flower is visible.
- `assets/showcase.js` — the four projects, laid out one per screen: title, type, the opening of the concept text, image and film counts, an Open project button, the project film (plays on hover, or tap Play on phones; the frame tilts towards the pointer) and a draggable strip of every image of that project (click any to open it full size). Pills at the top (bottom on phones) jump between projects.
- With "reduce motion" switched on, the dive is skipped and everything shows immediately.

## Refinement (November 2026)
- **Paper pages.** After the dive, every page is warm paper with dark ink; the project colour is kept for the home-page project panels, the film sections and small accents. Display type is Instrument Serif, text is Instrument Sans.
- **The builder cursors are gone**, with the character scrambling of headings and photos. Pictures fade in; pages change behind a plain curtain in the next page's colour.
- **The flower in her eye is drawn by code and blooms.** `flowerCell` in `assets/journey.js` draws six rings of petals round a golden heart, cell by cell: the outer rings open first as the pupil widens, the petals unwind, sway and carry fine veins, a ring of light travels out across them, and they swell and brighten under the pointer. The heart is a spiral of seeds that repeats at every scale, so the dive carries on into it and the seeds scatter into the paper of the projects. The dahlia photo (`img/extra/flower.webp`) is no longer used or loaded, so its credit line is gone from the page. A small Face / Eye / Flower / Work marker follows the dive.
- **Revit drawing sets.** Each project page has a "Revit drawing set" section with A1 sheets exported from the Revit models (`img/revit/`), opening in the zoomable viewer. Children Hospital: the second floor is modelled; ground and first floor plans are the original drawings registered to the model. Iran Pavilion: the model was built from the original plan and sections.
- **Project pages** have a facts row (type, software, image count, film length, sheets), a reading-progress line and a section index on the right edge (`assets/refine.js`).
- `assets/refine.css` is loaded after `style.css` and holds all of the above styling.
- With "reduce motion" switched on, the dive, reveals and curtain are off.

## 3D models (November 2026)

Each project on the home page opens with its Revit model in WebGL (`.m3d` sections, before each `.sc-panel`).
Scrolling raises a section plane through the building (Plan → Section → Model) while the camera comes down
from plan view and the sun moves round; drag (or arrow keys) turns the model.

- `models/*.mdl`: geometry exported from the four `.rvt` files (gzip of a JSON header + 16-bit positions,
  triangle and edge indices). Railings, window frames and small objects are simplified; nothing is redrawn by hand.
- `assets/model3d.js`: three.js scene, bundled; loaded by `showcase.js` only when the projects are near.
- Fallbacks: no WebGL / failed load → the poster in `img/m3d/`; reduced motion → the finished model, no pinning.
