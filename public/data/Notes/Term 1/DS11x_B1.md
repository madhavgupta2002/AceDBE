
# ***Business Statistics for Entrepreneurs - 1***

# Module 1: Descriptive Statistics

## 1.0 Welcome to the Module

## 1.1 Introduction to Descriptive Statistics

### 1.1.1 Basic Definitions
*   **Statistics:** The science of collecting, analyzing, presenting, and interpreting data to make business decisions.
*   **Data:** Facts and figures collected for analysis.
*   **Data Set:** All data collected for a particular study.
*   **Element:** The entity for which data is collected (e.g., a household, a company, a respondent).
*   **Variable:** A characteristic of interest for an element (e.g., income, age, satisfaction score).
*   **Observation:** The set of measurements obtained for a single element (corresponds to one **row** in a dataset).

### 1.1.2 Data Collection Types
*   **Cross-Sectional Data:** Data collected at the **same** or approximately the same point in time (e.g., Census 2020, customer satisfaction survey in January).
*   **Time Series Data:** Data collected over **several** time periods (e.g., Monthly sales over 3 years, daily stock prices).
*   **Observational Study:** Observing and recording variables without interfering (e.g., counting customers in a store).
*   **Experimental Study:** Data collected in a controlled environment where variables are manipulated (e.g., Clinical trials, A/B testing).

## 1.2 Types of Data

### 1.2.1 Qualitative (Categorical) Data
*   Can be numeric or non-numeric.
*   **Nominal Scale:** Labels or names used to identify an attribute. **No ranking** implied.
    *   *Examples:* Gender (M/F), Region (North/South), ID Numbers, Store Name.
*   **Ordinal Scale:** Labels have an inherent **ranking** or order.
    *   *Examples:* Satisfaction ratings (Satisfied > Dissatisfied), Size (Small, Medium, Large).

### 1.2.2 Quantitative Data
*   Always numeric; indicates "how much" or "how many".
*   **Interval Scale:** Numeric data with a fixed unit of measure. **Zero is arbitrary** (does not mean "none"). Ratios are **not** meaningful.
    *   *Examples:* Temperature (Celsius/Fahrenheit), Calendar Dates (Years), Standardized Test Scores (SAT/GMAT).
*   **Ratio Scale:** Numeric data where **zero is absolute** (indicates absence). Ratios are meaningful (e.g., 200 is twice 100).
    *   *Examples:* Income, Salary, Sales, Age, Weight, Price, Distance.

## 1.3 Data Visualisation

### 1.3.1 Summarizing Categorical Data
*   **Frequency Distribution:** Table showing the count of observations in non-overlapping categories.
*   **Relative Frequency:** Fraction/Proportion of total items in a class ($Frequency / n$).
*   **Percent Frequency:** Relative Frequency $\times 100$.
*   **Bar Chart:** Graphical display for categorical data (bars do not touch).
*   **Pie Chart:** Circular display using relative frequencies. (Often discouraged due to difficulty in comparing sector sizes).

### 1.3.2 Summarizing Quantitative Data
*   **Histogram:** Graphical display for quantitative frequency distributions. **Bars touch** to show continuity.
    *   Shows the **shape** of distribution (skewness).
*   **Scatter Plot:** Graphical display showing the relationship between **two quantitative** variables.
    *   *Trend Line:* Can be added to approximate the relationship.
*   **Comparing Variables:**
    *   **Side-by-side Bar Chart:** Compares two variables (e.g., Satisfaction levels by Gender).
    *   **Stacked Bar Chart:** Composition of the whole across categories.

## 1.4 Measures of Central Tendency

### 1.4.1 The Mean (Average)
*   Sum of values divided by the number of observations ($n$).
*   **Excel Command:** `=AVERAGE(range)`
*   **Sensitivity:** Highly sensitive to **outliers** (extreme values).
*   **Weighted Mean:** Used when observations vary in importance (Weights $w_i$). Formula: $\frac{\sum w_i x_i}{\sum w_i}$.

### 1.4.2 The Median
*   The middle value when data is sorted in **ascending order**.
*   **Odd $n$:** The exact middle value.
*   **Even $n$:** The average of the two middle values.
*   **Excel Command:** `=MEDIAN(range)`
*   **Robustness:** Not influenced by extreme values/outliers. Preferred for skewed data (e.g., Income, Property Prices).

### 1.4.3 The Mode
*   The value that occurs with the greatest frequency.
*   **Unimodal:** One mode. **Bimodal:** Two modes. **Multimodal:** More than two.
*   **Excel Command:** `=MODE.SNGL(range)` or `=MODE.MULT(range)`.

### 1.4.4 Percentiles and Quartiles
*   **Percentile ($p$):** Value where at least $p\%$ of observations are less than or equal to this value.
    *   *Location Formula ($L_p$):* $\frac{p}{100}(n+1)$. (Interpolate if not an integer).
    *   **Excel Command:** `=PERCENTILE.EXC(range, k)`
*   **Quartiles:** Divide data into four parts.
    *   **Q1 (1st Quartile):** 25th Percentile.
    *   **Q2 (2nd Quartile):** 50th Percentile (Median).
    *   **Q3 (3rd Quartile):** 75th Percentile.

## 1.5 Measures of Dispersion

### 1.5.1 Basic Measures
*   **Range:** Max Value - Min Value. (Based on only two points; sensitive to outliers).
*   **Interquartile Range (IQR):** $Q3 - Q1$. Measures the range of the **middle 50%** of data. (Robust against outliers).

### 1.5.2 Variance and Standard Deviation
*   **Variance ($s^2$):** Average of squared deviations from the mean.
    *   *Sample Variance Formula Divisor:* $n - 1$ (Degrees of freedom).
    *   **Excel Command:** `=VAR.S(range)`
*   **Standard Deviation ($s$):** Square root of the variance ($\sqrt{s^2}$).
    *   Measured in the **same units** as the original data.
    *   **Excel Command:** `=STDEV.S(range)`

### 1.5.3 Coefficient of Variation (CV)
*   A relative measure of variability expressed as a percentage.
*   **Formula:** $CV = (\frac{\text{Standard Deviation}}{\text{Mean}}) \times 100$
*   **Use:** To compare variability between datasets with different units or means (e.g., comparing stock price volatility of Apple vs. P&G).

## 1.6 Five Number Summaries and Box Plot

### 1.6.1 Z-Scores (Standardization)
*   Measures how many standard deviations a value ($x_i$) is from the mean ($\bar{x}$).
*   **Formula:** $z = \frac{x_i - \bar{x}}{s}$
*   **Properties:** Standardized data has Mean = 0, Standard Deviation = 1.
*   **Z-Score Outlier Rule:** Any data point with a z-score **less than -3** or **greater than +3** is considered an outlier.
*   **Excel Command:** `=STANDARDIZE(x, mean, standard_dev)`

### 1.6.2 Box and Whisker Plot
*   **Five-Number Summary:** Min, Q1, Median (Q2), Q3, Max.
*   **Box:** Drawn from Q1 to Q3. Line inside represents Median.
*   **IQR:** Height/Width of the box ($Q3 - Q1$).
*   **Outlier Boundaries (Fences):**
    *   Lower Limit: $Q1 - 1.5 \times IQR$
    *   Upper Limit: $Q3 + 1.5 \times IQR$
*   **Whiskers:** Extend to the smallest/largest values *within* the limits. Values outside are plotted as points (Outliers).

### 1.6.3 Module 1 Formula Sheet
| **Concept** | **Formula / Description** |
| :--- | :--- |
| **Relative Frequency** | $\text{Frequency} / n$ |
| **Percent Frequency** | $\text{Relative Frequency} \times 100$ |
| **Mean ($\bar{x}$)** | $\frac{\sum x_i}{n}$ |
| **Weighted Mean** | $\frac{\sum w_i x_i}{\sum w_i}$ |
| **Percentile Location ($L_p$)** | $\frac{p}{100}(n+1)$ |
| **Interquartile Range (IQR)** | $Q3 - Q1$ |
| **Sample Variance ($s^2$)** | $\frac{\sum (x_i - \bar{x})^2}{n-1}$ |
| **Standard Deviation ($s$)** | $\sqrt{s^2}$ |
| **Coefficient of Variation (CV)** | $(\frac{s}{\bar{x}}) \times 100$ |
| **Z-Score** | $z = \frac{x_i - \bar{x}}{s}$ |
| **Outlier Limits** | Lower: $Q1 - 1.5 \times IQR$ / Upper: $Q3 + 1.5 \times IQR$ |

