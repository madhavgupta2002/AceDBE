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

## MODULE 2: Designing Effective Dashboards

---

### Why Dashboards Fail and Who to Involve

- **More than 70%** of 450+ dashboard builders say most dashboards fail; usual cause: **nobody understood who would use it** (**NOT** wrong charts, colours or clutter).
- **User segments** need genuinely different dashboards (TrendE: CMO = market share trend; category manager = SKU-level funnel; warehouse head = near real-time fulfilment exceptions). One all-purpose dashboard = too dense for CMO, too shallow for the rest.

| Term | Meaning |
|---|---|
| **Stakeholder** | Commissions the dashboard; holds budget or authority; may **NOT** be a user |
| **User** | Opens it regularly (category manager, regional manager, possibly the CMO) |
| **Senior sponsor** | Engaged **from day 1** (not just informed); resolves adoption conflicts (distrusted numbers, old spreadsheet, rival versions) |
| **Pilot users** | Small cross-functional testers on **your side of the table**; report bugs constructively; nominated by sponsor per segment |
| **IT representative** | Looped in **week 1**; late request = context-free ticket in a long queue |

- **Stephen Few:** asking only the requester gives *what they are used to getting, not what they need*; talk to **both funder and user**.

---

### Asking the Right Questions

| Category | Ask about |
|---|---|
| **Why** | Role, responsibilities, business problem, **decisions/actions**, what they check now |
| **What** | KPIs, **benchmark** (target, last year, budget), **dimensions** to split by, **granularity** |
| **How and When** | Frequency, **alert triggers** (e.g. below 90% of target), next step (drill vs summary) |
| **Where** | **Device**, PDF/PowerPoint export, who else has access, **security** |

- "I want to see performance" = **opening line of a conversation, NOT a requirement**; ask which decision it drives.
- People volunteer **what** easily; **why** and parts of **how and when** need conversation; **where** needs only direct questions.
- Senior levels pass problems down; mid and junior levels **drill into detail**.

| Interviewee | Behaviour |
|---|---|
| **Blank-slate** | Vague ("show me sales") |
| **Laundry-list** | ~30 unprioritised metrics |

| Technique | Best for | TrendE example |
|---|---|---|
| **Walk me through your day** | How and when; filters laundry lists; gives blank-slate concrete content | Sales head checks headline number Monday before leadership call: summary suffices |
| **Show me what you already look at** | What, pain points, what they ignore | Marketing's manual spend vs leads spreadsheet |
| **Cross-pollinate across departments** | Sharpens what/why | Operations wants performance by **fulfilment centre and carrier**, not product category |
| **Rough mock-up** | Benchmarks and alert triggers (people critique better than they invent) | Wants quarter beside last year's; **red if more than 5% behind target** |

---

### Documenting and Consolidating Requirements

| Metric | Sales | Marketing | Operations |
|---|---|---|---|
| **GMV, total orders, average order value, conversion rate, return rate** | Yes | Yes | Yes |
| **Gross margin %** | By product category | No | No |
| **Sell-through rate** | Yes | No | Yes (by fulfilment centre) |
| **CAC, ROAS, cart abandonment** | No | Yes | No |
| **Order cycle time, on-time delivery %** | No | No | Yes |
| **Device** | Laptop (trend pulled into slides) | Provided | Phone on warehouse floor |

| Metric | Meaning |
|---|---|
| **Return rate** | Share of delivered orders returned; acts as **negative sales** |
| **Sell-through rate** | % of inventory sold; unsold = **dead stock** |
| **Cart abandonment rate** | Items in cart that never convert |
| **Order cycle time** | Click on buy to doorstep delivery |
| **On-time delivery %** | Share meeting the promised delivery date |

- **Return rate split:** sales = by **product category**; marketing = by **channel, campaign creative, promo code** (low-quality buyers, misaligned expectations); operations = by **fulfilment centre and carrier** (packaging/delivery issues).

| Structure | Pros | Cons | Use when |
|---|---|---|---|
| **One size fits all** | Single source of truth; lowest maintenance | **High clutter** | Heavy overlap in workflows and goals |
| **Fragmented** | Fully tailored | Costly; **same metric calculated differently**; no leadership overview | No shared goals or data sources |
| **Hybrid** | Shared core plus tailored pages | More upfront layout planning | Real shared core, distinct operational needs |

