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
