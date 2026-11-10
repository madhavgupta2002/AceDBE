# Module 1: Understanding Business Data Visualisation

## 1.0 Module Overview

### 1.0.1 Scope of the Module

- The module starts with **why visualisation matters, who uses it, and how to read, question and make sense of the visuals businesses rely on every day**.
- It covers: role of visualisation in business, turning observations into insights and recommendations, evaluating visualisations, matching business questions to charts, and recognising misleading graphs.
- Cases used: **online fashion retail, a pizza chain (Crust Club) and a grocery delivery platform**.

### 1.0.2 Learning Objectives

- Explain why visualisation matters and how different business functions use it.
- Distinguish an **observation**, an **insight** and a **recommendation**, and present findings so that a manager can act on them.
- Judge a visual as **clear, precise and free from distraction**.
- Match a business question to the right chart.
- Recognise how charts mislead through **missing or invalid data, time-period choice, altered axes and hidden patterns**.
- Look at any dashboard critically and ask the right questions before acting on it.

## 1.1 Role of Visualisation in Business

### 1.1.1 Why Businesses Need Visualisation

#### Definition: Data Visualisation

- **Data visualisation** = representing data as a picture for **immediate action**.
- Businesses (online fashion store, supermarket chain, food delivery app) generate huge amounts of data daily; **data is not the problem, finding what matters is**.
- Typical patterns firms want to find and act on:
  - **Slow-moving inventory**
  - The **city where deliveries are getting delayed**
  - The **customer segment that is no longer buying**
- Example: a manager at a quick commerce app (Blinkit) asking "are we losing money on late deliveries?" gets the answer faster from a chart than from a spreadsheet of delivery timestamps.

#### Three Ways Visualisation Helps

| Benefit | Meaning |
|---|---|
| **Supports decision-making** | Helps users see what is happening, identify a problem, recognise an opportunity, investigate further or decide |
| **Uncovers patterns and trends** | Reveals patterns that may not be spotted in a table of numbers |
| **Tells a data-backed story** | Helps present an argument backed by data |

- A good way to think: visualisation **makes business information visible**; it is the **language to communicate with business users**.
- **A beautiful visual is not necessarily a useful visual.**
- Managers both **create** and **consume** visualisations, so visual communication is a must-have skill.
- Reason it works: **brains read pictures far faster than tables with many numbers**.

### 1.1.2 Visualisation Across Business Functions

| Function | Business question | Visualisation that helps |
|---|---|---|
| **Marketing** | Which channel (Instagram, Google Ads, email) brings **paying customers, not just clicks**? | Dashboard comparing campaign spend, clicks and conversions by channel; shows where to spend more and where to pull back |
| **Sales and store operations** (fast-food chain, e.g. Pizza Hut) | Which stores are over- or under-performing against targets, and why? | Store performance dashboard: sales vs target by store, by week; turns 200 store reports into one screen scanned in a minute |
| **Supply chain and inventory** (online grocery platform) | Which warehouses are running low on fast-moving items before stock-out? | Inventory level dashboard colour-coded by closeness to running out; checked in 30 seconds each morning |
| **Customer service** | Are response times slipping in any complaint category? | Trend chart of ticket volume and resolution time split by complaint type |
| **Finance** | Which product lines are becoming less profitable? | Margin trend chart by product line (monthly revenue, margins and returns) |
| **Human resources** | Is a city or role losing people faster than others? | Attrition by location chart; flags where to focus retention efforts |

#### Common Pattern Across Functions

- Someone has a **specific business question**, already has **data**, and a **chart answers the question far faster than the underlying spreadsheet**.
- Visualisation is **not pretty pictures but a working tool for decisions made every day**.
- Every function relies on visualisation to **turn data into decisions**.

## 1.2 Turning Observations into Insights

### 1.2.1 Observation, Insight and Recommendation

#### Definition: Observation

- **Observation** = what you see in the chart; **a fact about the data, nothing more**.
- Example: "Sales in the North region dropped 15% this month."
- True and a good starting point, but on its own it does not tell anyone what to do.

#### Definition: Insight

- **Insight** = explains **why the observation matters**, usually by connecting it to a **cause or consequence**.
- Example: "Sales in the North region dropped 15% because our best-selling product was out of stock for 8 of the 30 days."

#### Definition: Recommendation

- **Recommendation** = proposes **what to actually do**; makes the finding actionable and beneficial to the business.
- Example: "Increase safety stock for our top five products in the North region to avoid repeat stock-outs."

| Stage | What it gives | Example (sales) | Example (marketing) |
|---|---|---|---|
| **Observation** | A fact: what is seen | North region sales dropped 15% | Email campaigns have a much lower conversion rate than social media campaigns this quarter |
| **Insight** | The reason / consequence | Best-selling product was out of stock for 8 of 30 days | Most emails are opened on mobile but the template is not mobile-friendly, so customers give up before the product page |
| **Recommendation** | The action | Increase safety stock of top five products in North | Redesign the email template for mobile before the next campaign and retest conversion rate over the following month |

- Much business analysis (including internships and jobs) **stops at the observation stage**; reporting "sales dropped 15%" and calling it analysis is only **the first third of the job**.
- A recommendation is specific but still a **hypothesis to try**: implement it and check whether the number improves in the following period.
- The **three-step structure (observation, insight, recommendation)** applies to any business function and is useful for senior management.

### 1.2.2 Bridging Observation to Insight

- The bridge is a simple **"why" question followed by a genuine check against the data**.
- Possible hypotheses for a North region sales dip: **stock-out, competitor opening nearby, pricing change, weather event disrupting deliveries, or a one-off dip that corrects itself next month**.
- Use the **drill-down diagnostic skill**:
  - Look at the diagnostic views
  - Check specific **SKUs**
  - Check specific **dates**
  - Check whether **other regions** saw anything similar at the same time
- Test hypotheses against data to see which the data supports.

#### Key Concept: Insight vs Hypothesis

- **An insight is only as good as the evidence behind it.**
- A plausible-sounding story not checked against the data is a **hypothesis, not yet an insight**.

### 1.2.3 Actionable vs Non-actionable Insights

- An insight can be **accurate but not lead to any action**.

| Insight | Cause | Value |
|---|---|---|
| Umbrella sales go down in the monsoon period | Monsoon (nobody in the room can influence it) | **Low**: true but not actionable |
| Umbrella sales go down during the monsoon period due to **stock-outs** | Stock-outs | **High**: triggers action; management can source stock from alternate locations and arrest the decline |

### 1.2.4 Presenting Insights as Recommendations

- How a finding is presented matters almost as much as the insight; **recommendation and presentation style depend on the audience**.

| Audience | What they want | Example |
|---|---|---|
| **Store manager** | A specific, actionable version | "Restock these three SKUs in store 12 by Friday." |
| **Senior leader** | A headline and the business impact | "A stock-out cost us an estimated 15% of North region revenue this month. Here is the fix and the expected recovery." |

#### Default Report / Presentation Structure

1. **Lead with the insight in one sentence.**
2. Follow with **one or two charts that support it**.
3. Close with a **clear recommendation or next step**.

- This gives the receiver clarity on **what was found, the credibility (data shown), and the next step**.

#### Definition: Bottom Line Up Front (BLUF)

- **Bottom line up front** = state the conclusion in the very first sentence rather than building up gradually (as in a suspense novel).
- Senior business audiences almost always prefer it: **"tell me what to do, then tell me why."**
- If someone leaves after the first sentence, they still know the conclusion.
- Both approaches are valid: **build up to the recommendation**, or **start with the recommendation and then explain why**.
- Structure the recommendation according to the audience.

## 1.3 Characteristics of Effective Visualisations

### 1.3.1 Core Principle

#### Key Concept: Purpose of a Visualisation

- **A visualisation is only as good as the decision or action it helps someone make.**
- Sophistication, number of colours or professional look do not matter; if it does not progress someone to a decision, it has not done its job.
- Evaluation is done from the **user's perspective**.

### 1.3.2 Crust Club Dashboard Drafts

- Three early drafts of Crust Club's (pizza chain) overview page, built by different designers, all showing the **same underlying data**.
- Test question (5 seconds): **"What is the total revenue for the quarter? Is it above or below target?"**