- **Hybrid build:** 5 shared KPIs on **overview page**; everything else on **dedicated department pages** (with department-specific splits).
- Unprioritised metrics (e.g. social media engagement) are **logged for phase 2, NEVER rejected**.
- **Playback session:** all three heads together; what we heard, shared core, dedicated tabs, phase 2 parking lot; show a **very rough sketch** (polished mock-up = people assume it is nearly final).

---

### Data Audit and Feasibility

| Audit item | Key point |
|---|---|
| **Where data sits** | TrendE: sales = point-of-sale; marketing spend = ad platforms; fulfilment = operations system |
| **External source** | Own discovery process; **explicit vendor permission**; slower; **flag immediately** |
| **Direct automated access** | Prefer **API feeds**; manual handoffs fail silently |
| **Manual uploads** | Note in audit; include upload training in **onboarding** |
| **Excel** | **Source of last resort** (Bangalore vs BLR; capitalised headers stopped an update) |
| **Data dictionary** | Field meanings from the **data owner** (revenue with or without tax/delivery); shown in dashboard |
| **Sample data** | **25 to 100 rows**; check date formats, blanks, text in numeric fields |
| **Refresh frequency** | Source must refresh at least as often as users want (returns wanted on 1st, logistics data on 7th) |
| **Known problems** | Ask owners and users directly |
| **Revisions** | Media spend final only a month later: show **indicative first figure** and allow **overwrite** of history |
| **Historical depth** | Needed for trends; may be a rolling window or archive |

- Run the audit with a **data-savvy partner** (date stored as text, hard-coded fields, structure mismatches).

| Verdict | TrendE example |
|---|---|
| **Feasible now** | GMV |
| **Feasible with extra work** | Return rate by 1st (align logistics 7th delivery); stays in phase 1 only if fixed quickly |
| **Not feasible yet** | Sell-through by fulfilment centre (inconsistent received vs sold tracking) to phase 2 |

- Close-out meeting: what was checked, verdict per metric, extra known issues, **sponsor intervenes to speed access**, **explicit sign-off on version 1 scope**.

---

### Phase-wise Development

- Biggest risk = **holding release until 100% perfect**; perfection is the enemy of progress.
- **Phase 1 (MVP) = overlap of highest-priority requirements and data feasible now**; delivered in **weeks, not months**; guards against clutter; other ideas go to **phase 2 (not rejected)**.

| Bottleneck | Cause | Example |
|---|---|---|
| **System** | Data not tracked consistently | Sell-through by fulfilment centre |
| **Process** | External vendors/manual handoffs | Return rate: wanted 1st, delivered 7th |
| **Governance** | Data revised after landing | Media spend final next month |

- **Roadmap table:** phase, items, target users, timeline, blockers (phase 1 normally none; phase 2 blockers name the team to fix).
- **TrendE phase 1:** GMV, total orders, average order value, conversion rate. **Return rate to phase 2** (procurement renegotiates vendor timeline).
- Users get new ideas on seeing real data; phase 1 scope is a **shield against scope creep** ("log it in phase 2").
- Launch is a **recurrent cycle** (lean v1, observe, adapt); simple dashboards feasible in one pass need no phasing; multiple segments plus senior stakeholders = phase.
- **Sign-off on roadmap before a single visual is built.**

---

### Anatomy of a Dashboard

- Dashboard = **small connected set of screens**, not one page; blocks are tool-independent (Power BI, Tableau, Looker).

| Block | Role |
|---|---|
| **Pages or tabs** | Different views |
| **Visuals** | Charts, tables, numbers (one block, not everything) |
| **KPI cards** | Key figures on opening; **under 10**, prominent, near top |
| **Filters (slicers)** | Narrow region/date/category; all visuals update |
| **Navigation** | Tabs, sidebar menu or buttons |
| **Hover and click interactions** | Detail without redesigning the screen; contain clutter |

---

### KPI Cards

- **KPI** = broadly on track?; **diagnostic** = why? Executives often look **only at KPI cards**.
- Isolated number (net margin 12%) is meaningless without context.

| Card part | Detail |
|---|---|
| **Number** | Large, unmistakable |
| **Label** | Plain language; use users' own name (GMV or total revenue) |
| **Comparison** | Reference point |
| **Trend signal** | Arrow or **sparkline**; shows whether issue is building or sudden |

- Add **tooltip definition** on hover.

| Comparison | Use when |
|---|---|
| **Versus target** | Agreed goal; show **% of target achieved** |
| **Versus prior period** | No fixed target; MoM, QoQ, YoY |
| **Versus industry standard** | Meaning depends on market (satisfaction score, on-time delivery, market share) |