# Module 2: Random Variables and Discrete Probability Distributions

## 2.0 Welcome to the Module

## 2.1 Introduction to Random Variables

### 2.1.1 Key Definitions
*   **Random Experiment:** A process or procedure for which more than one outcome is possible (e.g., tossing a coin, rolling a die).
*   **Sample Space ($S$):** The set of all possible experimental outcomes (sample points).
*   **Event:** A subset of the sample space (a collection of outcomes of interest).
*   **Probability ($P$):** Numerical measure of the likelihood of an event occurring.
    *   Range: $0 \le P(\text{Event}) \le 1$.
    *   Sum of probabilities of all outcomes in $S$ = 1.
*   **Complement of Event $A$ ($A'$ or $A^c$):** Event consisting of all sample points **not** in $A$.
    *   $P(A') = 1 - P(A)$.

### 2.1.2 Relationships Between Events
*   **Union ($A \cup B$):** Event containing points in $A$ **or** $B$ **or both**.
*   **Intersection ($A \cap B$):** Event containing points in **both** $A$ **and** $B$.
*   **Mutually Exclusive Events:** Events that have no sample points in common.
    *   If $A$ occurs, $B$ cannot occur.
    *   $P(A \cap B) = 0$.

### 2.1.3 The Addition Law
*   Used to compute the probability of the union of events.
*   **Formula:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.
*   **For Mutually Exclusive Events:** $P(A \cup B) = P(A) + P(B)$.

## 2.2 Linear Combination of Random Variables

### 2.2.1 Conditional Probability
*   Probability of event $A$ occurring given that event $B$ has already occurred.
*   **Notation:** $P(A|B)$.
*   **Formula:** $P(A|B) = \frac{P(A \cap B)}{P(B)}$

### 2.2.2 The Multiplication Law
*   Derived from conditional probability.
*   **Formula:** $P(A \cap B) = P(B) \times P(A|B)$ OR $P(A \cap B) = P(A) \times P(B|A)$.

### 2.2.3 Independence of Events
*   Two events are independent if the occurrence of one does not alter the probability of the other.
*   **Conditions for Independence:**
    1.  $P(A|B) = P(A)$
    2.  $P(B|A) = P(B)$
    3.  $P(A \cap B) = P(A) \times P(B)$
*   *Note:* Two events with non-zero probabilities cannot be both mutually exclusive and independent.

### 2.2.4 Bayes' Theorem
*   Used to update probabilities based on new information.
*   **Prior Probability:** Initial probability estimate ($P(A)$).
*   **Posterior Probability:** Revised probability after obtaining new information ($P(A|B)$).
*   **Joint Probability Table:** A table listing probabilities of intersections of two variables (useful for calculating marginal and conditional probabilities).

## 2.3 Recap

### 2.3.1 Random Variables (Discrete & Continuous)
*   **Random Variable (RV):** A numerical description of the outcome of an experiment.
*   **Discrete RV:** Takes integer values or countable numbers (e.g., number of defects, number of customers, sales orders).
*   **Continuous RV:** Takes fractional values in an interval (e.g., time, weight, temperature, volume).

### 2.3.2 Discrete Probability Functions
*   **Probability Mass Function (PMF), $f(x)$:** Probability that $X$ takes a specific value $x$.
    *   $\sum f(x) = 1$.
*   **Cumulative Distribution Function (CDF), $F(x)$:** Probability that $X$ is less than or equal to $x$.
    *   $F(x) = P(X \le x)$.
*   **Tail Probability:** Probability that $X$ is greater than $x$.
    *   $P(X > x) = 1 - F(x)$.

### 2.3.3 Numerical Measures of RVs
*   **Expected Value (Mean), $E(X)$ or $\mu$:** Weighted average of all possible values.
    *   Formula: $E(X) = \sum [x \times f(x)]$.
*   **Variance, $Var(X)$ or $\sigma^2$:** Weighted average of squared deviations from the mean.
    *   Formula: $Var(X) = \sum [(x - \mu)^2 \times f(x)]$.
*   **Standard Deviation ($\sigma$):** $\sqrt{Var(X)}$.

## 2.4 Binomial Distribution

### 2.4.1 Linear Function of One Variable ($Y = aX + b$)
*   **Expected Value:** $E(Y) = a E(X) + b$. (Scaling and shifting affect the mean).
*   **Variance:** $Var(Y) = a^2 Var(X)$. (Shifting $b$ does **not** affect variance; scaling $a$ is squared).
*   **Standard Deviation:** $SD(Y) = |a| \times SD(X)$.

### 2.4.2 Sum of Two Random Variables ($Y = X_1 + X_2$)
*   **Expected Value:** $E(Y) = E(X_1) + E(X_2)$.
*   **Variance:** $Var(Y) = Var(X_1) + Var(X_2) + 2 \times Cov(X_1, X_2)$.
*   **If Independent:** Covariance is 0.
    *   $Var(Y) = Var(X_1) + Var(X_2)$.

### 2.4.3 General Linear Combination ($Y = aX_1 + bX_2$)
*   **Expected Value:** $E(Y) = aE(X_1) + bE(X_2)$.
*   **Variance (if independent):** $Var(Y) = a^2 Var(X_1) + b^2 Var(X_2)$.
    *   *Note:* Even for Difference ($Y = X_1 - X_2$), variance **adds**: $Var(Y) = Var(X_1) + Var(X_2)$ (since $-1^2 = 1$).

### 2.4.4 Sum and Average of $n$ Independent Identical Variables
Let $X_1, X_2, ... X_n$ be independent with mean $\mu$ and variance $\sigma^2$.
*   **For the Sum ($S = \sum X_i$):**
    *   $E(S) = n \mu$
    *   $Var(S) = n \sigma^2$
    *   $SD(S) = \sqrt{n} \sigma$
*   **For the Average ($\bar{X} = \frac{\sum X_i}{n}$):**
    *   $E(\bar{X}) = \mu$ (Expectation stays the same).
    *   $Var(\bar{X}) = \frac{\sigma^2}{n}$ (Variance decreases as $n$ increases).
    *   $SD(\bar{X}) = \frac{\sigma}{\sqrt{n}}$.

## 2.5 Poisson Distribution

### 2.5.1 Characteristics
*   **Usage:** The Poisson distribution models the number of times an event occurs in a fixed interval of time or space.
*   **Examples:** Number of emails per hour, defects per meter of fabric, typos per page, customers arriving at a store in 30 minutes, number of phone calls at a call center in 15 minutes, number of defects in a stretch of highway, number of keywords on a page.
*   **Random Variable ($Y$):** Takes values $0, 1, 2, \ldots, \infty$ (i.e., any non-negative integer).
*   **Assumptions (Poisson Process):**
    1. The probability of the event occurring in any interval is proportional to the length of the interval.
    2. Occurrences in non-overlapping intervals are independent.
    3. Mean and variance of the process are both equal to the same parameter (see below).

### 2.5.2 Properties & Formulas
*   **Parameter $\lambda$ (Lambda):** The average (mean) number of occurrences in the interval; this is the only parameter needed for the Poisson distribution.
*   **Probability Mass Function (PMF):**
    $$
    P(Y = y) = \frac{e^{-\lambda} \lambda^y}{y!}
    $$
    Where $e \approx 2.71828$ and $y = 0, 1, 2, \ldots$
*   **Key Properties:**
    *   **Mean:** $E[Y] = \lambda$
    *   **Variance:** $Var(Y) = \lambda$
    *   **Standard Deviation:** $\sqrt{\lambda}$

| Property             | Poisson ($\lambda$)                      |
|----------------------|------------------------------------------|
| Random Variable      | $Y$ (events in interval)                 |
| PMF                  | $P(Y = y) = \dfrac{e^{-\lambda}\lambda^{y}}{y!}$ |
| Possible Values      | $y = 0,1,2,...$                          |
| Mean $E[Y]$          | $\lambda$                                |
| Variance $Var(Y)$    | $\lambda$                                |
| Std. Deviation       | $\sqrt{\lambda}$                         |

### 2.5.3 The Poisson Process
*   A **Poisson process** models the number of random events happening over time or space at a constant average rate.
*   **Key Features:**
    *   Events occur independently.
    *   Inter-arrival times between events are independent and identically distributed and follow an **exponential distribution**.
    *   Let $N(t)$ = number of events by time $t$.
    *   For any interval of length $t$, $N(t)$ follows a Poisson distribution:
        $$
        N(t) \sim \mathrm{Poisson}(\lambda t)
        $$
*   **Parameter $\lambda$ ("rate"):**
    *   $\lambda$ = average number of events per unit time (e.g., $\lambda = 10$/hour).
    *   For any interval of length $T$, the Poisson parameter is $\Lambda = \lambda T$.
    *   Mean and variance: $\mathbb{E}[N(T)] = \mathrm{Var}(N(T)) = \lambda T$.

#### Example:
*   If $\lambda = 10$ events/hour:
    *   In $2$ hours: $\Lambda = 10 \times 2 = 20$
    *   In $0.5$ hour: $\Lambda = 10 \times 0.5 = 5$
*   **Note:** Capital $\Lambda$ is sometimes used for the Poisson parameter for an interval, ($\Lambda = \lambda T$). Some textbooks use $\mathrm{Poisson}(\Lambda)$ or $\mathrm{Poisson}(\lambda T)$—these mean the same thing.

### 2.5.4 Relation to Binomial
*   The Poisson distribution is a limiting case of the Binomial distribution when the number of trials $n$ is large and the probability $p$ is small, so $np = \lambda$.

### 2.5.5 Portfolio Analysis (for Reference)
*   **Portfolio Mean:** $E[Z] = w_1 E[X] + w_2 E[Y]$
*   **Portfolio Variance:** $Var(Z) = w_1^2 \sigma_X^2 + w_2^2 \sigma_Y^2 + 2 w_1 w_2 Cov(X, Y)$

### 2.5.1 Module 2 Formula Sheet
| **Concept** | **Formula / Description** |
| :--- | :--- |
| **Complement Rule** | $P(A') = 1 - P(A)$ |
| **Addition Law** | $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ |
| **Cond. Probability** | $P(A\|B) = \frac{P(A \cap B)}{P(B)}$ |
| **Multiplication Law** | $P(A \cap B) = P(B) \times P(A\|B)$ |
| **Independence** | $P(A\|B) = P(A)$ or $P(A \cap B) = P(A)P(B)$ |
| **Exp. Value (Discrete)** | $E(X) = \sum [x \cdot f(x)]$ |
| **Variance (Discrete)** | $Var(X) = \sum [(x - \mu)^2 \cdot f(x)]$ |
| **Linear Func ($aX+b$)** | $E(Y) = aE(X) + b$ / $Var(Y) = a^2 Var(X)$ |
| **Sum ($X+Y$)** | $E(X+Y) = E(X) + E(Y)$ / $Var(X+Y) = Var(X) + Var(Y)$ (if indep.) |
| **Sum of $n$ i.i.d.** | Mean: $n\mu$, SD: $\sqrt{n}\sigma$ |
| **Avg of $n$ i.i.d.** | Mean: $\mu$, SD: $\frac{\sigma}{\sqrt{n}}$ |

# Module 3: Continuous Probability Distributions

## 3.0 Welcome to the Module

## 3.1 Continuous Random Variable - Introduction

### 3.1.1 Definition
A **Continuous Random Variable** is a variable that can take any fractional or decimal value within a given range (interval). Unlike discrete variables, which take specific integer values, continuous variables can represent an infinite number of values within their range.

*   **Examples of Discrete vs. Continuous:**
    *   **Discrete:** Number of defective items in a batch, number of customers arriving in a day.
    *   **Continuous:** Time between two customer arrivals, amount of fluid in a bottle, oven temperature.

### 3.1.2 Probability Density Function (PDF)
*   Represented by **$f(x)$**.
*   **Interpretation:** For continuous variables, $f(x)$ does **not** directly provide the probability of $x$. Instead, the **area under the curve** of $f(x)$ over a specific interval provides the probability.
*   **Core Property:** The probability of a continuous random variable taking an exact specific value is always **zero** ($P(X = c) = 0$) because the area under a single point is zero.

### 3.1.3 Fundamental Properties
| Property | Description |
| :--- | :--- |
| **Non-negativity** | $f(x) \ge 0$ for all values of $x$. |
| **Total Area** | The total area under the PDF curve across all possible values equals **1**. |
| **Probability in Interval** | $P(a \le X \le b)$ is calculated by the integral of $f(x)$ from $a$ to $b$. |

### 3.1.4 Cumulative Distribution Function (CDF)
*   Represented by **$F(x)$**.
*   Provides the probability that the random variable $X$ takes a value less than or equal to $x$ ($P(X \le x)$).
*   Calculated by integrating the PDF from the minimum possible value up to $x$.

### 3.1.5 Expected Value and Variance
*   **Expected Value $E[X]$:** The weighted average of all possible values, calculated by the integral of $x \cdot f(x)$.
*   **Variance $Var(X)$:** Measures the spread, calculated by the integral of $(x - E[X])^2 \cdot f(x)$.

## 3.2 Uniform Distribution

### 3.2.1 Definition
A random variable follows a **Uniform Distribution** if it can take any value between a lower limit ($L$) and an upper limit ($U$), where every value is equally likely.

### 3.2.2 Key Formulas
*   **PDF:** $f(x) = \frac{1}{U - L}$ for $L \le x \le U$, and $0$ elsewhere.
*   **CDF:** $F(x) = \frac{x - L}{U - L}$
*   **Tail Probability:** $P(X > x) = 1 - F(x) = \frac{U - x}{U - L}$
*   **Interval Probability:** $P(a \le X \le b) = \frac{b - a}{U - L}$
*   **Mean ($E[X]$):** $\frac{L + U}{2}$
*   **Variance ($Var(X)$):** $\frac{(U - L)^2}{12}$

### 3.2.3 Percentiles in Uniform Distribution
To find the $p^{th}$ percentile, solve for $x$ in the equation:
$$\frac{x - L}{U - L} = \text{Probability (e.g., 0.80 for 80th percentile)}$$

## 3.3 Exponential Distribution

### 3.3.1 Definition
The **Exponential Distribution** is used to model the **time between random events** occurring at a constant average rate ($\lambda$).

### 3.3.2 Key Formulas
*   **Rate Parameter ($\lambda$):** The average number of events per unit of time.
*   **PDF:** $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$
*   **CDF ($P(X \le x)$):** $1 - e^{-\lambda x}$
*   **Tail Probability ($P(X > x)$):** $e^{-\lambda x}$
*   **Mean ($E[X]$):** $\frac{1}{\lambda}$
*   **Variance ($Var(X)$):** $\frac{1}{\lambda^2}$
*   **Standard Deviation:** $\frac{1}{\lambda}$ (Unique property: Mean = Standard Deviation).

### 3.3.3 Memoryless Property
The exponential distribution "forgets" how much time has already passed. The probability of an event occurring in the next 10 minutes is the same regardless of whether you have already waited 0 minutes or 20 minutes.
*   **Mathematical Form:** $P(X > s + t | X > s) = P(X > t)$

### 3.3.4 Excel Functions
*   **`=EXPON.DIST(x, lambda, TRUE)`**: Returns the Cumulative Distribution Function (CDF).
*   **`=EXPON.DIST(x, lambda, FALSE)`**: Returns the Probability Density Function (PDF).

## 3.4 Normal Distribution

### 3.4.1 Definition
The **Normal Distribution** (or Gaussian Distribution) is the most important continuous distribution. It is a symmetric, bell-shaped curve defined by its mean ($\mu$) and standard deviation ($\sigma$).

### 3.4.2 Characteristics
*   **Symmetry:** Symmetric about the mean ($\mu$).
*   **Measures of Central Tendency:** Mean = Median = Mode.
*   **Range:** Theoretically extends from $-\infty$ to $+\infty$.
*   **Skewness:** Skewness is $0$.
*   **Spread:** $\sigma$ determines the flatness; larger $\sigma$ results in a wider, flatter curve.

### 3.4.3 The Empirical Rule (68-95-99.7 Rule)
*   **$P(\mu - \sigma \le X \le \mu + \sigma) \approx 0.683$** (68.3% of data)
*   **$P(\mu - 2\sigma \le X \le \mu + 2\sigma) \approx 0.954$** (95.4% of data)
*   **$P(\mu - 3\sigma \le X \le \mu + 3\sigma) \approx 0.997$** (99.7% of data)

### 3.4.4 Standard Normal Distribution ($Z$)
A Normal distribution with $\mu = 0$ and $\sigma = 1$.
*   **Z-Score Formula:** $Z = \frac{X - \mu}{\sigma}$
*   A Z-score represents the number of standard deviations a value $X$ is away from the mean.

### 3.4.5 Critical Values ($Z_{\alpha/2}$)
*   A critical value $Z_{\alpha/2}$ is the Z-value that leaves an area of $\alpha/2$ in the upper tail.
*   **Common Critical Values:**
    | Confidence Level ($1-\alpha$) | $\alpha/2$ | $Z_{\alpha/2}$ |
    | :--- | :--- | :--- |
    | 90% | 0.05 | 1.64 |
    | 95% | 0.025 | 1.96 |
    | 99% | 0.005 | 2.58 |

### 3.4.6 Excel Functions
*   **`=NORM.DIST(x, mean, standard_dev, TRUE)`**: Returns CDF ($P(X \le x)$).
*   **`=NORM.INV(probability, mean, standard_dev)`**: Returns the $x$ value for a given cumulative probability (Inverse calculation).

## 3.5 Linear Combinations of Normal Random Variables

If $X_1, X_2, \dots, X_n$ are independent normal random variables, any linear combination $Y = a_1X_1 + a_2X_2 + \dots + a_nX_n + b$ is **also normally distributed**.

### 3.5.1 Formulas for Expected Value and Variance
*   **Mean of $Y$:** $E[Y] = a_1\mu_1 + a_2\mu_2 + \dots + a_n\mu_n + b$
*   **Variance of $Y$ (if independent):** $Var(Y) = a_1^2\sigma_1^2 + a_2^2\sigma_2^2 + \dots + a_n^2\sigma_n^2$
*   **Variance of $Y$ (if dependent):** Requires inclusion of covariance terms ($2 a_i a_j Cov(X_i, X_j)$).

### 3.5.2 Special Case: Sample Mean ($\bar{X}$)
If $X_i$ are $iid$ (independent and identically distributed) with mean $\mu$ and variance $\sigma^2$:
*   **$E[\bar{X}] = \mu$**
*   **$Var(\bar{X}) = \frac{\sigma^2}{n}$**
*   **Standard Deviation of $\bar{X}$ (Standard Error):** $\frac{\sigma}{\sqrt{n}}$

## 3.6 Chi - Square Distribution

### 3.6.1 Normal Approximation to Binomial
When the number of trials ($n$) is large, the Binomial distribution can be approximated by a Normal distribution.

#### Conditions for Approximation
*   $n \cdot p \ge 5$
*   $n \cdot q \ge 5$ (where $q = 1 - p$)

#### Parameters for the Normal Curve
*   **Mean:** $\mu = n \cdot p$
*   **Variance:** $\sigma^2 = n \cdot p \cdot q$

#### Continuity Correction
Because we are using a continuous distribution to approximate a discrete one, we adjust the values by **0.5**:
*   To find $P(X \le k)$, calculate $P(Y \le k + 0.5)$.
*   To find $P(X \ge k)$, calculate $P(Y \ge k - 0.5)$.
*   To find $P(X = k)$, calculate $P(k - 0.5 \le Y \le k + 0.5)$.

### 3.6.2 Derived Distributions (Chi-Square, t, F)

These distributions are derived from the Normal distribution and are essential for statistical inference.

#### 3.6.2.1 Chi-Square Distribution ($\chi^2$)
*   **Definition:** The sum of the squares of $k$ independent standard normal random variables ($Z^2$).
*   **Parameter:** Degrees of freedom ($k$).
*   **Properties:** Defined only for positive values; skewed to the right (becomes more symmetric as $k$ increases).
*   **Mean:** $k$
*   **Variance:** $2k$

## 3.7 Student's t Distribution

#### 3.7.1 Student's t-Distribution
*   **Definition:** Used when the population standard deviation is unknown and sample size is small.
*   **Shape:** Symmetric bell shape, centered at 0, but **flatter** with heavier tails than the standard normal.
*   **Convergence:** As degrees of freedom ($k$) increase, the t-distribution converges to the Standard Normal ($Z$) distribution.
*   **Variance:** $\frac{k}{k - 2}$ (for $k > 2$).

## 3.8 F - Distribution

#### 3.8.1 F-Distribution
*   **Definition:** The ratio of two independent chi-square variables, each divided by its respective degrees of freedom.
*   **Parameters:** $k_1$ (numerator degrees of freedom) and $k_2$ (denominator degrees of freedom).
*   **Properties:** Only positive values; skewed to the right; used in ANOVA and testing regression fitness.

## 3.11 Key Takeaways

### 3.11.1 Quick Revision Summary

#### Key Definitions
*   **PDF ($f(x)$):** Height of the curve; area under it is probability.
*   **CDF ($F(x)$):** $P(X \le x)$.
*   **Memoryless Property:** Unique to Exponential distribution.

#### Important Formulas
*   **Standard Normal:** $Z = \frac{X - \mu}{\sigma}$
*   **Exponential Mean:** $1/\lambda$
*   **Uniform Mean:** $(L+U)/2$
*   **Standard Error of Mean:** $\sigma/\sqrt{n}$

#### Must-Remember Points
*   **$P(X = \text{point})$** is always **0** in continuous distributions.
*   The **Standard Normal ($Z$)** is the limiting distribution for the **t-distribution**.
*   **Continuity correction** of $0.5$ is mandatory when approximating Binomial with Normal.
*   Total area under any PDF is always **1**.
# Module 4: Sampling and Sampling Distributions

## 4.1 Sampling Process
#### Definition
**Sampling** is the process of selecting a subset of observations (a sample) from a larger group (the population). The primary goal is to use sample data to make reliable **inferences** about unknown population parameters.

#### Steps in the Sampling Process
1.  **Identification of the Target Population:** Defining the specific group for which data is needed. This requires clear boundaries using parameters like age, gender, or occupation.
2.  **Deciding the Sampling Frame:** Identifying the source or list from which the sample will be drawn (e.g., voter registration data, census records, or a customer database).
3.  **Determining Sample Size ($n$):** Selecting the minimum number of records required. Larger samples increase precision and confidence but also increase cost and time.
4.  **Choosing the Sampling Method:** Selecting the technique used to pull individuals from the sampling frame into the sample.

---

## 4.2 Sampling Methods
Sampling methods are classified into two broad categories: probabilistic and non-probabilistic.

### 4.2.1 Probabilistic Sampling
In these methods, every element in the population has a known, non-zero probability of being selected.
*   **Simple Random Sampling:** Every subject has an equal probability of selection. It is ideal for **homogeneous populations**.
    *   *Implementation:* Labeling population members sequentially and using Excel functions like `RAND()` or `RANDBETWEEN()`.
*   **Stratified Sampling:** The population is divided into mutually exclusive and collectively exhaustive groups called **strata** (e.g., by age, income, or gender).
    *   *Logic:* Random sampling is performed within each stratum. The sample size in each stratum should be proportional to its size in the population. It is necessary when the population is **heterogeneous**.
*   **Cluster Sampling:** The population is divided into separate groups called **clusters**. Each element belongs to only one cluster.
    *   *Process:* A random sample of clusters is taken, and all elements within the selected clusters are surveyed.
    *   *Contrast:* Strata should be homogeneous, but clusters should be **heterogeneous** (diverse) and act as mini-replicas of the entire population. **Area sampling** is a common form of cluster sampling.

### 4.2.2 Non-Probabilistic Sampling
Units are selected based on convenience or judgment rather than a probability distribution.
*   **Systematic Sampling:** A non-probability based method where one element is selected randomly (e.g., from the first 100), and then every $k^{th}$ element is chosen thereafter (e.g., every 100th person).
*   **Convenience Sampling:** Elements are included because they are readily accessible (e.g., surveying people at a specific intersection). It is easy and low-cost but impossible to evaluate representation quality.
*   **Judgment Sampling:** An expert selects elements they feel are most representative. Quality depends entirely on the expert's knowledge.
*   **Voluntary Sampling:** Participants volunteer to be part of the sample (e.g., customer satisfaction surveys). It is highly prone to **bias**, as typically only those with extreme (usually bad) experiences respond.

---

## 4.3 Analysis of Sample Data
The goal of analysis is to calculate **Sample Statistics** to estimate **Population Parameters**.

| Parameter | Population Notation | Sample Statistic (Point Estimator) |
| :--- | :---: | :---: |
| **Mean** | $\mu$ | $\bar{x}$ |
| **Standard Deviation** | $\sigma$ | $s$ |
| **Proportion** | $P$ | $\bar{p}$ |

#### Point Estimation
*   **Point Estimator:** The statistical process or formula (e.g., $\bar{x}$) used to estimate a parameter.
*   **Point Estimate:** The specific numerical value obtained from a single sample.
*   **Note:** Point estimates are not unique; different samples from the same population will yield different values.

---

## 4.4 Sampling Distribution
#### Definition
The **Sampling Distribution** is the probability distribution of all possible values of a sample statistic (like $\bar{x}$ or $\bar{p}$).

#### Sample Mean as a Random Variable
Selecting a sample is a random experiment. Therefore, the sample mean $\bar{x}$ is a **random variable**. Even though a researcher usually only has one sample, $\bar{x}$ belongs to a distribution that has its own mean, standard deviation, and shape.

---

## 4.5 Central Limit Theorem (CLT)
The CLT provides the mathematical foundation for determining the shape of the sampling distribution.

#### Theorem Statement
When selecting random samples of size $n$ from a population, the sampling distribution of the sample mean $\bar{x}$ can be approximated by a **Normal Distribution** as the sample size becomes large.

#### Key Properties of the Sampling Distribution of $\bar{x}$
*   **Expected Value:** $E[\bar{x}] = \mu$. The mean of the sampling distribution is equal to the population mean.
*   **Standard Error:** The standard deviation of a point estimator is called the **Standard Error**. For the sample mean, it is:
    $$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$$
*   **Sample Size ($n$):** The general rule of thumb is that the approximation is good if **$n \ge 30$**.
*   **Relationship with $n$:** As sample size increases, the standard error decreases. This makes the sample mean more likely to be closer to the population mean.

---

## 4.6 Sampling Distribution of Proportion
The sample proportion $\bar{p}$ is calculated as $\frac{x}{n}$, where $x$ is the number of elements with a specific characteristic.

#### Characteristics
*   **Expected Value:** $E[\bar{p}] = P$ (The population proportion).
*   **Standard Error of Proportion:**
    $$\sigma_{\bar{p}} = \sqrt{\frac{P(1 - P)}{n}}$$
*   **Normal Approximation:** The sampling distribution of $\bar{p}$ is approximately normal if $n \cdot P \ge 5$ and $n \cdot (1 - P) \ge 5$.

---

## 4.7 Distribution of Sample Variance
#### Sample Variance Formula
$$s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$$
*   **Degrees of Freedom (DOF):** We divide by $n - 1$ instead of $n$ to make the sample variance an **unbiased estimator** of the population variance. Calculating the mean from the sample "uses up" one degree of freedom.

#### The Chi-Square ($\chi^2$) Distribution
If the population is **normally distributed**, the random variable defined by $\frac{(n-1)s^2}{\sigma^2}$ follows a **Chi-Square Distribution** with $n - 1$ degrees of freedom.
*   **Mean of $\chi^2$:** Equal to the degrees of freedom.
*   **Shape:** Skewed to the right; becomes more symmetric and bell-shaped as degrees of freedom increase.

---

## 4.8 Properties of Point Estimator
Before using a statistic as an estimator, researchers look for four desirable properties:
1.  **Unbiased:** The expected value of the estimator equals the population parameter ($E[\bar{\theta}] = \theta$).
2.  **Efficient:** Between two unbiased estimators, the one with the smaller standard error is more **relatively efficient**.
3.  **Consistent:** The estimator tends to get closer to the population parameter as the sample size becomes larger.
4.  **Sufficient:** The estimator uses all the information available in the sample data (e.g., the sample mean uses every data point).

---

## 4.9 Sampling Error vs Non-sampling errors
### 4.9.1 Sampling Error
*   **Definition:** The deviation of the sample from the population due solely to the **random nature** of selecting a subset.
*   **Property:** It is unavoidable but can be quantified by the standard error and reduced by increasing the sample size.

### 4.9.2 Non-sampling Error
These occur for reasons other than random sampling and can introduce significant bias.
*   **Coverage Error:** Occurs when the sampling frame does not align with the research objective (e.g., surveying only current customers to find ways to acquire *new* customers).
*   **Non-response Error:** Occurs when segments of the population are systematically more or less likely to respond (e.g., an online survey ignoring people who only shop in person).
*   **Measurement Error:** Occurs when the data collection process is flawed.
    *   *Causes:* Ambiguous questions, lack of anonymity leading to dishonest answers, or poor recollection of facts by respondents.

---

## Quick Revision Summary
- **Unbiased Estimators:** $E[\bar{x}] = \mu$, $E[\bar{p}] = P$, and $E[s^2] = \sigma^2$.
- **Standard Error Formulas:**
    - Mean: $\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$
    - Proportion: $\sigma_{\bar{p}} = \sqrt{\frac{P(1 - P)}{n}}$
- **CLT Rule:** The distribution of the sample mean is approximately normal if **$n \ge 30$**, regardless of the population shape.
- **Degrees of Freedom:** Dividing by $n-1$ in variance calculations ensures the estimator is unbiased.
- **Sampling vs. Non-sampling Error:** Sampling error is the result of chance; non-sampling error is the result of poor design or execution.

# Module 5: Statistical Inference

## 5.1 Confidence Interval
#### Definition
A **Confidence Interval (CI)** is a range of values, derived from sample data, that is likely to contain the value of an unknown population parameter. It is expressed as:
**Point Estimate $\pm$ Margin of Error**

#### Key Concepts
*   **Confidence Coefficient ($1 - \alpha$):** The probability that the interval contains the true population parameter (e.g., 0.95 for a 95% CI).
*   **Margin of Error:** The maximum expected difference between the sample statistic and the actual population parameter.
*   **Interpretation:** If we take many random samples and construct a 95% confidence interval for each, 95% of those intervals will contain the true population parameter.

---

## 5.2 Confidence Interval for Population Mean ($\mu$)
### 5.2.1 Case 1: Population Standard Deviation ($\sigma$) Known
When the population standard deviation is known and the sample size is large ($n \ge 30$) or the population is normal, the CI is based on the **Standard Normal ($Z$) Distribution**.

#### Formula
$$\bar{x} \pm z_{\alpha/2} \left( \frac{\sigma}{\sqrt{n}} \right)$$

*   **$\bar{x}$:** Sample mean
*   **$z_{\alpha/2}$:** The $z$-value providing an area of $\alpha/2$ in the upper tail.
*   **Standard Error:** $\frac{\sigma}{\sqrt{n}}$

| Confidence Level | $\alpha$ | $\alpha/2$ | $z_{\alpha/2}$ |
| :--- | :--- | :--- | :--- |
| 80% | 0.20 | 0.10 | 1.28 |
| 90% | 0.10 | 0.05 | 1.64 |
| 95% | 0.05 | 0.025 | 1.96 |
| 99% | 0.01 | 0.005 | 2.58 |

### 5.2.2 Case 2: Population Standard Deviation ($\sigma$) Unknown
When $\sigma$ is unknown, we use the sample standard deviation ($s$) to estimate it. This requires the **Student's t-distribution** with **$n-1$ degrees of freedom**.

#### Formula
$$\bar{x} \pm t_{\alpha/2, n-1} \left( \frac{s}{\sqrt{n}} \right)$$

#### Reliability Guidelines
*   If the population is normal, the $t$-distribution interval is exact for any sample size.
*   If the population is not normal but roughly symmetric, a sample size of $n \ge 15$ is usually adequate.
*   If the population is highly skewed or contains outliers, a sample size of $n \ge 50$ is recommended.

---

## 5.3 Confidence Interval for Proportion ($p$)
Used to estimate the proportion of a population that possesses a specific characteristic. This is based on the normal approximation of the binomial distribution.

#### Conditions
*   $n \cdot \bar{p} \ge 5$ and $n(1 - \bar{p}) \ge 5$

#### Formula
$$\bar{p} \pm z_{\alpha/2} \sqrt{\frac{\bar{p}(1 - \bar{p})}{n}}$$

*   **$\bar{p}$:** Sample proportion ($x/n$)
*   **Standard Error of Proportion:** $\sqrt{\frac{\bar{p}(1 - \bar{p})}{n}}$

---

## 5.4 Confidence Interval for Variance ($\sigma^2$)
Estimates the variability in a population. Unlike the mean and proportion, this interval is **not symmetric** because it is based on the **Chi-Square ($\chi^2$) distribution**.

#### Formula
$$\frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}$$

*   **$df = n - 1$**
*   **$\chi^2_{\alpha/2}$:** Critical value for the upper tail area of $\alpha/2$.
*   **$\chi^2_{1-\alpha/2}$:** Critical value for the lower tail area (leaving $1-\alpha/2$ to the right).

---

## 5.5 Determining Sample Size ($n$)
Sample size selection is a decision made **prior** to data collection to achieve a desired level of precision (Margin of Error, $E$).

### 5.5.1 Sample Size for Mean
$$n = \frac{(z_{\alpha/2})^2 \cdot \sigma^2}{E^2}$$

**Planning value for $\sigma$:**
1.  Use historical data from previous studies.
2.  Conduct a pilot study to find a preliminary $s$.
3.  Use the range rule of thumb: $\text{Range} / 4$.

### 5.5.2 Sample Size for Proportion
$$n = \frac{(z_{\alpha/2})^2 \cdot p^*(1 - p^*)}{E^2}$$

**Planning value for $p^*$:**
1.  Use a sample proportion from a previous study.
2.  Conduct a pilot study.
3.  Use **$p^* = 0.5$** (This provides the most conservative/largest sample size).

---

## 5.6 Hypothesis Testing - Introduction
#### Definitions
*   **Null Hypothesis ($H_0$):** The tentative assumption or "status quo" statement. It always includes the equality sign ($=, \le, \ge$).
*   **Alternative Hypothesis ($H_a$):** The claim being tested or what the researcher is trying to prove.

#### Legal Analogy
*   $H_0$: Innocent (status quo).
*   $H_a$: Not innocent (the claim to be proven with evidence).
*   We **reject $H_0$** only if there is "evidence beyond a reasonable doubt." If evidence is weak, we **fail to reject $H_0$** (inconclusive).

---

## 5.7 Errors in Hypothesis Testing
| Decision | $H_0$ is True | $H_0$ is False |
| :--- | :--- | :--- |
| **Do Not Reject $H_0$** | Correct Decision | **Type 2 Error ($\beta$)** |
| **Reject $H_0$** | **Type 1 Error ($\alpha$)** | Correct Decision |

*   **Type 1 Error ($\alpha$):** Rejecting a true null hypothesis. Also known as the **Level of Significance**.
*   **Type 2 Error ($\beta$):** Failing to reject a false null hypothesis.

---

## 5.8 Hypothesis Testing for Population Mean
### 5.8.1 Three Forms of Hypotheses
| Test Type | Null Hypothesis ($H_0$) | Alternative Hypothesis ($H_a$) |
| :--- | :--- | :--- |
| **Lower Tail** | $\mu \ge \mu_0$ | $\mu < \mu_0$ |
| **Upper Tail** | $\mu \le \mu_0$ | $\mu > \mu_0$ |
| **Two-Tailed** | $\mu = \mu_0$ | $\mu \ne \mu_0$ |

### 5.8.2 Test Statistic
If $\sigma$ is unknown (common case):
$$t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$$

### 5.8.3 Decision Rules (p-value approach)
*   **Reject $H_0$** if **$p\text{-value} \le \alpha$**.
*   **Do Not Reject $H_0$** if **$p\text{-value} > \alpha$**.

---

## 5.9 Hypothesis Testing for Population Proportion
#### Test Statistic
$$z = \frac{\bar{p} - p_0}{\sqrt{\frac{p_0(1 - p_0)}{n}}}$$

*   **Note:** Use the hypothesized proportion $p_0$ in the denominator, not the sample proportion.

#### p-value calculation
*   **Upper Tail:** $P(Z > \text{test statistic})$
*   **Lower Tail:** $P(Z < \text{test statistic})$
*   **Two-Tailed:** $2 \times P(Z < -|\text{test statistic}|)$

---

## 5.10 Hypothesis Testing for Population Variance
#### Test Statistic
$$\chi^2 = \frac{(n-1)s^2}{\sigma_0^2}$$

*   Follows a Chi-Square distribution with $n-1$ degrees of freedom.

---

## Quick Revision Summary
- **CI for Mean ($\sigma$ unknown):** Use $t$-distribution with $n-1$ degrees of freedom.
- **Sample Size for Proportion:** Use $p^* = 0.5$ if no prior estimate exists.
- **Unbiased Estimators:** $\bar{x}$ is an unbiased estimator of $\mu$; $\bar{p}$ is an unbiased estimator of $p$.
- **Hypothesis Testing Logic:** $H_0$ is assumed true until proven otherwise. You never "accept" $H_0$, you only "fail to reject" it.
- **p-value Rule:** Small p-values (smaller than $\alpha$) indicate strong evidence against $H_0$ $\rightarrow$ **Reject $H_0$**.
- **Variance CI:** Uses Chi-Square distribution; range is $\left[\frac{(n-1)s^2}{\chi^2_{\alpha/2}}, \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}\right]$.

# Module 6: Association between Random Variables and Simple Linear Regression

## 6.1 Covariance and Correlation

#### Covariance
**Covariance** is a descriptive measure that explains the direction of the linear relationship between two variables.
*   **Notation:** $S_{xy}$ for sample covariance.
*   **Formula:** 
    $$S_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n - 1}$$