| Version | What happened | Failure | Why it matters |
|---|---|---|---|
| **Version 1** | Number buried in a cluttered grid of metrics | **Not clear** | Answer exists but cannot be located fast; if the user cannot locate it, they cannot decide with it. Clutter often arises because stakeholders ask for many metrics on one screen ("more data feels like more value") |
| **Version 2** | Answer found instantly: revenue 200,000, 92% of target; but dashboard not refreshed for 6 weeks and nothing on the page flagged it | **Not precise** | Stale answer looks credible; quieter and more dangerous failure because it does not feel like a failure |
| **Version 3** | Number clearly labelled and fresh, but 3D bars and busy background make it hard to judge bar heights; target line barely visible | **Not free from distraction** | Decoration competes with data for attention and wins; the user cannot interpret whether it is above or below target |

#### Danger of Fast Wrong Information

- A **confident wrong decision made quickly is often worse than a hesitant right one**, because nothing warned the user to double-check.
- **Fast wrong information looks trustworthy and does more damage than information that is difficult to find**: if the number is hard to find, the user at least hesitates before sharing.

#### Chart Junk

- Excess decoration (3D effects, grid lines, background noise) is called **chart junk** by some leading analysts.
- A demonstration ("data looks better naked", by blogger Dark Horse Visualization) strips a real chart step by step until only the actual data remains.

### 1.3.3 Stephen Few: Clear, Precise, Free from Distraction

#### Definition: Job of a Dashboard (Stephen Few)

- A dashboard's entire job is to express information **clearly, precisely and without distraction**.

| Quality | Test question | Failed by |
|---|---|---|
| **Clear** | Can someone find the number that matters? | Version 1 |
| **Precise** | Can they trust that it is current and correct? | Version 2 |
| **Free from distraction** | Is anything on the page fighting with it for attention? | Version 3 |

- None of the three qualities is about being impressive; **all exist purely in service of getting someone to a decision**.
- A dashboard can be visually striking and fail all three tests; a plain-looking one can pass all three.
- The gap between **looking good and working well** is where most bad dashboards are made (designers try hard to make dashboards look good).

#### The Effective Version

- Fourth card: revenue **250,000, 95% of target, trending up**; answer found in about **2 seconds**.
- It is better **not because it is prettier** (it is probably the plainest) but because it gets the user to a decision in about 2 seconds instead of leaving them stuck, misled or squinting.
- The three questions apply to any slide, summary table or tracker before sharing.

## 1.4 Business Questions vs Appropriate Charts

### 1.4.1 Framework for Matching Questions to Charts

- A chart can be well built, accurate, precise and distraction-free and still be **the wrong type for the question**.
- Framework by **Dr. Andrew Abela**: four types of business question.

| Question type | Asks | Charts covered |
|---|---|---|
| **Comparison** | How do categories or periods compare? | Column, bar, line |
| **Composition** | What is the share / contribution of each part? | Pie, donut, stacked bar, 100% stacked bar |
| **Distribution** | How spread out is something? | Histogram, box plot |
| **Relationship** | Do two things move together? | Scatter plot, bubble chart |

- Other questions beyond the four: KPI card, table, word cloud, funnel, waterfall, map.

### 1.4.2 Comparison Questions

#### Comparison Across Categories

- Example questions: top cities by pizza sales; top-selling menu categories (pizzas, sides, beverages); how 10 stores in a city do on sales and profits.

| Chart | Use when |
|---|---|
| **Column chart** (vertical) | Few categories (say fewer than six); the most common chart; e.g. sales by menu category (3 categories) |
| **Horizontal bar chart** | More categories; also accommodates **longer category names** (e.g. "Ahmedabad" fits easily); e.g. sales by city |

#### Comparison Over Time

- Example question: have sales improved over the last 6 weeks?
- **Single number tracked over a handful of periods**: bar and line charts do roughly the same job (**both work**).
- **Multiple categories over time** (e.g. beverages vs pizzas vs sides over 6 weeks):
  - Clustered bars make the eye jump from cluster to cluster and mentally imagine a trend line.
  - A **line chart** makes the trend immediate, since a line physically connects one week to the next.

#### Definition: Continuity Principle

- The eye automatically follows a connected line; this is why a line chart is easier than multiple bars.
- A cluster of separate bars has no connection between one week's bar and the next for the same category, so the eye must do the work manually.

#### Limit of Line Charts: Spaghetti Chart

- With five or six categories on one chart, overlapping lines become a tangle (**spaghetti chart**), as unreadable as bar clusters.
- Often resolved by letting the user **select the categories to display**.

#### Key Concept: Shared Reference Point

- **A shared, connected reference point makes comparison easy; a floating, disconnected one (as in bars) makes it hard.**

### 1.4.3 Composition Questions

- Phrased as **shares or contributions**: which menu category has the maximum share? which city contributes most to orders?

#### Pie and Donut Charts

- Good for a **few categories**: e.g. order mix across pizzas, sides and beverages; the biggest share (pizza) is obvious.
- With many categories (e.g. donut with eight cities), finding the second highest is hard.
- Reason: human vision is **measurably worse at comparing angles** than at comparing **length or position on a shared baseline**.
  - Pie / donut chart = compare **angles**.
  - Bar / column chart = compare **positions on a shared axis**; instantly rankable.
- **Thumb rule: do not use pie or donut charts if there are more than three or four categories.**

#### Comparing Compositions (Share Over Time)

- Question: has the share of beverages improved quarter on quarter?
- **Two donut charts side by side**: hard to judge. When sides overtake pizzas as the biggest contributor, every slice's position shifts (donuts are drawn largest to smallest, starting at the top), so beverages, which barely changed, is hard to compare.
- **Bars with each category at the same axis position in both periods** (two bars per category): obvious that beverages barely moved, sides grew and pizzas shrank.

#### Comparing Composition Across Many Groups

| Chart | Use when | Notes |
|---|---|---|
| **Stacked bar** | Show a total and its parts, e.g. orders split by menu category across four regions (which region depends more on beverages) | Only the **bottom segment** sits on a true shared baseline; every segment above starts where the one below ended. With more than three or four segments it runs into the pie/donut problem |
| **100% stacked bar** | Many segments (e.g. eight pizza types across regions); every bar stretched to the same height; compares proportions easily | **Trade-off: absolute numbers disappear**; only proportions are shown |

- Fix for the trade-off: add a **call-out with the absolute value** on each bar or segment, giving both proportion and size.

### 1.4.4 Distribution Questions

- Distribution questions **do not compare items and do not ask about share; they ask how spread out something is**.
- Examples: How consistent are delivery times? How risky is our order book? Do a few orders skew average order value?

| Chart | Use | Reading (Crust Club delivery times) |
|---|---|---|
| **Histogram** | One overall picture; groups values into buckets and shows how many fall in each | Most orders cluster around 25 to 30 minutes; a **long tail of slow deliveries** (up to 60 minutes) pulls the average up |
| **Box plot** | Compare spread **across groups (e.g. stores) side by side**; shows the middle of the data and how far outliers stretch | Stores A and C: narrow middle = high consistency (A faster than C). Stores B and D: broader middle = far more variable; D also has the slowest delivery time |

### 1.4.5 Relationship Questions

- Ask whether **two things move together**: does faster delivery lead to a better rating? does more marketing spend bring in more orders?

#### Scatter Plot

- One variable on the X-axis (delivery time), another on the Y-axis (ratings); each order is a point.
- Shows a pattern: slower deliveries tend to get lower ratings, but some fast deliveries still got poor ratings and some slow ones good ratings.
- **A scatter plot shows that a relationship exists; it does not tell why and does not prove one thing causes the other.**

#### Bubble Chart

- Looks like a scatter plot, but **dot size is proportional to a third variable** (e.g. order value).
- Reveals, for example, that some large orders delivered fast still get bad ratings.
- Colour and shape can add further dimensions.

### 1.4.6 Charts for Other Business Questions

| Business question | Best visual | Why / notes |
|---|---|---|
| Total revenue this quarter vs target | **KPI card** | A simple large number with a comparison beside it; no bars, lines or points |
| Many numbers where **precision matters more than pattern** (e.g. regional revenues vs targets) | **Table** | Does the KPI card's job from the other direction |
| What are customers complaining about in reviews? | **Word cloud** | Sizes words by frequency; **trades precision for speed**: a bar chart of word counts is more accurate, but the word cloud shows dominant themes faster |
| How is the purchase funnel doing? (sequence / progression) | **Funnel** | Stages: product views, add to cart, purchase, payment; narrows at each stage; shows **drop-off at each stage** and where revenue is potentially lost |
| What caused a number to change? (e.g. why did headcount shrink in department A) | **Waterfall chart** | Shows how each contributor (new hires, moves in, leavers, transfers out) takes the starting value to the ending value |
| Where? (e.g. which areas of the city to expand into) | **Map** | Runs on real-world geography; shows areas with no stores |

