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
    note: "For a beginner, the key lesson is that synthesis changes the design language: from behavior written by you to gates chosen from a library."
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
    note: "A weak floorplan usually appears later as routing congestion, timing trouble, or power-grid weakness, so this stage deserves careful thought."
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
    note: "CTS changes timing behavior because the clock is no longer ideal; always review timing again after the clock network is inserted."
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
    note: "STA is where the physical reality of wires and cells meets the timing promise made in the constraints."
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
    note: "Physical verification is not optional polish; it is the point where the design proves it can be built and still matches the intended circuit."
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
    note: "A clean streamout package should be traceable: final layout, reports, constraints, PDK version, tool versions, and source revision should agree."
  }
];

const learningPath = [
  {
    title: "1. First understand the mission",
    text: "RTL-to-GDSII is the journey from a hardware idea to a physical layout that can be manufactured. Do not begin by memorizing tool commands. Begin by asking: what changes at each stage, what files are handed forward, and what can go wrong?"
  },
  {
    title: "2. Learn the design as data",
    text: "The same chip is represented in different forms: RTL describes behavior, a netlist describes gates, DEF describes physical placement/routing, SPEF describes parasitics, and GDSII/OASIS describes final layout geometry."
  },
  {
    title: "3. Connect every tool to a reason",
    text: "Synthesis exists because RTL is too abstract for fabrication. Placement exists because gates need physical locations. CTS exists because clocks need controlled delivery. STA exists because the chip must meet timing before tapeout."
  },
  {
    title: "4. Study failures like an engineer",
    text: "Beginner growth happens when you learn why a setup violation, hold violation, congestion hotspot, DRC error, LVS mismatch, or antenna issue appears. Treat reports as feedback, not as final answers."
  },
  {
    title: "5. Build a small repeatable flow",
    text: "Practice on a tiny counter, FSM, FIFO, or ALU. Run the same design through RTL simulation, synthesis, floorplan, placement, CTS, routing, STA, and layout viewing. Small designs make the flow understandable."
  }
];

