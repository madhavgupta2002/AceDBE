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
