const stages = [
  {
    id: "spec",
    title: "Specification and Constraints",
    subtitle: "Define what the chip must do before implementation begins.",
    goal: "Turn product requirements into architecture, clocks, resets, interfaces, and measurable implementation constraints.",
    inputs: ["Product or block specification", "Clock and reset plan", "Power intent assumptions", "Initial PDK and library choice"],
    outputs: ["Microarchitecture notes", "Interface timing assumptions", "Constraint plan", "Verification intent"],
    checks: ["Unambiguous I/O behavior", "Clock-domain ownership", "Reset strategy", "Power and area targets"],
    tags: ["architecture", "constraints", "planning"],
    note: "A strong RTL-to-GDSII flow starts with constraints that can be validated later by synthesis, timing, and signoff tools."
  },
  {
    id: "rtl",
    title: "RTL Design and Verification",
    subtitle: "Write synthesizable hardware and prove intended behavior.",
    goal: "Implement the design in Verilog/SystemVerilog and verify it with simulation, assertions, and coverage before physical implementation.",
    inputs: ["RTL source files", "Testbench", "Assertions", "Functional coverage plan"],
    outputs: ["Verified RTL", "Waveforms", "Coverage reports", "Lint and CDC findings"],
    checks: ["Synthesizable coding style", "Reset behavior", "Protocol correctness", "Coverage closure"],
    tags: ["verilog", "systemverilog", "simulation"],
    note: "Physical design can only optimize the logic it receives; incomplete verification tends to become expensive after synthesis."
  },
  {
    id: "synthesis",
    title: "Logic Synthesis",
    subtitle: "Map RTL into a gate-level netlist using timing libraries and constraints.",
    goal: "Convert behavioral and RTL constructs into standard cells while optimizing timing, area, and power against constraints.",
    inputs: ["RTL", "Liberty timing libraries", "SDC constraints", "Technology mapping rules"],
    outputs: ["Gate-level Verilog netlist", "Synthesis reports", "Updated constraints", "Initial area and timing estimates"],
    checks: ["Setup timing trend", "Area and cell usage", "Unmapped logic", "Constraint quality"],
    tags: ["yosys", "netlist", "liberty"],
    note: "Yosys documents this role directly: it is a Verilog HDL synthesis tool that converts behavioral/RTL descriptions into lower-level design descriptions."
  },
  {
    id: "floorplan",
    title: "Floorplanning and Power",
    subtitle: "Create the physical canvas for standard cells, macros, pins, and power delivery.",
    goal: "Define die/core area, place macros and I/O, build the power distribution network, and prepare rows/sites for standard-cell placement.",
    inputs: ["Gate netlist", "LEF technology/cell abstracts", "Floorplan constraints", "Power domains or rails"],
    outputs: ["Initial DEF", "Macro and pin plan", "Power grid", "Tap/endcap insertion"],
    checks: ["Macro channels", "I/O reachability", "Power grid coverage", "Utilization and congestion risk"],
    tags: ["pdn", "lef", "def"],
    note: "OpenROAD flow documentation lists floorplanning, IO/tapcell insertion, and PDN as early physical-design steps."
  },
  {
    id: "placement",
    title: "Placement",
    subtitle: "Place standard cells legally while balancing timing and congestion.",
    goal: "Move cells from a logical netlist into physical rows/sites and optimize for wirelength, congestion, timing, and power.",
    inputs: ["Floorplanned DEF", "Technology LEF", "Gate netlist", "Timing constraints"],
    outputs: ["Placed DEF", "Placement density view", "Early timing reports", "Congestion estimates"],
    checks: ["Legal placement", "Congestion hotspots", "Timing-critical paths", "Cell density"],
    tags: ["global placement", "legalization", "timing"],
    note: "Placement is iterative: early timing and congestion feedback often drive RTL, constraints, or floorplan changes."
  },
  {
    id: "cts",
    title: "Clock Tree Synthesis",
    subtitle: "Build a clock distribution network for sequential elements.",
    goal: "Insert and size clock buffers/inverters and route clock networks so registers receive clocks within design constraints.",
    inputs: ["Placed DEF", "Clock definitions", "Clock buffer cells", "Timing libraries"],
    outputs: ["CTS DEF", "Clock tree report", "Skew and insertion-delay data"],
    checks: ["Clock reachability", "Setup and hold impact", "Transition limits", "Clock power"],
    tags: ["cts", "clock", "skew"],
    note: "OpenROAD's CTS module is exposed through the clock_tree_synthesis command and is based on TritonCTS 2.0."
  },
  {
    id: "routing",
    title: "Global and Detailed Routing",
    subtitle: "Connect placed cells with legal metal wires and vias.",
    goal: "Plan routing resources globally, then create detailed wires that satisfy design rules and timing constraints.",
    inputs: ["CTS DEF", "LEF routing rules", "Netlist", "Constraints"],
    outputs: ["Routed DEF", "Route guides", "Antenna fixes", "Routing DRC reports"],
    checks: ["Shorts and opens", "Antenna violations", "Routing congestion", "Timing after route"],
    tags: ["routing", "vias", "drc"],
    note: "Routing quality affects timing, capacitance, signal integrity, and final physical verification."
  },
  {
    id: "sta",
    title: "Extraction and Static Timing",
    subtitle: "Measure parasitics and verify setup/hold timing without logic simulation.",
    goal: "Extract interconnect parasitics, annotate the gate-level design, and verify timing across required modes and corners.",
    inputs: ["Routed design", "SPEF parasitics", "Liberty libraries", "SDC constraints"],
    outputs: ["Timing reports", "Slack summaries", "Critical path details", "SDF if required"],
    checks: ["Setup slack", "Hold slack", "Clock uncertainty", "Corner coverage"],
    tags: ["opensta", "spef", "slack"],
    note: "OpenSTA describes itself as a gate-level static timing verifier that reads standard formats such as Verilog, Liberty, SDC, SDF, and SPEF."
  },
  {
    id: "physical",
    title: "Physical Verification",
    subtitle: "Check that the physical layout is manufacturable and matches the netlist.",
    goal: "Run DRC, LVS, antenna, and other foundry-required checks before final handoff.",
    inputs: ["Routed layout", "DRC/LVS decks", "Gate netlist", "Technology rules"],
    outputs: ["DRC reports", "LVS reports", "Antenna reports", "Fix list"],
    checks: ["Design rule clean", "Layout equals schematic/netlist", "No opens/shorts", "Antenna compliance"],
    tags: ["drc", "lvs", "signoff"],
    note: "KLayout can be used to view and inspect mask-layout formats including GDS2 and OASIS; foundry signoff uses process-specific rule decks."
  },
  {
    id: "streamout",
    title: "GDSII Streamout",
    subtitle: "Package the final layout database for fabrication handoff.",
    goal: "Merge final layout data, verify signoff status, and export the manufacturable layout database.",
    inputs: ["Clean layout", "Fill data", "Seal ring/IO data", "Signoff reports"],
    outputs: ["GDSII or OASIS", "Final reports", "Tapeout package", "Archive manifest"],
    checks: ["Correct top cell", "Layer map consistency", "Final DRC/LVS status", "Version traceability"],
    tags: ["gdsii", "oasis", "tapeout"],
    note: "KLayout documentation identifies GDS and OASIS as central mask-layout formats that can be viewed, edited, and saved."
  }
];