- **One card, many comparisons (CMO case):** absolute sales plus % of target, **forecast as default target with filter to switch to budget**, YoY in corner, 6-month line below.

| TrendE card | Comparison | Note |
|---|---|---|
| **GMV** | Target | Plus sparkline; most watched |
| **Total orders** | Prior period | Pair with average order value |
| **Average order value** | Prior period | Orders up and basket size down shows at a glance while GMV looks stable |
| **Conversion rate** | Target (internal benchmark) | **Early warning**: moves before GMV |
| **Return rate** | Target | Catch rise before it drags GMV or margin |

---

### Information Flow and Visual Hierarchy

- Eye tracking: **big numbers noticed first**; **repeated identical cards lose attention by the 4th or 5th**; key chart works best **left of centre**. Most important number: **top left and visually different**.

| Hierarchy tool | Effect |
|---|---|
| **Size** | Bigger first (GMV largest) |
| **Colour and contrast** | Splash against muted background; use sparingly |
| **Position** | Top left scanned first |
| **Proximity** | Close = related (total orders beside average order value) |
| **Typography** | Weight and size signal importance |

- **Hierarchy** = what is noticed first on a screen; **flow** = sequence across pages: **start high, then drill down**.
- Dashboard must **communicate fast, not impress**; broken extremes: too much detail vs no path to investigate.
- **Three-question test:** where to start? what is next? when are we done?

| Level | Needs |
|---|---|
| **Executive** | Few measures vs target plus trend; minimalist; minimal learning; print/PowerPoint export |
| **Mid-level** | More context and history; interactive drill-down; diagnosis |
| **Operational** | Simple; alerts and notifications; spot red flags and act |

- TrendE: overview = **executive tier**; sales, marketing, operations = **sibling mid-level pages**.

| Progressive disclosure | Example |
|---|---|
| **Hover** | Detail appears without leaving the visual |
| **Expand in place** | Click return rate: category breakdown appears below |
| **Click through** | Click conversion rate: page by campaign (worth the click only for genuine deep dives) |

- **Structural wireframe:** boxes only (KPI cards, charts, filters, navigation); **no data, colour, branding or chart types**; hand sketch is fine; ask **"does the layout make sense?"** and get sign-off; involve a **UX designer** if possible.

---

### Choosing Charts for TrendE

| Question | Default chart |
|---|---|
| Comparison | Column (under ~6 categories); horizontal bar (more) |
| Over time | Bar or line (one series); **line** (multiple series) |
| Composition | Pie/donut only under 4 slices; stacked bar; 100% stacked |
| Distribution | Histogram; **box plot** (wider box = more variable; whiskers = outliers) |
| Relationship | Scatter (correlation, **NOT** causation) |

- **Position beats angle**: prefer bars to pie/donut.

| Page | Charts |
|---|---|
| **Overview** | KPI cards with callout number and **sparkline over quarters**; total orders and average order value together |
| **Sales** | Bar (sorted high to low) plus 6-month trend line for gross margin %, sell-through, return rate by product category |
| **Marketing** | 4 bar charts plus trend lines: CAC by channel, ROAS by channel, ROAS by campaign, cart abandonment by channel |
| **Operations** | Bar plus trend plus **box plot** (consistency and outliers) for order cycle time by fulfilment centre, on-time delivery by carrier, return rate by centre and carrier |
| **Region (operations)** | **Bar** for 4 regions; **map with colour gradient** for underperforming locations and clusters |

- **Linked trend line:** selecting a bar category updates the trend line to that category.
- **Crowded operations page:** progressive disclosure; default = users' preferred view; button ("Check performance consistency" or "Check performance trend over 6 months") reveals the other. Regular = visible; occasional = on a button.

---

### Look and Feel

- Look and feel is **frozen upfront with sign-off** (late colour/font changes are slow and subjective).
- Get **brand guidelines**, exact colours, approved logos, font rules from the **brand team** (not guessed); consult the brand creative; design for the **device** (mobile vs laptop).

| Palette rule | Share |
|---|---|
| **Neutral** (backgrounds, text) | ~60% |
| **Secondary/brand** | ~30% |
| **Accent** (highlight) | ~10% |

