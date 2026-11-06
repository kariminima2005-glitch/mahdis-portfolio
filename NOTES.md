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

## 3D face, builder cursors and transitions (update)
- `assets/face3d.js` — her portrait as a real 3D relief rendered with WebGL, then turned into coloured characters by a second shader pass. The depth map `img/extra/portrait_depth.png` was built from a 478-point face mesh detected on the portrait (red = depth, green = her outline), so nose, cheeks and eye sockets have true depth. The head turns with the mouse; on phones, drag sideways, tilt the phone (Android) or watch it sway. Scrolling flies the camera into her right eye. Browsers without WebGL get the flat character portrait instead.
- `assets/cursors.js` — eight cursors, one per design tool on her CV (Revit, AutoCAD, Photoshop, Lumion, Enscape, 3ds Max, V-Ray, AI visualisation). They fly to each part of the page as it comes into view, drag a selection frame with its real size, and build it in; on the home page they inspect the photos flying past; at the end they gather round her email. The bar shows how many parts are built and has a **Tour** button that plays the page by itself. Anything a cursor doesn't reach within 1.6 s builds itself, so nothing stays hidden. Phones get five cursors.
- Page changes: characters sweep out from where you click and harden into the next project's colour; the next page dissolves back out of characters. Lightbox photos resolve from characters too.
- Phones: a full-screen Menu, sideways drag to turn her head, and the layout no longer jumps when the address bar shows or hides.
- With "reduce motion" switched on, all of these effects are off and everything shows immediately.