const formats = [
  { ext: "RTL", name: "Verilog/SystemVerilog", use: "Behavioral and register-transfer design source used for simulation and synthesis." },
  { ext: "SDC", name: "Synopsys Design Constraints", use: "Clock, I/O delay, uncertainty, generated clock, false-path, and multi-cycle constraints." },
  { ext: "LIB", name: "Liberty timing library", use: "Standard-cell timing, power, pin, and operating-condition data used by synthesis and STA." },
  { ext: "LEF", name: "Library Exchange Format", use: "Technology and macro/cell abstracts for placement and routing tools." },
  { ext: "DEF", name: "Design Exchange Format", use: "Physical design database containing rows, components, nets, pins, and routing information." },
  { ext: "SPEF", name: "Standard Parasitic Exchange Format", use: "Extracted interconnect resistance and capacitance data used for signoff timing." },
  { ext: "SDF", name: "Standard Delay Format", use: "Back-annotated delays for timing-aware gate-level simulation when required." },
  { ext: "GDS", name: "GDSII/OASIS", use: "Final mask-layout geometry database used for layout viewing and fabrication handoff." }
];

const resourceCategories = ["All", "Flow", "Synthesis", "Timing", "Layout", "Formats", "PDK"];

const resources = [
  {
    title: "OpenROAD Flow Scripts Tutorial",
    category: "Flow",
    description: "Official tutorial for running a complete OpenROAD flow from RTL to GDS and understanding key flow stages.",
    url: "https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html",
    source: "OpenROAD Flow Scripts"
  },
  {
    title: "OpenROAD Documentation",
    category: "Flow",
    description: "Primary documentation for the OpenROAD application and its integrated RTL-GDSII flow ecosystem.",
    url: "https://openroad.readthedocs.io/",
    source: "The OpenROAD Project"
  },
  {
    title: "Yosys Primer on Digital Circuit Synthesis",
    category: "Synthesis",
    description: "Explains Yosys as a Verilog HDL synthesis tool and describes behavioral/RTL synthesis concepts.",
    url: "https://yosyshq.readthedocs.io/projects/yosys/en/stable/appendix/primer.html",
    source: "YosysHQ"
  },
  {
    title: "OpenSTA Repository",
    category: "Timing",
    description: "Primary OpenSTA reference describing gate-level STA and the standard file formats it reads.",
    url: "https://github.com/The-OpenROAD-Project/OpenSTA",
    source: "The OpenROAD Project"
  },
  {
    title: "OpenLane Timing Closure",
    category: "Timing",
    description: "OpenLane documentation on identifying timing violations with STA and working toward timing closure.",
    url: "https://openlane2.readthedocs.io/en/latest/usage/timing_closure/index.html",
    source: "OpenLane"
  },
  {
    title: "KLayout Layout Viewer and Editor",
    category: "Layout",
    description: "Official KLayout site for viewing and editing GDS2, OASIS, LEF/DEF, and other layout formats.",
    url: "https://www.klayout.de/",
    source: "KLayout"
  },
  {
    title: "KLayout DRC Basics",
    category: "Layout",
    description: "Official basics for running DRC scripts and viewing report databases in KLayout.",
    url: "https://www.klayout.de/doc/manual/drc_basic.html",
    source: "KLayout"
  },
  {
    title: "Si2 LEF/DEF Downloads",
    category: "Formats",
    description: "Official LEF/DEF standard downloads and reference documentation distributed by Si2.",
    url: "https://si2.org/lef-def-downloads/",
    source: "Si2"
  },
  {
    title: "SkyWater SKY130 Libraries",
    category: "PDK",
    description: "Documentation for SKY130 library categories, including digital standard-cell libraries.",
    url: "https://skywater-pdk.readthedocs.io/en/main/contents/libraries.html",
    source: "SkyWater PDK"
  },
  {
    title: "OpenROAD Clock Tree Synthesis",
    category: "Flow",
    description: "Official OpenROAD CTS module documentation for the clock_tree_synthesis command.",
    url: "https://openroad.readthedocs.io/en/latest/main/src/cts/README.html",
    source: "The OpenROAD Project"
  }
];