*   **Interpretation:**
    *   **Positive Covariance:** Indicates a positive linear association (as $x$ increases, $y$ increases). Data points fall mostly in quadrants 1 and 3.
    *   **Negative Covariance:** Indicates a negative linear association (as $x$ increases, $y$ decreases). Data points fall mostly in quadrants 2 and 4.
    *   **Near Zero:** Indicates little to no linear association.
*   **Limitation:** The value depends on the units of measurement (e.g., measuring income in rupees vs. lakhs changes the covariance value), making it hard to interpret the **strength** of the relationship.

#### Correlation Coefficient
The **Pearson product-moment correlation coefficient** ($r$) is a scale-independent measure of the strength and direction of a linear relationship.
*   **Range:** $-1 \le r \le +1$.
*   **Formula:**
    $$r_{xy} = \frac{S_{xy}}{S_x \cdot S_y}$$
    *(Where $S_x$ and $S_y$ are the sample standard deviations of $x$ and $y$).*
*   **Key Values:**
    *   **+1:** Perfect positive linear relationship.
    *   **-1:** Perfect negative linear relationship.
    *   **0:** No linear relationship (though a non-linear relationship may still exist).

#### Classification of Correlation
| Type | Description |
| :--- | :--- |
| **Explainable** | Correlation that can be justified through logical reasoning or a causal link. |
| **Spurious** | Correlation that exists in data but has no logical causal link, often caused by a **hidden (latent) variable**. |

