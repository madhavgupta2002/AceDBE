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

# Module 3: Building Visualisations with Power BI

## 3.0 Module Overview

### 3.0.1 Scope of the Module

- The module **moves from planning a dashboard to building one in Power BI**, Microsoft's business intelligence tool.
- **Data first**: load four separate files, clean them in **Power Query**, connect them in a **data model**, set up **hierarchies** and write calculations as **measures in DAX**.
- **Look next**: set a **theme** so every visual follows the same colours, text and settings.
- **Visuals**: the seven main chart types (**table, donut, column and bar, line, KPI card, scatter**), plus **slicers, interactions, drill-down and tooltips**.
- **Assembly**: put the visuals on one report page and manage it with the **filter, selection and grouping tools**.
- **Additional charts**: matrix, combo chart, waterfall chart and stacked area chart.
- Running case: **Superstore**, a fictional US retailer of office supplies, furniture and technology, 2015 to 2018.

### 3.0.2 Learning Objectives

- Bring multiple data files together, clean them and connect them into one data model.
- Decide between a **calculated column** and a **measure**, and write basic **DAX** measures.
- Build and format the core visuals, using **conditional formatting**, **hierarchies** and **drill-down** to answer business questions.
- Give users control through **slicers, interactions and tooltips**, and assemble a finished report page.

## 3.1 Getting Started and Data Preparation

### 3.1.1 Power BI and the Superstore Data

#### Key Concept: Report vs Dashboard in Power BI

| Term | Power BI meaning |
|---|---|
| **Report** | One or more **pages of interactive visuals**; what is built in Power BI Desktop in this module |
| **Dashboard** | Always a **single screen** made by **pinning visuals** from reports in the online cloud service |

- What is normally called a multi-screen dashboard is called a **report** in Power BI's language.
- **Power BI Desktop** is free and runs on **Windows**; it has **new releases every month**, so menus may look slightly different but the steps still work.
- The **online service** (cloud) is used to share reports and dashboards.

#### Superstore Data: Four Files

| File | One row is | Key fields |
|---|---|---|
| **Orders** | One **product in an order** (so an order ID repeats across rows) | Order date, customer ID, product ID, net sales, quantity, profit, discount |
| **Customer lookup** | One customer | Customer name, **segment** (consumer, corporate, home office), city, state, **region** |
| **Product lookup** | One product | Product ID, **category** (technology, office supplies, furniture), **subcategory**, product name |
| **Shipping** | One order | Shipping date, shipping mode |

- Scale: **2015 to 2018**, about **9,000+ order lines**, total sales about **2.2 million dollars**.
- Four separate files is realistic: orders, customers and products are held by different teams, and **bringing them together is part of an analyst's job**.
- Guiding question: **How is the business performing? Where is it making money and where is it losing money?**

### 3.1.2 Interface and Loading Data

#### Interface Areas

| Area | Role |
|---|---|
| **Data pane** (right) | Tables and all their columns used to build charts |
| **Visualizations pane** (middle) | Choose the visual; also holds the formatting options |
| **Canvas** (centre) | Drag and drop to build the report |
| **Report view** | Default view where visuals are built |
| **Table view** | Shows the data like a spreadsheet; quick check that data loaded properly |
| **Model view** | Connect tables and set relationships |
| **DAX query and TMDL views** | More advanced views, not used here |

#### Loading Data

- Start with a **Blank report**, then **Get Data** (Home ribbon). Sources include **Excel, CSV, SQL Server** and many more; large organisations typically connect to SQL tables.
- Choosing **Excel workbook** opens the **Navigator**, which lists each worksheet; options are **Load**, **Transform Data** or Cancel.
- Here: the Orders and Shipping sheets come from one workbook; the customer and product files are loaded separately.
- Each worksheet becomes a **separate table** in the data pane.

#### Field Icons in the Data Pane

| Icon | Meaning |
|---|---|
| **Sigma** | Numeric field that can be added or subtracted |
| **Calendar** | Date field |
| **Calculator** | **Calculated measure** |

### 3.1.3 Checking Tables in Table View

| Problem found | Fix |
|---|---|
| **Postal code** stored as a number (shows sigma) | Column tools: change data type from whole number to **text**, since postal codes are never added |
| **Order date and shipping date** carry an unused timestamp | Change data type from date-time to **Date** and pick format **MM/DD/YYYY** |
| **Country** column has only one value (United States) | Remove it; **every column uses memory**, so keep only columns useful for visuals |
| **Product lookup has no headers** (shows Column1 to Column4) | Needs Power Query: use first row as headers |
| Customer name wanted in capitals | Needs Power Query: add column from examples |

- Date formatting done in table view carries into every visual built afterwards.
- Table view also allows **sorting ascending or descending** to inspect values.

### 3.1.4 Power Query Transformations

#### Definition: Power Query

- **Power Query Editor** (Home, Transform Data) is a tool for data operations that normally need a data engineer, simple enough for a layperson.
- In large projects data engineers prepare the data; analysts may still need small transformations.

#### What Can Be Done