const stageLessons = {
  spec: {
    plain: "Before writing RTL, you need a clear description of what the circuit must do. In software, unclear requirements become bugs. In chip design, unclear requirements become expensive rework because every later stage depends on the assumptions made here.",
    analogy: "Think of this stage like drawing the map before building a city. If the roads, power lines, and neighborhoods are not planned, construction teams will keep rebuilding the same area.",
    steps: [
      "Write the function of the block in simple words.",
      "List inputs, outputs, clock domains, reset behavior, and interface timing expectations.",
      "Decide the first performance goals: frequency, latency, area, and power direction.",
      "Create initial timing constraints, even if they are rough, so downstream tools know what to optimize."
    ],
    beginnerMistakes: [
      "Starting RTL without knowing clock frequency or reset behavior.",
      "Ignoring clock-domain crossings until late verification.",
      "Assuming constraints are only a backend topic."
    ],
    practice: "Pick a simple 8-bit counter. Write a one-page specification with clock, reset, enable, count direction, output behavior, and expected maximum frequency.",
    diagram: ["Idea", "Spec", "Constraints", "RTL Plan"]
  },
  rtl: {
    plain: "RTL is where behavior becomes hardware structure. You describe registers, combinational logic, state machines, and data movement between clock edges. Good RTL is easy to simulate, easy to synthesize, and easy for the physical design flow to optimize.",
    analogy: "RTL is like an architectural drawing. It is not the final building, but it must be precise enough that construction teams can build from it.",
    steps: [
      "Separate sequential logic from combinational logic.",
      "Use clear reset behavior and avoid accidental latches.",
      "Write a small testbench that checks normal cases and corner cases.",
      "Run lint or manual review before sending RTL to synthesis."
    ],
    beginnerMistakes: [
      "Writing code that simulates but does not synthesize well.",
      "Mixing too much logic into one always block.",
      "Testing only the happy path and missing reset or overflow cases."
    ],
    practice: "Write a 4-state FSM and a testbench. Draw the state diagram, then compare the waveform with the diagram.",
    diagram: ["Spec", "RTL", "Testbench", "Verified RTL"]
  },
  synthesis: {
    plain: "Synthesis converts RTL into gates from a standard-cell library. The tool chooses cells such as NAND, NOR, muxes, flip-flops, and buffers while trying to satisfy constraints for timing, area, and power.",
    analogy: "Imagine translating a paragraph into a limited vocabulary. The meaning must stay the same, but the final sentence can only use words from a fixed dictionary. The library is that dictionary.",
    steps: [
      "Read RTL and identify the top module.",
      "Read timing libraries that define available standard cells.",
      "Apply timing constraints so the tool knows the target speed.",
      "Generate a gate-level netlist and reports for area, timing, and unmapped logic."
    ],
    beginnerMistakes: [
      "Treating synthesis as a black box and ignoring reports.",
      "Using unrealistic constraints that make results meaningless.",
      "Forgetting that bad RTL structure can create poor synthesis results."
    ],
    practice: "Synthesize a small mux or counter. Compare the RTL with the gate-level netlist and identify flip-flops, combinational gates, and buffers.",
    diagram: ["RTL", "Constraints", "Library", "Gate Netlist"]
  },
  floorplan: {
    plain: "Floorplanning creates the physical boundary of the chip or block. It decides where the core area, macros, pins, rows, and power grid will live. A good floorplan gives later steps enough space to place and route the design.",
    analogy: "This is city planning. You decide where large buildings, roads, power lines, and entry points go before placing individual houses.",
    steps: [
      "Choose die/core size and target utilization.",
      "Place large macros first because they are hard to move later.",
      "Plan pin locations based on connectivity.",
      "Build power delivery so every cell can receive stable VDD and VSS."
    ],
    beginnerMistakes: [
      "Using too high utilization and creating routing congestion.",
      "Placing macros without leaving routing channels.",
      "Thinking power planning can be fixed at the very end."
    ],
    practice: "Draw a block with one memory macro, four I/O sides, standard-cell rows, and a simple power grid. Mark where congestion might happen.",
    diagram: ["Netlist", "Core Area", "Macros/Pins", "Power Grid"]
  },
  placement: {
    plain: "Placement assigns physical locations to standard cells. The tool tries to keep connected cells close, reduce wirelength, avoid congestion, and improve timing before real routing begins.",
    analogy: "After city planning, placement is assigning each house, shop, and office to a plot so people and roads can connect efficiently.",
    steps: [
      "Run global placement to find approximate locations.",
      "Legalize placement so cells sit correctly on valid rows/sites.",
      "Optimize timing by moving cells, resizing cells, or adding buffers.",
      "Review congestion and timing before moving to CTS."
    ],
    beginnerMistakes: [
      "Assuming placed cells are already fully connected by real wires.",
      "Ignoring congestion maps before routing.",
      "Looking only at timing and forgetting density."
    ],
    practice: "Take a simple netlist diagram and manually cluster strongly connected cells together. Explain why that reduces wirelength.",
    diagram: ["Floorplan", "Global Placement", "Legalization", "Placed DEF"]
  },
  cts: {
    plain: "Clock Tree Synthesis builds a controlled network that delivers the clock to flip-flops. Without CTS, the clock could reach different registers at very different times, which can break setup or hold timing.",
    analogy: "A clock network is like a synchronized announcement system in a large building. Every room should hear the signal at nearly the right time, not randomly early or late.",
    steps: [
      "Identify clock roots and sequential endpoints.",
      "Choose allowed clock buffers/inverters.",
      "Build branches that balance delay and skew.",
      "Re-check setup, hold, transition, and clock power after CTS."
    ],
    beginnerMistakes: [
      "Thinking CTS only connects clock wires.",
      "Ignoring hold timing after clocks are inserted.",
      "Forgetting that clock networks can consume significant power."
    ],
    practice: "Draw one clock source driving eight flip-flops. Build a balanced tree and compare it with one long chain.",
    diagram: ["Placed FFs", "Clock Root", "Buffers", "Balanced Clock Tree"]
  },
  routing: {
    plain: "Routing creates the actual metal connections between placed cells and pins. Global routing plans the paths; detailed routing creates legal wires and vias that follow technology design rules.",
    analogy: "If placement decides where buildings are, routing builds roads and cables between them while obeying construction rules.",
    steps: [
      "Plan approximate routes and estimate congestion.",
      "Assign nets to metal layers and routing tracks.",
      "Insert vias where signals move between layers.",
      "Fix shorts, opens, antenna issues, and route-related timing problems."
    ],
    beginnerMistakes: [
      "Believing a routed design is automatically signoff clean.",
      "Ignoring antenna or via-related violations.",
      "Not connecting routing congestion back to floorplan and placement decisions."
    ],
    practice: "Draw two metal layers: horizontal M1 and vertical M2. Route three nets and mark where vias are required.",
    diagram: ["Placed DEF", "Global Route", "Detailed Route", "Routed DEF"]
  },
  sta: {
    plain: "Static Timing Analysis checks whether data can travel from one register to another within the clock period. It does this mathematically using cell delays, wire parasitics, constraints, and timing corners instead of running functional simulation.",
    analogy: "STA is like checking if a train can leave one station and reach the next before the scheduled gate closes. Setup checks late arrival; hold checks arrival that is too early.",
    steps: [
      "Read the gate netlist, libraries, constraints, and parasitics.",
      "Build timing paths from startpoints to endpoints.",
      "Calculate arrival time, required time, and slack.",
      "Fix setup and hold violations through logic, sizing, buffering, placement, or constraint review."
    ],
    beginnerMistakes: [
      "Thinking zero setup violations automatically means the chip is safe.",
      "Ignoring hold checks after CTS and routing.",
      "Reading only WNS and missing total failing paths."
    ],
    practice: "For a 10 ns clock, assume data delay is 8.2 ns and setup requirement is 0.5 ns. Calculate slack and decide whether the path passes.",
    diagram: ["Netlist", "Liberty", "SDC/SPEF", "Timing Report"]
  },
  physical: {
    plain: "Physical verification checks that the layout can be manufactured and that it still matches the intended circuit. DRC checks geometry rules; LVS checks that extracted layout connectivity matches the netlist.",
    analogy: "This is the final inspection before construction drawings go to manufacturing. The design must be buildable and electrically equivalent to what was intended.",
    steps: [
      "Run DRC to find spacing, width, enclosure, and density issues.",
      "Run LVS to compare layout connectivity with the schematic or netlist.",
      "Review antenna and electrical checks where required.",
      "Fix violations and re-run until the required checks are clean."
    ],
    beginnerMistakes: [
      "Treating one clean DRC run as complete signoff.",
      "Forgetting LVS can fail even when DRC passes.",
      "Not tracking which rule deck and PDK version produced the result."
    ],
    practice: "Draw two wires too close together and label it as a spacing DRC issue. Then draw a missing connection and label it as an LVS issue.",
    diagram: ["Routed Layout", "DRC", "LVS", "Clean Signoff"]
  },
  streamout: {
    plain: "Streamout packages the final layout database into GDSII or OASIS for handoff. This is not just saving a file; it is the point where hierarchy, layers, fills, top cell, and signoff reports must match the release checklist.",
    analogy: "This is like exporting the final manufacturing blueprint. The factory should receive exactly the approved version, with no missing pages or wrong layer names.",
    steps: [
      "Confirm the final top cell and hierarchy.",
      "Merge required layout data such as macros, IO, seal ring, or fill.",
      "Use the correct layer map for streamout.",
      "Archive final GDS/OASIS with reports, constraints, logs, and revision information."
    ],
    beginnerMistakes: [
      "Sending a layout without checking top cell name.",
      "Forgetting fill, macros, or IP layout merge steps.",
      "Not keeping reports and source versions with the final database."
    ],
    practice: "Create a tapeout checklist with top cell, GDS/OASIS file, DRC status, LVS status, STA status, PDK version, and commit hash.",
    diagram: ["Clean Layout", "Layer Map", "GDS/OASIS", "Release Package"]
  }
};

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