const checklist = [
  ["Read the flow overview", "Understand why the design moves from RTL to gates, then to placed and routed layout."],
  ["Identify key inputs", "Recognize RTL, SDC, Liberty, LEF, DEF, SPEF, and GDS/OASIS in the flow."],
  ["Review synthesis", "Know how RTL is converted into a gate-level netlist using libraries and constraints."],
  ["Review floorplanning", "Know how die/core area, macros, pins, rows, and power distribution are planned."],
  ["Review placement and CTS", "Know why legalization, congestion, clock skew, and clock insertion delay matter."],
  ["Review routing", "Know the difference between global route planning and detailed route implementation."],
  ["Review STA", "Know why extracted parasitics and timing corners affect setup/hold closure."],
  ["Review DRC/LVS", "Know how physical verification checks manufacturability and netlist equivalence."],
  ["Open source references", "Use the resource library to read official docs instead of relying on unsourced summaries."]
];

const glossary = [
  ["CTS", "Clock Tree Synthesis; construction of a buffered clock distribution network."],
  ["DEF", "Design Exchange Format; a physical design database for components, nets, pins, rows, and routing."],
  ["DRC", "Design Rule Check; verifies layout geometry against manufacturing rules."],
  ["GDSII", "Graphic Data System II; a mask-layout stream format used for physical handoff."],
  ["LEF", "Library Exchange Format; abstract technology and cell/macro information for P&R tools."],
  ["LIB", "Liberty timing library; timing, power, and pin behavior models for standard cells."],
  ["LVS", "Layout Versus Schematic; checks layout connectivity against the expected netlist."],
  ["PDK", "Process Design Kit; technology data, rules, models, and libraries for a fabrication process."],
  ["SDC", "Synopsys Design Constraints; timing constraints such as clocks, I/O delays, and exceptions."],
  ["SPEF", "Standard Parasitic Exchange Format; extracted resistance/capacitance for timing analysis."],
  ["STA", "Static Timing Analysis; timing verification without dynamic simulation."],
  ["WNS", "Worst Negative Slack; the most severe timing violation among analyzed paths."]
];

