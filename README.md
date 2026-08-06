# Chew Z — Short Fiction


A single dark screen: your stories listed on the left, a candlelit stage in
the middle. Hovering a story shows its synopsis on the stage; the file icon
opens the story as a PDF. On phones, tapping the eye expands the synopsis
under the title instead.

## What's in the folder

```
stories.js      YOUR STORY LIST — the file you'll edit most
index.html      the page text (theme, about, author's notes, email)
style.css       all the styling (colours, fonts, layout)
script.js       behaviour — you never need to touch it
pdfs/           your stories, one PDF each, numbered: 01.pdf, 02.pdf ...
covers/         a cover image per story, numbered to match: 01.jpg ...
assets/         the background artwork + favicon + optional extras
```

## Look at it now

Double-click `index.html`. Hover over a story title and watch the stage.

## Make it yours

Open `index.html` in a text editor and change:

- `Chew Z` in the `<title>` and the header, if the pen name ever changes
- the theme paragraph in `panel-home` (the big centred text)
- the author's note beneath it
- the `panel-about` and `panel-notes` text — both marked `CHANGE THIS`
- `you@example.com` in the About panel and the footer (three places)

## Add a story

1. Export the story as a PDF into `pdfs/` and drop a cover image
   into `covers/`, both named by the story's position in the list:
   story 4 = `pdfs/04.pdf` + `covers/04.jpg`. With numbered names,
   the site finds both files on its own.
2. Open `stories.js` and copy one `{ ... }` block. Paste it wherever
   you want the story in the list (top = first on the site) and fill
   in the four fields:

   ```js
   {
     title: "The Long Way Round",
     words: "820 words",
     synopsis: "One or two sentences shown when a reader hovers."
   },
   ```

3. Save, refresh. Numbering is automatic; the hover behaviour picks
   the story up on its own. Reordering stories = reordering blocks.
   Removing one = deleting its block. Mind the commas between blocks.


## The two optional atmosphere slots

**Backdrop image.** Your artwork is installed at `assets/backdrop.jpg`;
replace that file to change the scene — it's automatically darkened and
vignetted to keep the text readable. If it's ever deleted, the site falls
back to the built-in illustration at `assets/backdrop.svg`.

**Ambient sound.** Drop an audio file at `assets/ambient.mp3` — rain,
fireplace, wind — and the speaker icon in the header starts working.
Without the file, the button simply does nothing.

Free sources for both: Unsplash (images), Pixabay (ambient audio). Check
each file's licence allows web use.

## Put it on the internet

**Fast:** go to <https://app.netlify.com/drop> and drag this folder onto
the page. Live in ten seconds, free. Drag again to update.

**Sturdier:** make a free account at <https://github.com>, create a
repository named `yourusername.github.io`, upload these files, and the
site appears at that address. You get a full history of every change.

**Your own domain** (optional, ~£10–15/year from Namecheap, Porkbun, or
Cloudflare): both hosts connect it free — search their docs for
"custom domain".

## Email subscriptions later

When you're ready: a free Buttondown account gives you a signup form
snippet. Paste it into `panel-about` in `index.html`, and point the
footer's Subscribe link at your Buttondown page. Nothing else changes.

## If something breaks



Almost always an unclosed tag or a half-copied `<li>` block. Undo, save,
refresh. The example stories are safe reference copies to compare against.