const visualCategories = ["All", "Synthesis", "Floorplan", "Placement", "CTS", "Routing", "Timing", "Signoff"];

const visuals = [
  {
    id: "yosys-netlist",
    stageIds: ["synthesis"],
    category: "Synthesis",
    title: "Logic mapped into cells",
    signal: "Netlist view",
    description: "A Yosys schematic view showing how RTL becomes connected cells after synthesis and technology mapping.",
    image: "assets/visuals/yosys-cell-mapped-counter.svg",
    alt: "Yosys generated counter schematic after cell mapping",
    source: "YosysHQ documentation",
    sourceUrl: "https://yosyshq.readthedocs.io/projects/yosys/en/0.44/using_yosys/synthesis/cell_libs.html"
  },
  {
    id: "openroad-floorplan",
    stageIds: ["floorplan"],
    category: "Floorplan",
    title: "Floorplan canvas",
    signal: "Core, rows, and macros",
    description: "A real OpenROAD GUI floorplan view, useful for seeing the physical chip boundary before cells are placed.",
    image: "assets/visuals/openroad-ibex-floorplan.webp",
    alt: "OpenROAD GUI showing an Ibex floorplan",
    source: "OpenROAD documentation",
    sourceUrl: "https://openroad.readthedocs.io/en/latest/main/README.html"
  },
  {
    id: "floorplan-utilization",
    stageIds: ["floorplan"],
    category: "Floorplan",
    title: "Core utilization setup",
    signal: "Die and core sizing",
    description: "Shows how die/core sizing and utilization choices shape available placement and routing area.",
    image: "assets/visuals/openroad-core-util.webp",
    alt: "OpenROAD Flow Scripts tutorial screenshot for core utilization setup",
    source: "OpenROAD Flow Scripts tutorial",
    sourceUrl: "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md"
  },
  {
    id: "pin-planning",
    stageIds: ["floorplan"],
    category: "Floorplan",
    title: "Pin planning view",
    signal: "I/O reachability",
    description: "Pin placement affects routing demand, interface access, and congestion near the chip boundary.",
    image: "assets/visuals/openroad-pin-planning.webp",
    alt: "OpenROAD Flow Scripts screenshot showing pin placement in a floorplan",
    source: "OpenROAD Flow Scripts tutorial",
    sourceUrl: "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md"
  },
  {
    id: "standard-cell-placement",
    stageIds: ["placement"],
    category: "Placement",
    title: "Standard-cell placement",
    signal: "Cells become physical",
    description: "A placement-stage screenshot where the netlist has been converted into many cells assigned to physical rows.",
    image: "assets/visuals/openroad-ibex-placement.webp",
    alt: "OpenROAD Flow Scripts screenshot of standard cell placement",
    source: "OpenROAD Flow Scripts tutorial",
    sourceUrl: "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md"
  },
  {
    id: "placement-congestion",
    stageIds: ["placement", "routing"],
    category: "Placement",
    title: "Placement congestion map",
    signal: "Hotspot detection",
    description: "A congestion visualization helps beginners see where placement choices can make routing difficult later.",
    image: "assets/visuals/openroad-placement-congestion.webp",
    alt: "OpenROAD GUI showing placement congestion",
    source: "OpenROAD documentation",
    sourceUrl: "https://openroad.readthedocs.io/en/latest/main/README.html"
  },
  {
    id: "clock-routing",
    stageIds: ["cts"],
    category: "CTS",
    title: "Clock routing after CTS",
    signal: "Clock delivery network",
    description: "Clock tree visualizations show the inserted clock network that drives sequential endpoints after placement.",
    image: "assets/visuals/openroad-clock-routing.webp",
    alt: "OpenROAD GUI showing clock routing after clock tree synthesis",
    source: "OpenROAD documentation",
    sourceUrl: "https://openroad.readthedocs.io/en/latest/main/README.html"
  },
  {
    id: "post-route-layout",
    stageIds: ["routing", "physical"],
    category: "Routing",
    title: "Post-route metal layers",
    signal: "Wires and vias",
    description: "The routed view shows how physical metal layers connect cells and pins while obeying routing rules.",
    image: "assets/visuals/openroad-ibex-routing.webp",
    alt: "OpenROAD GUI showing a routed Ibex design",
    source: "OpenROAD documentation",
    sourceUrl: "https://openroad.readthedocs.io/en/latest/main/README.html"
  },
  {
    id: "timing-path-view",
    stageIds: ["sta"],
    category: "Timing",
    title: "Timing path inspection",
    signal: "STA debug",
    description: "A timing-path view helps connect STA reports to physical locations, clock paths, and data paths.",
    image: "assets/visuals/openroad-clock-path.webp",
    alt: "OpenROAD Flow Scripts screenshot highlighting a timing path",
    source: "OpenROAD Flow Scripts tutorial",
    sourceUrl: "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md"
  },
  {
    id: "final-layout-database",
    stageIds: ["physical", "streamout"],
    category: "Signoff",
    title: "Final layout database",
    signal: "Ready for review",
    description: "A final database view helps learners recognize the end result of placement, routing, extraction, and checks.",
    image: "assets/visuals/openroad-final-layout-db.webp",
    alt: "OpenROAD Flow Scripts screenshot of a final Ibex layout database",
    source: "OpenROAD Flow Scripts tutorial",
    sourceUrl: "https://github.com/The-OpenROAD-Project/OpenROAD-flow-scripts/blob/master/docs/tutorials/FlowTutorial.md"
  }
];

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
  ["Use references wisely", "Treat external documents as deeper reading while keeping your own notes as the main learning path."]
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