---

## 6.2 Simple Linear Regression (SLR)

#### Definition
Simple Linear Regression established a linear relationship between one **independent variable ($x$)** and one **dependent variable ($y$)**.
*   **Dependent Variable ($y$):** The response, outcome, or variable being predicted.
*   **Independent Variable ($x$):** The predictor, explanatory variable, or feature.

#### The Regression Model
The population regression model is:
$$y = \beta_0 + \beta_1 x + \epsilon$$
*   **$\beta_0$:** The y-intercept.
*   **$\beta_1$:** The slope (marginal contribution/change in $y$ for a 1-unit change in $x$).
*   **$\epsilon$:** The random error (residual/unexplained variation).

#### Estimated Regression Equation
Using sample data, we estimate the parameters to create the prediction line:
$$\hat{y} = b_0 + b_1 x$$
*   **$\hat{y}$:** The predicted (mean) value of $y$ for a given $x$.

---

## 6.3 Application of Steps in Simple Linear Regression

Building a regression model involves specific stages:

| Step | Action |
| :--- | :--- |
| 1 | **Data Collection:** Extract primary (surveys) or secondary (existing) data. |
| 2 | **Pre-processing:** Clean data, handle missing values, remove outliers, or derive new features. |
| 3 | **Data Splitting:** Divide into **Training set** (~75%) and **Validation set** (~25%). |
| 4 | **Descriptive Stats:** Use box plots or scatter plots to visualize obvious relationships. |
| 5 | **Functional Form:** Decide if the relationship is linear ($y = \beta_0 + \beta_1 x$) or needs transformation. |
| 6 | **Estimation:** Use **Ordinary Least Squares (OLS)** to find $b_0$ and $b_1$. |
| 7 | **Diagnostics:** Validate model assumptions and check for significance. |
| 8 | **Validation:** Test the model on the validation set to avoid **overfitting**. |
| 9 | **Deployment:** Use the model for decision-making and actionable items. |

