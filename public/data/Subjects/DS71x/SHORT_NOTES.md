## MODULE 1: Understanding Business Data Visualisation

---

### Role of Visualisation in Business

- **Data visualisation:** representing data as a picture for **immediate action**.
- **Problem is not data, it is finding what matters** (slow-moving inventory, delayed-delivery city, customer segment no longer buying).
- **A beautiful visual is NOT necessarily a useful visual.**

| Benefit | Meaning |
|---|---|
| **Supports decisions** | See what is happening, spot problem or opportunity, investigate, decide |
| **Uncovers patterns and trends** | Patterns hidden in a table of numbers |
| **Data-backed story** | Presents an argument supported by data |

> **Q:** Why does visualisation work faster than tables?
> - **Brains read pictures far faster than tables with many numbers** ✓

---

### Visualisation Across Functions

| Function | Question | Visual |
|---|---|---|
| **Marketing** | Which channel brings paying customers, not just clicks? | Spend, clicks, conversions by channel |
| **Sales / store ops** | Which stores over/under-perform vs target? | Sales vs target by store, by week |
| **Supply chain** | Which warehouses are near stock-out? | Colour-coded inventory level dashboard |
| **Customer service** | Are response times slipping by complaint type? | Trend of ticket volume and resolution time |
| **Finance** | Which product lines are losing profitability? | Margin trend by product line |
| **HR** | Which city/role has faster attrition? | Attrition by location |

- Common pattern: **specific business question + existing data + chart answers faster than spreadsheet**.

> **Q:** Which visual suits an HR manager checking where employees are leaving fastest?
> - **Attrition by location chart** ✓

---

### Observation vs Insight vs Recommendation

| Stage | Meaning | Example |
|---|---|---|
| **Observation** | A fact seen in the chart | North sales dropped 15% |
| **Insight** | **Why** it matters (cause or consequence), backed by evidence | Best-seller out of stock 8 of 30 days |
| **Recommendation** | **What to do** | Increase safety stock for top five products in North |

- Observation alone = **first third of the job**.
- Bridge = **"why" question + check against data** (drill down by SKU, date, other regions).
- Untested story = **hypothesis, NOT insight**.
- Recommendation = specific but still a **hypothesis to retest** next period (e.g. mobile email template redesign, retest conversion).
- Accurate but **non-actionable** insight (umbrella sales fall in monsoon) = low value; "due to stock-outs" = high value (source stock elsewhere).

> **Q:** "Sales in the North region dropped 15% this month." Is this an observation, insight or recommendation?
> - **Observation** ✓

> **Q:** "Sales dropped because the best-selling product was out of stock for 8 of 30 days." Which stage?
> - **Insight** ✓

> **Q:** An explanation not yet checked against data is called a ______.
> - **Hypothesis (not yet an insight)** ✓

---

### Presenting Insights

| Audience | Wants |
|---|---|
| **Store manager** | Specific action ("Restock these three SKUs in store 12 by Friday") |
| **Senior leader** | Headline + business impact + fix + expected recovery |

- Default structure: **insight in one sentence, 1 or 2 supporting charts, clear recommendation or next step**.
- **Bottom line up front (BLUF):** conclusion in the first sentence; "tell me what to do, then why."
- Both build-up and recommendation-first are valid; **choose by audience**.

> **Q:** Which structure do senior audiences almost always prefer?
> - **Bottom line up front** ✓

---

### Characteristics of Effective Visualisations

- **A visualisation is only as good as the decision or action it helps someone make.**
- Test (Crust Club, 5 seconds): total quarterly revenue, above or below target?

| Version | Problem | Fails |
|---|---|---|
| **V1** | Number lost in cluttered grid | **Clear** |
| **V2** | 200,000 (92% of target) but **not refreshed for 6 weeks**, unflagged | **Precise** |
| **V3** | 3D bars, faint target line, busy background | **Free from distraction** |
| **Effective card** | 250,000, 95% of target, trending up, found in ~2 seconds | Passes all three |

- **Stephen Few:** dashboard must express information **clearly, precisely, without distraction**.
- **Chart junk:** excess decoration (3D, grid lines, background noise).
- **Fast wrong information is worse than hard-to-find information** (looks trustworthy, gets shared).
- Qualities serve the **decision**, not impressiveness; a plain dashboard can pass all three.
- Three checks: **Can they find the number? Is it current and correct? Is anything fighting it for attention?**