const sources = [
  ["OpenROAD Flow Scripts", "Complete RTL-to-GDS tutorial and flow-stage organization.", "https://openroad-flow-scripts.readthedocs.io/en/latest/tutorials/FlowTutorial.html"],
  ["YosysHQ Documentation", "Definition of Yosys as a Verilog HDL synthesis tool and synthesis primer.", "https://yosyshq.readthedocs.io/projects/yosys/en/stable/appendix/primer.html"],
  ["OpenSTA", "Gate-level static timing verification and supported standard file formats.", "https://github.com/The-OpenROAD-Project/OpenSTA"],
  ["KLayout", "GDS2/OASIS layout viewing and editing capabilities.", "https://www.klayout.de/"],
  ["Si2 LEF/DEF", "Official LEF/DEF standard and reference-documentation distribution.", "https://si2.org/lef-def-downloads/"],
  ["SkyWater PDK", "SKY130 library documentation and standard-cell library categories.", "https://skywater-pdk.readthedocs.io/en/main/contents/libraries.html"]
];

const state = {
  selectedStage: stages[0].id,
  resourceCategory: "All",
  resourceSearch: "",
  glossarySearch: ""
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function renderStages() {
  const rail = qs("[data-stage-rail]");
  rail.innerHTML = stages.map((stage, index) => `
    <button class="stage-button ${stage.id === state.selectedStage ? "active" : ""}" type="button" data-stage="${stage.id}">
      <span class="stage-index">${String(index + 1).padStart(2, "0")}</span>
      <span><strong>${stage.title}</strong><span>${stage.subtitle}</span></span>
      <span class="stage-arrow">Open</span>
    </button>
  `).join("");

  qsa("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedStage = button.dataset.stage;
      renderStages();
      renderStagePanel();
    });
  });
}

function renderStagePanel() {
  const stage = stages.find((item) => item.id === state.selectedStage) || stages[0];
  const panel = qs("[data-stage-panel]");
  panel.innerHTML = `
    <p class="eyebrow">${stage.id}</p>
    <h3>${stage.title}</h3>
    <p>${stage.goal}</p>
    <div class="tag-row">${stage.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    <div class="detail-grid">
      ${detailCard("Inputs", stage.inputs)}
      ${detailCard("Outputs", stage.outputs)}
      ${detailCard("Checks", stage.checks)}
    </div>
    <div class="stage-note">${stage.note}</div>
    <div class="code-strip">
      <pre><code>${snippetForStage(stage.id)}</code></pre>
      <button class="copy-button" type="button" data-copy-snippet>Copy snippet</button>
    </div>
  `;

  qs("[data-copy-snippet]", panel).addEventListener("click", async (event) => {
    const text = qs("code", panel).textContent;
    try {
      await navigator.clipboard.writeText(text);
      event.currentTarget.textContent = "Copied";
      setTimeout(() => event.currentTarget.textContent = "Copy snippet", 1400);
    } catch {
      event.currentTarget.textContent = "Select and copy";
    }
  });
}