#### Ordinary Least Squares (OLS)
OLS finds parameters that **minimize the Sum of Squared Errors (SSE)**:
$$Minimize \sum (y_i - \hat{y}_i)^2$$
*   **$b_1$ formula:** $\frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}$
*   **$b_0$ formula:** $\bar{y} - b_1 \bar{x}$

---

## 6.4 SLR - Application using Excel & Diagnostics

#### Coefficient of Determination ($R^2$)
$R^2$ measures the **goodness of fit**; it is the percentage of variation in $y$ explained by the regression model.
*   **Range:** $0 \le R^2 \le 1$.
*   **Formulas:**
    *   $SST = SSR + SSE$
    *   $R^2 = \frac{SSR}{SST} = 1 - \frac{SSE}{SST}$
*   **Relationship to $r$:** $r = \pm \sqrt{R^2}$ (The sign of $r$ is the same as the sign of the slope $b_1$).

#### ANOVA and Significance Tests
Hypothesis tests determine if the linear relationship is statistically significant.
*   **Null Hypothesis ($H_0$):** $\beta_1 = 0$ (No linear relationship).
*   **Alternate Hypothesis ($H_a$):** $\beta_1 \neq 0$ (Linear relationship exists).
*   **Test Statistics:**
    *   **t-test:** $t = \frac{b_1}{SE(b_1)}$ with $n - 2$ degrees of freedom.
    *   **F-test:** $F = \frac{MSR}{MSE}$ where $MSE = \frac{SSE}{n-2}$.