- Funnel example: **50% of customers are lost between purchase and payment**; they clicked buy but did not complete payment, suggesting a possible payment gateway problem.
- Waterfall example: the key reason for headcount fall was people **transferred out**.

#### Three Lenses for Judging a Chart

1. Is it **well made** (clear, precise, free from distraction)?
2. Is it the **right type** for the question?
3. Is it **misleading** (a chart can pass both tests and still fool the reader)?

## 1.5 Recognising Misleading Graphs

### 1.5.1 Why Charts Mislead

- Visualisations can be misleading **intentionally or unintentionally**.
- A dashboard can look professional, contain sophisticated charts and impressive metrics, and still lead to the wrong conclusion if accepted at face value.
- Aim: build a **critical eye** to check that the data and chart are believable.
- **A visualisation is only a representation of the data, not the data itself.**
- **Every dashboard is the result of choices made by the designer**, and those choices influence what the viewer sees.

### 1.5.2 Can I Trust the Data?

#### First Questions

- Is the data **complete**? **Timely**? Are there **missing records**? **Duplicates**? Are the **values valid**?

#### Example: Missing Data

- Online fashion retailer: transaction counts over a year, aggregated monthly. The line is steady, drops to nearly zero in June and July, then spikes in August.
- Possible explanation: a **system outage** with records uploaded later, so August contains data for the months not uploaded; it is not a real boom.
- **When sudden zeros appear, first ask whether there was a data issue.**

#### Example: Invalid Values

- Distribution of transaction values showing **negative values and zero-value transactions**.
- Not an insight; likely a data problem, possibly **cancelled orders not filtered out** or **refunds recorded as negative sales instead of separately**.
- Visualisation often **reveals data quality issues before deeper analysis begins**, which is a good thing.
- Rule: **validate the data before interpreting the chart.**

#### Questions to Ask Before Trusting a Visualisation

| No. | Question |
|---|---|
| 1 | What data was **included**? |
| 2 | What data was **excluded**? |
| 3 | Were **duplicates** removed? |
| 4 | What **assumptions** were made? |
| 5 | When was the data **refreshed**? |
| 6 | Are there any **known data quality issues**? |

- This does not mean every chart is untrustworthy; it is a healthy habit before acting. No data is perfect, so understand the **source data, assumptions and limitations** so decisions rest on credible data.

### 1.5.3 Time Period Selection

- Choosing the comparison period is **an easy way to flatter a result without technically lying**.
- "Sales grew 40% this quarter" looks very different depending on whether the comparison period was a normal quarter.
- Example: post-COVID retail outlet sales rose because people went out again; compared with the COVID period (depressed sales), the growth is **a return to normal, not a real boom**.
- Always check the reference period and context.

### 1.5.4 Axis and Scale

- Two charts with identical data: average delivery time of an online grocery platform improved from **60 to 50 minutes** over a quarter.

| Chart | Axis starts at | Appearance |
|---|---|---|
| Left | **0** | Reduction looks modest |
| Right | **45** | Looks like a dramatic improvement |

- Same data; only the **representation** misleads: changing **where the axis begins** changes how dramatic the same change appears.
- **One of the single most common ways charts mislead.**
- Rule: before interpreting, **check the axis, the scale and the units**.
- An honest chart, especially for **comparison over time**, should almost always **start the axis at zero** unless there is a clearly stated reason not to.

### 1.5.5 Aggregation Hiding Patterns

- Dashboards summarise information, which is useful (no one wants to scroll through every transaction), but aggregation can **conceal the pattern you need**.
- Example: two product lines with **identical total sales** in a bar chart seem to have the same appeal. Plotted over time, one shows **much greater variation** (possibly boosted by promotions) while the other has **stable sales**.
- The differences are mathematically present in the aggregate but **invisible until split apart**.
- Rule: **drill down** (by store, product category, vendor, region, etc.); many anomalies appear only after drilling down.

#### Summary Checks Before Accepting a Chart

- Can the underlying data be trusted?
- Check the **axis and scale** before judging how dramatic a change is.
- **Drill down** into summary numbers to find patterns before deciding.

## Quick Revision Summary

### Key Definitions

- **Data visualisation**: representing data as a picture for immediate action.
- **Observation**: a fact seen in the chart. **Insight**: why the observation matters (cause or consequence), backed by evidence. **Recommendation**: what to do about it.
- **Hypothesis**: plausible explanation not yet checked against data (not an insight).
- **Bottom line up front**: conclusion stated in the first sentence.
- **Chart junk**: excess decoration that competes with the data.
- **Continuity principle**: the eye follows connected lines automatically.
- **Spaghetti chart**: line chart with too many overlapping lines.
- **Stephen Few**: dashboard must express information **clearly, precisely and without distraction**.
- **Abela framework**: comparison, composition, distribution, relationship.

### Chart Selection Rules

| Question | Chart |
|---|---|
| Comparison, few categories | Column chart |
| Comparison, many categories / long labels | Horizontal bar chart |
| Single measure over a few periods | Bar or line (both work) |
| Several categories over time | Line chart (but avoid too many lines) |
| Composition, 3 or 4 categories | Pie / donut |
| Composition, many categories or change over time | Bar / column |
| Composition across groups | Stacked bar; 100% stacked bar for many segments (add call-outs for absolute values) |
| Distribution, one overall picture | Histogram |
| Distribution across groups | Box plot |
| Relationship between two variables | Scatter plot |
| Relationship with a third variable | Bubble chart |
| Single number vs target | KPI card |
| Precise values | Table |
| Themes in text | Word cloud |
| Stage-to-stage progression and drop-off | Funnel |
| What caused a change | Waterfall |
| Location | Map |

### Must-Remember Points

- A visualisation is only as good as the decision or action it helps someone make.
- Crust Club drafts: Version 1 not **clear**, Version 2 not **precise** (stale data, 6 weeks), Version 3 not **free from distraction** (3D bars); effective card shows 250,000, 95% of target, trending up in about 2 seconds.
- Fast wrong information is more dangerous than hard-to-find information.
- Only the first third of the analysis job is the observation; insight needs evidence; recommendation must be specific and audience-appropriate.
- Accurate but non-actionable insights (umbrella sales fall in monsoon) are low value.
- Eye compares angles worse than positions on a shared baseline; avoid pie/donut with more than three or four categories.
- 100% stacked bars lose absolute numbers; add call-outs.
- Scatter plots show relationship, not causation.
- Word cloud trades precision for speed.
- Misleading-graph checks: data quality (missing, invalid, duplicates, refresh date), time-period context, axis start and scale, aggregation (drill down).
- A visualisation is a representation of the data, not the data itself; it reflects the designer's choices.

# Module 2: Designing Effective Dashboards

## 2.0 Module Overview

### 2.0.1 Scope of the Module

- The module **shifts from reading dashboards to designing one, step by step and from the ground up**.
- **Before any design**: identify user segments and key stakeholders, ask the right questions to gather requirements, run a **data audit** to check feasibility, and plan a **phase-wise roadmap**.
- **Design itself**: building blocks of a dashboard, KPI cards, information flow and visual hierarchy, choosing appropriate charts, and the look and feel.
- Closes with a recap of the **eight-step design process**.
- Running case: **TrendE**, an online fashion retailer, where requirements from **sales, marketing and operations** are consolidated into a **hybrid dashboard**.

### 2.0.2 Learning Objectives

- Show how a dashboard goes from a **first conversation with users to a signed-off design**, ready to be built in Power BI.
- Separate **stakeholders from users** and bring in a senior sponsor, pilot users and IT early.
- Gather, document and consolidate requirements; audit data and give each metric an honest feasibility verdict.
- Plan phases, design KPI cards, arrange hierarchy and flow, choose charts and design the look.

## 2.1 Requirements, Data Feasibility and Planning

### 2.1.1 Identifying User Segments and Key Stakeholders

#### Key Concept: Why Dashboards Fail

- A survey of **450+ dashboard builders** (book *Dashboards That Delivered*) found that **more than 70% agreed most dashboards fail**.
- The usual cause is **not** wrong charts, unprofessional colours or too much data; it is that **nobody understood who would actually use the dashboard and what they need from it**.
- So the work **before design** (understanding users) decides whether a dashboard succeeds.

#### Definition: User Segment

- **User segment** = a group of users with a genuinely different need for information.
- Same company and same broad topic (sales) can need three different dashboards:

