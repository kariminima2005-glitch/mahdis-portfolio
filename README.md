# Mahdis Sabzi — portfolio website and PDF

Static portfolio site (plain HTML, CSS and JavaScript, no build step) plus a print-ready PDF. Built 5 November 2026 from the files in `Documents\Mahdis`. Nothing in the original folder was changed.

- **Website:** this folder (`site/`). Open `index.html` directly, or publish to GitHub Pages (steps in `NOTES.md`).
- **PDF:** `../pdf/Mahdis_Sabzi_Portfolio_A4.pdf` (39 pages, A4 landscape). An identical copy is `portfolio.pdf` here so the site can offer it as a download.

Sources referred to below:

- **PT 18.pptx** — the original 29-slide portfolio. All project text is copied from it word for word. All original images come from its `ppt/media` folder (the same pictures as in the four project zips).
- **V5 export** — `combines work almost all of it is here/Mahdis_Complete_Project_Export_2026-11-05.zip`, the latest earlier AI edition. Source of the films, the AI-assisted renders and their captions.

## Pages

| File | What it does | Content from |
|---|---|---|
| `index.html` | Home: hero film loop, project grid (hover plays each project film), full portfolio film with chapters/timeline/scene strip, About (education and skills) | Text: PT 18.pptx slides 1–3. Film: V5 `site/media/hero.mp4`, `experience.mp4` |
| `in-between.html` | In Between: hero, concept, project film with scene jump, design approach, drawings, perspectives, AI-assisted views rail, next-project link | PT 18.pptx slides 4–11; film V5 `site/media/p1.mp4` |
| `rasta.html` | Rasta Sport Complex: hero, concept, project film with scene jump, design approach, drawings, perspectives, AI-assisted views rail, next-project link | PT 18.pptx slides 12–16; film V5 `site/media/p2.mp4` |
| `children-hospital.html` | Children Hospital: hero, concept, project film with scene jump, design approach, drawings, perspectives, AI-assisted views rail, next-project link | PT 18.pptx slides 17–22; film V5 `site/media/p3.mp4` |
| `iran-pavilion.html` | Iran Pavilion: hero, concept, project film with scene jump, design approach, drawings, perspectives, AI-assisted views rail, next-project link | PT 18.pptx slides 23–28; film V5 `site/media/p4.mp4` |
| `404.html` | Sends unknown URLs back to the home page | — |
| `.nojekyll` | Tells GitHub Pages to serve files as they are | — |
| `portfolio.pdf` | Download copy of the PDF portfolio | Built here (see `../pdf`) |
| `README.md`, `NOTES.md` | This file; design decisions and pre-publish checklist | — |

## Code

| File | What it does |
|---|---|
| `assets/style.css` (17 KB) | All styling. Palette `#5A4135`, `#304563`, `#535746`, `#776656` as CSS variables; Syne + Instrument Sans from Google Fonts |
| `assets/main.js` (13 KB) | Nav behaviour, split-letter headings, scroll reveals, hero parallax, hover film previews, film player (chapters, scrubbing, scene strip, keyboard), drag rails, lightbox (zoom, pan, swipe, keys), page transitions. No libraries |

## Films (`media/`)

Re-encoded to 1280 px wide H.264 for the web (silent, as the originals are). Originals are 1920×1080 and untouched.

| File | Size | From |
|---|---|---|
| `media/hero.mp4` | 2.4 MB | V5 export `site/media/hero.mp4` |
| `media/experience.mp4` | 40.2 MB | V5 export `site/media/experience.mp4` |
| `media/p1.mp4` | 4.7 MB | V5 export `site/media/p1.mp4` |
| `media/p2.mp4` | 5.1 MB | V5 export `site/media/p2.mp4` |
| `media/p3.mp4` | 5.2 MB | V5 export `site/media/p3.mp4` |
| `media/p4.mp4` | 3.3 MB | V5 export `site/media/p4.mp4` |
| `img/film/*-poster.webp` | — | Frame at 1.5 s of each film |
| `img/film/p1_car/ramp/dusk.thumb.webp` | — | V5 export `site/img/` thumbnails of the three original In Between eye-level views (film scene strip) |

## Original images (`img/orig/`)

Each image has a full-size `.webp` (max 2000 px) and a `.thumb.webp` (max 800 px). Captions are the labels printed beside the image on the original slide.

