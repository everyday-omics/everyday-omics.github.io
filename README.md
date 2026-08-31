# everyday-omics.github.io

The public site for **Everyday Omics** — a computational genomics team in formation at
Tel Aviv Sourasky Medical Center. Served by GitHub Pages from `main` at
<https://everyday-omics.github.io/>.

Plain HTML, CSS and one small JS file. No build step: edit, commit, push, and the site
is live in about a minute.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole site. All copy lives here. |
| `assets/site.css` | Styles. Brand colours are the CSS variables at the top. |
| `assets/site.js` | Nav, scroll reveals, and the hero parallax. |
| `assets/logo.svg` | The mark, redrawn as vectors from the original PNG. |
| `assets/pileup.svg` | The read-pileup texture used behind the dark sections. |
| `assets/tasmc.png` | Tel Aviv Sourasky Medical Center logo. |
| `assets/og.png` | Preview card shown when the link is shared. |

## Editing the things that change most

**Publications** — in `index.html`, find `EDIT PUBLICATIONS HERE`. Copy one `<li class="pub">`
block, paste it at the top of the list, and change the year, title, authors and journal.
Wrap the PI's name in `<b>…</b>` so it stands out. The `Find` link is a Google Scholar
search on the title, so it never goes stale.

**Team members** — under `id="team"`. To add someone, copy the `<article class="person">`
block and swap the portrait `<svg>` for `<img src="assets/their-photo.jpg" alt="">`.

**Research** — the section under `id="research"`: the heading and the two paragraphs.

**Status** — the site says the team is being established in three places: the publications
note, the team note and the footer fine print.

**Type** — the display face is Archivo at its drawn proportions. Do not reintroduce
`font-variation-settings: "wdth"` above 100; expanding the width axis makes the headings
read as horizontally stretched.

## Colours

Both hex values come straight from the logo; the navy is TASMC's.

```
--blue #3D8ACA   Everyday Omics, dark chevron
--cyan #54C2E1   Everyday Omics, light chevron
--navy #1B3B72   Tel Aviv Sourasky Medical Center
```

## Local preview

```sh
python3 -m http.server 8899
# then open http://localhost:8899
```

## The contact address

The address is never shown, never written into the DOM, and never set as an `href`.
Contact links read "Email the team" / "Email", point at `#contact`, and carry `data-u` /
`data-d` — the user and the domain, base64. `assets/site.js` reassembles it *inside the
click handler* and hands it straight to `window.location`, so a `mailto:` never exists in
the document — not in the markup, not after a hover, not in the status bar.

If you add another contact link, copy an existing `class="mail"` anchor — **do not** paste
a plain `name@host` address into the markup, and keep it out of the JSON-LD block too.
Commits here use the GitHub noreply author address for the same reason.
