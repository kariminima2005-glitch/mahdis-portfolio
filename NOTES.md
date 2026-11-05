# Notes — design decisions and pre-publish checks

## Design decisions

- **Content source.** All project text is copied word for word from the original `PT 18.pptx`, including its spelling. "Kenarak" and "Konarak" both appear in the original Pavilion text; neither was changed. Earlier AI editions rewrote some copy, for example "Three volumes. Two bridges.". None of that rewritten text is used here.
- **Images, original first.** Every project page leads with the original renders and drawings, captioned with the label printed beside them on the original slide. The V5 AI renders appear only in a separate "More views" band on each page and on one PDF page per project. Both are labelled "AI-assisted visualisation".
- **Films drive the interaction.**
  - The home hero loops `hero.mp4`.
  - Hovering a project card plays that project's film.
  - The home page has the full film with chapter buttons, a timeline segmented by project, scrubbing with thumbnail previews, a clickable scene strip and arrow-key scene stepping.
  - Each project page has its own film. It plays muted when scrolled into view and pauses when it leaves the screen, and it has the same scene-jump controls.
  - All films are the earlier AI cut of still visualisations, and the page says so.
- **Palette.** `--c1 #5A4135`, `--c2 #304563`, `--c3 #535746`, `--c4 #776656`, each assigned to one project (In Between, Rasta, Hospital, Pavilion).
  - The background is a light neutral `#F7F2EC`.
  - Body text is `#2E221C`, a deepened `--c1`, at about 13:1 contrast. Secondary text is `--c1` itself, at about 8:1.
  - Text on coloured panels is the paper colour.
- **Type.** Syne for display and Instrument Sans for body, loaded from Google Fonts on the site. The PDF embeds Syne SemiBold and Instrument Sans Regular.
- **Motion.**
  - Scroll reveals, image clip reveals, split-letter titles, hero parallax and colour-wipe page transitions.
  - All of it switches off under "reduce motion". Films don't autoplay then.
  - No JavaScript libraries are used.
- **Lightbox.** Click any image to open it. Click again or use the mouse wheel to zoom, drag to pan, swipe or use the arrow keys to move between images, and Esc to close.
- **Performance.**
  - Films are re-encoded to 1280 px. Grid and rail images are 800 px thumbnails, and full-size images load only in the lightbox. Lazy loading is used throughout.
  - The full film is 42 MB, but it only loads when someone presses play.
  - The heaviest page load is the home hero film at 2.4 MB.
- **Privacy.** There is no email, phone number, "Tehran, Iran" or portrait photo on the site or in the PDF. The contact line is a visible TODO.
- **PDF.** A4 landscape at trim size, with no bleed. Full-bleed images run to the paper edge.

## Check before publishing

1. **Open the site and look at it.** I could not view it in a browser from here (the Chrome extension wasn't connected), so it has only been checked structurally:
    - no missing files or broken links
    - valid HTML and film data
    - no JavaScript syntax errors
    - no file over GitHub's 100 MB limit
    
   Open `site/index.html` in Chrome or Edge on desktop and on a phone, and check the films, the lightbox and the mobile layout.
2. **Resolve every `[TODO: ...]`.** They are highlighted in yellow on the site and in the PDF.
    - Year, location and course/studio for each project.
    - A personal statement for the About section. None exists in the original.
    - A contact line, if you want one.
    - A design-approach text for Children Hospital. The original has only a concept paragraph.
    - Credits for the three Pavilion reference photos: dunes, superadobe and the Shahr-e Farang device. They look like third-party photos, so credit them or remove them.
3. **Check caption pairings on four original slides.** The labels sit between images there, so the pairings were matched by position:
    - In Between: "Walking Bridge" vs the fourth "Perspective".
    - Children Hospital: "Emergency Entrance" vs "Main Entrance", plus two unlabelled views now captioned "Perspective".
4. **Check for watermarks.** Earlier notes say some original Gendo/NewArc renders carry watermarks. They are shown as they are, and nothing was retouched. The In Between text credits Gendo AI, as in the original.
5. **Confirm the AI views are OK to publish.** If you'd rather not include them, delete the `img/ai/` folder and the "More views" sections, or tell me and I'll rebuild without them.

## Publishing on GitHub Pages

The `site` folder is the website. Publish its contents as the root of a repository.

1. On github.com, create a new **public** repository, for example `mahdis-portfolio`. Don't add a README.
2. Open PowerShell and run:

   ```powershell
   cd "C:\Users\NOone\Documents\Mahdis\site"
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mahdis-portfolio.git
   git push -u origin main
   ```
   
   Don't use Git LFS for the `.mp4` files, because GitHub Pages can't serve LFS files.
3. On GitHub, go to **Settings → Pages**. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: `main`**, folder **`/ (root)`**, and click **Save**.
4. Wait 1–2 minutes. The site will be live at `https://<your-username>.github.io/mahdis-portfolio/`. All links are relative, so it works under that sub-path.
5. To update it later, edit the files, then run `git add .`, `git commit -m "Update"` and `git push`.

The existing `Documents\Mahdis\Mahdis` repo is empty, with no remote and Git LFS configured. Leave it alone, or delete it if it was a false start.