| Web file | Project | Caption | Original |
|---|---|---|---|
| `img/orig/image6.webp` | In Between | In Between — opening image | PT 18.pptx › ppt/media/image6.png (1672×941) |
| `img/orig/image7.webp` | In Between | Design Process | PT 18.pptx › ppt/media/image7.png (3629×3243) |
| `img/orig/image9.webp` | In Between | Functional Zoning — White: Commercial, Black: Residential, Yellow: Public Space | PT 18.pptx › ppt/media/image9.png (2155×730) |
| `img/orig/image8.webp` | In Between | Vertical Access | PT 18.pptx › ppt/media/image8.png (2160×1200) |
| `img/orig/image10.webp` | In Between | Site Plan | PT 18.pptx › ppt/media/image10.png (2144×1200) |
| `img/orig/image12.webp` | In Between | Sample Plan 1 — SC: 1/200 | PT 18.pptx › ppt/media/image12.png (1928×1231) |
| `img/orig/image11.webp` | In Between | Sample Plan 2 — SC: 1/200 | PT 18.pptx › ppt/media/image11.png (1990×986) |
| `img/orig/image13.webp` | In Between | Section A-A — SC: 1/600 | PT 18.pptx › ppt/media/image13.png (1942×715) |
| `img/orig/image14.webp` | In Between | Section A-A | PT 18.pptx › ppt/media/image14.png (2144×1200) |
| `img/orig/image15.webp` | In Between | Public Space | PT 18.pptx › ppt/media/image15.jpg (2144×1200) |
| `img/orig/image17.webp` | In Between | Landscape in Yard | PT 18.pptx › ppt/media/image17.jpg (2144×1200) |
| `img/orig/image16.webp` | In Between | Walking Bridge | PT 18.pptx › ppt/media/image16.jpg (2144×1200) |
| `img/orig/image18.webp` | In Between | Perspective | PT 18.pptx › ppt/media/image18.jpg (2144×1216) |
| `img/orig/image21.webp` | In Between | Eye-level Perspective | PT 18.pptx › ppt/media/image21.png (1672×941) |
| `img/orig/image19.webp` | In Between | Pedestrian and Car Entrance | PT 18.pptx › ppt/media/image19.png (1672×941) |
| `img/orig/image20.webp` | In Between | Entrance Ramp and Stairs | PT 18.pptx › ppt/media/image20.png (1672×941) |
| `img/orig/image22.webp` | Rasta Sport Complex | Rasta Sport Complex — opening image | PT 18.pptx › ppt/media/image22.png (1672×941) |
| `img/orig/image23.webp` | Rasta Sport Complex | Zoning and Spatial Organization | PT 18.pptx › ppt/media/image23.png (4956×3413) |
| `img/orig/image24.webp` | Rasta Sport Complex | Design Process | PT 18.pptx › ppt/media/image24.png (2144×1028) |
| `img/orig/image25.webp` | Rasta Sport Complex | Floor Plan — SC: 1/550 (±0.00 m / +3.00 m) | PT 18.pptx › ppt/media/image25.png (8200×9586) |
| `img/orig/image26.webp` | Rasta Sport Complex | Section 1-1 — SC: 1/300 | PT 18.pptx › ppt/media/image26.png (3090×986) |
| `img/orig/image27.webp` | Rasta Sport Complex | Section 2-2 — SC: 1/600 | PT 18.pptx › ppt/media/image27.png (1175×264) |
| `img/orig/image29.webp` | Rasta Sport Complex | Perspective | PT 18.pptx › ppt/media/image29.png (2144×1200) |
| `img/orig/image30.webp` | Rasta Sport Complex | Perspective | PT 18.pptx › ppt/media/image30.png (2144×1200) |
| `img/orig/image31.webp` | Rasta Sport Complex | Perspective | PT 18.pptx › ppt/media/image31.png (2144×1200) |
| `img/orig/image32.webp` | Rasta Sport Complex | Perspective | PT 18.pptx › ppt/media/image32.png (2144×1200) |
| `img/orig/image33.webp` | Children Hospital | Children Hospital — opening image | PT 18.pptx › ppt/media/image33.jpg (1920×1080) |
| `img/orig/image34.webp` | Children Hospital | Patient and Staff Circulation Diagram — Ground, First and Second Floor | PT 18.pptx › ppt/media/image34.png (1586×992) |
| `img/orig/image35.webp` | Children Hospital | Spatial Relationship Diagram | PT 18.pptx › ppt/media/image35.jpeg (1920×1200) |
| `img/orig/image45.webp` | Children Hospital | Ground Floor — SC: 1/500 | PT 18.pptx › ppt/media/image45.png (1176×879) |
| `img/orig/image46.webp` | Children Hospital | First Floor — SC: 1/500 | PT 18.pptx › ppt/media/image46.png (1164×900) |
| `img/orig/image47.webp` | Children Hospital | Second Floor — SC: 1/500 | PT 18.pptx › ppt/media/image47.png (1146×852) |
| `img/orig/image38.webp` | Children Hospital | Main Entrance | PT 18.pptx › ppt/media/image38.jpg (2144×1200) |
| `img/orig/image37.webp` | Children Hospital | Emergency Entrance | PT 18.pptx › ppt/media/image37.jpg (1968×1312) |
| `img/orig/image36.webp` | Children Hospital | Building Entrance Elevation | PT 18.pptx › ppt/media/image36.png (2144×1200) |
| `img/orig/image39.webp` | Children Hospital | Outdoor Children’s Playground | PT 18.pptx › ppt/media/image39.jpg (2144×1200) |
| `img/orig/image40.webp` | Children Hospital | Perspective | PT 18.pptx › ppt/media/image40.jpg (1968×1312) |
| `img/orig/image41.webp` | Children Hospital | Outdoor Children’s Playground | PT 18.pptx › ppt/media/image41.jpg (1968×1312) |
| `img/orig/image42.webp` | Children Hospital | General Inpatient | PT 18.pptx › ppt/media/image42.jpg (1968×1312) |
| `img/orig/image44.webp` | Children Hospital | Emergency Examination | PT 18.pptx › ppt/media/image44.jpg (2176×1200) |
| `img/orig/image43.webp` | Children Hospital | Perspective | PT 18.pptx › ppt/media/image43.jpg (2176×1200) |
| `img/orig/image2.webp` | Iran Pavilion | Iran Pavilion — opening image | PT 18.pptx › ppt/media/image2.jpg (1968×1312) |
| `img/orig/image48.webp` | Iran Pavilion | Design Process | PT 18.pptx › ppt/media/image48.jpeg (1500×1039) |
| `img/orig/image49.webp` | Iran Pavilion | Design Process | PT 18.pptx › ppt/media/image49.jpeg (1397×1500) |
| `img/orig/image60.webp` | Iran Pavilion | Plan — SC: 1/100 | PT 18.pptx › ppt/media/image60.png (5747×9575) |
| `img/orig/image59.webp` | Iran Pavilion | Section 1-1 — SC: 1/170 | PT 18.pptx › ppt/media/image59.png (2382×1684) |
| `img/orig/image58.webp` | Iran Pavilion | Section 2-2 — SC: 1/130 | PT 18.pptx › ppt/media/image58.png (8545×1718) |
| `img/orig/image51.webp` | Iran Pavilion | Design Process | PT 18.pptx › ppt/media/image51.jpg (2032×1280) |
| `img/orig/image53.webp` | Iran Pavilion | Entrance | PT 18.pptx › ppt/media/image53.png (1616×1616) |
| `img/orig/image54.webp` | Iran Pavilion | Shahr-e Farang Gallery | PT 18.pptx › ppt/media/image54.jpg (1616×1616) |
| `img/orig/image56.webp` | Iran Pavilion | Carpet Gallery | PT 18.pptx › ppt/media/image56.jpg (1616×1616) |
| `img/orig/image57.webp` | Iran Pavilion | Kenarak Gallery | PT 18.pptx › ppt/media/image57.jpg (1984×1312) |
| `img/orig/image50.webp` | Iran Pavilion | Design Process — reference image [TODO: credit] | PT 18.pptx › ppt/media/image50.jpg (800×500) |
| `img/orig/image52.webp` | Iran Pavilion | Super adobe Structural System — reference image [TODO: credit] | PT 18.pptx › ppt/media/image52.jpg (768×576) |
| `img/orig/image55.webp` | Iran Pavilion | Shahr-e Farang Gallery — reference image [TODO: credit] | PT 18.pptx › ppt/media/image55.JPG (330×518) |

