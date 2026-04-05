# Energy Tracker — Functionality Spec

## Concept
A HomeWizard-inspired web app for tracking home energy consumption. Educational project, using fake/simulated data.

---

## Core Features (v1)

### Main Graph
- Single large, prominent graph as the centrepiece of the UI
- Four time-range toggles:
  - **Live** — real-time consumption (simulated, updates every few seconds)
  - **Day** — hourly breakdown for today
  - **Week** — daily breakdown for the current week
  - **Year** — monthly breakdown for the current year

### Settings
- Set electricity tariff (€/kWh or $/kWh, user-configurable)
- Graph dual-axis or tooltip shows both **kWh** and **cost (€/$)**

---

## Ideas to Consider

### Dashboard / Stats Cards
- Current power draw (W) — large live readout like a speedometer
- Today's total (kWh + cost)
- This month vs last month comparison
- Estimated monthly bill based on current usage trend

### Live Simulation
- Simulate realistic usage patterns: high in morning/evening, low at night
- Random spikes to mimic appliances turning on (kettle, oven, washing machine)
- Visual pulse/glow effect on the live indicator

### Cost & Tariff
- Peak / off-peak tariff support (e.g. cheaper at night)
- Day-ahead dynamic pricing toggle (simulated hourly price fluctuation)
- Monthly budget limit with a warning indicator when approaching it

### Appliance Breakdown (optional / v2)
- Pie or donut chart showing estimated share per category: heating, lighting, cooking, devices
- Click a slice to see its daily cost

### Comparisons
- "vs. yesterday", "vs. last week" delta indicator on the graph
- Average household benchmark line on the graph

### Export / History
- Download CSV of the simulated data
- Simple history log view (table of daily totals)

### UI / UX
- Dark mode (energy dashboards look great dark)
- Colour-coded usage zones: green (low), amber (medium), red (high)
- Animated transitions when switching time ranges
- Responsive — works on mobile too

---

## Open Questions
- Currency symbol: fixed (€) or user-selectable?
- Should "Live" mode show a scrolling line chart, or a gauge/dial?
- Single electricity meter, or allow adding solar panel production (net metering)?

---

## Tech Stack (TBD)
- Plain HTML/CSS/JS vs React/Vue?
- Chart library: Chart.js, Recharts, or D3?