> **Q:** A dashboard shows revenue instantly but has not refreshed for 6 weeks and shows no warning. Which quality fails?
> - **Precise** ✓

> **Q:** The number is accurate and fresh, but 3D bars hide whether it is above target. Which quality fails?
> - **Free from distraction** ✓

> **Q:** The answer exists but is buried in a grid of metrics. Which quality fails?
> - **Clear** ✓

---

### Framework: Business Questions vs Charts (Abela)

| Question type | Asks | Charts |
|---|---|---|
| **Comparison** | Categories / periods | Column, bar, line |
| **Composition** | Share / contribution | Pie, donut, stacked, 100% stacked |
| **Distribution** | Spread | Histogram, box plot |
| **Relationship** | Do two things move together? | Scatter, bubble |

- A chart can be clear, precise, distraction-free and still be the **wrong type**.

---

### Comparison Charts

| Situation | Chart |
|---|---|
| Few categories (fewer than ~6) | **Column chart** |
| Many categories / long names | **Horizontal bar chart** |
| One measure over a few periods | **Bar or line (both work)** |
| Several categories over time | **Line chart** (continuity principle) |
| 5 or 6 lines | **Spaghetti chart**; let user select categories |

- **Continuity principle:** eye follows a connected line automatically.
- **Shared connected reference point = easy comparison; floating disconnected one (bars) = hard.**

> **Q:** Sales by city (many cities) vs sales by menu category (3). Which charts?
> - **Horizontal bar for cities; vertical column for menu categories** ✓

> **Q:** Weekly total sales over 6 weeks: bar chart, line chart, or both?
> - **Both** ✓

> **Q:** Is beverages trending up across 6 weeks when split by pizzas, sides, beverages? Which chart makes it easiest?
> - **Line chart** ✓

---

### Composition Charts

| Chart | Use | Limit |
|---|---|---|
| **Pie / donut** | Share, **3 or 4 categories max** | Eye compares **angles** poorly |
| **Bar / column** | Rank shares (position on shared axis) | Shows many categories well |
| **Side-by-side donuts** | Compare two periods | Slice positions shift; hard to read |
| **Bars, same axis position per period** | Share change over two periods | Becomes cluttered with many groups |
| **Stacked bar** | Total and parts across groups (e.g. 4 regions) | Only **bottom segment** on true baseline; fails beyond 3 or 4 segments |
| **100% stacked bar** | Proportions with many segments | **Absolute numbers disappear**; add call-outs |

> **Q:** Donut with eight cities: why is finding the second highest hard?
> - **Vision compares angles worse than positions on a shared baseline** ✓

> **Q:** Maximum number of categories for a pie/donut (thumb rule)?
> - **Three or four** ✓

> **Q:** Beverage share across two quarters, when sides overtake pizzas as largest. Which chart reads better?
> - **Bars with each category at the same axis position in both periods (not two donuts)** ✓

> **Q:** Which region is more dependent on beverages (orders split by menu category, four regions)?
> - **Stacked bar chart; North** ✓

> **Q:** What is the trade-off of a 100% stacked bar, and the fix?
> - **Loses absolute numbers; add call-outs with absolute values** ✓

---

### Distribution and Relationship Charts

| Chart | Answers | Reading |
|---|---|---|
| **Histogram** | How spread out are delivery times (one overall picture)? | Cluster at 25 to 30 min; long tail up to 60 min pulls average up |
| **Box plot** | Spread **across groups** (stores) | Narrow middle = consistent (A, C); broad middle = variable (B, D); D slowest |
| **Scatter plot** | Do two variables move together? | Slower delivery tends to lower ratings; shows relationship, **NOT** causation |
| **Bubble chart** | Effect of a **third variable** (dot size) | Large orders delivered fast can still get bad ratings; colour and shape add more dimensions |

> **Q:** How consistent are delivery times across four stores?
> - **Box plot** ✓

> **Q:** Does faster delivery lead to better ratings?
> - **Scatter plot (shows relationship, does not prove causation)** ✓

> **Q:** Add order value to a ratings-vs-delivery-time scatter plot. Which chart?
> - **Bubble chart (size = order value)** ✓

---