## AI-assisted views (`img/ai/`)

Copied unchanged from the V5 export `site/img/` (already web-sized WebP, 1672 px). Captions are V5's own. These are AI visualisations generated in earlier portfolio work from the original plans and models, and are labelled as such everywhere they appear.

| Web file | Project | Caption |
|---|---|---|
| `img/ai/p1_signature_v5.webp` (+ `.thumb`) | In Between | Shared terraces in the last light |
| `img/ai/p1_street_corner_v5.webp` (+ `.thumb`) | In Between | Street corner and connected homes |
| `img/ai/p1_courtyard_reverse_v5.webp` (+ `.thumb`) | In Between | The courtyard from the opposite path |
| `img/ai/p1_yard_v4.webp` (+ `.thumb`) | In Between | The planted shared courtyard at dusk |
| `img/ai/p1_bridge_threshold_v5.webp` (+ `.thumb`) | In Between | At the bridge threshold |
| `img/ai/p1_bridge_v4.webp` (+ `.thumb`) | In Between | Walking through the elevated bridge at dusk |
| `img/ai/p1_bridge_lateral_v5.webp` (+ `.thumb`) | In Between | A lateral view along the bridge |
| `img/ai/p1_walk_v4.webp` (+ `.thumb`) | In Between | Public walkway overlooking the connected volumes |
| `img/ai/p1_terrace_reverse_v5.webp` (+ `.thumb`) | In Between | Across the shared terrace |
| `img/ai/p1_public_v4.webp` (+ `.thumb`) | In Between | Elevated public terraces at blue hour |
| `img/ai/p1_aerial_orbit_v5.webp` (+ `.thumb`) | In Between | The linked volumes from above |
| `img/ai/p1_aerial_v4.webp` (+ `.thumb`) | In Between | Three linked volumes — aerial architectural visualisation |
| `img/ai/p1_site_v4.webp` (+ `.thumb`) | In Between | Three volumes within the curved site — overhead visualisation |
| `img/ai/p2_signature_v5.webp` (+ `.thumb`) | Rasta Sport Complex | Light beneath the tensile canopy |
| `img/ai/p2_spine_arrival_v5.webp` (+ `.thumb`) | Rasta Sport Complex | Arrival along the Green Spine |
| `img/ai/p2_running_plaza_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — running loop and public plaza |
| `img/ai/p2_walking_cycle_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — bicycle shelter and planted walking route |
| `img/ai/p2_canopy_edge_v5.webp` (+ `.thumb`) | Rasta Sport Complex | Under the canopy edge |
| `img/ai/p2_cycle_bend_v5.webp` (+ `.thumb`) | Rasta Sport Complex | At the bend of the cycle route |
| `img/ai/p2_raised_cycling_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — raised cycle route over the courts |
| `img/ai/p2_padel_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — courts beside the elevated Green Spine |
| `img/ai/p2_courts_reverse_v5.webp` (+ `.thumb`) | Rasta Sport Complex | Courts seen from the connecting route |
| `img/ai/p2_basketball_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — basketball and spectator seating |
| `img/ai/p2_climbing_play_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — climbing wall and play courtyard |
| `img/ai/p2_covered_football_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — football under the tensile canopy |
| `img/ai/p2_football_touchline_v5.webp` (+ `.thumb`) | Rasta Sport Complex | Along the covered football touchline |
| `img/ai/p2_aerial_orbit_v5.webp` (+ `.thumb`) | Rasta Sport Complex | The sports landscape from the other side |
| `img/ai/p2_aerial_v4.webp` (+ `.thumb`) | Rasta Sport Complex | Rasta — the Green Spine within the triangular site |
| `img/ai/p3_signature_v5.webp` (+ `.thumb`) | Children Hospital | A quiet morning in the healing atrium |
| `img/ai/p3_arrival_oblique_v5.webp` (+ `.thumb`) | Children Hospital | Arrival from the garden path |
| `img/ai/p3_main_entrance_v4.webp` (+ `.thumb`) | Children Hospital | Main entrance |
| `img/ai/p3_entrance_elevation_v4.webp` (+ `.thumb`) | Children Hospital | Coloured facade and entrance landscape |
| `img/ai/p3_atrium_ground_v5.webp` (+ `.thumb`) | Children Hospital | Through the entrance atrium |
| `img/ai/p3_entrance_hall_v4.webp` (+ `.thumb`) | Children Hospital | Entrance hall and atrium |
| `img/ai/p3_hall_upper_v5.webp` (+ `.thumb`) | Children Hospital | The hall from the upper landing |
| `img/ai/p3_reception_waiting_v4.webp` (+ `.thumb`) | Children Hospital | Reception and family waiting area |
| `img/ai/p3_inpatient_v4.webp` (+ `.thumb`) | Children Hospital | General inpatient nursing station and recovery circulation |
| `img/ai/p3_emergency_entrance_v4.webp` (+ `.thumb`) | Children Hospital | Emergency entrance |
| `img/ai/p3_emergency_oblique_v5.webp` (+ `.thumb`) | Children Hospital | The emergency approach |
| `img/ai/p3_emergency_exam_v4.webp` (+ `.thumb`) | Children Hospital | Emergency examination and staff station |
| `img/ai/p3_play_courtyard_ground_v4.webp` (+ `.thumb`) | Children Hospital | Play courtyard and family garden - ground view |
| `img/ai/p3_garden_reverse_v5.webp` (+ `.thumb`) | Children Hospital | The play garden from the shaded edge |
| `img/ai/p3_roof_play_eye_v5.webp` (+ `.thumb`) | Children Hospital | Among the elevated play spaces |
| `img/ai/p3_play_courtyard_aerial_v4.webp` (+ `.thumb`) | Children Hospital | Play courtyard and healing garden - elevated view |
| `img/ai/p3_aerial_context_v4.webp` (+ `.thumb`) | Children Hospital | Aerial and context view |
| `img/ai/p4_signature_v5.webp` (+ `.thumb`) | Iran Pavilion | Mirrorwork and water at the entrance threshold |
| `img/ai/p4_approach_reverse_v5.webp` (+ `.thumb`) | Iran Pavilion | The earthen shells from the opposite approach |
| `img/ai/p4_approach_v4.webp` (+ `.thumb`) | Iran Pavilion | Approach to the Iran Pavilion at dusk |
| `img/ai/p4_entrance_v4.webp` (+ `.thumb`) | Iran Pavilion | Mirror work and water at the entrance |
| `img/ai/p4_entry_water_edge_v5.webp` (+ `.thumb`) | Iran Pavilion | Mirror reflections at the entrance water edge |
| `img/ai/p4_farang_v4.webp` (+ `.thumb`) | Iran Pavilion | Shahr-e Farang cultural viewing gallery |
| `img/ai/p4_farang_oblique_v5.webp` (+ `.thumb`) | Iran Pavilion | Cultural viewing niches along Shahr-e Farang |
| `img/ai/p4_carpet_v4.webp` (+ `.thumb`) | Iran Pavilion | The L-shaped Carpet Gallery |
| `img/ai/p4_carpet_turn_reverse_v5.webp` (+ `.thumb`) | Iran Pavilion | The wall carpet around the gallery turn |
| `img/ai/p4_kenarak_v4.webp` (+ `.thumb`) | Iran Pavilion | Four cultural mounds in the Kenarak Gallery |
| `img/ai/p4_kenarak_water_path_v5.webp` (+ `.thumb`) | Iran Pavilion | Along the water path between four cultural hills |
| `img/ai/p4_cafe_v4.webp` (+ `.thumb`) | Iran Pavilion | The café around its central service island |
| `img/ai/p4_elevation_v4.webp` (+ `.thumb`) | Iran Pavilion | Earthen shell profiles at dusk |
| `img/ai/p4_aerial_low_v5.webp` (+ `.thumb`) | Iran Pavilion | A lower oblique view across all five shells |
| `img/ai/p4_aerial_v4.webp` (+ `.thumb`) | Iran Pavilion | Pavilion site and unequal earthen shells |

## PDF (`../pdf/`)

| File | What it is |
|---|---|
| `Mahdis_Sabzi_Portfolio_A4.pdf` | 39-page A4 landscape portfolio: cover, About + contents, then per project an opener, design approach, drawings, perspectives and one page of AI-assisted views; closing page. Same text, palette and fonts as the site. Images at about 220 dpi; fonts embedded |

Built with Python (ReportLab) from the same content data as the site, then optimised with Ghostscript. Fonts: Syne SemiBold and Instrument Sans Regular from the V5 export `code/authoring/fonts/`.