- Total palette **3 to 4 colours**; one colour per bar = decoration, not message.
- **Brand red vs status red:** shift status to **red-orange**; reserve exact brand red for logos and primary actions.
- **Red, yellow, green** reserved for **below/on/above target**; for degrees use a **single-colour light-to-dark gradient**.
- **Colourblind:** ~1 in 12 men red-green; test with **Coblis**; pair colour with **icon, label or pattern**; if removing colour keeps the point, it is accessible (down arrow > red dot).
- **Page design:** light canvas on darker neutral background, consistent spacing, **invisible grid**, title plus logo.

| | Wireframe | Mock-up |
|---|---|---|
| **Signs off** | Layout and navigation | Look and feel |
| **Content** | Boxes | Charts |
| **Colour** | Grayscale | Real palette |
| **Logo** | Blank | Real logo |
| **Data** | None | Dummy; not live |

- Content evolves; **look, layout and navigation stay stable** so users need not relearn. Simple short-term single-audience dashboards still meet requirements but **look and feel is secondary**.

---

### Eight-step Design Process

| Step | Activity | Sign-off or output |
|---|---|---|
| **1** | Identify stakeholders and user segments | Sponsor, stakeholders, pilot users |
| **2** | Gather and consolidate requirements | Aligned priorities |
| **3** | Data audit and feasibility | **Scope for version 1** |
| **4** | Phase-wise plan | **Sponsor and stakeholder sign-off**; reference plan |
| **5** | Information flow and hierarchy | **Wireframe** sign-off |
| **6** | Chart finalisation (plus filters) | Charts per requirement |
| **7** | Look and feel | **Mock-up** sign-off (sponsor, stakeholders, pilot users) |
| **8** | Ongoing agile development | Sprint releases to pilot users; feedback for glitches and bugs |

---

## Quick Reference: Dashboard Design Frameworks

| Framework | Core Question / Rule | Benchmark Example |
|---|---|---|
| **Why/What/How and When/Where** | What does this user need in order to act? | Sales head's request covers only "what" |
| **Four elicitation techniques** | How to get users to open up | Monday headline-number check; manual spend sheet; ops wants carrier split; "red if 5% behind" |
| **Hybrid structure** | Shared core plus dedicated pages | 5 common KPIs on overview; sales, marketing, operations pages |
| **Data audit checklist** | Can data support the requirement? | Return rate 1st vs 7th; sell-through not comparable |
| **Phase 1 as MVP** | Priority requirement and feasible data | GMV, orders, average order value, conversion rate |
| **KPI card anatomy** | Number, label, comparison, trend | GMV vs target with sparkline |
| **Five hierarchy tools** | What is noticed first | Largest GMV top left |
| **Progressive disclosure** | Show now, reveal on demand | Button to open box plot |
| **60-30-10 colour rule** | Neutral, brand, accent | Highlighted underperforming bar |
| **Eight-step process** | Idea to ongoing agile release | Wireframe then mock-up sign-offs |

## Key Decision Rules Summary

| Rule | Detail |
|---|---|
| Users first | Identify segments and stakeholders versus users before design |
| Request vs requirement | Ask what decision the number drives |
| Enrol early | Senior sponsor, pilot users (on your side), IT from week 1 |
| Structure choice | Heavy overlap = one size; no overlap = fragmented; shared core plus distinct needs = hybrid |
| Unprioritised metrics | Log for phase 2, never reject |
| Data access | Prefer API feeds; flag external sources; Excel last resort |
| Dictionary and sample | Definitions from data owner; 25 to 100 real rows |
| Verdict | Feasible now / with extra work / not feasible yet |
| Phase 1 | Priority requirement and feasible data; scope is the shield against creep |
| KPI card | Never a lone number; add comparison and trend |
| Comparison choice | Target if agreed goal; prior period if direction matters; industry if external context matters |
| Hierarchy | Most important number top left and different; start high, then drill down |
| User level | Executive simple, mid-level diagnostic, operational alerts |
| Crowded page | Default view plus button (progressive disclosure) |
| Chart | Position beats angle; box plot for consistency; map for location |
| Colour | 3 to 4 colours (60-30-10); red/yellow/green only for status; pair colour with icon or label |
| Sign-offs | Wireframe for structure, mock-up for look, roadmap before any build |

## MODULE 3: Building Visualisations with Power BI

---

### Power BI Basics and Superstore Data

| Term | Meaning |
|---|---|
| **Report** | One or more **pages of interactive visuals** (built in Power BI Desktop) |
| **Dashboard** | **Single screen** made by **pinning visuals** in the online (cloud) service |