const state = {
  selectedStage: stages[0].id,
  visualCategory: "All",
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
  const lesson = stageLessons[stage.id];
  const stageVisuals = visualsForStage(stage.id);
  const panel = qs("[data-stage-panel]");
  panel.innerHTML = `
    <p class="eyebrow">${stage.id}</p>
    <h3>${stage.title}</h3>
    <p>${stage.goal}</p>
    <div class="tag-row">${stage.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
    ${lesson ? `
      <div class="owned-note">
        <strong>Beginner explanation</strong>
        <p>${lesson.plain}</p>
      </div>
      <div class="mini-flow" aria-label="${stage.title} mini diagram">
        ${lesson.diagram.map((item, index) => `
          <span>${item}</span>${index < lesson.diagram.length - 1 ? "<i></i>" : ""}
        `).join("")}
      </div>
      <div class="lesson-grid">
        ${lessonCard("Think of it like this", [lesson.analogy])}
        ${lessonCard("How this module works", lesson.steps, true)}
        ${lessonCard("Beginner mistakes to avoid", lesson.beginnerMistakes)}
        ${lessonCard("Practice task", [lesson.practice])}
      </div>
    ` : ""}
    ${stageVisuals.length ? `
      <div class="visual-panel">
        <div>
          <p class="eyebrow">Tool View</p>
          <h4>What this stage looks like inside EDA tools</h4>
          <p>These visuals support the explanation above so beginners can connect the concept to real layout, netlist, timing, or routing views.</p>
        </div>
        <div class="stage-visual-grid">
          ${stageVisuals.map((visual) => visualCard(visual, true)).join("")}
        </div>
      </div>
    ` : ""}
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

function visualsForStage(stageId) {
  return visuals.filter((visual) => visual.stageIds.includes(stageId));
}

function visualCard(visual, compact = false) {
  const className = compact ? "visual-card compact-visual" : "visual-card reveal";
  return `
    <article class="${className}">
      <a class="visual-image-wrap" href="${visual.sourceUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open source for ${visual.title}">
        <img src="${visual.image}" alt="${visual.alt}" loading="lazy">
        <span>${visual.signal}</span>
      </a>
      <div class="visual-card-body">
        <div class="tag-row">
          <span class="tag">${visual.category}</span>
          <span class="tag">${visual.source}</span>
        </div>
        <h3>${visual.title}</h3>
        <p>${visual.description}</p>
        <a href="${visual.sourceUrl}" target="_blank" rel="noopener noreferrer">Open source</a>
      </div>
    </article>
  `;
}

function lessonCard(title, items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `
    <article class="lesson-card">
      <h4>${title}</h4>
      <${tag}>${items.map((item) => `<li>${item}</li>`).join("")}</${tag}>
    </article>
  `;
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

function renderLearningPath() {
  qs("[data-learning-path]").innerHTML = learningPath.map((item, index) => `
    <article class="learning-card reveal">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderFormats() {
  qs("[data-format-grid]").innerHTML = formats.map((format) => `
    <article class="format-card reveal" data-ext="${format.ext}">
      <h3>${format.name}</h3>
      <p>${format.use}</p>
    </article>
  `).join("");
}

function renderVisualFilters() {
  qs("[data-visual-filters]").innerHTML = visualCategories.map((category) => `
    <button class="filter-chip ${category === state.visualCategory ? "active" : ""}" type="button" data-visual-filter="${category}">
      ${category}
    </button>
  `).join("");

  qsa("[data-visual-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.visualCategory = button.dataset.visualFilter;
      renderVisualFilters();
      renderVisualGallery();
    });
  });
}

function renderVisualGallery() {
  const visible = visuals.filter((visual) => state.visualCategory === "All" || visual.category === state.visualCategory);
  qs("[data-visual-gallery]").innerHTML = visible.map((visual) => visualCard(visual)).join("");
  updateReveals();
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
  renderLearningPath();
  renderFormats();
  renderVisualFilters();
  renderVisualGallery();
  renderResourceFilters();
  renderResources();
  renderChecklist();
  renderGlossary();
  setupSearch();
  setupNavigation();
  setupTheme();
  updateReveals();
  drawChipCanvas();
}

document.addEventListener("DOMContentLoaded", init);
