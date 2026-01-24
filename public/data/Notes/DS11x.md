
# ***Business Statistics for Entrepreneurs - 1***
# **Module 1: Descriptive Statistics**
## **Topic 1: Introduction & Data Structure**
### **1.1 Basic Definitions**
*   **Statistics:** The science of collecting, analyzing, presenting, and interpreting data to make business decisions.
*   **Data:** Facts and figures collected for analysis.
*   **Data Set:** All data collected for a particular study.
*   **Element:** The entity for which data is collected (e.g., a household, a company, a respondent).
*   **Variable:** A characteristic of interest for an element (e.g., income, age, satisfaction score).
*   **Observation:** The set of measurements obtained for a single element (corresponds to one **row** in a dataset).
### **1.2 Data Collection Types**
*   **Cross-Sectional Data:** Data collected at the **same** or approximately the same point in time (e.g., Census 2020, customer satisfaction survey in January).
*   **Time Series Data:** Data collected over **several** time periods (e.g., Monthly sales over 3 years, daily stock prices).
*   **Observational Study:** Observing and recording variables without interfering (e.g., counting customers in a store).
*   **Experimental Study:** Data collected in a controlled environment where variables are manipulated (e.g., Clinical trials, A/B testing).
 

 
## **Topic 2: Types of Data & Measurement Scales**
### **2.1 Qualitative (Categorical) Data**
*   Can be numeric or non-numeric.
*   **Nominal Scale:** Labels or names used to identify an attribute. **No ranking** implied.
    *   *Examples:* Gender (M/F), Region (North/South), ID Numbers, Store Name.
*   **Ordinal Scale:** Labels have an inherent **ranking** or order.
    *   *Examples:* Satisfaction ratings (Satisfied > Dissatisfied), Size (Small, Medium, Large).
### **2.2 Quantitative Data**
*   Always numeric; indicates "how much" or "how many".
*   **Interval Scale:** Numeric data with a fixed unit of measure. **Zero is arbitrary** (does not mean "none"). Ratios are **not** meaningful.
    *   *Examples:* Temperature (Celsius/Fahrenheit), Calendar Dates (Years), Standardized Test Scores (SAT/GMAT).
*   **Ratio Scale:** Numeric data where **zero is absolute** (indicates absence). Ratios are meaningful (e.g., 200 is twice 100).
    *   *Examples:* Income, Salary, Sales, Age, Weight, Price, Distance.
 

 
## **Topic 3: Data Visualization**
### **3.1 Summarizing Categorical Data**
*   **Frequency Distribution:** Table showing the count of observations in non-overlapping categories.
*   **Relative Frequency:** Fraction/Proportion of total items in a class ($Frequency / n$).
*   **Percent Frequency:** Relative Frequency $\times 100$.
*   **Bar Chart:** Graphical display for categorical data (bars do not touch).
*   **Pie Chart:** Circular display using relative frequencies. (Often discouraged due to difficulty in comparing sector sizes).
### **3.2 Summarizing Quantitative Data**
*   **Histogram:** Graphical display for quantitative frequency distributions. **Bars touch** to show continuity.
    *   Shows the **shape** of distribution (skewness).
*   **Scatter Plot:** Graphical display showing the relationship between **two quantitative** variables.
    *   *Trend Line:* Can be added to approximate the relationship.
*   **Comparing Variables:**
    *   **Side-by-side Bar Chart:** Compares two variables (e.g., Satisfaction levels by Gender).
    *   **Stacked Bar Chart:** Composition of the whole across categories.
 

 
## **Topic 4: Measures of Central Tendency**
### **4.1 The Mean (Average)**
*   Sum of values divided by the number of observations ($n$).
*   **Excel Command:** `=AVERAGE(range)`
*   **Sensitivity:** Highly sensitive to **outliers** (extreme values).
*   **Weighted Mean:** Used when observations vary in importance (Weights $w_i$). Formula: $\frac{\sum w_i x_i}{\sum w_i}$.
### **4.2 The Median**
*   The middle value when data is sorted in **ascending order**.
*   **Odd $n$:** The exact middle value.
*   **Even $n$:** The average of the two middle values.
*   **Excel Command:** `=MEDIAN(range)`
*   **Robustness:** Not influenced by extreme values/outliers. Preferred for skewed data (e.g., Income, Property Prices).
### **4.3 The Mode**
*   The value that occurs with the greatest frequency.
*   **Unimodal:** One mode. **Bimodal:** Two modes. **Multimodal:** More than two.
*   **Excel Command:** `=MODE.SNGL(range)` or `=MODE.MULT(range)`.
### **4.4 Percentiles and Quartiles**
*   **Percentile ($p$):** Value where at least $p\%$ of observations are less than or equal to this value.
    *   *Location Formula ($L_p$):* $\frac{p}{100}(n+1)$. (Interpolate if not an integer).
    *   **Excel Command:** `=PERCENTILE.EXC(range, k)`