*   **Decision:** Reject $H_0$ if the p-value $\le \alpha$.

#### Residual Analysis (Assumptions)
To validate the model, the residuals ($\epsilon = y - \hat{y}$) must meet these conditions:
1.  **Mean is zero:** $E[\epsilon] = 0$.
2.  **Constant Variance:** The variance ($\sigma^2$) is the same for all $x$ (**Homoscedasticity**). Violation shows a "funnel" pattern.
3.  **Independence:** Residuals for one $x$ are not related to residuals for another $x$.
4.  **Normality:** Residuals are normally distributed.

#### Outliers and Influential Observations
*   **Standardized Residuals:** Computed by dividing residuals by their standard deviation. 
*   **Outliers:** Points with standardized residuals outside $[-2, +2]$ are potential outliers.
*   **Influential Observations:** Points that, if removed, significantly change the slope ($b_1$) of the regression line.

---

## Quick Revision Summary

#### Key Formulas
*   **OLS Slope ($b_1$):** $\frac{\text{Covariance}(x,y)}{\text{Variance}(x)} \times \frac{n-1}{n-1}$ (simplified: $S_{xy} / S^2_x$)
*   **Total Variation:** $SST = \sum (y_i - \bar{y})^2$
*   **Error Variation:** $SSE = \sum (y_i - \hat{y}_i)^2$
*   **Regression Variation:** $SSR = \sum (\hat{y}_i - \bar{y})^2$
*   **$R^2$:** $SSR / SST$

