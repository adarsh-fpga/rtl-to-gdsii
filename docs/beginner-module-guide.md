# Beginner Module Guide: RTL to GDSII

This guide is written as original learning material for this repository. It is meant for a learner who may know programming, electronics basics, or FPGA basics, but is new to the VLSI physical design flow.

The main idea is simple:

```text
Behavior -> Gates -> Physical Placement -> Routed Layout -> Verified Layout -> GDSII
```

At each step, the design becomes more physical. RTL is close to behavior. GDSII is close to manufacturing geometry.

## Module 1: Specification and Constraints

Before writing RTL, define what the circuit must do. A clear specification avoids confusion later when synthesis, placement, timing, and signoff tools start reporting problems.

Important questions:

- What are the inputs and outputs?
- Which clock drives the design?
- Is reset synchronous or asynchronous?
- What frequency should the design meet?
- Are there multiple clock domains?
- Is the block area-sensitive, power-sensitive, or speed-sensitive?

Beginner explanation:

Think of this as writing the contract for the design. If the contract is weak, every later stage becomes guesswork. Physical design tools cannot know the designer's intention unless clocks, timing expectations, interfaces, and constraints are described.

Practical task:

Write a one-page specification for an 8-bit counter. Include clock, reset, enable, count direction, output behavior, and expected operating frequency.

## Module 2: RTL Design and Verification

RTL stands for Register Transfer Level. It describes how data moves between registers on clock edges and what combinational logic transforms the data between those registers.

Good RTL should be:

- Easy to simulate.
- Synthesizable.
- Structured into clear modules.
- Friendly to timing closure.
- Reviewed for reset, clocking, and latch issues.

Beginner explanation:

RTL is not software, even though it may look like code. Software instructions run one after another. RTL describes hardware that can operate in parallel. A beginner should always ask: what registers exist, what combinational logic exists, and what happens on each clock edge?

Practical task:

Write a 4-state FSM. Draw the state diagram first, then write RTL, then simulate transitions in a testbench.

## Module 3: Logic Synthesis

Synthesis converts RTL into a gate-level netlist using a standard-cell library. The output is still logical, but it is closer to real hardware than RTL.

Typical inputs:

- RTL files.
- Timing constraints.
- Liberty timing libraries.
- Technology mapping information.

Typical outputs:

- Gate-level Verilog netlist.
- Area report.
- Timing report.
- Cell usage report.

Beginner explanation:

Imagine translating your design into a limited set of building blocks. The standard-cell library is the allowed dictionary. The synthesis tool chooses gates and flip-flops from that dictionary while trying to meet timing, area, and power goals.

Practical task:

Synthesize a simple mux or counter and inspect the gate-level netlist. Identify which parts became flip-flops and which parts became combinational gates.

## Module 4: Floorplanning and Power Planning

Floorplanning creates the physical boundary of the chip or block. It decides the size of the core, where large macros go, where pins are placed, and how power is distributed.

Important concepts:

- Die area and core area.
- Standard-cell rows.
- Macro placement.
- Pin placement.
- Power grid.
- Utilization.

Beginner explanation:

This is city planning for a chip. Macros are large buildings, standard cells are small houses, pins are entry points, and the power grid is the electrical supply system. If the city plan is bad, later routing becomes painful.

Practical task:

Draw a floorplan for a small block with one memory macro and standard-cell rows. Mark power straps, pin locations, and routing channels.

## Module 5: Placement

Placement assigns physical locations to standard cells. The goal is to place related cells close enough for good timing and routing, while avoiding congestion and density problems.

Placement usually includes:

- Global placement.
- Legalization.
- Detailed placement.
- Timing and congestion optimization.

Beginner explanation:

Placement is not final wiring. It is deciding where gates and flip-flops should sit on the chip. The router will connect them later, but bad placement can make routing difficult or impossible.

Practical task:

Draw five connected gates and place them manually in a small grid. Then redraw the placement to reduce wire crossing and wirelength.

## Module 6: Clock Tree Synthesis

Clock Tree Synthesis, or CTS, builds a clock distribution network. It inserts buffers and routes the clock so flip-flops receive the clock with controlled delay and skew.

Important terms:

- Clock root.
- Clock sink.
- Clock buffer.
- Skew.
- Insertion delay.
- Transition.

Beginner explanation:

The clock is not just another signal. It controls when registers capture data. If the clock reaches some registers too early or too late, the design can fail even if the logic is correct.

Practical task:

Draw a clock source driving eight flip-flops. Compare a single long chain with a balanced tree. Which one gives better clock distribution?

## Module 7: Global and Detailed Routing

Routing creates metal connections between placed cells. Global routing plans approximate paths. Detailed routing creates actual wires and vias using legal tracks and design rules.

Routing must handle:

- Metal layers.
- Vias.
- Wire spacing.
- Wire width.
- Shorts and opens.
- Antenna effects.
- Congestion.

Beginner explanation:

If placement is deciding where buildings go, routing is building the roads and wires between them. Routing must obey manufacturing rules, so it cannot draw arbitrary lines.

Practical task:

Draw two routing layers: one horizontal and one vertical. Route three nets and mark every via needed to change layers.

## Module 8: Extraction and Static Timing Analysis

After routing, wires have real resistance and capacitance. Extraction estimates these parasitics. Static Timing Analysis uses cell delays, wire delays, constraints, and clock information to check whether timing passes.

Important terms:

- Arrival time.
- Required time.
- Slack.
- Setup check.
- Hold check.
- SPEF.
- Timing corner.

Beginner explanation:

STA checks timing mathematically instead of simulating every input pattern. It asks whether data can travel from one register to another before the next clock edge, and whether it stays stable long enough after the clock edge.

Practical task:

For a 10 ns clock, assume data delay is 8.2 ns and setup time is 0.5 ns. Required time is 9.5 ns, so slack is 1.3 ns. The path passes setup.

## Module 9: Physical Verification

Physical verification checks that the layout can be manufactured and that it matches the intended circuit.

Key checks:

- DRC: Design Rule Check.
- LVS: Layout Versus Schematic.
- Antenna checks.
- ERC: Electrical Rule Check.

Beginner explanation:

A layout can look complete and still be wrong. DRC checks if geometry follows manufacturing rules. LVS checks if the layout connectivity matches the netlist. Both are needed.

Practical task:

Draw a layout mistake where two wires are too close together. Label it as DRC. Then draw a missing connection between two nodes. Label it as LVS.

## Module 10: GDSII Streamout

GDSII streamout creates the final layout database for handoff. This package must include the correct top cell, layout hierarchy, layer mapping, merged macros, final fill, and signoff reports.

Beginner explanation:

Streamout is not just exporting a file. It is a release process. The final file must match the approved design state and must be traceable to the exact reports, tool versions, PDK version, and source revision used.

Practical task:

Create a release checklist with these fields: top cell, GDS/OASIS file, DRC status, LVS status, STA status, PDK version, tool versions, date, and commit hash.

## How to Study This Flow

Use this order:

1. Understand the goal of each stage.
2. Learn the input and output files.
3. Read the reports produced by that stage.
4. Practice on a tiny design.
5. Debug one issue at a time.

Do not try to memorize every command first. Commands change between tools, but the engineering logic stays stable.