*   **Quartiles:** Divide data into four parts.
    *   **Q1 (1st Quartile):** 25th Percentile.
    *   **Q2 (2nd Quartile):** 50th Percentile (Median).
    *   **Q3 (3rd Quartile):** 75th Percentile.
 

 
## **Topic 5: Measures of Dispersion (Variability)**
### **5.1 Basic Measures**
*   **Range:** Max Value - Min Value. (Based on only two points; sensitive to outliers).
*   **Interquartile Range (IQR):** $Q3 - Q1$. Measures the range of the **middle 50%** of data. (Robust against outliers).
### **5.2 Variance and Standard Deviation**
*   **Variance ($s^2$):** Average of squared deviations from the mean.
    *   *Sample Variance Formula Divisor:* $n - 1$ (Degrees of freedom).
    *   **Excel Command:** `=VAR.S(range)`
*   **Standard Deviation ($s$):** Square root of the variance ($\sqrt{s^2}$).
    *   Measured in the **same units** as the original data.
    *   **Excel Command:** `=STDEV.S(range)`
### **5.3 Coefficient of Variation (CV)**
*   A relative measure of variability expressed as a percentage.
*   **Formula:** $CV = (\frac{\text{Standard Deviation}}{\text{Mean}}) \times 100$
*   **Use:** To compare variability between datasets with different units or means (e.g., comparing stock price volatility of Apple vs. P&G).
 

 
## **Topic 6: Relative Location & Outliers**
### **6.1 Z-Scores (Standardization)**
*   Measures how many standard deviations a value ($x_i$) is from the mean ($\bar{x}$).
*   **Formula:** $z = \frac{x_i - \bar{x}}{s}$
*   **Properties:** Standardized data has Mean = 0, Standard Deviation = 1.
*   **Z-Score Outlier Rule:** Any data point with a z-score **less than -3** or **greater than +3** is considered an outlier.
*   **Excel Command:** `=STANDARDIZE(x, mean, standard_dev)`
### **6.2 Box and Whisker Plot**
*   **Five-Number Summary:** Min, Q1, Median (Q2), Q3, Max.
*   **Box:** Drawn from Q1 to Q3. Line inside represents Median.
*   **IQR:** Height/Width of the box ($Q3 - Q1$).
*   **Outlier Boundaries (Fences):**
    *   Lower Limit: $Q1 - 1.5 \times IQR$
    *   Upper Limit: $Q3 + 1.5 \times IQR$
*   **Whiskers:** Extend to the smallest/largest values *within* the limits. Values outside are plotted as points (Outliers).

### **Module 1 Formula Sheet**
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

 
---

 # **Module 2: Probability and Random Variables**
## **Topic 1: Basic Probability Concepts**
### **1.1 Key Definitions**
*   **Random Experiment:** A process or procedure for which more than one outcome is possible (e.g., tossing a coin, rolling a die).
*   **Sample Space ($S$):** The set of all possible experimental outcomes (sample points).
*   **Event:** A subset of the sample space (a collection of outcomes of interest).
*   **Probability ($P$):** Numerical measure of the likelihood of an event occurring.
    *   Range: $0 \le P(\text{Event}) \le 1$.
    *   Sum of probabilities of all outcomes in $S$ = 1.