#### Must-Remember Points
*   **Correlation $\neq$ Causation:** High $r$ doesn't prove $x$ causes $y$.
*   **Linearity:** The model is "linear" if it is linear in the **parameters** ($\beta_0, \beta_1$), even if $x$ is squared or logged.
*   **$R^2$ Interpretation:** If $R^2 = 0.65$, 65% of the variability in the dependent variable is explained by the model.
*   **Significance:** If the p-value for the slope is small, the independent variable is a significant determinant of the dependent variable.
*   **Overfitting:** A model that is too complex might work on training data but fail on validation data.

# Module 7: Multiple Linear Regression - I

## 7.1 Multiple Linear Regression (MLR) Overview
#### Definition
**Multiple Linear Regression (MLR)** is an extension of simple linear regression used to establish a linear relationship between a single **dependent variable ($y$)** and **two or more independent variables ($x_1, x_2, \dots, x_p$)**.

*   **Objective:** To consider more factors that impact the dependent variable, allowing for better predictions than possible with just one independent variable.
*   **Supervised Learning:** MLR is a supervised learning algorithm because it requires knowledge of both dependent and independent variables from training data.

---

## 7.2 The Multiple Regression Model and Equation
#### The Population Regression Model
Describes how the dependent variable $y$ is related to the independent variables $x_1, x_2, \dots, x_p$ and an error term $\epsilon$:
$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p + \epsilon$$
*   **$\beta_0, \beta_1, \dots, \beta_p$:** Population parameters (regression coefficients).
*   **$\epsilon$:** Random error accounting for variability in $y$ that cannot be explained by the linear combination of $x$ variables.

#### The Multiple Linear Regression Equation
Describes the **expected value** ($E[y]$) of $y$ for given values of $x$:
$$E[y] = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p$$
*(Note: The error term $\epsilon$ is gone because its expected value is assumed to be zero.)*

#### The Estimated Multiple Regression Equation
Calculated from sample data using point estimators ($b_0, b_1, \dots, b_p$):
$$\hat{y} = b_0 + b_1 x_1 + b_2 x_2 + \dots + b_p x_p$$
*   **$\hat{y}$:** Predicted value of the dependent variable.

---

## 7.3 Steps in Building a Multiple Regression Model
The development of an MLR model is an **iterative process** involving the following ten steps:

| Step | Phase | Description |
| :--- | :--- | :--- |
| 1 | **Collection** | Extract data from primary (surveys) or secondary (ERP, databases) sources. |
| 2 | **Pre-processing** | Clean data, check completeness, and handle missing observations or outliers. |
| 3 | **Descriptive Analytics** | Use basic statistics, scatter plots, and box plots to identify relationships. |
| 4 | **Strategy** | Select a set of independent variables that are controllable and independent. |
| 5 | **Data Splitting** | Partition data into **Training** (~75%) and **Validation** (~25%) sets. |
| 6 | **Functional Form** | Define the equation (e.g., linear, or transforming $x$ to $x^2$). |
| 7 | **Estimation** | Use **Ordinary Least Squares (OLS)** to minimize the sum of squared residuals. |
| 8 | **Diagnostics** | Check statistical significance and validate assumptions (residuals, multicollinearity). |
| 9 | **Validation** | Test performance on the validation set to ensure consistency and avoid **overfitting**. |
| 10 | **Deployment** | Generate actionable business rules and implement the model. |

---

## 7.4 Interpretation of Coefficients
In MLR, the interpretation of the slope coefficients ($b_i$) is different from Simple Linear Regression:
*   **$b_i$** represents the estimated change in $y$ corresponding to a **one-unit change** in $x_i$, **while all other independent variables are held constant**.
*   **Example:** If $y = 355.7 + 71.16x_1 + 339.9x_2$, then for every 1-unit increase in $x_1$, $y$ increases by $71.16$, provided $x_2$ remains unchanged.

---

## 7.5 Multiple Coefficient of Determination ($R^2$)
#### Goodness of Fit
Just like in SLR, $R^2$ measures the proportion of variability in the dependent variable explained by the model:
$$R^2 = \frac{SSR}{SST}$$
*   **$SST = SSR + SSE$**
*   Adding more independent variables usually causes $SSE$ to decrease and $R^2$ to increase.

#### Adjusted $R^2$
Standard $R^2$ can overestimate the impact of adding variables. **Adjusted $R^2$** accounts for the number of independent variables ($p$) relative to the sample size ($n$):
$$\text{Adjusted } R^2 = 1 - \left( (1 - R^2) \frac{n - 1}{n - p - 1} \right)$$
*   **Key Fact:** Adjusted $R^2$ is usually slightly lower than $R^2$. If $p$ is very large relative to $n$, it can theoretically be negative (in which case it is set to 0).

---

## 7.6 Test for Significance
MLR requires two distinct types of significance tests:

### 7.6.1 Overall Significance (F-test)
Determines if there is a significant relationship between $y$ and the **entire set** of independent variables.
*   **Null Hypothesis ($H_0$):** $\beta_1 = \beta_2 = \dots = \beta_p = 0$ (The model is not useful).
*   **Alternate Hypothesis ($H_a$):** One or more $\beta_i \neq 0$ (At least one variable is useful).
*   **F-statistic:** $\frac{MSR}{MSE}$
    *   $MSR = \frac{SSR}{p}$ (degrees of freedom = $p$)
    *   $MSE = \frac{SSE}{n - p - 1}$ (degrees of freedom = $n - p - 1$)
*   **Decision:** Reject $H_0$ if $p\text{-value} \le \alpha$.

### 7.6.2 Individual Significance (t-test)
Performed only if the F-test is significant. Determines if a **specific** independent variable is significant.
*   **Null Hypothesis ($H_0$):** $\beta_i = 0$.
*   **Alternate Hypothesis ($H_a$):** $\beta_i \neq 0$.
*   **t-statistic:** $\frac{b_i}{SE(b_i)}$ (with $n - p - 1$ degrees of freedom).

