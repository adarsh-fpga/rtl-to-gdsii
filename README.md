# RTL to GDSII Interactive VLSI Flow

An original, beginner-friendly learning website for the digital ASIC implementation path from RTL to final GDSII/OASIS layout handoff.

This repository is written as a self-contained learning project. The main explanations, diagrams, module notes, practice tasks, and interactive sections are created for this project. External documentation is kept separately as references for verification and deeper reading.

## What is included

- Interactive module explorer for the full RTL-to-GDSII flow.
- Beginner explanations for every major module.
- Plain-language analogies, common mistakes, and practice tasks.
- Clickable file-format guide for RTL, SDC, Liberty, LEF, DEF, SPEF, SDF, and GDS/OASIS.
- EDA visual gallery with official OpenROAD and Yosys screenshots for floorplanning, placement, routing, STA, and layout review.
- Small searchable reference library with direct links to official documentation.
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
|-- diagrams/
|   `-- rtl-to-gdsii-flow.svg
|-- docs/
|   |-- README.md
|   `-- beginner-module-guide.md
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

## Learning modules

The project explains these modules in detail:

1. Specification and constraints
2. RTL design and verification
3. Logic synthesis
4. Floorplanning and power planning
5. Placement
6. Clock tree synthesis
7. Global and detailed routing
8. Extraction and static timing analysis
9. Physical verification
10. GDSII streamout

Each module answers:

- What is this stage?
- Why does it matter?
- What files does it use?
- What files or reports does it produce?
- What mistakes do beginners make?
- What small practice task can a learner try?

## Content policy

The main educational content is original to this repository. It is written to help beginners understand the flow before they read long tool manuals. External references are used only as a support section for deeper reading and verification of tool/file-format behavior.

Visual references included:

- OpenROAD GUI screenshots for floorplan, placement congestion, clock routing, and routed layout: https://openroad.readthedocs.io/
- OpenROAD Flow Scripts tutorial screenshots for utilization, pin planning, placement, STA path viewing, and final database review: https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md
- Yosys synthesis schematic example: https://yosyshq.readthedocs.io/projects/yosys/en/0.44/using_yosys/synthesis/cell_libs.html

Reference links included:

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