- Power BI Desktop: **free, Windows only, new release every month**. File saved as **.pbix**.
- **Superstore** (fictional US retailer, 2015 to 2018, **9,000+ order lines, about 2.2 million net sales**): 4 files.

| File | One row is | Key fields |
|---|---|---|
| **Orders** | One **product in an order** (order ID repeats) | Order date, customer ID, product ID, net sales, quantity, profit, discount |
| **Customer lookup** | One customer | Name, **segment** (consumer, corporate, home office), city, state, **region** |
| **Product lookup** | One product | Product ID, **category**, **subcategory**, product name |
| **Shipping** | One order | Shipping date, shipping mode |

- Core question: **where is the business making and losing money?**

---

### Interface, Loading and Cleaning

| Area or icon | Role |
|---|---|
| **Data pane** | Tables and columns |
| **Visualizations pane** | Pick visual and format it |
| **Canvas** | Build area |
| **Report / Table / Model view** | Build visuals / check data like a spreadsheet / connect tables |
| **Sigma, calendar, calculator** | Numeric field, date field, **measure** |

- **Get Data** (Excel, CSV, SQL Server and others); Navigator offers **Load** or **Transform Data**.

| Problem | Fix |
|---|---|
| **Postal code** stored as number | Change type to **text** |
| **Dates** carry unused timestamp | Change type to **Date**, format **MM/DD/YYYY** |
| **Country** has one value | **Remove**: every column uses memory |
| **Product lookup** shows Column1 to 4 | Power Query: **Use first row as headers** |
| Customer name in capitals | Power Query: **Add column from examples** |

- **Power Query** (Home, Transform Data): **Applied Steps** records actions. **Close & Apply** closes; **Apply** stays in Power Query.

---

### Data Model and Hierarchies

| Tables | Match key | How |
|---|---|---|
| **Orders and Products** | Product ID | Automatic |
| **Orders and Shipping** | Order ID | Automatic |
| **Orders and Customers** | Customer ID vs **cust_id** | **Manual drag** (names differ) |

- Tables connect only through a **match key** (common column). Relationship is **one to many**: one lookup row, many order rows.
- **Lookup tables need unique rows**; confirm the mapped column on both sides.
- Once connected, it is **as if one file**.

| Hierarchy | Levels | Creation |
|---|---|---|
| **Date** | Year, quarter, month, day | **Automatic** |
| **Category hierarchy** | Category, subcategory, product | **Manual**: three dots, Create / Add to hierarchy; then **hide** the originals |

---

### Columns vs Measures and DAX

| | Calculated column | Measure |
|---|---|---|
| **Calculated** | Once per row | **On the fly** for current filters |
| **Stored** | **Yes** (memory) | **No** |
| **Use** | **Filter** or **axis** | **Aggregates** that react to selections |

- Test: needs to **change with filters or slicers**: measure. Needs to **filter or sit on an axis**: column. **Cannot filter by a measure.**
- **DAX** = **Data Analysis Expressions**, Excel-like formulas; a measure shows a **calculator** icon; its format becomes the default everywhere.

| Measure | DAX |
|---|---|
| **Total net sales** | `SUM(Orders_Products[Net Sales])` |
| **Total profit** | `SUM(Orders_Products[Profit])` |
| **Profitability** | `DIVIDE([Total Profit], [Total Net Sales])` |
| **Total discount** | `SUM(Orders_Products[Discount])` |
| **Discount PCT** | `DIVIDE([Total Discount], [Total Net Sales] + [Total Discount])` |

$$\text{Profitability} = \frac{\text{Total Profit}}{\text{Total Net Sales}} \qquad \text{Discount \%} = \frac{\text{Total Discount}}{\text{Net Sales} + \text{Discount}}$$

- **Net sales = gross sales minus discount**, so discount % uses **gross sales (net + discount)**, **NOT** net sales.
- **DIVIDE** is a **safe divide** (handles zero denominator); the slash gives an error.
- Check: 273K / 2.2 million is about 12.4%, matching the 12.42% totals row.

---

### Theme

- **Theme** = one set of colours, text and visual settings that all charts follow; set **before the first visual** because formatting is the most time-consuming part. View, Themes, Customize current theme; editable later; saved as a **JSON file**.