- Use first row as headers, add a custom column, choose or remove columns, keep or delete rows, remove duplicates, copy a table.
- The **Applied Steps** pane records every action taken.

| Task | Method |
|---|---|
| Product lookup headers | **Use first row as headers** |
| Remove country | Select the column, **Remove columns** (recorded as the step "Removed columns") |
| Capitalised customer name | **Add column from examples**: type the expected result for a couple of rows and the tool learns the pattern and fills the rest |

#### Close & Apply vs Apply

| Option | Effect |
|---|---|
| **Close & Apply** | Applies changes and closes Power Query |
| **Apply** | Applies changes but **stays in Power Query**, so other tables can be edited |

### 3.1.5 Data Model and Relationships

#### Key Concept: Why Connect Tables

- Most dashboards use **multiple data sets**, each with part of the information (orders hold the numbers, lookups explain the IDs).
- A segment-wise report needs the order table to refer to the customer lookup.
- After connecting, it is **as if working with one file**. The **data model is one of the most important inputs for a great dashboard**.
- Done in **Model view**.

#### Match Key

- Tables can be connected only if they share **at least one common column (a match key)**.
- Power BI **auto-connects** when column names are spelled the same.

| Tables | Match key | Connection |
|---|---|---|
| **Orders and Products** | Product ID | Automatic |
| **Orders and Shipping** | Order ID | Automatic |
| **Orders and Customers** | Customer ID in orders, but **cust_id** in the customer lookup | Names differ, so **drag cust_id onto customer ID manually** |

#### Relationship Cardinality

- Dragging the key opens a relationship dialog that shows the direction, for example **from customer lookup to orders: one to many**.
- **One to many**: each customer ID has **one row** in the lookup but the same customer may have **many order rows**. Seen from the orders side the same relationship reads many to one.
- Selecting a connector shows the summary (which column on each side).

#### Checks for Lookup Tables

- Lookup tables must have **unique rows**; if a product ID appears in several rows the model cannot connect correctly.
- Confirm the **correct column** is mapped on both sides.

### 3.1.6 Hierarchies

#### Definition: Hierarchy

- A **hierarchy** arranges data in levels so users can view patterns at the top level and **drill down** to explore deeper.
- Example use: year-wise sales show a dip; drill from year to quarter to see whether all quarters dipped or only one.

| Hierarchy | Levels | How it is created |
|---|---|---|
| **Date** | Year, quarter, month, day | **Automatic**: Power BI configures dates as a hierarchy |
| **Product (category hierarchy)** | Category, subcategory, product | **Manual**: Power BI cannot recognise it unless defined |

#### Creating the Category Hierarchy

1. In the product lookup, click the **three dots next to Category** and choose **Create hierarchy**.
2. For subcategory and then product, three dots, **Add to hierarchy**, choose the category hierarchy.
3. **Hide** the original fields (category, subcategory, product) so they are not used by mistake; they stay available inside the hierarchy.

- An arrow beside a field in the data pane shows it is a hierarchy.
- The lowest level is the product: it is added as **product ID** when the hierarchy is first built and as **product name** when it is used in the bar chart.

## 3.2 Measures and DAX

### 3.2.1 Columns vs Measures

#### Definitions

| Term | How it is calculated | Stored? | Use |
|---|---|---|---|
| **Calculated column** | **Once for every row** | **Yes**, in the table, so it uses memory | Value needed for **filtering** or as an **axis** (for example capitalised customer name) |
| **Calculated measure** | **On the fly** at query time, for whatever is currently filtered, sliced or grouped | **No**; recalculates on every change | Anything that must **aggregate or react to the user's selection** |

- Total sales for the business is one number; with a region selected the **same measure** gives that region's sales.
- Measures suit total sales, percentage of target, year-over-year growth, quarterly versus yearly sales.
- A percentage per row would be wrong: for a selected region the percentage must be **calculated at that time rather than adding up row percentages**.

#### Simple Test: Column or Measure

| Question | If yes |
|---|---|
| Does it need to **change automatically with filters or slicers**? | **Measure** |
| Do I need it to **filter on or put on an axis**? | **Column** |

- You **cannot filter on a measure**; filtering needs an actual column.

### 3.2.2 DAX Basics

#### Definition: DAX

- **DAX** stands for **Data Analysis Expressions**, the formula language for measures, similar to Excel formulas.
- It has a large function library: summing, counting, dividing, conditions, and date work such as year-on-year or month-on-month.

#### Creating a Measure

- Three dots next to the table in the data pane, **New measure**, or **New measure** on the ribbon; a formula pane opens like Excel's.
- Typing `SUM(` shows a dropdown of tables and columns; the measure appears in the table with a **calculator** icon.
- **Formatting** (for example percentage, decimals) is set on the measure and becomes the **default across the report**; it can be overridden per visual.
- Measures can be built on earlier measures; a few **building-block measures** are created first and others reuse them.
- Save the file early and often: Power BI saves as a **.pbix** file (here named Superstore).

### 3.2.3 Superstore Measures