| Persona (TrendE) | What they need |
|---|---|
| **CMO** | Overall market trends: is TrendE gaining or losing share quarter over quarter? |
| **Category manager (women's wear)** | Funnel of views, add-to-carts and purchases at **SKU level** to spot underperforming products |
| **Warehouse head** | **Today's fulfilment exceptions**, updated close to real time, to act within the hour |

- One all-purpose dashboard for everyone ends up **too dense for the CMO, too shallow for the category manager, useful to nobody**.
- Identifying user segments is the **first and essential step** before design.

#### Stakeholder vs User

| Term | Meaning | Example |
|---|---|---|
| **Stakeholder** | Usually the person who **commissions** the dashboard and holds the **budget or authority** | CMO wanting performance visibility for the team |
| **User** | The person who **opens the dashboard regularly** | Category manager, regional manager (may also include the CMO) |

- A stakeholder **may or may not** be a user, and their needs do **not necessarily match** other users' needs.
- **Stephen Few:** asking only the requester usually gives *what they are already used to getting, not what they actually need* (e.g. "the same monthly PowerPoint or Excel report, just faster and cleaner").
- Good requirements gathering means talking to **both the person funding it and the person using it**.

#### Who to Enrol Early

| Role | Who they are | Why needed early |
|---|---|---|
| **Senior sponsor** | A senior person who buys in **at the start** and is **involved through the process, not just informed** | Steps in on adoption problems (distrusted numbers, preference for old spreadsheet, two departments disagreeing on whose version is correct) and gets people aligned; involvement from day 1 makes it partly their initiative, so they push adoption |
| **Pilot users** | A small set of people from different functions who **test the dashboard while it is being built**, before rollout | Every first version has bugs (broken filter, number not matching a spreadsheet, slow chart); invested pilots report these **constructively as feedback**, a sceptical one may use the first bug to **write the whole project off** |
| **IT representative** | Person controlling **access to source systems** who knows data facts the business side does not | Involved from week 1, IT arrives at the data audit knowing why the dashboard exists; if looped in late, the request is **just another ticket in a long queue with no context** (slower, less prioritised) |

- Choose pilot users who sit **on your side of the table, not across from it**.
- Best practice: get the **senior sponsor to nominate pilot users from each user segment**, which makes them feel important and invested.

#### Pre-design Checklist

| No. | Must be in place |
|---|---|
| 1 | Known **user segments** (different people need genuinely different dashboards) |
| 2 | **Stakeholders vs daily users** distinguished |
| 3 | At least one **senior sponsor** genuinely engaged from the start |
| 4 | **Pilot users** on your side of the table |
| 5 | An **IT representative** in the loop from day 1 |

### 2.1.2 Asking the Right Questions

#### Key Concept: A Request Is Not a Requirement

- Sales head: "I mainly want to see the performance trend line over the last 6 months, updated as of yesterday, versus targets, with a breakdown by product category."
- Correct first move: **ask what decision they will make with that number**, not start building a chart (easy in tools like Power BI).
- "I want to see performance" is **not a requirement; it is the opening line of a conversation**.

#### Requirements Checklist: Why, What, How and When, Where

(Inspired by **Stephen Few's** work on dashboard requirements.)

| Category | Purpose | Questions to answer |
|---|---|---|
| **Why** | User's role and objective of the dashboard | Job title and core responsibilities; business problem being solved; **specific actions or decisions** taken from what they see; what they look at now to know if the day or week is going well |
| **What** | Data and metrics | Key performance indicators (**KPIs**); **benchmark** for each metric (target, same period last year, budget); **dimensions** to split by (region, product line, location); **granularity** (daily views or monthly summaries) |
| **How and When** | Frequency and triggers | How often viewed (every morning, weekly, live stream); **what triggers an alert** (e.g. sales below 90% of target); next step on spotting a problem (drill into detail or high-level summary enough) |
| **Where** | Viewing context and access | **Device** (desktop monitor, laptop, phone, wall screen); use in presentations (**export to PDF or PowerPoint**); **who else needs access** and whether they see the same view (**security controls**, e.g. sensitive part only for senior people) |

- Granularity matters because it plays a major role in **how the chart is designed**.
- Drill-down need varies by level: **senior levels** usually pass the problem to someone junior and ask for an explanation; **mid and junior levels** want to drill into detail because they must answer to those above.
- Alert triggers show what is critical for the user; a dashboard that serves them is seen as **an ally**.

#### Checking the Sales Head's Statement

| Category | Coverage in the statement |
|---|---|
| **What** | Covered: metric, comparison (versus targets) and one grouping (product category) |
| **How and When** | One weak hint ("updated as of yesterday") |
| **Why** | **Blank**: business problem, decision and priorities unknown |
| **Where** | Not mentioned: device, report or presentation use, who else needs access |

- This is **normal, not a bad interview**: people volunteer the **what** easily because it is concrete; the **why** and the rest need real conversation.

#### Two Types of Interviewee

| Type | Behaviour | Problem |
|---|---|---|
| **Blank-slate responder** | Cannot think on a blank slate; vague answers ("show me sales", "something useful") | Describing an ideal dashboard with no reference point is genuinely hard |
| **Laundry-list responder** | Hands over every metric ever wondered about (e.g. **30 items**), none prioritised | Not a requirement; **30 things cannot sit on one screen** |

- Start by scheduling **one-on-one interviews** with senior stakeholders and a **representative user from each segment**.
- The skill is **not reading questions like a script** but holding a conversation to find **what this person needs in order to act and make good decisions**; the checklist categories get filled along the way.
- Requirements gathering is **as much an art as a science**; the type of interviewee becomes clear in the first few minutes.

#### Four Techniques to Get Users to Open Up

| Technique | How it works | Best for / what it reveals | TrendE example |
|---|---|---|---|
| **1. Walk me through your day** | Ask for a typical day or week: when do they look at data, charts or reports | Strongest for **how and when**; confirms frequency and drill vs summary need; gives blank-slate users something concrete to **describe, not invent**; naturally **filters a laundry list** (rarely checked metrics are low priority) | Sales head checks the quarter against target every Monday before the leadership call, glancing only at the headline number: confirms regular refresh and that a **high-level summary suffices** most days |
| **2. Show me what you already look at** | Ask for existing reports checked daily, weekly or monthly (what they **actually use**, not what they imagine) | Strong for **what** (data items, level of detail); also reveals **why**, pain points (e.g. a report taking 2.5 days to compile), what they act on and what they **consistently ignore** | Marketing head shows a **manually maintained spreadsheet of campaign spend versus leads**, a data item not mentioned on his own |
| **3. Cross-pollinate across departments** | Mention in passing what another department asked for | Sharpens the **what** and surfaces **why**; two reactions: "we need this too" (include it) or "no, we need this instead" (sharpens the difference) | Sales wants performance by product category; operations replies it needs **performance by fulfilment centre and shipping carrier**, since delays happen there |
| **4. Put a rough mock-up in front of them** | Sketch a rough (even wrong) mock-up mid-interview, even on blank paper on the spot | People struggle to describe from a blank page but are **good at critiquing**; surfaces details such as **benchmarks and alert triggers** | Single quarterly sales number shown; sales head wants it **next to same quarter last year** and **flagged red if more than 5% behind target** |

- **Not every question needs a technique**: direct questions work for straightforward ones (device, presentation use, who needs access).
- Use the techniques where a direct question gets a **vague or incomplete answer**, mainly the **why** and parts of **how and when**.

### 2.1.3 Documenting and Consolidating Requirements

#### TrendE Requirements by Department

| Metric | Sales | Marketing | Operations | Notes |
|---|---|---|---|---|
| **Gross merchandise value (GMV)** / total revenue | Yes | Yes | Yes | Overview number |
| **Total orders** | Yes | Yes | Yes | Overview |
| **Average order value** | Yes | Yes | Yes | Overview |
| **Conversion rate** | Yes | Yes | Yes | Of those viewing a product, how many buy |
| **Return rate** | Yes | Yes | Yes | Split differs by department |
| **Gross margin %** | By product category | No | No | |
| **Sell-through rate** | Yes | No | Yes | Sales: which products move fast or slow; operations: by fulfilment centre |
| **Customer acquisition cost (CAC)** | No | Yes | No | |
| **Return on ad spend (ROAS)** | No | Yes | No | Budget spent versus revenue obtained |
| **Cart abandonment rate** | No | Yes | No | Of items put in cart, how many do not convert |
| **Order cycle time** | No | No | Yes | |
| **On-time delivery %** | No | No | Yes | |
| **Viewing device or format** | Laptop; trend view occasionally pulled into a slide for the leadership call | Provided | Phone on the warehouse floor | Shapes layout |

- The **top five metrics** (GMV, total orders, average order value, conversion rate, return rate) are required by **all three** departments: genuine common ground drawn from the same underlying sales data.
- Every row below that is required by **only one or two** departments.
- Every required metric exists because someone said it matters to how they do their job.

#### Key Metric Definitions

| Metric | Meaning | Why it matters |
|---|---|---|
| **Return rate** | Of 100 orders delivered for a product, how many were returned | Acts like **negative sales**: a rising return rate pulls net sales down |
| **Sell-through rate** | **Percentage of inventory held that has actually been sold** | Should be high; unsold inventory is **dead stock** |
| **Cart abandonment rate** | Share of products put in the cart that do not become sales | Affects website or app design; needs follow-up messages (e.g. email) |
| **Order cycle time** | Total time from the moment the customer **clicks buy** to successful **delivery at the doorstep** | Tracks how fast orders are delivered |
| **On-time delivery %** | How often the delivery commitment shown to the customer is met | Tracked by the logistics team; kept as high as possible |

#### Same Metric, Different Split: Return Rate

| Department | Split | What it reveals |
|---|---|---|
| **Sales** | By **product category** | Whether a specific product line has an issue |
| **Marketing** | By **channel or acquisition source** | A channel driving **low-quality buyers** (channels: Instagram, Google, email) |
| **Marketing** | By **campaign creative or promotion code** | Messaging that created misaligned expectations; heavy promotions (e.g. 70% off) can drive orders that are later returned |
| **Operations** | By **fulfilment centre and shipping carrier** | Packaging or delivery-related issues |

- Each department wants the common metrics as an **overview** and also **split by categories important to it**.
- Device details **shape layout decisions**, e.g. a page working well on a small screen or holding up when projected in a meeting.

#### Three Dashboard Structures

| Structure | Description | Advantages | Disadvantages | Use when |
|---|---|---|---|---|
| **One size fits all** | Single shared dashboard for everybody | **Single source of truth**; lowest maintenance | **High visual clutter** (irrelevant data for any one viewer); dilutes the sharp minimal view | Departments have **heavy overlap in daily workflows and goals**, not just a handful of shared numbers |
| **Fragmented** | Separate dashboards for each team | Fully tailored to each team | **Expensive to maintain**; risk of **calculating the same metric (e.g. revenue) differently** from different data sources; no single place for leadership overview | Departments share **nothing**: no overlapping goals, no common data sources |
| **Hybrid** | One **shared core** view for common metrics plus **department-specific views** | Focused core with each team still getting its own metrics | Needs more **careful layout planning upfront** | Teams share a **real core** but have **genuinely distinct operational needs** |

#### Building TrendE's Hybrid Dashboard

- The **five common KPIs** go on an **overview page**: the first thing everybody sees.
- Everything below the shared line gets its **own dedicated page** per department.
- Common KPIs split by department-specific categories (region, product category) also go on the dedicated page; the overview shows only the **number, perhaps with a trend line**.

#### Handling Unprioritised Metrics

- Users usually name many more metrics than the table shows; get them to **prioritise key metrics**.
- Metrics a department head **names as critical** belong to **phase 1**; the rest generally go to **phase 2**.
- Example: marketing head mentions **social media engagement** but omits it from top metrics, so it goes to phase 2 by his own priority order.
- All mentioned metrics are **logged, not rejected**; if users think an idea was quietly dropped they lose trust in the roadmap, but an explicit phase 2 log keeps them invested.

#### Playback and Sign-off Session

- Bring the **sales, marketing and operations heads back together in the same room** to play back the requirements and get sign-off.
- Simple agenda:
  - What was heard from each person, one by one.
  - The **shared core on the overview page** and why.
  - Each dedicated tab and its contents.
  - What is **parked for phase 2**, based on their own stated priorities.
- Show a **very rough, sketched mock-up** of the hybrid structure, **not** built in Power BI or Excel.
- Reason: a **polished mock-up makes people assume it is nearly final**; an obviously unfinished one **invites real critique** before committing to a build.

### 2.1.4 Data Audit and Feasibility

#### Key Concept: Data Audit

- A **data audit** checks whether the **data can actually support the requirements**, metric by metric.
- Information comes from the **users and the IT team** (the reason IT is enrolled upfront).
- It is not a quiet technical exercise but a checklist closed out with a feasibility verdict and sign-off.

#### Data Audit Checklist

| No. | Audit item | Key points |
|---|---|---|
| 1 | **Where does the data sit?** | TrendE: sales in the **point-of-sale system**, marketing spend in **ad platforms**, fulfilment data in the **operations system**: three metrics, three different sources |
| 2 | **Internal or external source?** | External examples: ad campaign data with the **ad platform vendor**, logistics data with a **third-party shipping partner**. Treat as its **own small discovery process**: needs **explicit vendor permission**, a different team and process; vendor timelines are often **far slower**. **Flag at once** and prioritise so the project is not delayed |
| 3 | **Direct automated access?** | Connect **directly to the source system** (automated feeds using **APIs**) rather than relying on someone exporting and uploading a file; manual handoffs break unnoticed (leave, forgetting, last month's file sent by mistake, untrained replacement) until a senior questions the numbers |
| 4 | **Manual uploads where unavoidable** | Example: quarterly forecast Excel file from finance. **Note it in the audit** and include upload training in **standard onboarding** for new employees |
| 5 | **Excel as source of last resort** | Spreadsheets are manually edited, columns renamed or reordered, formats change, nothing enforced. Dashboards need **standardised data**. Examples: "Bangalore" vs "BLR"; a new team member capitalising all column headers made the file incompatible and the **dashboard update stopped** |
| 6 | **Data dictionary** | Document explaining **what each field means**; revenue may include or exclude tax or delivery charges. Do not assume from the name; get definitions **from the data owner** (two people in one organisation may use different definitions); definitions are **shown in the final dashboard** |
| 7 | **Sample data** | Ask the owner for **actual data, usually 25 to 100 rows in a simple spreadsheet** (separate from the dictionary). Sanity-check: date formats, blank cells, text in numeric fields |
| 8 | **Refresh frequency** | Check the source refreshes **at least as often as users want**. Example: marketing wants returns data on the **1st**, but the logistics partner provides data only on the **7th**; flag to users |
| 9 | **Known problems** | Ask each source owner directly: **"What are the known problems with this data?"** (inconsistently filled field, tracking break, unfixed duplication). Also ask users who built their own reports. Faster than discovering issues 3 weeks into the build; goal is to surface issues **sooner than later** |
| 10 | **Revisions after landing** | Is the data accurate on arrival or **revised afterwards**? Example: media spend updated at month end, but fully accurate only the next month after vendor credit adjustments (March figure updated on 1 April is final only on **1 May**) |
| 11 | **Historical availability** | How far back does history go? Needed for **trend charts** and to know whether past periods can still be revised. Some systems keep only a **rolling window** or store history in a harder-to-access archive |

#### Handling Revised Data (Media Spend Example)

- Best approach (option chosen): show **indicative numbers first uploaded** (users want the likely spend) **and** let users **overwrite a historical value** when the corrected figure arrives.
- Rejected: showing only the original figures permanently; delaying publication until fully final.
- Consequence: the plan of uploading **only the latest month and not overwriting past data** had to change for this department.

#### Running the Audit

- Do **not** run the audit alone if uncomfortable with technical talk; pair with a **data-savvy partner** (IT or an analyst).
- A technical partner catches issues such as a **date column stored as text**, a field that looks suspiciously clean because it is **hard-coded rather than calculated**, or a **mismatch between two system structures**.
- These are cheap to catch at audit but **very expensive after the dashboard is built**.

#### Feasibility Verdict

- Give every metric an honest verdict:

| Verdict | TrendE example |
|---|---|
| **Feasible now** | GMV (clean) |
| **Feasible with extra work** | **Return rate** wanted by marketing on the 1st; logistics partner delivers on the 7th, so refresh timings must be aligned. If done quickly it **stays in phase 1**, else moves to phase 2 |
| **Not feasible yet** | **Sell-through rate by fulfilment centre**: warehouse system does not track received versus sold inventory consistently across locations, so data is not comparable; moves to **phase 2** until the data is fixed |

#### Audit Close-out Meeting

- Bring users and stakeholders together again; agenda:
  - **What was checked**: each metric and where its data comes from.
  - **Verdict on each** with brief reasons.
  - Ask once more for **any additional known issues**.
  - Get **senior sponsors and stakeholders to intervene** to speed up access and fixes (e.g. the CMO says "get this done fast and you can still deliver it in phase 1").
  - Obtain **explicit sign-off confirming the scope for version 1**.
- The audit and feasibility **directly shape the project scope and phase-wise development**.

### 2.1.5 Plan for Phase-wise Development

#### Key Concept: Perfection Is the Enemy of Progress

- The biggest risk is often **not** time, changing requirements or messy data, but the **temptation to hold the release until the dashboard feels 100% complete, polished and beyond criticism**.
- If you wait for flawless data you will **never launch**.

#### Definition: Phase 1 as MVP

- **Phase 1 = minimum viable product (MVP)** = the **overlap** of:
  - **Requirements**: the highest-priority essential metrics users need today.
  - **Data audit**: what is feasible, clean, connected and ready to use now.
- It gives users something **simple, clean and functional in weeks, not months**.
- Phase-wise development **guards against visual clutter**: ideas are **not deleted or rejected**, they are **scheduled in the phase 2 list**.

#### Three Bottlenecks That Push Metrics to Later Phases

| Bottleneck | Cause | TrendE example |
|---|---|---|
| **System bottleneck** | Data not tracked consistently yet | **Sell-through rate by fulfilment centre**: warehouse system not consistent across locations; pushed to phase 2 so operations can fix tracking without blocking the project |
| **Process bottleneck** | Data depends on **external vendors or manual handoffs** (a process mismatch, not a system problem) | **Return rate**: marketing wants it on the 1st but the logistics partner delivers on the 7th |
| **Governance bottleneck** | Data is ready but **revised after it lands** (nobody's mistake) | **Media spend**: figures reported on 1 April change by 1 May after vendor credit adjustments |

- Phasing lets the **core dashboard launch today with what is stable** while IT, marketing and logistics clear roadblocks in the background.

#### Development Roadmap

- Table columns: **phase, items, target users, timeline, blockers**.
- **Phase 1 normally has no blockers**; for phase 2 the blockers show **which team must fix the problem** before phase 2 can launch.
- The roadmap is presented to senior sponsors and stakeholders for an **explicit final sign-off before a single visualisation is built**; this manages data limitations with a structured plan and confirms **exact phase 1 scope**.

#### TrendE Case: Phase 1 Launch

| Item | Decision |
|---|---|
| **GMV** | 100% clean and feasible now: **core KPI at the top of phase 1** |
| **Return rate** | Depends on **renegotiating the vendor's delivery schedule**; moved to **phase 2** while procurement works on the vendor timeline |
| **Phase 1 launch** | GMV, total orders, average order value and conversion rate |
| **Outcome** | Immediate data visibility; procurement gets a **clear deadline** for the vendor change |

#### Sign-offs and Scope Creep

- Business users are **inherently visual**: seeing real data triggers **new ideas** ("just one more metric or view"). This is natural, **not a failure of the requirements process**.
- Many small asks across users add up to chaotic **scope creep**.
- The **assigned phase 1 scope acts as a shield**: respond that the idea (e.g. a geographic map visual) is excellent, outside phase 1, and **logged in the phase 2 roadmap**. The timeline is protected and the user feels heard.
- A dashboard launch is a **recurrent cycle, not a one-time event**: platforms such as Power BI and Tableau allow a **lean version 1**, observing usage, adapting, and rolling out the next phase.
- Some dashboards are **feasible in one pass** and need no phasing; with **multiple user segments and senior stakeholders**, phases are best to **manage expectations and show quick progress**.

| Phase element | Role |
|---|---|
| **Phase 1** | Immediate scope: clutter-free core delivered fast without blockers |
| **Later phases** | Clear **parking lot** for unfolding user needs as usage matures |
| **Timeline** | Gives data infrastructure room to mature |

## 2.2 Designing the Dashboard

### 2.2.1 Anatomy of a Dashboard

#### Key Concept: Tool-independent Building Blocks

- The same building blocks appear in **Power BI, Tableau, Looker** or any future tool; names and clicks differ but **the design thinking stays the same**.
- A dashboard is **not usually one screen**: it is a **small connected set of screens** (multiple pages or tabs).

#### Building Blocks

| Block | Description |
|---|---|
| **Pages or tabs** | Viewer moves between them depending on what they need to see |
| **Visuals** | Actual charts (line, bar), tables and numbers carrying the content; just one block, not the whole dashboard |
| **KPI cards** | Most important figures seen the moment the dashboard opens; usually **fewer than 10**, placed prominently, mostly **near the top** |
| **Filters (slicers)** | Control to narrow down by region, date range or product category; **all charts update**; lets one dashboard serve many views without a chart for every combination |
| **Navigation** | How the user moves between pages: set of **tabs, sidebar menu, or buttons** in the design; must be obvious and easy |
| **Hover and click interactions** | Pop-ups or expansions revealing more detail **without redesigning the screen**; contain clutter (simplest: exact figure on hover; complex: several charts on hover) |

### 2.2.2 Key KPIs and Metrics

#### Key Concept: KPI vs Diagnostic

- A **KPI** tells whether things are **broadly on track**; a **diagnostic** helps understand **why**.
- **Senior executives often focus only on the KPI cards**, so they must be designed well.
- An isolated number (e.g. net profit margin 12%) tells almost nothing: is it good, bad, average? A KPI needs **the number plus enough context to mean something instantly**.

#### Four Parts of a Good KPI Card

| Part | Description |
|---|---|
| **1. Number** | **Large and unmistakable**; first and often only thing the eye needs to land on |
| **2. Label** | Plain-language name with no ambiguity; spell out abbreviations (e.g. gross merchandise value) when needed; **use names users know** (GMV or total revenue) |
| **3. Comparison or context** | Reference point that turns an isolated number into something meaningful |
| **4. Trend signal** | **Up or down arrow** or small **sparkline** showing direction, not just current position; shows whether an issue is **consistently present, building up or sudden**; executives may want a proper trend line to judge seriousness |

- Add the **KPI definition as a tooltip on hover** to remove ambiguity.

#### Three Types of Comparison

| Comparison | Question | Use when | Typical display |
|---|---|---|---|
| **Versus target** | Are we hitting what we committed to? (goal-based) | An **agreed number** exists to hold ourselves accountable | **Percentage of target achieved** |
| **Versus prior period** | Are we improving compared with last month, quarter or same period last year? | **No fixed target**, or direction matters more than an absolute goal | Month-on-month, quarter-on-quarter, **year-on-year** |
| **Versus industry standard** | How do we stack up against the market? (competitive) | Less common internally; valuable when meaning depends on **external context** | Customer satisfaction score, on-time delivery percentage, market share |

#### Case: One KPI, Many Comparisons

- A CMO wanted sales versus **budget**, versus **latest forecast** (revised quarterly), **year-on-year** and **trend**.
- Resolved with a **single KPI card**:
  - Absolute sales number with **percentage of target achieved**.
  - **Latest forecast as default target**; a **filter switches the basis** between forecast and budget and the target updates.
  - **Year-on-year comparison in the right corner** of the card.
  - A **simple line chart below** showing the trend over the last 6 months.
- Result: clutter cut while the user got what he wanted.

#### TrendE Overview Page: Five KPI Cards

| Card | Best comparison | Design note |
|---|---|---|
| **GMV** | **Versus target** (leadership has a quarterly revenue goal; card answers "are we going to hit it?") | Pair with a **sparkline or trend line** across the quarter; likely the **single most watched card** |
| **Total orders** | **Versus prior period** | Read together with average order value |
| **Average order value** | **Versus prior period** | Place **side by side** with total orders: rising orders with falling average order value (more customers, smaller baskets) is visible at a glance while **GMV alone can look stable** |
| **Conversion rate** | **Versus target** (internal benchmark from historical data sets a healthy rate) | Moves **before GMV**, so it is an **early warning signal** worth watching directly |
| **Return rate** | **Versus target** | Trend line or sparkline shows stable or fluctuating; a rising return rate should be caught **before it drags down GMV or gross margin** |

- Colouring of cards (red or green) is decided later under look and feel; at this stage the focus is **what information each card carries**.
- Summary: a good KPI card is **never just one number**: it has a clear label, the right comparison and a trend signal.

### 2.2.3 Planning Information Flow and Visual Hierarchy

#### Key Concept: Eye-tracking Findings

- **Big numbers get noticed first**: a bigger number pulls the eye faster than anything else.
- **Repetition is not helpful**: with five identical KPI cards in a row, attention **drops sharply by the fourth or fifth**.
- The most important chart works best **left of centre**, where the eye lands first when reading left to right.
- Rule: the most important number goes **first, top left**, and must **look different from its neighbours** (sized or styled differently).

#### Five Tools of Visual Hierarchy

| Tool | Effect | TrendE application |
|---|---|---|
| **1. Size** | Bigger draws the eye first | GMV is the **largest number** on the overview page |
| **2. Colour and contrast** | A splash of colour against a muted background pulls attention; use **sparingly** | |
| **3. Position** | **Top left is scanned first** on most screens | |
| **4. Proximity** | Things placed close together read as **related** | Total orders and average order value sit **right next to each other** |
| **5. Typography** | Weight and size signal **importance, not just legibility** | Bold large number beside a small label |

#### Hierarchy vs Flow

| Concept | Meaning | Rule |
|---|---|---|
| **Hierarchy** | What is noticed **first within a screen**; makes a screen **scannable** | Important information reachable quickly |
| **Flow** | Sequence of information **across the whole dashboard, page by page** | **Start high, then let people drill down**: broadest read of the business in the first few seconds, specific pages only if something looks off |

- A dashboard's job is to **communicate fast, not to impress**; decoration and beautification **compete with important numbers**.
- Two broken opposites: a page with **too much detail** (plenty of ways to go, nothing to see on arrival) and a page with **no detail** (loud headline number but no path to investigate bad news).

#### Three-question Test for Any Dashboard Page

| No. | Question |
|---|---|
| 1 | Do we know **where to start**? |
| 2 | Do we know **what is next**? |
| 3 | Can we tell **when we are done**? |

- An **overview page does two jobs**: show top-level numbers and give a **clear way forward** to everything else.

#### Designing for the User's Level

| Level | Example users | Dashboard needs |
|---|---|---|
| **Executive (senior management)** | CMO, any CXO monitoring business health and opportunities | **Very high-level measures versus targets with a trend**; **simple and minimalist**; not for deep analysis (they ask the next level); enough to **point the question at the right person**; **minimal learning**; often **printability or export to PowerPoint** for board and internal meetings |
| **Mid-level** | Regional manager, category manager | See what bosses see **with more context and history**; **highly interactive with drill-down**; built for **diagnosis** and uncovering action steps; made for **analysis** |
| **Operational** | Store manager, customer support | **Simple, built for immediate decisions** with **alerts and notifications**; some drill-down to locate where action is needed; for **spotting red flags and taking action, not analysis** |

- TrendE mapping: the **overview page is executive tier**; the **sales, marketing and operations pages are mid-level** pages where department heads diagnose issues.
- The three department pages must be **true siblings** (comparable, coherent slices at the same level below the overview): a top-level summary branching into parallel pages.

#### Definition: Progressive Disclosure

- **Progressive disclosure** = **show only what is needed now, but make it easy to reveal more**; it lets a user climb the ladder from KPI to primary diagnostic to deeper diagnostic without putting everything on the page at once.

| Mechanism | How it works | Example |
|---|---|---|
| **Hover for context** | Small detail appears without leaving the visual or screen | Exact figure or definition on hover |
| **Expand in place** | Clicking a card reveals the next layer on the same page | Click return rate and a **category breakdown** appears underneath |
| **Click through to a detail page** | Viewer lands on a page built for that question | Click conversion rate to see conversion rate **by campaign** |

- Which mechanism fits depends on **how deep the next rung goes** and **how often it is needed**; a **full page is worth the extra click only when someone genuinely needs to dig in**.
- The discipline (one clear headline number, enough context, easy way to go deeper) applies even to a **simple spreadsheet weekly tracker**: it is a habit of thinking, not a software feature.

#### Structural Wireframe

- Before choosing chart types or colours, record the hierarchy, flow, tiers, navigation and progressive disclosure in a **structural wireframe**.
- It contains only **boxes**: where KPI cards, charts and filters sit and how navigation connects pages; **no real data, no colours, no branding, no chart types**.
- Sketch by **hand, pen and paper, or a simple slide**.
- Sign-off question: **"Does this layout make sense?"**, not "Do you like how it looks?"
- Collaborating with a **UX designer** is advisable if possible (specialist in layout and navigation).

### 2.2.4 Choosing Appropriate Charts

#### Question Types and Default Charts

| Question type | Example | Default chart |
|---|---|---|
| **Comparison** | Top cities by sales | **Column chart** (fewer than about 6 categories); **horizontal bar** (more) |
| **Comparison over time** | Sales trend over 6 months | **Bar or line** for a single series; **line chart** is better for multiple series (e.g. by product line) |
| **Composition** | Share of menu categories in orders | **Pie or donut only for fewer than 4 slices**; **stacked bar** for many slices; **100% stacked bar** to compare segment shares |
| **Distribution** | Delivery times across stores; consistency | **Histogram** or **box plot** |
| **Relationship** | Delivery time vs customer rating | **Scatter plot** (shows correlation, **not necessarily causation**) |

- **Position beats angle**: eyes compare bar length better than pie angles, so prefer a stacked bar over pie or donut where possible.
- **Box plot**: central box shows variability (**wider box = more variable**); long **whiskers** show outliers; best for **consistency of performance**.

#### TrendE Signed-off Requirements and Comparisons

| Page | Metric | Split and period | Comparison |
|---|---|---|---|
| **Overview** | GMV | | Versus target |
| | Total orders and average order value (together) | | Versus prior period (quarter on quarter) |
| | Conversion rate; return rate | | Versus target |
| **Sales** | Gross margin % | By product category, trend over last 6 months | |
| | Sell-through rate | By product category, last 6 months | |
| | Return rate | By product category, last 6 months | |
| **Marketing** | Customer acquisition cost (CAC) | By channel, last 6 months | |
| | Return on ad spend (ROAS) | By channel and by campaign, last 6 months | |
| | Cart abandonment rate | By channel, last 6 months | |
| **Operations** | Order cycle time | By fulfilment centre, last 6 months, plus consistency | |
| | On-time delivery % | By carrier and by region or location, last 6 months, plus consistency | |
| | Return rate | By fulfilment centre and by carrier, last 6 months, plus consistency | |

#### Chart Choices by Page

| Page | Chart choice | Reason |
|---|---|---|
| **Overview** | **KPI cards with large callout number and sparkline over quarters**; total orders and average order value placed together | Comparison versus target or prior quarter |
| **Sales** (3 metrics) | **Bar chart sorted highest to lowest** per metric, with a **trend line (6 months) below** | All are **comparison across categories and over time** |
| **Marketing** (4 metrics) | **Four bar charts**, each with its own trend line | Same comparison question repeated |
| **Operations: order cycle time by fulfilment centre** | Bar chart with trend line, plus **box plot** for consistency | Box plot shows **spread and outliers**: identifies most consistent centres and those with too much variability, giving **actionability** on what to investigate |
| **Operations: on-time delivery by carrier** | Bar chart, line chart for trend, box plot | |
| **Operations: on-time delivery by region** | **Bar chart** if only **4 regions**; **map with colour gradient** to find underperforming locations and **geographical clusters** (e.g. need for a new fulfilment centre) | Map suits location questions |
| **Operations: return rate by fulfilment centre and carrier** | Bar charts, trend lines and box plots | Reveals packaging or other issues for a specific carrier or centre |

- **Linked trend line** (Power BI): selecting a product category in the bar chart makes the trend line show **only that category**, highlighting what the user is interested in.

#### Managing a Crowded Page

- The operations page ends up with **too many visuals**, which can overwhelm the user, even though all meet requirements.
- Resolution via **progressive disclosure**: ask users what they want **by default**.
  - If **trend charts** are preferred: show bar and trend charts by default with a button near each trend chart reading **"Check performance consistency"** that reveals the box plot.
  - If **box plots** are preferred: show them by default with a button reading **"Check performance trend over 6 months"**.
- Principle: **regularly needed charts are visible by default; occasionally needed views open on a button**.

### 2.2.5 Designing the Look of the Dashboard

#### Key Concept: Why Freeze Look and Feel Early

- A dashboard gets used when it **meets user requirements**, but look and feel makes a big difference to **visual appeal**.
- Freeze it upfront and get **sign-off from senior sponsors and users**: changing colours or fonts after the build is **time-consuming**, and such decisions are **subjective** (users and sponsors do not necessarily agree), so early consensus avoids rework.

#### Brand Guidelines

- Dashboards in large companies must **reflect corporate branding and follow brand guidelines**.
- Gather **brand guidelines, colour palettes and logos** when requirements are first gathered.
- Ask the **brand team** for the guidelines document; if none exists, get the **exact colours, approved logo files and font rules** directly, not guessed from corporate communication.
- Example: asking upfront revealed the **logo and colours were being redesigned**, so the design aligned to the new guidelines and saved time.
- Consult the **creative person responsible for the brand** on the first set of designs.
- **Device** also matters: a mobile-first design differs from a laptop design.

#### Use of Colour: The 60-30-10 Rule

- Using a different colour on every bar leaves the viewer asking whether colour means something or is **just decoration**; one highlighted bar answers "which category is underperforming?" instantly.
- Thumb rule: the whole palette uses **only 3 to 4 colours**.

| Share | Colour role | Use |
|---|---|---|
| **About 60%** | **Neutral** colours | Backgrounds, text |
| **About 30%** | **Secondary or brand** colour | Makes it look and feel like the brand |
| **About 10%** | **Accent** colour | **Highlighting** (e.g. the underperforming bar) |

#### Status Colours

- **Conflict:** the brand colour is red and red also signals a missed target.
  - Fix: shift the status colour **slightly off the true brand colour** (e.g. **red-orange** for missed target) and **reserve the exact brand red for logos and primary actions**, so viewers never confuse a warning with the company's look.
- **Reserve discrete red, yellow and green** for universally understood signals: **below, on, or above target**.
- For anything showing a **degree rather than pass or fail**, use a **gradient of a single colour, light to dark**.

#### Colourblind Accessibility

- About **1 in 12 men** have some red-green colourblindness; a smaller share have the rarer blue-yellow type.
- Test rather than assume: a free tool such as the **Coblis colour-blindness simulator** shows a chart as a colourblind user sees it.
- If colour alone marks the underperforming category, the message **disappears** for some users.
- Fix: **pair colour with an icon, label or pattern**.
- Test: **if you could delete the colour entirely and the chart still makes its point, it is accessible to everyone**.
- A **down arrow** is a clearer signal than a red dot.

#### Page Design

- Professional page: **light canvas on a slightly darker neutral background** (shadow-box effect), **consistent spacing** between charts, and an **invisible underlying grid** so charts line up instead of looking hand-placed (tools like Power BI make this easy).
- Page has a **title and logo**; use style guidelines, standard logos and the palette so the page **belongs to the brand** rather than looking generic.

#### Wireframe vs Mock-up

| Aspect | Wireframe | Mock-up |
|---|---|---|
| **Sign-off question** | Does the **layout and navigation** make sense? | What will the dashboard **look like**? |
| **Content** | Rough sketches and **boxes**, no specifics | **Charts** instead of boxes |
| **Colour** | **Grayscale** | **Actual colour palette** |
| **Branding** | Blank corner | **Real logo** |
| **Data** | None | **Dummy data**; dashboard is **not live** |

- A mock-up is **close to final** in look and feel, giving users something tangible to assess; sign-off is needed **before the build**.
- Over time, contents change as needs and data availability evolve, but **look and feel, layout and navigation usually stay the same** so users do not have to relearn the tool.
- Full design and sign-off rigour is for **important company-wide dashboards** used by many users and senior sponsors. A **simple, short-term dashboard for one set of users** must still satisfy requirements, but **look and feel becomes secondary**.

### 2.2.6 Module Recap

#### Eight-step Dashboard Design Process

| Step | Activity | Output or sign-off |
|---|---|---|
| **1. Identify stakeholders and user segments** | Know the senior sponsor, key stakeholders per department and pilot users from each department | People in place |
| **2. Gather and consolidate requirements** | Questioning and techniques to elicit needs | Alignment on requirements and priorities across departments |
| **3. Data audit and feasibility** | Align with IT and data owners: what is feasible, who owns it, in what format | **Sign-off on scope for version 1** (requirements the users specified that are also feasible) |
| **4. Phase-wise plan** | Plan what is developed in each phase from user priorities and audit feasibility | **Sign-off from senior sponsor and stakeholders**; becomes the reference plan |
| **5. Information flow and hierarchy** | Decide number of pages, movement between pages, and what is important within a page | **Rough sketched wireframe** (navigation and hierarchy, no charts); sign-off from senior stakeholders and users |
| **6. Chart finalisation** | Populate wireframe boxes with appropriate charts from the business question; **plan filtering** per page and across pages | Charts per requirement |
| **7. Look and feel** | Based on brand guidelines and best practice; **mock-up of the prototype** showing colours, logo or images, charts and filters | Sign-off from sponsor, stakeholders and **pilot users**; manages expectations |
| **8. Ongoing agile development** | Dashboard is a **living project**; user needs unfold with use and some data arrives later | Test versions released to **pilot users each sprint**, launched to all after approval; **feedback mechanisms** to report data glitches and bugs |

- The process applies to a dashboard built from scratch for **multiple users across departments**; the next stage is creating dashboards in Power BI.

## Quick Revision Summary

### Key Definitions

- **Stakeholder**: commissions the dashboard and holds budget or authority. **User**: opens it regularly. They may differ.
- **Senior sponsor**: senior person engaged from the start who steps in on adoption problems.
- **Pilot users**: small cross-functional group testing the dashboard during the build; must be on your side of the table.
- **Requirements checklist**: **why** (role, objective, decisions), **what** (KPIs, benchmarks, dimensions, granularity), **how and when** (frequency, alert triggers, next step), **where** (device, presentation or export, access and security).
- **Data audit**: metric-by-metric check of whether data can support requirements; ends in a feasibility verdict.
- **Data dictionary**: document explaining what each field means.
- **Phase 1 (MVP)**: overlap of highest-priority requirements and data that is feasible now.
- **Scope creep**: accumulation of small extra asks; shielded by the signed-off phase 1 scope.
- **Progressive disclosure**: show only what is needed now, make it easy to reveal more.
- **Wireframe**: structure-only sketch (boxes, navigation); **mock-up**: near-final look with real palette, logo and dummy data.

### Key Frameworks and Rules

| Topic | Rule |
|---|---|
| Why dashboards fail | Nobody understood who would use it (more than 70% of builders say most fail) |
| Four interview techniques | Walk me through your day; show me what you already look at; cross-pollinate across departments; rough mock-up |
| Interviewee types | Blank-slate (vague) and laundry-list (30 unprioritised items) |
| Structures | One size fits all (clutter), fragmented (inconsistent metrics, costly), **hybrid** (shared core plus dedicated pages) |
| TrendE shared KPIs | GMV, total orders, average order value, conversion rate, return rate |
| Unprioritised metrics | Logged for phase 2, never rejected |
| External sources | Flag immediately; explicit vendor permission; slower timelines |
| Automation | Prefer direct API connections; Excel is the source of last resort |
| Sample data | 25 to 100 rows |
| Feasibility verdicts | Feasible now; feasible with extra work; not feasible yet |
| Three bottlenecks | System, process, governance |
| Dashboard blocks | Pages or tabs, visuals, KPI cards (under 10), filters (slicers), navigation, hover and click interactions |
| KPI card parts | Number, label, comparison, trend signal (plus tooltip definition) |
| Comparison types | Versus target, versus prior period, versus industry standard |
| Hierarchy tools | Size, colour and contrast, position, proximity, typography |
| Three-question page test | Where to start? What is next? When are we done? |
| User levels | Executive (simple, trend, export), mid-level (interactive, diagnostic), operational (alerts, red flags) |
| Chart defaults | Column or bar for comparison; line for multiple series over time; stacked bar over pie; box plot for consistency; scatter for relationship; map for location |
| Palette | 3 to 4 colours: about 60% neutral, 30% brand, 10% accent |
| Accessibility | About 1 in 12 men red-green colourblind; pair colour with icon, label or pattern |

### Must-Remember Points

- Identify user segments first; one all-purpose dashboard serves nobody well.
- A request ("show performance") is not a requirement; ask what decision the number drives.
- People volunteer the **what** easily; the **why** needs conversation; direct questions suffice for **where**.
- Involve IT from week 1; late requests become context-free tickets.
- Dictionary tells what a field means; sample data shows what is really in it.
- Return rate (feasible with extra work) and sell-through by fulfilment centre (not feasible yet) are the TrendE audit examples; revised media spend needs overwrite capability.
- Phase 1 launch for TrendE: GMV, total orders, average order value, conversion rate; return rate to phase 2.
- Total orders next to average order value reveals hidden basket-size decline; conversion rate is an early warning signal ahead of GMV.
- Overview page is executive tier; sales, marketing and operations pages are sibling mid-level pages.
- Wireframe is signed off on layout and navigation before any chart is chosen; mock-up is signed off on look and feel before the build.
- Operations page crowding is solved with default views plus buttons that disclose the box plot or trend chart.
- Reserve red, yellow and green for below, on, above target; use a single-colour gradient for degrees; shift status red off brand red.
- Eight steps: stakeholders, requirements, data audit and feasibility, phase plan, information flow and hierarchy (wireframe), chart finalisation, look and feel (mock-up), ongoing agile development.