| Setting | Course choice |
|---|---|
| **Palette** | **Accessible default** (colourblind-friendly); **first colour = default** chart colour (blue) |
| **Sentiment** | Negative **dark red**, neutral **amber**, positive **green** |
| **Divergent** | Max green, middle amber, min red |
| **Text** | General **16 pt**; title **18 pt** |
| **Visual** | White background, **light grey border**, **rounded corners (about 10 px)**, shadow on |
| **Page** | **1920 by 1080**; light grey canvas background; **wallpaper** = area behind canvas |
| **Tooltip** | Reduced to **10 pt** in the theme |

- Chart title size and axis labels often **do not follow** the theme: format per visual.
- Change settings in the theme (no visual selected) rather than visual by visual.

---

### Format Pane Essentials

| Tool | Use |
|---|---|
| **Visual tab / General tab** | Chart-specific options / common (size, title, subtitle, effects, header icons, properties) |
| **Swap visual** | Click another visual type with the visual selected |
| **Copy-paste** | Reuse a formatted visual; **edit the title** afterwards |
| **Format painter** | Copies **formatting only**, **including help tooltip text** (edit it) |
| **fx** | **Conditional formatting** |

---

### Tables

- Subcategory, total net sales, total profit, profitability; totals row about **2.2 million, 273K, 12.42%**.
- Top profitability (labels, paper, envelopes) **40%+**; loss-making: **tables, bookcases, supplies**.

| Formatting | Detail |
|---|---|
| **Display units** | Thousands (net sales 0 decimals; profit 1 decimal); number format set on **measure**, display units on **visual** |
| **Icons** | Rules: bottom 33% red, middle amber, top 33% green; traffic-light circles |
| **Data bars** | Positive green, negative red (from theme sentiment) |
| **Font colour** | Profitability **greater than minimum and less than 0** gives red |

- Rules can use **targets** (above/near/below) or a **threshold** (for example below 10% red). Apply to **values only** or **values and totals**.
- **Less is more**: format only the **most important column**. Sparklines come in the next module.

---

### Donut Charts and Interactions

| Feature | Pie | Donut |
|---|---|---|
| Total | **No** | **Yes (centre)** |

- Pie or donut only for **a handful of slices** (4 regions, 3 segments). **Legend field defines the slices**; turn legend off and use **detail labels** (category, value, percent).
- Region: **West about a third (about 33.5%, 736.77K)**, East 26 to 27%, **South smallest**. Segment: **consumer about 50%, corporate about 30%, home office about 19%**.

| Edit Interactions option | Effect |
|---|---|
| **Filter** | Target shows **only** the selection (percentages sum to 100%); **default for table** |
| **Highlight** | Whole data kept, selected part highlighted; **default between charts** |
| **None** | **No effect** |

- By default **any selection affects all other visuals**; **Ctrl+click** for multiple; **click white space** to clear.
- West selected: donut centre 2.2 million becomes **736.77K**; table totals **737K**.

---

### Column and Bar Charts

- **Eyes compare length better than angle**: column or bar over pie.
- **Column** for about **4 to 5 bars**; **horizontal bar** for many categories or long labels.
- **Data labels = best practice** (no hover on slides); then **turn Y-axis values off**. X-axis font about 14; bar spacing adjustable; title centred, subtitle off.
- **Tooltips well**: add extra fields (for example profitability).
- **Bar colour rule**: profitability **greater than minimum and less than 0** gives **red**; subtitle "Red bars indicate losses" explains it.
- Loss-making subcategories: **tables, bookcases, supplies** (in furniture, chairs and furnishings make money).

---

### Hierarchy and Drill-down

- **One bar chart with the category hierarchy replaces three charts** (category, subcategory, product).

| Drill method | Effect |
|---|---|
| **Tooltip** | Drill down or up on a bar; **none at the lowest level** |
| **Drill mode (single arrow)** | Click a data point to go into that bar only |
| **Double arrow** | **All bars** move to the next level |
| **Forked arrow** | **Expand** to show levels together (category and subcategory) |

- Sort by category then subcategory to group bars. Power BI **remembers the level at which the file is saved**.
- **Date drill**: use **drill on a data point** or **forked arrow**; **double arrow adds up Q1 of all years**, so it is **NOT** useful for dates; daily view too dense.
- **Static trend** = keep only Year on X-axis (drill icons vanish). **Subtitle is dynamic** (changes with level).
- **Red dots** on the line chart came from the carried-over **format painter** loss rule.
- **Responsive** shrinks fonts with the visual: turn off in General, Properties, Advanced options (Shift-select to change many).

---

### Help Tooltip and Notes on Visuals