| Measure | DAX | Note |
|---|---|---|
| **Total net sales** | `Total Net Sales = SUM(Orders_Products[Net Sales])` | **Net sales = gross sales minus discount**, the amount actually paid |
| **Total profit** | `Total Profit = SUM(Orders_Products[Profit])` | Absolute profit amount |
| **Profitability** | `Profitability = DIVIDE([Total Profit], [Total Net Sales])` | Format as **percentage** |
| **Total discount** | `Total Discount = SUM(Orders_Products[Discount])` | Sum of discount amounts |
| **Discount percentage** | `Discount PCT = DIVIDE([Total Discount], [Total Net Sales] + [Total Discount])` | Denominator is **gross sales** |

$$\text{Profitability} = \frac{\text{Total Profit}}{\text{Total Net Sales}}$$

$$\text{Discount \%} = \frac{\text{Total Discount}}{\text{Total Net Sales} + \text{Total Discount}}$$

- Discount percentage uses **gross sales** in the denominator, **not net sales**, because net sales is already reduced by the discount.
- Check: total profit of about 273K on net sales of about 2.2 million gives about 12.4%, matching the 12.42% shown on the table totals row.

#### DIVIDE vs Slash

| Operator | Behaviour when the denominator is zero |
|---|---|
| **/** (Excel-style) | Gives an **error** |
| **DIVIDE()** | **Safe divide**; handles the divide-by-zero case |

- `DIVIDE(numerator, denominator)`: numerator first, then denominator.

## 3.3 Report Theme

### 3.3.1 Why Set a Theme First

- **Formatting is the most time-consuming part** of building a report, so anything set up at the start saves time on every visual.
- A **theme** is one set of **colours, text and visual settings** that every chart follows.
- Path: **View, Themes, Customize current theme**. The theme can be **edited at any point later**.

### 3.3.2 Theme Settings Used

| Setting | Choice in the course |
|---|---|
| **Name** | Superstore course theme (saved as base theme selection) |
| **Colour palette** | **Accessible default**: adapted so slightly colourblind users can read most colours; the **first colour becomes the default** for most charts (column and line charts are blue) |
| **Sentiment colours** | **Negative: dark red; neutral: amber; positive: green** |
| **Divergent colours** | For gradients (like Excel colour scales): **maximum green, middle amber, minimum red** |
| **General text** | **16 points** (used for table values and similar) |
| **Title** | Changed from 12 to **18 points** |
| **Visual background** | White |
| **Border** | On, **light grey** so it does not dominate; **rounded corners** about 10 pixels |
| **Shadow** | On, so visuals look slightly lifted off the page |
| **Page canvas size** | **1920 by 1080** (default); enough detail even on large monitors |
| **Canvas background** | Slightly grey with added transparency so white visuals stand out |
| **Wallpaper** | Area **behind the canvas** when the screen is larger than the page; left as default |

- Companies vary colours to match their **brand palette**.

### 3.3.3 Saving and Limits of a Theme

- **Download current theme** saves a **JSON file** (Superstore Course theme) that can be browsed and applied to other reports.
- Fonts and colours generally reach every visual, and general text size reaches tables.
- **Chart title size and axis labels or axis titles often do not follow the theme** and are formatted on each visual.
- Good habit: change settings in the **theme** where possible instead of visual by visual (for example **tooltip text size**, 16 reduced to **10**). To open the theme, make sure **no visual is selected** (click outside), then use customize your report theme.

## 3.4 Building the Core Visuals

### 3.4.1 General Formatting Workflow

- A visual is added from the **gallery** by a single click or drag and drop onto the canvas.
- Two panes: **Build visual** (assign fields) and **Format your visual** (appearance).
- Format pane has two tabs: **Visual** (specific to the chart type) and **General** (common to all: size, title, subtitle, effects such as border, background and curved corners, header icons, properties).
- **Swap visual type**: with a visual selected, click another visual icon and the same data is redrawn (pie to donut to bar).
- **Copy and paste (Ctrl+C, Ctrl+V)** a formatted visual and replace the field to reuse formatting.
- **Format painter** (top ribbon) copies **only formatting** from one visual to another to keep a consistent look.
- **fx** beside a setting means **conditional formatting** can be applied.

### 3.4.2 Tables

#### Key Concept: Purpose

- A table **shows the detail** behind a report.
- Built here as **subcategory performance**: subcategory, total net sales, total profit and profitability.

#### Build and Read

- Fields are dragged in order; the **totals row** is on by default.
- Each column can be **sorted**; a scroll slider appears when rows do not fit.
- Totals: about **2.2 million** net sales, **273K** profit, **12.42%** profitability.
- Most profitable subcategories (labels, paper, envelopes) show **40%+ profitability**; loss-making ones are **tables, bookcases and supplies**.

#### Formatting Options

| Option | Detail |
|---|---|
| **Style presets** | For example minimal or flashy rose; **none** allows manual control |
| **Values and column headers** | Text takes size from the theme; header colour changed to dark blue |
| **Totals** | Can be turned off or formatted |
| **Specific column** | Formatting chosen **one column at a time** |
| **Display units** | Thousands, millions, billions; net sales set to **thousands, 0 decimals**; profit to **thousands, 1 decimal** (smallest value 949 shows as 0.9K); profitability **1 decimal**, no display unit |
| **Number format** | Set on the **measure** (or in table view for a column); display units are set on the visual |
| **Cell elements** | Background colour, font colour, **data bars**, **icons** |

#### Conditional Formatting in Tables

| Type | Applied to | Rule or setting |
|---|---|---|
| **Icons** | Total net sales | Rules based: default is bottom 33% red diamond, middle triangle, top 33% green; changed to **traffic-light circles** |
| **Data bars** | Total profit | Positive green, negative red (taken from theme sentiment colours); positive bar lightened in this visual so numbers stay readable |
| **Font colour** | Profitability | Rule: **greater than minimum and less than 0** gives red (flags loss-making) |

- Conditional formatting is reachable from **cell elements** or from the **dropdown next to the field** in the Build pane.
- Rules can be by **rules, gradient or field value**; it can apply to **values only, or values and totals**.
- Changes made on one visual **do not change the theme**.
- Rules depend on context: real companies often use **targets** (above target green, below red, near target yellow) or a **minimum profitability threshold** (for example anything below 10% is red).
- **Less is more**: formatting every column overwhelms the user. Format the **one most important column** (for example profit for a finance user).
- Sparklines for trends in a table are added in the next module.

### 3.4.3 Donut Charts

#### Key Concept: When to Use

- Pie and donut charts show **who contributes to sales** and work **only with a handful of slices**: four regions and three segments qualify.

| Feature | Pie | Donut |
|---|---|---|
| Total shown | **No** | **Yes, in the centre** (2.2 million) |

- Fields: **Values** = total net sales; **Legend** = region (customer lookup). **Whatever is in the legend determines the slices.**

#### Formatting

- **Legend off** and **detail labels** set to show everything (category, absolute value and percentage), because matching colours to a legend is hard.
- Title (General): **"Net sales by region"**, size about 22, centred; **subtitle turned off**.
- Segment donut made by **copy-paste**, replacing region with segment, then editing the title.

#### Reading the Results

| Chart | Observation |
|---|---|
| **Region** | **West contributes almost a third** (about 33.5%, 736.77K); East about 26 to 27% (about 590K); **South is smallest** |
| **Segment** | **Consumer about 50%**, **corporate about 30%**, **home office about 19%** |

- Hover **tooltips** show whatever fields the chart uses (region, total net sales, percentage).

### 3.4.4 Interactions

#### Key Concept: Default Behaviour

- **A selection in one visual impacts all other visuals on the page** by default. This effect is called **interactions**.
- Selecting **West** in the region donut changes the donut centre from 2.2 million to **736.77K**; the table now totals **737K** (West only) and the segment donut **highlights** the West share of each segment (highlighted percentages add up to the West share, 33.49%).
- **Ctrl+click** selects several slices (for example consumer and corporate); **click on empty white space** clears the selection.

#### Edit Interactions

- Select the **source visual**, then **Format, Edit Interactions**; icons appear on the other (target) visuals.

| Option | Effect on target visual |
|---|---|
| **Filter** | Target shows **only** the selected data; the whole donut becomes West and percentages sum to 100% (**default for the table**) |
| **Highlight** | Target still shows all data and **highlights the selected part** (**default between charts**) |
| **None** | Target is **unaffected** (back to 2.2 million) |

- The designer decides how much interaction to allow, based on user and design requirements; it helps, for example, to select phones and see every chart turn into phone numbers.
- Interactions work both ways: selecting a table row (for example chairs) shows how much of it comes from each region and segment.

### 3.4.5 Column Charts

- **Column and bar charts compare numbers across categories** because **eyes compare lengths far more accurately than angles**; often preferred to pie charts.
- Built as **net sales by category**: **X-axis** = category, **Y-axis** = total net sales (technology highest; furniture and office supplies close).

| Improvement | Setting |
|---|---|
| **Data labels** | **Best practice for column and bar charts**: without them the reader must read the axis or hover, and hovering is impossible when the chart is pasted into a slide |
| **Y-axis values** | Turn **off** once data labels are on, for a cleaner chart |
| **X-axis font** | About 14 points |
| **Bar colour** | Optional change; Columns, Layout adjusts **spacing between bars** (less space gives thicker bars) |
| **Title** | General: "Net sales by category", size 20, centred; subtitle off |

### 3.4.6 Bar Charts

- **Column charts suit about 4 to 5 bars**; with more categories (here subcategories) labels tilt and long names are hard to read, so use a **horizontal bar chart**.
- Method: copy the column chart, replace category with subcategory, then **swap to the bar chart type** and increase the height. Sorting is by the main measure by default.
- Formatting carried by copy-paste includes data labels; the **title must be edited** ("Net sales by subcategory").

#### Adding Tooltip Detail

- Fields dropped into **Tooltips** appear on hover. **Profitability** added to the tooltip.

#### Conditional Formatting of Bars

- Format pane, Bars, colour **fx**: **rules based on profitability**, **greater than minimum and less than 0**, bar colour **red**; other bars stay blue by default.
- Any available field or measure can be used, even if it is not in the visual.
- Result: three problem subcategories (**tables, bookcases, supplies**) are visible at a glance. Selecting furniture shows two loss-making subcategories (bookcases and tables) while chairs and furnishings make money.

#### Explaining the Colour

- Add a **subtitle** (General, Title, Subtitle): "Red bars indicate losses", about 13 points, italic, centred.
- A **text box** is the other option (covered later).

### 3.4.7 Hierarchy in Charts

#### Key Concept: One Chart Replaces Three

- A manager asks next: **are all tables losing money or only some?** Instead of another chart, use a **hierarchy** (category, subcategory, product name) in the bar chart.
- Replace subcategory with **category hierarchy**; the top level (category) shows first with **drill icons**.

#### Ways to Drill

| Method | How it works |
|---|---|
| **Tooltip drill** | Hover or click a bar and choose **drill down** or **drill up**; no drill-down at the lowest level |
| **Drill mode (single arrow)** | Turn on; "click a data point to drill" into that bar only; go up one level to return |
| **Next level (double arrow)** | **All bars move to the next level** (category to subcategory to all products across categories) |
| **Expand to next level (forked arrow)** | Shows **category and subcategory together** (for example chairs under furniture) |

- Examples: drilling tables shows that most tables lose money; drilling phones shows that nearly all make money except one.
- Bars sort by net sales by default; use the three dots, **Sort by**, category then subcategory, so subcategories group under technology, office supplies and furniture.
- Title changed to a generic **"Product Performance: Net sales"**; the subtitle "red bars indicate losses" is kept.
- **Power BI remembers the drill level at which the file is saved** and reopens at it. Organisations leave the **most-used view** open; users drill from there.
- New users do not know a chart can be drilled, so give **help instructions** (next section).

### 3.4.8 Help Tooltip

#### Ways to Add Notes

| Method | Visibility | Best for |
|---|---|---|
| **Subtitle** | Always visible | **Short notes**, such as what a colour means |
| **Help tooltip** | A small **question mark** shown on hover; text appears when used | **Longer instructions** that would clutter the chart: how to drill, **last refresh time**, **data issues**, new functionality |
| **Text box** | Free-standing | Covered in later modules |

- Set under **Format, General, Header icons**: icons such as drill up and drill down can be switched on or off, and the **Help tooltip** is turned on with its text (example: "Red bars show losses. You can use the tooltip to drill down or up into specific bars").
- New users do not know what a colour means or that a chart can be drilled; notes remove that doubt without cluttering the chart.

### 3.4.9 Line Charts

#### Key Concept: Purpose

- Bar charts compare categories; a **line chart shows how something changes over time**.
- Build: **X-axis = order date** (date hierarchy used), **Y-axis = total net sales**. Trends are built on dates.

#### Formatting

| Item | Setting |
|---|---|
| **Format painter** | Copy formatting (title and fonts) from a formatted visual |
| **Data labels** | Turned **off** and **Y-axis values on** (font about 12) |
| **Lines, interpolation** | **Smooth** or **linear** (jagged, follows the points) |
| **Markers** | Turn on to show the individual data points |

#### Adding Category to Legend

- **Category into Legend** gives three lines.
- Reading: overall dip from 2015 to 2016. **Furniture grew steadily**; **office supplies dipped and then rose**; **technology dropped in 2016 then accelerated rapidly and overtook the others**. So the dip came from **office supplies and technology, not furniture**.

### 3.4.10 Drill-down in Line Charts

#### Key Concept: When Did It Happen

- The line chart shows **which category** drove the change but **not when within the year**; the date hierarchy lets the user drill down.
- **A static trend chart** keeps only **Year** on the X-axis: the drill icons disappear.

#### Date Drill Behaviour

| Mode | Result for dates |
|---|---|
| **Drill mode on a data point** | Goes deeper into that year only (year, then quarter, then month, then day) |
| **Forked arrow (expand)** | Shows quarter-wise (then month-wise) across all years; the **daily view is too dense** |
| **Double arrow (next level)** | **Adds up all Q1s across years**, and so on; **not useful for dates** |

- Examples: 2017, then quarter 2, then April to June, then a May daily view.
- **Red dots** appear where losses occur because the **format painter carried over the loss-red rule** from the bar chart.
- Format painter carries **everything, including the help tooltip text**, so it must be edited ("red dots show losses" instead of bars).
- The **subtitle is dynamic**: it reads "total net sales by year, quarter and month" and changes as the level changes.

#### Trend Per KPI and Responsive Setting

- Copy-paste the chart twice and replace the measure: **total net sales, total profit, profitability**.
- **Responsive** behaviour shrinks fonts as the visual shrinks. Turn off at **Format, Visual, General, Properties, Advanced options, Responsive**; Shift-click to select several visuals and change them together.

### 3.4.11 KPI Cards

#### Key Concept: Purpose

- KPI cards answer **how are we doing?** at a glance: big simple numbers placed prominently, top or left, so the eye lands there first (visual hierarchy).
- Use the newest **Card** visual: it accepts **multiple values** and creates a card for each.
- Values here: total net sales, total profit, profitability.

#### Formatting Levels

| Level | Settings |
|---|---|
| **Multi-card layout** | **Tiles** (space between cards) or **table** (no space); **arrangement** horizontal (default) or vertical; **gap** (default 8 points); **background** colours the overall card block |
| **Cards (individual)** | Background of each card; border; **accent bar** (colour, width, position such as left or top); **shadow** and size |
| **Callout values** | Size of the number (for example 60), colour; conditional colour |
| **Labels** | Size of the label text (for example 16) |

- **Apply settings to all** cards, or to **one specific card** (switch the setting selector from all to the card name).
- Conditional formatting of callout values: **profitability** rule greater than minimum and less than 0 gives **deep red**; the number turns red when the selection (for example tables) is loss-making.
- Result: **2.2 million net sales, 273K profit, 12.4% profitability**.

### 3.4.12 Slicers

#### Definition: Slicer

- A **slicer** is a control for **user selection** that is **always visible**, letting users customise their view (for example the West manager sees only West; a manager narrows to Q1).
- Funnel icon; a slicer takes **one field** only.
- By default **affects all visuals on the page**; control it with **Edit Interactions** (filter or none).

#### Region Slicer

| Setting | Options |
|---|---|
| **Style** | **Vertical list**, **tile**, **dropdown** (smallest; best when space is limited) |
| **Selection** | **Multi-select** by default (Ctrl+click for checkboxes); single select can be forced; **Select all** can be shown |
| **Header** | Text defaults to the field name; changed to **"Select region"**, italic, so users know it is for them |
| **Background and border** | General, Effects: background and visual border on (otherwise it shows page background) |

#### Date Slicer

- Copy the formatted slicer and replace the field with **order date**.
- Options: **Between** (chosen; users know it from travel bookings), before, after, relative date, dropdown; a **slider** lets users narrow the range.
- Header "Select date range"; if the header size does not change, turn **responsive off** (General, Properties, Advanced options).
- **Interactions**: the date slicer should **filter the KPIs** but have **no impact on the region slicer**; the region slicer likewise should not affect the date slicer.

### 3.4.13 Scatter Plots

#### Key Concept: Relationship Between Two Things

- A scatter answers a different question: **do two things move together?**
- Here: do **net sales and profitability** go together across subcategories, and what is the effect of discounting?

#### Field Wells

| Well | Field | Meaning |
|---|---|---|
| **X-axis** | Total net sales | Horizontal position |
| **Y-axis** | Profitability | Vertical position |
| **Values** | Subcategory | **One bubble per subcategory** |
| **Legend** | Category | **Colour** shows the category |
| **Size** | Total discount | Bubble size shows how much discount was given |
| **Tooltips** | Subcategory | Name on hover |

- Four parameters per dot: **X = net sales, Y = profitability, colour = category, size = discount**.
- **Total discount** had to be created as a new measure to put into size.

#### Reading the Chart

- Overall there is **no clear relationship** between net sales and profitability; adding **category as colour** can reveal patterns hidden overall.

| Category | Pattern |
|---|---|
| **Office supplies** | Clustered at **lower net sales**, many with high profit; most receive low discounts |
| **Technology** | Mid to high net sales; profitability highest in the mid range |
| **Furniture** | **Mixed bag, many losses** (tables lowest at about -8.56%, bookcases also negative) |

- **Machines**: not much net sales but **very heavy discount**, profitability only **2.32%**, just above the loss line.
- **Phones**: high net sales, medium discount. **Binders**: sell a lot with heavy discounts, yet still more profitable than loss-making furniture.
- Turn on **Category label** (Format) so subcategory names show without hovering, which matters for slides.

#### Formatting the Scatter

| Task | Setting |
|---|---|
| **Copy formatting** | Format painter from the line chart; axis titles still need work |
| **Axis titles** | X and Y titles set to size 18 |
| **Axis range** | Y-axis minimum and maximum changed from auto (for example **-20% to 70%**, entered as -0.2 and 0.7) so dots are not hugging the axis; top and bottom later set to the same range |
| **Zero line** | **Add further analysis** pane: **Y-axis constant line at 0**, coloured red |
| **Target line** | Same tool, for example constant line at **0.2** for a 20% profitability target |
| **Shade area** | Shade below the line to mark the **loss region**; raise **transparency (about 85%)** so bubble colours stay visible |

- Loss region subcategories: **tables, bookcases, supplies**; machines sit just above it.
- Caution: total discount amount **rises with sales** even at a small discount rate, so low-sales office supplies show low discount. **Discount percentage** is the better measure for the size of the bubble (to be added in a later dashboard).

## 3.5 Assembling the Report

### 3.5.1 Building the Performance Overview Page

- In practice, from the design we know which charts are needed; **reuse what exists, create what is missing, then assemble**.
- Page contents: **header "Performance Overview"**, **KPI cards**, **trend charts**, the **product performance bar chart**, and **three slicers** (date range, region, segment).

#### Steps and Tools

| Tool or step | Detail |
|---|---|
| **Gridlines and Snap to grid** | View menu; they help align visuals |
| **Header** | Insert, **Text box**; typed text size about 32 to 36, bold; a logo can be added the same way |
| **Moving a text box** | Use the **three dots (move handle)**; it does not move while in edit mode |
| **Copy visuals** | Ctrl+C from other pages (KPI, drill-down line, bar chart) and Ctrl+V on the report page; resize each |
| **Align** | Select with **Shift**, Format, **Align** (left, top and so on); similar to PowerPoint, with distribute available |
| **Slicer paste prompt** | When pasting a slicer onto another page, Power BI asks whether to **sync** it |
| **Third slicer** | Copy an existing slicer, replace the field with **segment**, change the **slicer header** text |

- Always **select the visual** before formatting, otherwise the format pane shows canvas options.
- Trend charts are shown at **year** level; the user can choose another level.
- East selected on the report page shows about **590K** net sales on every page that shares the slicer.

#### Sync Slicers

- If the slicer is **synced**, a selection **persists across pages**: choosing East on one page applies on the others, and selecting all returns everything to 2.2 million.
- **Most companies prefer persistence**; choose **Don't sync** when it is not wanted. It depends on user requirements.
- Placement and choices can always be changed; use design inputs if a designer is available.

### 3.5.2 Designer Controls vs User Choices

#### Who Chooses What

| Role | What they can do |
|---|---|
| **Users** | Pick values in **slicers**, **click visuals** to filter or highlight others, **drill down**, **hover** over tooltips and the help tooltip |
| **Designer (report author)** | Filters pane, sync slicers, selection pane, grouping, edit interactions, locking and hiding filters |

- Microsoft calls the designer the **report author**.

### 3.5.3 Filters Pane

#### Three Levels of Filter (set by the designer, not the user)

| Level | Scope | Example |
|---|---|---|
| **Filters on this visual** | Selected visual only | **Top N**: top 5 subcategories by total net sales; rename the visual to match |
| **Filters on this page** | All visuals on the page | **Region = West**; remove the region slicer and title the page "Western Region Performance Overview" |
| **Filters on all pages** | Entire report | Region = West on every page |

- Basic filtering and **Top N** are among the options; **clear filter** removes it.
- **Lock** a filter so nobody can change it, or **hide** it so it does not show; useful when sharing the **.pbix** file.
- Use page-level region filters to **create the same report for several regions** without letting users see other regions' numbers (save and send one per region).

### 3.5.4 Sync Slicers Pane, Selection Pane and Grouping

| Tool | Where | Purpose |
|---|---|---|
| **Sync slicers** | View menu | Select a slicer, then choose **per page** whether it is **synced** and whether it is **visible** |
| **Selection pane** | View menu | Lists all elements; **rename** them (segment slicer, date range slicer, region slicer, bar chart, trends, KPI cards, header); **show or hide** them; useful when elements overlap, for editing something behind a logo, or hiding a visual before sharing |
| **Grouping** | Format, **Group** (and Ungroup) | Group related visuals (trend charts and KPI cards) so they **move together** |

- Renaming matters because with many boxes, slicers and charts it is hard to identify a visual by its default name.

### 3.5.5 What the Module Covers (Recap)

- **Data**: load four files, clean in Power Query, connect in a data model, define measures in DAX.
- **Visuals**: tables, donuts, column and bar charts, line charts, KPI cards, scatter plots, formatted with the format pane and **conditional formatting** for important numbers.
- **Consistency**: theme for colours and fonts; **format painter**; select, align, distribute and group; **selection pane** for naming and showing or hiding.
- **Designer controls**: interactions; filter on a visual, a page or the report; lock or hide filters.
- **User controls**: slicers, click-to-filter, drill-down, tooltips and help tooltip.
- Save the file; it is reused in later sessions.

## 3.6 Additional Charts

### 3.6.1 Matrix

#### Key Concept: Table vs Matrix

| Visual | Structure |
|---|---|
| **Table** | Lists **one thing per row** (for example subcategories) |
| **Matrix** | **Crosses two things, rows against columns, with totals both ways** (a cross-tabulation) |

- Build: **Columns** = region, **Rows** = category hierarchy (so rows can be drilled), **Values** = profitability.
- Reading: **furniture overall about 2.33%**; **technology highest overall at 17.66% but South only 6.27%**.
- Click **Furniture** to expand: **bookcases and tables make losses**. Bookcases in Central are borderline (not a loss); tables are a problem across regions, **less so in South and West, especially West**.
- Formatting is like a table: **conditional formatting, font colour, rules** (greater than minimum, less than 0, red).
- Rules apply to **values only by default**; choose **values and totals** to colour totals as well. Row and column subtotals, bold and so on are controlled in the format pane.

### 3.6.2 Combo Chart

- Used to show **an amount and a rate together** (for example sales and profitability), which sit on **very different scales**.
- **One as columns and the other as a line, each with its own axis** (line and stacked column chart).
- Build: **X-axis** = order date, **column Y-axis** = total net sales, **line Y-axis** = profitability. Drilling is available.
- Reading: net sales rise every quarter, but profitability varies a lot; for example **Q4 2018 has a huge bar with a dip in profitability**, which raises the question of whether sales were bought with too much discounting.
- **Use carefully**: because the axes differ, show **axis titles on both the primary and secondary Y-axes** so users know which series follows which axis.

### 3.6.3 Waterfall Chart

- Shows **how a total moves from one point to another step by step**: what pushed it up and what pulled it down; very common in finance for seeing what pulls performance down.
- Build: **Y-axis** = total net sales, **category (X)** = order date kept at **year** only, **breakdown** = category.
- **Green** = increases, **red** = decreases.

| Period | Reading |
|---|---|
| **2015 to 2016** | **Furniture increased**, **office supplies and technology fell**, net effect a **small decline** (matches the line chart dip) |
| **2016 to 2017** | **All three increased**; technology jumped relatively |
| **2017 to 2018** | **All three increased**; most of the rise from **office supplies**, furniture grew very little |

- **Check the axis scale**: here it starts at **400K**. The relative contribution is still readable, but **a large bar does not by itself show how large the jump is**.

### 3.6.4 Stacked Area Chart

- Shows **how a total and the mix inside it change over time**.
- Better than two donuts (for example segment sales in two different years), which are hard to compare.
- Build: **X-axis** = order date at year level, **Y-axis** = total net sales, **Legend** = segment.
- **100% stacked area chart**: shows **only composition**, not absolute values; clearer when the change in total makes the stacked version hard to read.
- Reading: **consumer is dominant**; in the 100% view the **consumer share comes down, corporate takes over space, and home office stays reasonably stable**.

## Quick Revision Summary

### Key Definitions

- **Report**: pages of interactive visuals in Power BI Desktop. **Dashboard**: one screen made by pinning visuals in the online service.
- **Power Query**: tool to clean and transform data; **Applied Steps** record each action.
- **Match key**: common column that lets two tables connect. **One to many**: one lookup row, many order rows. Lookup tables must have **unique rows**.
- **Hierarchy**: levels for drilling (date is automatic; category, subcategory, product must be created).
- **Calculated column**: stored, computed per row, used for filtering or axes. **Measure**: computed on the fly, reacts to filters, cannot be used to filter.
- **DAX**: Data Analysis Expressions; **DIVIDE** is the safe divide.
- **Theme**: saved set of colours, text and visual settings (JSON file).
- **Slicer**: always-visible user control for selection. **Interaction**: effect of a selection in one visual on others (filter, highlight, none).
- **Format painter**: copies formatting only. **Help tooltip**: question-mark note for longer instructions.
- **Matrix**: rows against columns with totals both ways. **Combo**: columns plus line on separate axes. **Waterfall**: step-by-step changes in a total. **Stacked area**: total and mix over time.

### Key Formulas and Rules

| Topic | Rule |
|---|---|
| Net sales | Gross sales minus discount |
| Profitability | `DIVIDE([Total Profit], [Total Net Sales])` |
| Discount percentage | `DIVIDE([Total Discount], [Total Net Sales] + [Total Discount])` (gross sales in denominator) |
| Column or measure | Needs to react to filters: measure. Needs to filter or be an axis: column |
| Field icons | Sigma = numeric, calendar = date, calculator = measure |
| Superstore scale | 2015 to 2018, 9,000+ order lines, about 2.2 million in net sales, 273K profit, 12.42% profitability |
| Chart choice | Donut or pie only for a handful of slices; column for about 4 to 5 bars, bar for more; line for time; scatter for relationship |
| Data labels | Best practice on column and bar charts; then turn Y-axis values off |
| Drill modes | Drill mode (one bar), double arrow (next level for all), forked arrow (expand to show levels together) |
| Date drill | Double arrow adds up the same quarter across years, so it is not useful |
| Notes on visuals | Subtitle (short, always visible), help tooltip (longer), text box |
| Slicer styles | Vertical list, tile, dropdown; dates use Between |
| Filters pane | Visual, page, all pages; set by designer; can lock or hide |
| Combo chart | Always title both axes |

### Must-Remember Points

- Power BI Desktop is free, runs on Windows, and files are saved as **.pbix**.
- Fix data types in table view (postal code to text, dates to date) and remove unused columns because **every column uses memory**.
- Customer lookup used **cust_id** against **customer ID**, so it had to be connected manually; product and shipping connected automatically.
- Set the theme before the first visual; tooltip size and similar settings are best changed in the theme. Chart titles and axis labels are formatted per visual.
- Conditional formatting rule used throughout: **profitability greater than minimum and less than 0 gives red**; it carries across with the format painter, including help tooltip text.
- Loss-making subcategories: **tables, bookcases, supplies**; machines is borderline at 2.32% with heavy discounts.
- 2015 to 2016 dip came from **office supplies and technology**, not furniture.
- By default every selection affects every other visual; the designer overrides with Edit Interactions.
- A synced slicer keeps its selection across pages; sync is controlled in the sync slicers pane.
- Page or report filters set by the designer let one report be sent to each region without slicer choice.
- Use the selection pane to name, show or hide elements and group related visuals so they move together.
- Combo and waterfall charts need careful reading: label both axes, check the axis start (waterfall started at 400K).