---

## 7.7 Multicollinearity
#### Definition
**Multicollinearity** refers to the correlation between the independent variables ($x_i$) themselves.

*   **The Problem:** High correlation between $x$ variables makes it difficult to determine the separate effect of each variable. It can lead to high $p$-values for significant variables or even coefficients with the **wrong sign** (e.g., a positive correlation showing a negative coefficient).
*   **Rule of Thumb:** A correlation coefficient greater than $+0.7$ or less than $-0.7$ between two independent variables suggests potential multicollinearity issues.
*   **Solution:** Avoid including highly correlated independent variables in the same model.

---

## 7.8 Residual Analysis and Outliers
#### Assumptions of the Error Term ($\epsilon$)
1.  **Expected Value:** $E[\epsilon] = 0$.
2.  **Constant Variance:** Variance is the same for all sets of $x$ (**Homoscedasticity**).
3.  **Independence:** Error values are independent of each other.
4.  **Normality:** Errors are normally distributed for all sets of $x$.

#### Diagnostic Plots
*   **Residual Plot against $\hat{y}$:** Most widely used in MLR. Should show a random horizontal band. A "funnel" indicates violation of constant variance; a "U-shape" indicates a non-linear relationship.
*   **Standardized Residuals:** Used to identify **outliers**.
    *   In a valid normal model, ~95% of standardized residuals should fall between **$-2$ and $+2$**.
    *   Values outside **$-3$ to $+3$** are definitely outliers.

#### Influential Observations
An observation that has a dramatic effect on the regression line. If removing a point significantly changes the slope ($b_1, b_2$, etc.), it is influential.

---

## 7.9 Omitted Variable Bias
#### Definition
Occurs when an important independent variable that is correlated with both the dependent variable and other independent variables is left out of the model.

*   **Impact:** The coefficients of the included variables become biased because they try to capture the effect of the ignored variable.
*   **Detection:** Including the omitted variable will result in a **significant increase in $R^2$** and a **significant drop in the standard error** of the original variables.

---

## Quick Revision Summary

#### Key Formulas
*   **MLR Equation:** $y = \beta_0 + \beta_1 x_1 + \dots + \beta_p x_p + \epsilon$
*   **Degrees of Freedom:** $df(\text{Regression}) = p$, $df(\text{Error}) = n - p - 1$
*   **F-statistic:** $MSR / MSE$
*   **t-statistic:** $b_i / SE(b_i)$

#### Must-Remember Points
*   **F-test first:** Always check the F-test for overall significance before interpreting individual t-tests.
*   **Adjusted $R^2$:** Use this to compare models with different numbers of predictors.
*   **Multicollinearity Warning:** If $R^2$ is high and F-test is significant, but individual t-tests are not, suspect multicollinearity.
*   **Prediction Range:** Never use the regression equation to predict values outside the range of the training data (**extrapolation**).

# Module 8: Multiple Linear Regression - II

## 8.1 MLR with Categorical Variables
#### Definition
**Multiple Linear Regression with Categorical Variables** is an extension of MLR that includes **qualitative (categorical)** independent variables alongside quantitative ones. This allows the model to account for non-numeric factors such as brand, gender, location, or ownership status.

#### Dummy Variables (Indicator Variables)
To include qualitative data in a regression model, we use **Dummy Variables**.
*   **Coding:** Dummy variables can take only two values: **0 or 1**.
*   **The $k - 1$ Rule:** If a categorical variable has $k$ levels (categories), you must use **$k - 1$** dummy variables to represent it.
*   **Baseline (Reference) Category:** The category that is not assigned its own dummy variable. It is represented when all other dummy variables for that factor are set to **0**. 

| Categorical Variable | Levels ($k$) | Number of Dummy Variables ($k-1$) |
| :--- | :---: | :---: |
| **Gender** (Men, Women) | 2 | 1 |
| **Brand** (Lenovo, Dell, Asus) | 3 | 2 |
| **Location** (SE, SW, NE, NW) | 4 | 3 |

---

## 8.2 Interpretation of Coefficients
In a model with both quantitative and categorical variables, the regression equation takes the form:
$$E[y] = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_p x_p$$

#### Interpretation of Dummy Coefficient ($\beta_i$)
*   The coefficient for a dummy variable represents the **estimated change in the mean value of $y$** for that category **relative to the baseline category**, assuming all other variables remain constant.
*   **Positive Coefficient:** The specific category has a higher average $y$ than the baseline.
*   **Negative Coefficient:** The specific category has a lower average $y$ than the baseline.
*   **Intercept Shifts:** Adding a dummy variable essentially creates a different regression equation (with a different intercept) for each category, while maintaining the same slope for the quantitative variables.

---

## 8.3 Interaction Variables
#### Definition
An **Interaction Variable** is the product of two independent variables ($x_1 \cdot x_2$), usually a product of one continuous variable and one categorical variable.

#### Purpose and Moderation
*   **Moderation:** A variable is called a **moderation variable** when it affects the relationship between the dependent variable and another independent variable.
*   **Conditional Relationships:** Interaction terms allow the model to check if the effect of one independent variable on $y$ depends on the level of another variable.
*   **Example (Salary vs. Experience by Gender):**
    *   Model: $\text{Salary} = \beta_0 + \beta_1(\text{Gender}) + \beta_2(\text{Experience}) + \beta_3(\text{Gender} \cdot \text{Experience})$
    *   If Gender = 0 (Men): $\text{Salary} = \beta_0 + \beta_2(\text{Experience})$
    *   If Gender = 1 (Women): $\text{Salary} = (\beta_0 + \beta_1) + (\beta_2 + \beta_3)(\text{Experience})$
    *   Here, $\beta_3$ shows how much the "return on experience" differs between men and women.

#### Linearity Note
Even though we multiply $x_1$ and $x_2$, the model remains **linear** because it is linear in the **coefficients** ($\beta_0, \beta_1, \dots$).

---

## 8.4 Model Building and Diagnostics
Building a high-performing MLR model requires balancing **complexity** and **performance**.

#### Key Evaluative Measures
| Measure | Purpose |
| :--- | :--- |
| **$R^2$** | Percentage of variation in $y$ explained by the model. |
| **Adjusted $R^2$** | $R^2$ adjusted for the number of predictors; prevents overestimating the value of adding variables. |
| **Standard Error ($S$)** | Measures the average deviation of observations from the regression line. |
| **F-test** | Tests the **overall significance** of the model (is at least one variable useful?). |
| **t-test** | Tests the **individual significance** of each specific variable. |

#### Lessons in Model Building
*   **Stepwise Improvement:** Adding variables should ideally increase Adjusted $R^2$ and decrease the Standard Error.
*   **Multicollinearity Warning:** If a new variable is highly correlated with an existing one, its $p$-value will likely be high (insignificant), even if it seems intuitively important.
*   **Overfitting:** Adding too many variables can make a model perform perfectly on training data but poorly on new (validation) data.
*   **Parsimony:** Only variables that contribute significantly (low $p$-values) should be retained in the final model.

---

## 8.5 Residual Analysis
Residual analysis is used to validate model assumptions in the presence of categorical variables.
*   **Standardized Residuals:** Should fall between **$-2$ and $+2$** about 95% of the time.
*   **Categorical Plots:** In a plot of residuals against a dummy variable, observations will appear "bunched" or "clustered" at values of 0 and 1.
*   **Validity:** As long as residuals are randomly distributed above and below the zero line without a distinct pattern (funnel or U-shape), the model assumptions are considered satisfied.

---

## Quick Revision Summary
#### Key Definitions
*   **Dummy Variable:** A numeric variable (0 or 1) used to represent a qualitative category.
*   **Baseline:** The reference group (where all dummies = 0).
*   **Interaction Term:** $x_1 \cdot x_2$; used to model how the effect of one variable changes based on another.

#### Must-Remember Formulas
*   **Dummy Variables needed:** $k - 1$ (for $k$ categories).
*   **Regression Equation with Interaction:** $\hat{y} = b_0 + b_1 x_1 + b_2 x_2 + b_3(x_1 x_2)$

#### Must-Remember Points
*   **Coefficient Interpretation:** The $b$ value for a dummy variable is the difference in the expected $y$ value between that group and the reference group.
*   **Significance:** Just because you have qualitative data doesn't mean it belongs in the model; check the **p-values** of individual t-tests.
*   **Logic over intuition:** If $R^2$ does not improve significantly when adding a variable, that variable is likely redundant due to correlation with existing predictors (**Multicollinearity**).