| Method | Visibility | Best for |
|---|---|---|
| **Subtitle** | Always visible | **Short notes** (colour meaning) |
| **Help tooltip** | Question mark, on hover | **Longer instructions**, drill help, **last refresh**, **data issues** |
| **Text box** | Free-standing | Later modules |

- Set at Format, General, **Header icons**; icons for drill up and drill down can be switched off.

---

### Line Charts

- **Over time**: X-axis = **order date**, Y-axis = **total net sales**.
- Settings: data labels off and **Y-axis values on (about 12 pt)**; line **smooth or linear**; **markers** on.
- **Category in legend** gives 3 lines: **furniture grew steadily; office supplies dipped then rose; technology dropped in 2016, then accelerated and overtook**.
- 2015 to 2016 dip came from **office supplies and technology**, **NOT furniture**.
- Copy and swap the measure to get trends for **net sales, profit, profitability**.

---

### KPI Cards

- Answer **how are we doing?** at a glance; place **top or left**.
- Newest **Card** visual takes **several values** (net sales, profit, profitability) and makes one card each: **2.2 million, 273K, 12.4%**.

| Level | Settings |
|---|---|
| **Multi-card layout** | **Tiles** (gaps) vs **table** (no gaps); horizontal or vertical; **gap** (default 8 pt); overall background |
| **Cards** | Individual background, border, **accent bar**, **shadow** |
| **Callout values** | Number size (for example 60), colour; **conditional colour** (profitability below 0 gives red) |
| **Labels** | Size (for example 16) |

- Apply to **all** cards or **one specific** card.

---

### Slicers

- **Slicer** = **always-visible** user selection control; **one field** only; affects **all visuals on the page** by default (change with Edit Interactions: filter or none).

| Setting | Options |
|---|---|
| **Style** | **Vertical list, tile, dropdown** (smallest) |
| **Selection** | **Multi-select** by default (Ctrl+click); single select can be forced; **Select all** optional |
| **Header** | Edit text (for example "Select region"), italic |
| **Background and border** | General, Effects |
| **Date slicer** | **Between** (calendar, like bookings), before, after, relative date, dropdown; **slider** |

- Date slicer should **filter the KPIs** but **NOT affect the region slicer**; set the others to **None**.
- Header size not changing: turn **responsive off**.

---

### Scatter Plots

- Answers **do two things move together?** (net sales vs profitability for subcategories; effect of discount).

| Well | Field |
|---|---|
| **X-axis** | Total net sales |
| **Y-axis** | Profitability |
| **Values** | Subcategory (one bubble each) |
| **Legend** | Category (colour) |
| **Size** | Total discount (**new measure** needed) |
| **Category label** | On, to show names without hovering |

- Overall: **no clear relationship**; colour by category reveals patterns. **Office supplies**: low sales, many highly profitable; **technology**: mid to high sales, best profit in mid range; **furniture**: mixed, many losses (**tables about -8.56%**).
- **Machines**: heavy discount, only **2.32%** profitability. **Phones**: high sales, medium discount. **Binders**: heavy discount but still profitable.
- **Y-axis constant line** at 0 (red) via **Add further analysis**; target line example 0.2 (20%); **shade area** with **about 85% transparency** to mark the **loss region**.
- Set axis range (for example -20% to 70%) so dots do not hug the axis; axis titles 18 pt.
- Caution: discount **amount** grows with sales; **discount percentage** is a better bubble size.

---

### Assembling the Report

- Process: from the design reuse existing visuals, create the missing ones, then **assemble**.
- Performance Overview page: **header text box (32 to 36 pt, bold)**, **KPI cards**, **three trend charts**, **product performance bar chart**, **3 slicers** (date range, region, segment).

| Tool | Detail |
|---|---|
| **Gridlines and Snap to grid** | View menu; alignment |
| **Move text box** | Three dots (move handle); **not in edit mode** |
| **Align and distribute** | Shift-select, Format, Align (like PowerPoint) |
| **Paste slicer** | Prompt to **sync**; **synced = selection persists across pages** |
| **Third slicer** | Copy a slicer, swap field to **segment**, edit **slicer header** |

- Select a visual before formatting, or the pane shows canvas options. Most companies prefer **persistent (synced)** selections.

---

### Designer Controls

| Who | Controls |
|---|---|
| **Users** | **Slicers, click on visuals, drill-down, hover tooltips and help tooltip** |
| **Designer (report author)** | **Filters pane, sync slicers, selection pane, grouping, edit interactions** |