function detailCard(title, items) {
  return `
    <div class="detail-card">
      <h4>${title}</h4>
      <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;
}

function snippetForStage(id) {
  const snippets = {
    spec: "# Start with clocks, resets, interfaces, and constraints before tool execution",
    rtl: "iverilog -g2012 -o sim.out rtl/*.sv tb/*.sv\nvvp sim.out",
    synthesis: "yosys -p \"read_verilog rtl/top.v; synth -top top; write_verilog netlist/top_netlist.v\"",
    floorplan: "openroad\n# read LEF/DEF, initialize floorplan, insert tapcells, build PDN",
    placement: "openroad\n# global_placement, detailed_placement, repair_design, estimate timing",
    cts: "openroad\nclock_tree_synthesis\n# analyze skew, insertion delay, and post-CTS timing",
    routing: "openroad\n# global_route followed by detailed_route and routing checks",
    sta: "sta\n# read_liberty, read_verilog, link_design, read_sdc, read_spef, report_checks",
    physical: "klayout -b -r drc_script.lydrc\n# run process-specific DRC/LVS decks where available",
    streamout: "klayout final.gds\n# inspect top cell, layers, hierarchy, and final signoff package"
  };
  return snippets[id] || snippets.spec;
}

function renderFormats() {
  qs("[data-format-grid]").innerHTML = formats.map((format) => `
    <article class="format-card reveal" data-ext="${format.ext}">
      <h3>${format.name}</h3>
      <p>${format.use}</p>
    </article>
  `).join("");
}

function renderResourceFilters() {
  qs("[data-resource-filters]").innerHTML = resourceCategories.map((category) => `
    <button class="filter-chip ${category === state.resourceCategory ? "active" : ""}" type="button" data-resource-filter="${category}">
      ${category}
    </button>
  `).join("");

  qsa("[data-resource-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.resourceCategory = button.dataset.resourceFilter;
      renderResourceFilters();
      renderResources();
    });
  });
}

function renderResources() {
  const term = state.resourceSearch.trim().toLowerCase();
  const visible = resources.filter((resource) => {
    const matchesCategory = state.resourceCategory === "All" || resource.category === state.resourceCategory;
    const haystack = `${resource.title} ${resource.category} ${resource.description} ${resource.source}`.toLowerCase();
    return matchesCategory && (!term || haystack.includes(term));
  });

  qs("[data-resource-grid]").innerHTML = visible.map((resource) => `
    <article class="resource-card reveal">
      <span class="tag">${resource.category}</span>
      <h3>${resource.title}</h3>
      <p>${resource.description}</p>
      <small>Source: ${resource.source}</small>
      <a href="${resource.url}" target="_blank" rel="noopener noreferrer">Open reference</a>
    </article>
  `).join("") || `<p>No matching resources found.</p>`;
  updateReveals();
}

function renderChecklist() {
  const saved = readProgress();
  qs("[data-checklist]").innerHTML = checklist.map(([title, detail], index) => `
    <label class="check-item">
      <input type="checkbox" data-check="${index}" ${saved.includes(index) ? "checked" : ""}>
      <span><strong>${title}</strong><span>${detail}</span></span>
    </label>
  `).join("");

  qsa("[data-check]").forEach((input) => {
    input.addEventListener("change", () => {
      const next = qsa("[data-check]").filter((item) => item.checked).map((item) => Number(item.dataset.check));
      localStorage.setItem("rtl-gds-progress", JSON.stringify(next));
      updateProgress();
    });
  });

  qs("[data-reset-progress]").addEventListener("click", () => {
    localStorage.removeItem("rtl-gds-progress");
    qsa("[data-check]").forEach((input) => input.checked = false);
    updateProgress();
  });

  updateProgress();
}

function readProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem("rtl-gds-progress") || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function updateProgress() {
  const total = checklist.length;
  const done = qsa("[data-check]").filter((item) => item.checked).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  qs("[data-progress-number]").textContent = `${pct}%`;
  qs("[data-progress-bar]").style.width = `${pct}%`;
  qs("[data-progress-caption]").textContent = done === total
    ? "Flow review complete. Revisit the source references for deeper practice."
    : `${done} of ${total} items reviewed.`;
}

function renderGlossary() {
  const term = state.glossarySearch.trim().toLowerCase();
  const visible = glossary.filter(([name, definition]) => `${name} ${definition}`.toLowerCase().includes(term));
  qs("[data-glossary-grid]").innerHTML = visible.map(([name, definition]) => `
    <article class="glossary-card reveal">
      <h3>${name}</h3>
      <p>${definition}</p>
    </article>
  `).join("") || `<p>No matching terms found.</p>`;
  updateReveals();
}

function renderSources() {
  qs("[data-source-list]").innerHTML = sources.map(([title, description, url]) => `
    <article class="source-item reveal">
      <h3>${title}</h3>
      <p>${description}</p>
      <a href="${url}" target="_blank" rel="noopener noreferrer">Read source</a>
    </article>
  `).join("");
}

function setupSearch() {
  qs("[data-resource-search]").addEventListener("input", (event) => {
    state.resourceSearch = event.target.value;
    renderResources();
  });

  qs("[data-glossary-search]").addEventListener("input", (event) => {
    state.glossarySearch = event.target.value;
    renderGlossary();
  });
}

function setupNavigation() {
  const nav = qs("[data-nav]");
  qs("[data-menu-toggle]").addEventListener("click", () => nav.classList.toggle("open"));
  qsa(".top-nav a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  const sections = qsa("main section[id]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      qsa(".top-nav a").forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 });
  sections.forEach((section) => observer.observe(section));

  const topButton = qs("[data-back-to-top]");
  window.addEventListener("scroll", () => {
    topButton.classList.toggle("visible", window.scrollY > 700);
  });
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function setupTheme() {
  const saved = localStorage.getItem("rtl-gds-theme");
  if (saved === "light") document.body.classList.add("light");
  qs("[data-theme-toggle]").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("rtl-gds-theme", document.body.classList.contains("light") ? "light" : "dark");
  });
}

function updateReveals() {
  if (!("IntersectionObserver" in window)) {
    qsa(".reveal").forEach((item) => item.classList.add("visible"));
    return;
  }
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  qsa(".reveal:not(.visible)").forEach((item) => revealObserver.observe(item));
}

function drawChipCanvas() {
  const canvas = qs("#signalCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;

  function render() {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const chipW = width * 0.72;
    const chipH = height * 0.58;
    const chipX = centerX - chipW / 2;
    const chipY = centerY - chipH / 2;

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--panel").trim();
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue("--line").trim();
    ctx.lineWidth = 2;
    roundRect(ctx, chipX, chipY, chipW, chipH, 18);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(35, 199, 217, 0.32)";
    ctx.lineWidth = 1;
    for (let x = chipX + 32; x < chipX + chipW; x += 42) {
      line(ctx, x, chipY + 18, x, chipY + chipH - 18);
    }
    ctx.strokeStyle = "rgba(110, 231, 168, 0.22)";
    for (let y = chipY + 28; y < chipY + chipH; y += 38) {
      line(ctx, chipX + 20, y, chipX + chipW - 20, y);
    }

    const macroColors = ["#23c7d9", "#6ee7a8", "#f2b95b", "#ff6b7a"];
    const macros = [
      [0.12, 0.16, 0.24, 0.20],
      [0.54, 0.14, 0.30, 0.18],
      [0.18, 0.54, 0.28, 0.24],
      [0.58, 0.52, 0.22, 0.24]
    ];
    macros.forEach((macro, index) => {
      const [x, y, w, h] = macro;
      ctx.fillStyle = `${macroColors[index]}26`;
      ctx.strokeStyle = macroColors[index];
      roundRect(ctx, chipX + x * chipW, chipY + y * chipH, w * chipW, h * chipH, 8);
      ctx.fill();
      ctx.stroke();
    });

    const t = frame / 55;
    drawTrace(ctx, chipX + 70, chipY + 82, chipX + chipW - 74, chipY + chipH - 82, t, "#23c7d9");
    drawTrace(ctx, chipX + chipW - 80, chipY + 92, chipX + 84, chipY + chipH - 92, t + 0.38, "#6ee7a8");
    drawTrace(ctx, chipX + 110, chipY + chipH - 62, chipX + chipW - 130, chipY + 64, t + 0.72, "#f2b95b");

    ctx.fillStyle = "rgba(234, 242, 247, 0.72)";
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillText("Interactive VLSI Flow", chipX + 28, chipY - 22);

    if (!reduceMotion) {
      frame += 1;
      requestAnimationFrame(render);
    }
  }

  render();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawTrace(ctx, x1, y1, x2, y2, t, color) {
  const phase = (t % 1 + 1) % 1;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  const midX = (x1 + x2) / 2;
  ctx.lineTo(midX, y1);
  ctx.lineTo(midX, y2);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const segments = [
    [x1, y1, midX, y1],
    [midX, y1, midX, y2],
    [midX, y2, x2, y2]
  ];
  const seg = segments[Math.floor(phase * segments.length)];
  const local = (phase * segments.length) % 1;
  const px = seg[0] + (seg[2] - seg[0]) * local;
  const py = seg[1] + (seg[3] - seg[1]) * local;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(px, py, 6, 0, Math.PI * 2);
  ctx.fill();
}

function init() {
  renderStages();
  renderStagePanel();
  renderFormats();
  renderResourceFilters();
  renderResources();
  renderChecklist();
  renderGlossary();
  renderSources();
  setupSearch();
  setupNavigation();
  setupTheme();
  updateReveals();
  drawChipCanvas();
}

document.addEventListener("DOMContentLoaded", init);
