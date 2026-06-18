# RTL to GDSII Interactive VLSI Flow

An interactive static website for learning the digital ASIC implementation path from RTL to final GDSII/OASIS layout handoff.

The site focuses on the RTL-to-GDSII / VLSI physical design flow: RTL design, verification, synthesis, floorplanning, placement, clock tree synthesis, routing, extraction, static timing analysis, physical verification, and final streamout.

## What is included

- Interactive stage explorer for the full RTL-to-GDSII flow.
- Clickable file-format guide for RTL, SDC, Liberty, LEF, DEF, SPEF, SDF, and GDS/OASIS.
- Searchable resource library with direct links to official documentation.
- Browser-saved learning checklist.
- Glossary for common physical design terms.
- Animated chip/routing visual built with JavaScript canvas.
- Responsive layout with light/dark theme toggle.

## Repository structure

```text
.
|-- index.html
|-- style.css
|-- app.js
|-- src/
|   `-- index.html
`-- README.md
```

The main website is now served from the repository root. The old `src/index.html` path redirects to the upgraded root page.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Source policy

The educational content is intentionally tied to primary or official technical references. Tool behavior, file-format descriptions, and flow-stage summaries should be updated only when they can be traced to reliable documentation.

Primary references used:

- OpenROAD Flow Scripts tutorial: https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html
- OpenROAD documentation: https://openroad.readthedocs.io/
- Yosys documentation: https://yosyshq.readthedocs.io/projects/yosys/en/stable/appendix/primer.html
- OpenSTA repository: https://github.com/The-OpenROAD-Project/OpenSTA
- OpenLane timing closure docs: https://openlane2.readthedocs.io/en/latest/usage/timing_closure/index.html
- KLayout documentation: https://www.klayout.de/
- KLayout DRC basics: https://www.klayout.de/doc/manual/drc_basic.html
- Si2 LEF/DEF downloads: https://si2.org/lef-def-downloads/
- SkyWater SKY130 PDK libraries: https://skywater-pdk.readthedocs.io/en/main/contents/libraries.html

## Notes

This site is a learning aid, not a foundry signoff methodology. Real tapeout requirements depend on the selected PDK, foundry decks, signoff tool versions, constraints, and project-specific verification plans.