| Filters pane level | Example |
|---|---|
| **This visual** | **Top N**: top 5 subcategories by total net sales |
| **This page** | Region = West (remove slicer; "Western Region Performance Overview") |
| **All pages** | Region = West across the report |

- **Lock** a filter (nobody can change) or **hide** it; **clear** removes it. Set by designer, **not the user**; lets the same report go to each region.
- **Sync slicers pane** (View): per page, **sync** and **visibility**.
- **Selection pane** (View): **rename**, **show or hide** elements; helps with overlapping items, a logo behind, or hiding a visual before sharing.
- **Group** (Format, Group) so related visuals (trend charts, KPI cards) **move together**; Ungroup to separate.

---

### Additional Charts

| Chart | Question it answers | Build | Key reading |
|---|---|---|---|
| **Matrix** | Cross-tab: two things, **rows against columns, totals both ways** | Columns = region, rows = category hierarchy, values = profitability | Furniture about **2.33%**; technology **17.66%** overall but **South 6.27%**; bookcases and tables lose (West least bad for tables) |
| **Combo (line and stacked column)** | **Amount and rate together** on different scales | X = order date, columns = net sales, line = profitability (**secondary axis**) | Sales rise each quarter; profitability varies; **Q4 2018** big sales, profitability dip (discounting?) |
| **Waterfall** | **How a total moves step by step**; what pushed it up or down | Y = net sales, X = year only, **breakdown = category** | Green up, red down; 2015 to 2016 **furniture up, office supplies and technology down**; later years all up |
| **Stacked area** | **Total and mix over time** (better than two donuts) | X = year, Y = net sales, legend = segment | **100% version** shows composition only: consumer share falls, corporate rises, home office stable |

- Matrix conditional formatting: apply to **values and totals**, not values only, to colour totals.
- Combo: **title both axes**. Waterfall: **check axis start (400K here)**; a big bar alone does not show the size of the jump.

---

## Quick Reference: Power BI Build Toolkit

| Framework | Core Question / Rule | Benchmark Example |
|---|---|---|
| **Data model** | Can tables share a match key? | Product ID, order ID automatic; cust_id manual |
| **Column vs measure** | Must it react to filters (measure) or filter and axis (column)? | Total net sales = measure; capitalised name = column |
| **Theme** | Set formatting once for all visuals | Accessible default, 16 pt text, tooltip 10 pt |
| **Conditional formatting** | Make the key number stand out | Profitability below 0 shown red |
| **Chart choice** | Which chart for the question? | Donut contribution, bar many categories, line trend, scatter relationship |
| **Hierarchy** | Can one chart answer several levels? | Category, subcategory, product in one bar chart |
| **Notes** | Where does an explanation go? | Subtitle for colour, help tooltip for drill help |
| **Interactions** | Should this selection change other visuals? | Highlight, filter or none |
| **Assembly** | Reuse, then align, group, sync | Performance Overview page |
| **Additional charts** | Cross-tab, amount plus rate, step change, mix over time | Matrix, combo, waterfall, stacked area |

## Key Decision Rules Summary

| Rule | Detail |
|---|---|
| Report vs dashboard | Report = pages of visuals; dashboard = single pinned screen in the service |
| Clean first | Fix data types, remove unused columns, set headers in Power Query |
| Connect | Shared match key (rename or drag if names differ); lookup rows unique |
| Column or measure | React to filters: measure; filter or axis: column; never filter on a measure |
| Divide | Use DIVIDE, not the slash |
| Discount percentage | Denominator is net sales plus discount (gross sales) |
| Theme first | Set once; change global items (tooltip size) in the theme |
| Pie or donut | Handful of slices only; donut shows the total |
| Column or bar | Column for about 4 to 5 bars; bar for more; add data labels, drop Y-axis values |
| Loss flag | Rule: profitability greater than minimum and less than 0 gives red; explain with subtitle |
| Date drill | Drill on a point or forked arrow; double arrow is not useful |
| Notes | Short and always visible: subtitle; longer: help tooltip |
| Slicer | Dropdown to save space; Between for dates; block unwanted effects with None |
| Format painter | Copies everything: edit title, help text |
| Sync | Synced slicer persists across pages; choose by user requirement |
| Filters | Designer sets visual, page or all-pages filters; lock or hide them |
| Selection pane | Rename and show or hide elements; group to move together |
| Combo and waterfall | Title both axes; read the axis scale |