### Charts for Other Business Questions

| Question | Chart | Note |
|---|---|---|
| Total revenue vs target | **KPI card** | Large number plus comparison; not a chart in usual sense |
| Many numbers, precision over pattern | **Table** | e.g. regional revenue vs targets |
| What are customers complaining about? | **Word cloud** | **Trades precision for speed**; bar chart of counts is more accurate |
| How are people progressing stage to stage? | **Funnel** | Shows drop-off per stage (e.g. 50% lost purchase to payment) |
| What caused the number to change? | **Waterfall** | Hires, moves in, leavers, transfers out |
| Where to expand? | **Map** | Uses real-world geography |

> **Q:** 50% of customers who click buy do not complete payment. Which chart shows this and what could it indicate?
> - **Funnel; possible payment gateway problem** ✓

> **Q:** What caused headcount in department A to shrink over the last year?
> - **Waterfall chart (key cause: transfers out)** ✓

---

### Recognising Misleading Graphs

- **Visualisation is a representation of the data, NOT the data itself**; every dashboard reflects **designer choices**.
- Three lenses: **well-made? right type? misleading?**

| Source of misleading | Example | Check / Rule |
|---|---|---|
| **Missing data** | Near-zero June and July then August spike = likely system outage and late upload | Sudden zeros: ask about data issues first |
| **Invalid values** | Negative or zero transactions = cancelled orders not filtered, refunds as negative sales | **Validate data before interpreting** |
| **Time period** | "Sales grew 40%" vs depressed COVID period = return to normal | Check comparison period and context |
| **Axis and scale** | Delivery time 60 to 50 min; axis from 45 looks dramatic, from 0 looks modest | Check axis, scale, units; **start at zero** for time comparisons unless justified |
| **Aggregation** | Two product lines with identical totals but very different variation over time | **Drill down** (store, category, vendor, region) |

#### Questions Before Trusting a Visualisation

| No. | Ask |
|---|---|
| 1 | What data was **included**? |
| 2 | What data was **excluded**? |
| 3 | Were **duplicates** removed? |
| 4 | What **assumptions** were made? |
| 5 | When was data **refreshed**? |
| 6 | Any known **data quality issues**? |

> **Q:** The same data looks dramatic on one chart and modest on another. What changed?
> - **Where the axis begins (representation, not the data)** ✓

> **Q:** Two product lines have identical total sales. How do you check whether they have the same appeal?
> - **Drill down over time; aggregation can hide different patterns** ✓

> **Q:** Zero-value and negative transactions appear in the distribution. Insight or data issue?
> - **Likely a data issue (cancelled orders not filtered, refunds recorded as negative sales)** ✓

---

## Quick Reference: Choosing the Chart

| Situation | Chart |
|---|---|
| Few categories compared | Column |
| Many categories / long labels | Horizontal bar |
| Trend, several categories | Line (avoid spaghetti) |
| Share, 3 or 4 parts | Pie / donut |
| Share, many parts or ranking | Bar / column |
| Parts across groups | Stacked bar; 100% stacked for many segments |
| One distribution | Histogram |
| Distribution across groups | Box plot |
| Two variables | Scatter |
| Three variables | Bubble |
| One number vs target | KPI card |
| Exact values | Table |
| Themes in text | Word cloud |
| Stage drop-off | Funnel |
| Drivers of change | Waterfall |
| Location | Map |

## Key Decision Rules Summary

| Rule | Detail |
|---|---|
| Purpose test | A visualisation is only as good as the decision it helps someone make |
| Clear, precise, free from distraction | Find number fast; current and correct; nothing competing |
| Fast wrong vs slow right | Fast wrong information is more dangerous |
| Observation, insight, recommendation | Fact, then cause or consequence with evidence, then action |
| Insight vs hypothesis | Unchecked explanation is only a hypothesis |
| Audience | Store manager = specific action; senior leader = headline and impact; BLUF |
| Pie / donut | Maximum 3 or 4 categories |
| Line vs bars | Line for several categories over time (continuity); too many lines = spaghetti |
| Scatter | Relationship, not causation |
| Word cloud | Speed over precision |
| Data trust | Validate completeness, validity, duplicates, refresh date first |
| Axis | Check start, scale, units; start at zero for time comparisons |
| Aggregation | Drill down before deciding |
