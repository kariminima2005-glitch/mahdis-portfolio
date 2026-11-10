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

## Her face, builder cursors and transitions (update)
- The home page opens at her face every time (the browser no longer drops you back in the middle of the flight); links such as `index.html#work` still jump to their place.
- Her face is drawn in coloured characters from `img/extra/portrait_ascii.webp` (background removed, contrast lifted). On load the characters settle into her face; the cursor scrambles the characters it passes over.
- The dive goes into her right eye. Measured on the portrait: iris centre (424, 435), radius 15.6 px, pupil 4.4 px, catchlight up and to the right, eyelid opening. As the iris fills the screen it is redrawn in characters: radial fibres (`- \ | /` along each fibre), an amber ring round the pupil, darker crypts, a dark limbal ring, shading under the upper lid, and her catchlight. The pupil dilates as you go in, rings pull you through it, and the flight through the projects starts from inside the pupil.
- `assets/cursors.js` — eight cursors, one per design tool on her CV (Revit, AutoCAD, Photoshop, Lumion, Enscape, 3ds Max, V-Ray, AI visualisation). They move like a hand: curved strokes, longer moves take longer but not proportionally, a little overshoot and settle, a faint tremor at rest, a click dip with a ring when they start and finish a selection, and their name tags trail behind the movement. They only appear on the project pages, once you scroll past the big photo at the top into the explanation: they frame each part of the page as it scrolls into view (with its size) and build it in, and at the end they gather round her email. The home page (her face, the eye and the flight) has no cursors. The bar shows progress and has a **Tour** button that plays the page by itself. Anything a cursor doesn't reach within 1.6 s builds itself.
- Page changes: characters sweep out from where you click and harden into the next project's colour; the next page dissolves back out of characters. Lightbox photos resolve from characters too.
- Phones: full-screen Menu, five cursors, and the layout no longer jumps when the address bar shows or hides.
- With "reduce motion" switched on, all of these effects are off and everything shows immediately.