*   **Complement of Event $A$ ($A'$ or $A^c$):** Event consisting of all sample points **not** in $A$.
    *   $P(A') = 1 - P(A)$.
### **1.2 Relationships Between Events**
*   **Union ($A \cup B$):** Event containing points in $A$ **or** $B$ **or both**.
*   **Intersection ($A \cap B$):** Event containing points in **both** $A$ **and** $B$.
*   **Mutually Exclusive Events:** Events that have no sample points in common.
    *   If $A$ occurs, $B$ cannot occur.
    *   $P(A \cap B) = 0$.
### **1.3 The Addition Law**
*   Used to compute the probability of the union of events.
*   **Formula:** $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.
*   **For Mutually Exclusive Events:** $P(A \cup B) = P(A) + P(B)$.
 

 
## **Topic 2: Conditional Probability & Bayes' Theorem**
### **2.1 Conditional Probability**
*   Probability of event $A$ occurring given that event $B$ has already occurred.
*   **Notation:** $P(A|B)$.
*   **Formula:** $P(A|B) = \frac{P(A \cap B)}{P(B)}$.
### **2.2 The Multiplication Law**
*   Derived from conditional probability.
*   **Formula:** $P(A \cap B) = P(B) \times P(A|B)$ OR $P(A \cap B) = P(A) \times P(B|A)$.
### **2.3 Independence of Events**
*   Two events are independent if the occurrence of one does not alter the probability of the other.
*   **Conditions for Independence:**
    1.  $P(A|B) = P(A)$
    2.  $P(B|A) = P(B)$
    3.  $P(A \cap B) = P(A) \times P(B)$
*   *Note:* Two events with non-zero probabilities cannot be both mutually exclusive and independent.
### **2.4 Bayes' Theorem**
*   Used to update probabilities based on new information.
*   **Prior Probability:** Initial probability estimate ($P(A)$).
*   **Posterior Probability:** Revised probability after obtaining new information ($P(A|B)$).
*   **Joint Probability Table:** A table listing probabilities of intersections of two variables (useful for calculating marginal and conditional probabilities).

 
## **Topic 3: Random Variables (Discrete & Continuous)**
### **3.1 Definitions**
*   **Random Variable (RV):** A numerical description of the outcome of an experiment.
*   **Discrete RV:** Takes integer values or countable numbers (e.g., number of defects, number of customers, sales orders).
*   **Continuous RV:** Takes fractional values in an interval (e.g., time, weight, temperature, volume).
### **3.2 Discrete Probability Functions**
*   **Probability Mass Function (PMF), $f(x)$:** Probability that $X$ takes a specific value $x$.
    *   $\sum f(x) = 1$.
*   **Cumulative Distribution Function (CDF), $F(x)$:** Probability that $X$ is less than or equal to $x$.
    *   $F(x) = P(X \le x)$.
*   **Tail Probability:** Probability that $X$ is greater than $x$.
    *   $P(X > x) = 1 - F(x)$.
### **3.3 Numerical Measures of RVs**
*   **Expected Value (Mean), $E(X)$ or $\mu$:** Weighted average of all possible values.
    *   Formula: $E(X) = \sum [x \times f(x)]$.
*   **Variance, $Var(X)$ or $\sigma^2$:** Weighted average of squared deviations from the mean.
    *   Formula: $Var(X) = \sum [(x - \mu)^2 \times f(x)]$.
*   **Standard Deviation ($\sigma$):** $\sqrt{Var(X)}$.
 

 
## **Topic 4: Linear Combinations of Random Variables**
### **4.1 Linear Function of One Variable ($Y = aX + b$)**
*   **Expected Value:** $E(Y) = a E(X) + b$. (Scaling and shifting affect the mean).
*   **Variance:** $Var(Y) = a^2 Var(X)$. (Shifting $b$ does **not** affect variance; scaling $a$ is squared).
*   **Standard Deviation:** $SD(Y) = |a| \times SD(X)$.
### **4.2 Sum of Two Random Variables ($Y = X_1 + X_2$)**
*   **Expected Value:** $E(Y) = E(X_1) + E(X_2)$.
*   **Variance:** $Var(Y) = Var(X_1) + Var(X_2) + 2 \times Cov(X_1, X_2)$.
*   **If Independent:** Covariance is 0.
    *   $Var(Y) = Var(X_1) + Var(X_2)$.
### **4.3 General Linear Combination ($Y = aX_1 + bX_2$)**
*   **Expected Value:** $E(Y) = aE(X_1) + bE(X_2)$.
*   **Variance (if independent):** $Var(Y) = a^2 Var(X_1) + b^2 Var(X_2)$.
    *   *Note:* Even for Difference ($Y = X_1 - X_2$), variance **adds**: $Var(Y) = Var(X_1) + Var(X_2)$ (since $-1^2 = 1$).
### **4.4 Sum and Average of $n$ Independent Identical Variables**
Let $X_1, X_2, ... X_n$ be independent with mean $\mu$ and variance $\sigma^2$.
*   **For the Sum ($S = \sum X_i$):**
    *   $E(S) = n \mu$
    *   $Var(S) = n \sigma^2$
    *   $SD(S) = \sqrt{n} \sigma$
*   **For the Average ($\bar{X} = \frac{\sum X_i}{n}$):**
    *   $E(\bar{X}) = \mu$ (Expectation stays the same).
    *   $Var(\bar{X}) = \frac{\sigma^2}{n}$ (Variance decreases as $n$ increases).
    *   $SD(\bar{X}) = \frac{\sigma}{\sqrt{n}}$.

 

### **Module 2 Formula Sheet**

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

# **Module 3: Discrete Probability Distributions**
## **Topic 1: General Discrete Probability Distributions**
### **1.1 Basic Concepts**
*   **Discrete Random Variable:** Takes countable values (e.g., 0, 1, 2).
*   **Probability Mass Function (PMF), $f(x)$:** Probability that the random variable takes a specific value $x$.
*   **Conditions:**
    1.  $0 \le f(x) \le 1$
    2.  $\sum f(x) = 1$ (Sum of all probabilities equals 1).
### **1.2 Numerical Measures**
*   **Expected Value (Mean / $\mu$):** The long-run average.
    *   **Formula:** $E[X] = \sum [x \times f(x)]$
    *   *Application:* In insurance, the "Break-even Premium" = Expected Claim Amount.
*   **Variance ($\sigma^2$):** Weighted average of squared deviations.
    *   **Formula:** $Var(X) = \sum [(x - \mu)^2 \times f(x)]$
*   **Standard Deviation ($\sigma$):** $\sqrt{Variance}$.
### **1.3 Portfolio Analysis (Two Assets)**
*   **Portfolio Return ($Z$):** Weighted sum of returns of Asset X and Asset Y.
    *   $Z = w_1 X + w_2 Y$ (where $w$ is the proportion of investment).
*   **Portfolio Mean:** $E[Z] = w_1 E[X] + w_2 E[Y]$.
*   **Portfolio Variance:**
    *   $Var(Z) = w_1^2 \sigma_X^2 + w_2^2 \sigma_Y^2 + 2 w_1 w_2 Cov(X, Y)$.
*   **Correlation ($r$):** $r = \frac{Cov(X, Y)}{\sigma_X \sigma_Y}$.
*   **Risk Reduction:** A **negative correlation** between assets helps reduce the overall risk (standard deviation) of the portfolio.
 

 
## **Topic 2: The Bernoulli Distribution**
### **2.1 Characteristics**
*   **Single Trial:** An experiment with only **two** possible outcomes.
*   **Outcomes:** Success ($Y=1$) and Failure ($Y=0$).
*   **Probabilities:**
    *   Probability of Success = $p$.
    *   Probability of Failure = $q = 1 - p$.
### **2.2 Properties**
*   **Probability Mass Function:**
    *   $f(1) = p$
    *   $f(0) = 1 - p$
*   **Expected Value (Mean):** $E[Y] = p$.
*   **Variance:** $Var(Y) = p \times q$.
*   **Standard Deviation:** $\sqrt{p \times q}$.
 

 
## **Topic 3: The Binomial Distribution**
### **3.1 Conditions for a Binomial Experiment**
1.  **Fixed Number of Trials ($n$):** The experiment consists of $n$ identical trials.
2.  **Two Outcomes:** Each trial results in Success or Failure.
3.  **Independence:** Outcomes of trials are independent of each other.
4.  **Constant Probability:** The probability of success ($p$) remains the same for each trial.
### **3.2 Properties & Formulas**
*   **Random Variable ($Y$):** Counts the number of successes in $n$ trials.
*   **PMF Formula:**
    $$P(Y=y) = {}^nC_y \times p^y \times (1-p)^{n-y}$$
    *   Where ${}^nC_y = \frac{n!}{y!(n-y)!}$
*   **Expected Value (Mean):** $\mu = n \times p$.
*   **Variance:** $\sigma^2 = n \times p \times (1-p)$.
*   **Standard Deviation:** $\sigma = \sqrt{n \times p \times q}$.
### **3.3 Calculation Logic**
*   **"At most $k$":** $P(Y \le k) = P(0) + P(1) + ... + P(k)$.
*   **"At least $k$":** $P(Y \ge k) = 1 - P(Y \le k-1)$.
 

 
## **Topic 4: The Poisson Distribution**
### **4.1 Characteristics**
*   **Usage:** Models the number of occurrences of an event over a specified interval of **time** or **space**.
*   **Examples:** Number of emails per hour, defects per meter of fabric, typos per page.
*   **Assumptions (Poisson Process):**
    1.  Probability of occurrence is proportional to the interval length.
    2.  Occurrences in non-overlapping intervals are independent.
### **4.2 Properties & Formulas**
*   **Parameter $\lambda$ (Lambda):** The average (mean) number of occurrences in the specified interval.
*   **PMF Formula:**
    $$P(Y=y) = \frac{e^{-\lambda} \times \lambda^y}{y!}$$
    *   Where $e \approx 2.71828$.
*   **Key Property:** **Mean = Variance = $\lambda$**.
*   **Standard Deviation:** $\sqrt{\lambda}$.
### **4.3 Scaling Lambda**
*   If the rate is given for a specific interval (e.g., 10 calls per hour), and the question asks about a different interval (e.g., 30 minutes):
    *   **New $\lambda$:** $\text{Original Rate} \times \text{New Interval Ratio}$.
    *   *Example:* Rate = 10/hour. For 30 mins, $\lambda = 10 \times 0.5 = 5$.
### **4.4 Relation to Binomial**
*   The Poisson distribution is a limiting case of the Binomial distribution when $n$ (trials) is large and $p$ (probability) is small, such that $np = \lambda$.

### **Module 3 Formula Sheet**

| **Concept** | **Bernoulli** | **Binomial** | **Poisson** |
| :--- | :--- | :--- | :--- |
| **PMF $f(y)$** | $f(1)=p; f(0)=1-p$ | ${}^nC_y p^y (1-p)^{n-y}$ | $\frac{e^{-\lambda} \lambda^y}{y!}$ |
| **Mean $E[Y]$** | $p$ | $np$ | $\lambda$ |
| **Variance $Var(Y)$** | $p(1-p)$ | $np(1-p)$ | $\lambda$ |

**Portfolio Analysis Formulas:**
*   **Portfolio Mean:** $E[Z] = w_1 E[X] + w_2 E[Y]$
*   **Portfolio Variance:** $Var(Z) = w_1^2 \sigma_X^2 + w_2^2 \sigma_Y^2 + 2 w_1 w_2 Cov(X, Y)$

# **Module 4: Continuous Probability Distributions**
## **Topic 1: Fundamentals of Continuous Random Variables**
### **1.1 Basic Concepts**
*   **Continuous Random Variable:** Can take any fractional value in an interval (e.g., time, weight, distance, temperature).
    *   *Note:* The probability of a continuous random variable taking any **exact** single value is always **zero**. Probabilities are defined for intervals.
*   **Probability Density Function (PDF), $f(x)$:**
    *   Represents the density of probability at a given point.
    *   **Area under the curve** represents probability.
    *   Total area under the curve = 1.
    *   $f(x) \ge 0$ for all $x$.
*   **Cumulative Distribution Function (CDF), $F(x)$:**
    *   Probability that the random variable $X$ is less than or equal to a specific value $x$.
    *   $F(x) = P(X \le x) = \text{Area under } f(x) \text{ from min to } x$.
*   **Tail Probability ($F_{bar}(x)$):**
    *   Probability that $X$ is greater than $x$.
    *   $P(X > x) = 1 - F(x)$.
### **1.2 Numerical Measures**
*   **Expectation ($E[X]$ or $\mu$):** The mean or center of the distribution.
    *   Calculated by integrating $x \cdot f(x)$.
*   **Variance ($Var(X)$ or $\sigma^2$):** Measure of spread/dispersion.
    *   Calculated by integrating $(x - \mu)^2 \cdot f(x)$.
 

 
## **Topic 2: Uniform Distribution**
### **2.1 Characteristics**
*   **Definition:** A random variable where probability is proportional to the length of the interval. All values between a lower limit ($L$) and an upper limit ($U$) are equally likely.
*   **PDF:** $f(x) = \frac{1}{U - L}$ for $L \le x \le U$.
### **2.2 Properties & Formulas**
*   **Mean ($E[X]$):** $\frac{L + U}{2}$ (Average of limits).
*   **Variance ($Var(X)$):** $\frac{(U - L)^2}{12}$.
*   **CDF ($F(x)$):** $\frac{x - L}{U - L}$.
*   **Probability for interval $[a, b]$:** $\frac{b - a}{U - L}$.
### **2.3 Percentile Calculation**
*   To find the $k$-th percentile ($P_k$):
    *   Solve for $x$: $\frac{x - L}{U - L} = k$ (where $k$ is the decimal probability, e.g., 0.80).
 

 
## **Topic 3: Exponential Distribution**
### **3.1 Characteristics**
*   **Usage:** Models the **time between** independent random events that occur at a constant average rate.
*   **Examples:** Time between customer arrivals, battery life, time to failure of a component.
*   **Parameter:** $\lambda$ (Lambda) = Rate of occurrence (e.g., 6 visitors per minute).
    *   **Mean ($\mu$):** $\frac{1}{\lambda}$ (Average time between events).
### **3.2 Properties & Formulas**
*   **PDF:** $f(x) = \lambda e^{-\lambda x}$ for $x \ge 0$.
*   **CDF ($P(X \le x)$):** $1 - e^{-\lambda x}$.
*   **Tail Probability ($P(X > x)$):** $e^{-\lambda x}$.
*   **Key Property:** **Mean ($\mu$) = Standard Deviation ($\sigma$) = $\frac{1}{\lambda}$**.
    *   Variance = $\frac{1}{\lambda^2}$.
### **3.3 Memoryless Property**
*   The probability of an event occurring in the future does not depend on how much time has already elapsed.
*   *Mathematically:* $P(X > t_0 + t | X > t_0) = P(X > t)$.
*   *Interpretation:* The process "forgets" the time already waited.
### **3.4 Relationship with Poisson**
*   **Poisson:** Counts the **number of events** in a fixed interval.
*   **Exponential:** Measures the **time between** those events.
*   If events follow a Poisson process with rate $\lambda$, the inter-arrival times follow an Exponential distribution with mean $\frac{1}{\lambda}$.
 

 
## **Topic 4: Normal Distribution**
### **4.1 Characteristics**
*   **Shape:** Symmetric, bell-shaped curve.
*   **Parameters:**
    *   Mean ($\mu$): Determines the center.
    *   Standard Deviation ($\sigma$): Determines the spread (width/flatness).
*   **Properties:**
    *   Mean = Median = Mode.
    *   Total area = 1; Area to the left/right of mean = 0.5.
    *   Tails extend to infinity but never touch the axis.
### **4.2 Standard Normal Distribution ($Z$)**
*   A special normal distribution where **Mean ($\mu$) = 0** and **Standard Deviation ($\sigma$) = 1**.
*   **Z-Score Formula:** Used to convert any normal random variable $X$ to $Z$.
    $$Z = \frac{X - \mu}{\sigma}$$
*   **Interpretation:** $Z$ represents the number of standard deviations $X$ is from the mean.
### **4.3 Empirical Rules (Approximate Areas)**
*   $\mu \pm 1\sigma$: ~68.3%
*   $\mu \pm 2\sigma$: ~95.4%
*   $\mu \pm 3\sigma$: ~99.7%
### **4.4 Normal Approximation to Binomial**
*   The Normal distribution can approximate the Binomial distribution when $n$ is large.
*   **Condition:** $np \ge 5$ and $nq \ge 5$.
*   **Parameters for Approximation:**
    *   Mean $\mu = np$
    *   Standard Deviation $\sigma = \sqrt{npq}$
*   **Continuity Correction:** Since Binomial is discrete and Normal is continuous, add/subtract 0.5 to the discrete value boundaries.
### **Module 4 Formula Sheet**

| **Property** | **Uniform ($L, U$)** | **Exponential ($\lambda$)** | **Normal ($\mu, \sigma$)** |
| :--- | :--- | :--- | :--- |
| **PDF $f(x)$** | $\frac{1}{U - L}$ | $\lambda e^{-\lambda x}$ | - |
| **CDF $F(x)$** | $\frac{x - L}{U - L}$ | $1 - e^{-\lambda x}$ | $P(Z \le \frac{x-\mu}{\sigma})$ |
| **Mean $E[X]$** | $\frac{L + U}{2}$ | $\frac{1}{\lambda}$ | $\mu$ (or $np$) |
| **Variance** | $\frac{(U - L)^2}{12}$ | $\frac{1}{\lambda^2}$ | $\sigma^2$ (or $npq$) |
| **Std. Deviation** | $\frac{U - L}{\sqrt{12}}$ | $\frac{1}{\lambda}$ | $\sigma$ (or $\sqrt{npq}$) |
| **Key Formula** | $P(a < X < b) = \frac{b-a}{U-L}$ | $P(X > x) = e^{-\lambda x}$ | $Z = \frac{X - \mu}{\sigma}$ |
