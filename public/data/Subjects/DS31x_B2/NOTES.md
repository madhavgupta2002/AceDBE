# Module 1: ANOVA and Chi-squared Tests

## 1.1 Introduction to Analysis of Variance (ANOVA)

### 1.1.1 Overview and Purpose of ANOVA

#### Fundamental Concept of Comparing Multiple Population Means
* **Analysis of Variance (ANOVA)** is a statistical hypothesis testing technique used to compare the means of **$k$ independent populations** ($k \ge 2$) using sample data drawn from each population.
* While simple two-sample $t$-tests compare at most two population means, ANOVA extends statistical inference to handle multiple populations simultaneously without inflating the Type I error rate ($\alpha$).
* **Terminology**:
  * **Factor / Treatment**: The categorical variable or group criterion defining the different populations (e.g., age groups, locations, assembly methods).
  * **Factor Levels**: The specific categories or groups under investigation ($k$ levels).
  * **Response Variable ($X$)**: The quantitative outcome variable being measured across populations (e.g., investment amount, assembly time, meal price).

#### Null and Alternative Hypotheses in ANOVA
* For $k$ populations with unknown population means $\mu_1, \mu_2, \dots, \mu_k$, ANOVA tests whether all population means are equal against the alternative that at least one mean differs.

$$\text{Null Hypothesis } (H_0): \mu_1 = \mu_2 = \mu_3 = \dots = \mu_k$$
$$\text{Alternative Hypothesis } (H_A): \text{Not all population means are equal (i.e., at least two means differ)}$$

* **Key Distinctions**:
  * $H_A$ does **not** require every population mean to be distinct from every other mean; the existence of a single unequal pair is sufficient to reject $H_0$.
  * ANOVA is structured as a two-sided overall comparison. Direct upper-tail or lower-tail directional hypotheses across multiple populations do not fall under standard ANOVA.

#### Why it is Called Analysis of Variance
* Although the primary objective is to test for equality of population **means**, the technique evaluates population means by analyzing the **composition of sample variances**.
* ANOVA decomposes the total variability observed in the combined dataset into two distinct components:
  1. Variability **between** the treatment/group means.
  2. Variability **within** each treatment/group sample.
* By taking the ratio of these variance estimates, ANOVA determines whether the differences among sample means are larger than what would be expected purely by random sampling variation.

---

## 1.2 One-way ANOVA

### 1.2.1 Core Assumptions of ANOVA

#### Required Assumptions for Validity
To ensure that the test statistic follows an $F$-distribution under $H_0$, One-way ANOVA requires three fundamental assumptions:

| Assumption | Description | Practical Implications |
| :--- | :--- | :--- |
| **1. Normality** | For each population, the response variable $X$ is normally distributed. | $X_{ij} \sim N(\mu_j, \sigma^2)$ for each group $j$. |
| **2. Equal Variances (Homoscedasticity)** | The variance of the response variable $\sigma^2$ is identical across all $k$ populations. | $\sigma_1^2 = \sigma_2^2 = \dots = \sigma_k^2 = \sigma^2$, regardless of group mean differences. |
| **3. Independence** | All sample observations are independently drawn both within groups and across groups. | The value of one observation does not influence or depend on another. |

---

### 1.2.2 Partitioning Variance and Sum of Squares

#### Formulas and Definitions of Sum of Squares
Let $k$ be the number of treatments, $n_j$ be the sample size for treatment $j$, and $N_T = \sum_{j=1}^k n_j$ be the total sample size across all treatments.

Let $X_{ij}$ represent observation $i$ in treatment group $j$, $\bar{X}_j$ represent the sample mean of group $j$, and $\bar{\bar{X}}$ represent the overall grand mean.

$$\bar{X}_j = \frac{\sum_{i=1}^{n_j} X_{ij}}{n_j}$$

$$\bar{\bar{X}} = \frac{\sum_{j=1}^k \sum_{i=1}^{n_j} X_{ij}}{N_T}$$

#### Total Sum of Squares ($SST$)
* Measures total variation in all $N_T$ observations relative to the overall grand mean $\bar{\bar{X}}$, ignoring group classifications.

$$SST = \sum_{j=1}^k \sum_{i=1}^{n_j} (X_{ij} - \bar{\bar{X}})^2 \quad \text{with Degrees of Freedom } DF_{\text{total}} = N_T - 1$$

#### Sum of Squares Treatment / Between ($SSTr$)
* Measures variation attributable to differences **between treatment means** and the overall grand mean.

$$SSTr = \sum_{j=1}^k n_j (\bar{X}_j - \bar{\bar{X}})^2 \quad \text{with Degrees of Freedom } DF_{\text{treatment}} = k - 1$$

#### Sum of Squares Error / Within ($SSE$)
* Measures residual variation **within individual treatment groups** relative to their respective group sample means.

$$SSE = \sum_{j=1}^k \sum_{i=1}^{n_j} (X_{ij} - \bar{X}_j)^2 \quad \text{with Degrees of Freedom } DF_{\text{error}} = N_T - k$$

#### Additivity Identity
The total variation partitions cleanly into treatment and error components:

$$SST = SSTr + SSE$$
$$DF_{\text{total}} = DF_{\text{treatment}} + DF_{\text{error}} \implies (N_T - 1) = (k - 1) + (N_T - k)$$

---

### 1.2.3 Mean Squares and the F-Test

#### Derivation of Mean Squares ($MSTr$, $MSE$) and $F$-Statistic
Mean Square quantities are obtained by dividing each Sum of Squares by its associated degrees of freedom:

$$\text{Mean Square Treatment }(MSTr) = \frac{SSTr}{k - 1}$$

$$\text{Mean Square Error }(MSE) = \frac{SSE}{N_T - k}$$

* **Variance Estimation Properties**:
  * **$MSE$**: Provides an **unbiased estimate** of the population variance $\sigma^2$ regardless of whether $H_0$ is true or false, as it depends solely on within-group spread.
  * **$MSTr$**: Provides an **unbiased estimate** of $\sigma^2$ **only if $H_0$ is true**. If $H_0$ is false (population means differ), $MSTr$ overestimates $\sigma^2$ due to added variability between treatment means.

#### Test Statistic Formula
The test statistic $F$ is defined as the ratio of two independent variance estimates:

$$F = \frac{MSTr}{MSE}$$

Under $H_0$, $F$ follows an **$F$-distribution** with numerator degrees of freedom $df_1 = k - 1$ and denominator degrees of freedom $df_2 = N_T - k$.

$$F \sim F_{k-1, \, N_T-k}$$

#### Decision Rules
Because inequality among sample means inflates $MSTr$ and makes $F$ large, ANOVA is always an **upper-tail test**.

* **$P$-Value Approach**:
  * $P\text{-value} = P(F_{k-1, N_T-k} \ge F_{\text{calculated}})$
  * Reject $H_0$ if $P\text{-value} \le \alpha$.
* **Critical Value Approach**:
  * Find critical value $F_{\alpha, \, k-1, \, N_T-k}$ from the $F$-table.
  * Reject $H_0$ if $F_{\text{calculated}} \ge F_{\alpha, \, k-1, \, N_T-k}$.

---

### 1.2.4 ANOVA Table Structure

#### Standard One-Way ANOVA Table Format

| Source of Variation | Sum of Squares ($SS$) | Degrees of Freedom ($DF$) | Mean Square ($MS$) | $F$-Statistic | $P$-Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Between Groups (Treatment)** | $SSTr$ | $k - 1$ | $MSTr = \frac{SSTr}{k - 1}$ | $F = \frac{MSTr}{MSE}$ | Area to right of $F$ |
| **Within Groups (Error)** | $SSE$ | $N_T - k$ | $MSE = \frac{SSE}{N_T - k}$ | | |
| **Total** | $SST$ | $N_T - 1$ | | | |

---

### 1.2.5 Post-Hoc Analysis

#### Pairwise Comparisons and Rationale
* Rejecting $H_0$ in ANOVA confirms that not all population means are equal, but it does **not** identify *which* specific population means differ.
* **Post-Hoc Analysis** involves pairwise two-sample hypothesis tests to evaluate specific pairs $(\mu_i, \mu_j)$.
* **Methodology**:
  * One simplified approach is conducting individual One-way ANOVA tests on selected pairs of treatments at a time.
  * Advanced post-hoc tests (e.g., Tukey's HSD, Fisher's LSD) adjust significance levels to control for cumulative family-wise Type I error rates across multiple pairwise tests.

---

## 1.3 Introduction to Chi-squared Tests

### 1.3.1 Concept and Scope of Chi-squared Tests

#### Testing Population Distributions
* Chi-squared ($\chi^2$) tests extend statistical inference beyond single parameters (mean $\mu$, variance $\sigma^2$, proportion $p$) to make inferences about an **entire population probability distribution**.
* **Goodness of Fit (GOF) Test**: Evaluates whether sample data collected from a population is consistent with a hypothesized theoretical or historical distribution (discrete or continuous).

---

## 1.4 Chi-squared Goodness of Fit Tests

### 1.4.1 Discrete Distributions (Multinomial & Binomial)

#### Hypothesis Setup and Expected Frequency Calculation
* **Multinomial Distribution**: Extension of the binomial distribution where each independent trial yields one of $k \ge 3$ mutually exclusive categories, with hypothesized population proportions $p_1, p_2, \dots, p_k$ such that $\sum_{i=1}^k p_i = 1$.

$$H_0: p_1 = p_{10}, \, p_2 = p_{20}, \, \dots, \, p_k = p_{k0}$$
$$H_A: \text{The population proportions differ from the hypothesized values } p_{10}, p_{20}, \dots, p_{k0}$$

* **Expected Frequencies ($E_i$)**: Calculated under the assumption that $H_0$ is true, given a sample size $n$:

$$E_i = n \cdot p_i \quad \text{for category } i = 1, 2, \dots, k$$

#### Chi-Square Test Statistic Formula and Degrees of Freedom
Let $O_i$ be the observed frequency and $E_i$ be the expected frequency for category $i$:

$$\chi^2 = \sum_{i=1}^k \frac{(O_i - E_i)^2}{E_i}$$

* **Condition for Validity**: The sample size must be sufficiently large such that $E_i \ge 5$ for all categories $i = 1, 2, \dots, k$.
* **Sampling Distribution**: Under $H_0$, $\chi^2$ follows a Chi-square distribution with $df = k - 1$ degrees of freedom.

$$\chi^2 \sim \chi^2_{k-1}$$

* **Decision Rule**: Chi-square GOF tests are always **upper-tail tests**.
  * Reject $H_0$ if $\chi^2_{\text{calculated}} \ge \chi^2_{\alpha, \, k-1}$ or $P\text{-value} \le \alpha$.

---

### 1.4.2 Continuous Distributions (Normal & Exponential)

#### Interval Construction, Cutoffs, and Expected Frequencies
When evaluating continuous distributions (e.g., Normal, Exponential), continuous data must be grouped into $k$ discrete intervals/bins.

1. **Rule for Category Definition**: Construct $k$ non-overlapping adjacent intervals covering the entire real line ($-\infty$ to $+\infty$ or $0$ to $+\infty$) such that $E_i = n \cdot P(\text{Interval } i) \ge 5$ for all $i$.
2. **Equal Probability Approach**: Divide the theoretical CDF into $k$ equal-probability slices such that $P(\text{Interval } i) = \frac{1}{k}$, yielding identical expected counts $E_i = \frac{n}{k} \ge 5$.
3. **Binomial Probability**: $P(X = x) = \binom{n}{x} p^x (1-p)^{n-x}$
4. **Normal Distribution Cutoffs**: Calculate $Z$-scores corresponding to cumulative probability thresholds, then unstandardize using $X = \mu + Z\sigma$.
5. **Exponential Distribution Cutoffs**: Uses CDF $F(x) = 1 - e^{-\lambda x}$, where mean $\mu = \frac{1}{\lambda}$. Cutoffs for cumulative probability $P$ are found via inverse CDF:

$$1 - e^{-\lambda x} = P \implies x = -\mu \cdot \ln(1 - P)$$

#### Chi-Square Decision Rules for Continuous Distributions
* Compute observed count $O_i$ within each constructed interval.
* Calculate test statistic $\chi^2 = \sum_{i=1}^k \frac{(O_i - E_i)^2}{E_i}$.
* Degrees of freedom $df = k - 1$ (when distribution parameters $\mu, \sigma, \lambda$ are specified *a priori* by $H_0$).
* Reject $H_0$ if $\chi^2_{\text{calculated}} \ge \chi^2_{\alpha, \, k-1}$.

---

## 1.5 Applications of One-way ANOVA

### 1.5.1 Real-World Case Studies and Calculations

#### Case Study 1: Investor Portfolios by Age Groups (Srinivas Rao / Motilal Oswal)
* **Problem**: Determine whether average investment amount ($\text{in } \text{\textrupee} \text{ thousands}$) varies across 3 age groups: Young ($n_1=4$), Middle-Aged ($n_2=5$), Senior ($n_3=6$). Total $N_T = 15, k = 3$.
* **Hypotheses**: $H_0: \mu_1 = \mu_2 = \mu_3$ vs. $H_A: \text{Not all means are equal}$.

##### Dataset 1: Palnadu District
* Sample Means: $\bar{X}_1 = 60.0$, $\bar{X}_2 = 57.2$, $\bar{X}_3 = 54.8$, Grand Mean $\bar{\bar{X}} = 57.0$.
* Standard Deviations: $S_1 = 1.83$, $S_2 = 2.28$, $S_3 = 2.71$.

$$\text{Calculations:}$$
$$SST = 132.0, \quad SSTr = 4(60-57)^2 + 5(57.2-57)^2 + 6(54.8-57)^2 = 64.37$$
$$SSE = SST - SSTr = 132.0 - 64.37 = 67.63$$
$$DF_{\text{treatment}} = 3 - 1 = 2, \quad DF_{\text{error}} = 15 - 3 = 12$$
$$MSTr = \frac{64.37}{2} = 32.18, \quad MSE = \frac{67.63}{12} = 5.64$$
$$F = \frac{32.18}{5.64} = 5.71, \quad P\text{-value} = 0.018, \quad F_{0.05, 2, 12} = 3.88$$

* **Decision**: $F_{\text{calc}} (5.71) > F_{\text{crit}} (3.88)$ and $P\text{-value} (0.018) < 0.05$. **Reject $H_0$**. Average investment levels differ significantly across age groups.

##### Palnadu Post-Hoc Pairwise Analysis

| Comparison | $SSTr$ | $SSE$ | $MSTr$ | $MSE$ | $F$-Stat | $P$-Value | Decision ($\alpha=0.05$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Young vs. Middle-Aged** | $17.42$ | $30.80$ | $17.42$ | $4.40$ | $3.96$ | $0.090$ | Do Not Reject $H_0$ ($\mu_1 \approx \mu_2$) |
| **Middle-Aged vs. Senior** | $15.30$ | $57.60$ | $15.30$ | $5.24$ | $2.92$ | $0.160$ | Do Not Reject $H_0$ ($\mu_2 \approx \mu_3$) |
| **Young vs. Senior** | $64.10$ | $29.30$ | $64.10$ | $5.86$ | $10.94$ | $0.010$ | **Reject $H_0$** ($\mu_1 \neq \mu_3$) |

* **Conclusion**: The primary driver of the overall rejection is the significant difference between Young and Senior investors.

##### Dataset 2: Bapatla District (High Within-Group Variability)
* $\bar{X}_1 = 41.0$, $\bar{X}_2 = 42.0$, $\bar{X}_3 = 41.67$. $S_1 = 24.08$, $S_2 = 21.12$, $S_3 = 18.61$.
* $SST = 5257.6$, $SSTr = 2.27$, $SSE = 5255.33$.
* $MSTr = 1.13$, $MSE = 438.0$, $F = \frac{1.13}{438} = 0.0026$, $P\text{-value} = 0.997$.
* **Decision**: **Do Not Reject $H_0$**. High sample variance obscures any potential mean differences.

##### Dataset 3: NTR District (High Between-Group Variability)
* $\bar{X}_1 = 60.0$, $\bar{X}_2 = 37.2$, $\bar{X}_3 = 20.0$. $S_1 = 2.31$, $S_2 = 2.28$, $S_3 = 2.31$.
* $SST = 3345.6$, $SSTr = 3287.0$, $SSE = 58.6$.
* $MSTr = 1643.5$, $MSE = 4.88$, $F = \frac{1643.5}{4.88} = 336.8$, $P\text{-value} \approx 0.000$.
* **Decision**: **Reject $H_0$**. Strong separation between sample means relative to small within-group variance.

---

#### Case Study 2: Transmission Assembly Methods (Kia Motors / Lakshmamma)
* **Problem**: Compare 4 transmission assembly methods ($k=4$): Method A ($n_1=8$), Method B ($n_2=11$), Method C ($n_3=9$), Method D ($n_4=6$). Total $N_T = 34$. $\alpha = 0.05$.
* **Hypotheses**: $H_0: \mu_A = \mu_B = \mu_C = \mu_D$ vs. $H_A: \text{Not all means are equal}$.
* **Data**: $\bar{X}_1 = 117.0$, $\bar{X}_2 = 100.0$, $\bar{X}_3 = 102.6$, $\bar{X}_4 = 114.2$, Grand Mean $\bar{\bar{X}} = 107.2$.

$$\text{Calculations:}$$
$$SST = 11588.0, \quad SSTr = 1800.3, \quad SSE = 9787.7$$
$$DF_{\text{treatment}} = 4 - 1 = 3, \quad DF_{\text{error}} = 34 - 4 = 30$$
$$MSTr = \frac{1800.3}{3} = 600.1, \quad MSE = \frac{9787.7}{30} = 326.3$$
$$F = \frac{600.1}{326.3} = 1.84, \quad F_{0.05, 3, 30} = 2.92$$

* **ANOVA Table**:

| Source | $SS$ | $DF$ | $MS$ | $F$ | $P$-Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Treatment** | $1800.3$ | $3$ | $600.1$ | $1.84$ | $>0.05$ |
| **Error** | $9787.7$ | $30$ | $326.3$ | | |
| **Total** | $11588.0$ | $33$ | | | |

* **Decision**: $F_{\text{calc}} (1.84) < F_{\text{crit}} (2.92)$. **Do Not Reject $H_0$**. Assembly method differences are not statistically significant.

---

#### Case Study 3: Biryani Meal Prices by Location (Wanderlog / Sujata)
* **Problem**: Test whether average biryani price depends on restaurant location: Shopping ($n_1=13$), Office ($n_2=9$), Station ($n_3=8$). Total $N_T = 30, k = 3, \alpha = 0.05$.
* **Hypotheses**: $H_0: \mu_1 = \mu_2 = \mu_3$ vs. $H_A: \text{Not all means are equal}$.
* **Data**: $\bar{X}_1 = 390.7$, $\bar{X}_2 = 393.3$, $\bar{X}_3 = 460.0$, Grand Mean $\bar{\bar{X}} = 410.0$.

$$\text{Calculations:}$$
$$SST = 172600.0, \quad SSTr = 27307.0, \quad SSE = 145293.0$$
$$DF_{\text{treatment}} = 3 - 1 = 2, \quad DF_{\text{error}} = 30 - 3 = 27$$
$$MSTr = \frac{27307}{2} = 13653.5, \quad MSE = \frac{145293}{27} = 5381.2$$
$$F = \frac{13653.5}{5381.2} = 2.54, \quad F_{0.05, 2, 27} = 3.35$$

* **Decision**: $F_{\text{calc}} (2.54) < F_{\text{crit}} (3.35)$. **Do Not Reject $H_0$**. Despite $\bar{X}_3$ being higher, small sample size ($n_3=8$) and high within-group variance result in insufficient statistical evidence.

---

#### Case Study 4: Audit Completion Times by Team Composition (Davuluri & Associates / Ram)
* **Problem**: Determine if audit team composition affects completion days: Local ($n_1=7$), Corporate ($n_2=6$), Both ($n_3=7$). Total $N_T = 20, k = 3, \alpha = 0.05$.
* **Hypotheses**: $H_0: \mu_1 = \mu_2 = \mu_3$ vs. $H_A: \text{Not all means are equal}$.
* **Data**: $\bar{X}_1 = 25.3$, $\bar{X}_2 = 20.8$, $\bar{X}_3 = 17.0$, Grand Mean $\bar{\bar{X}} = 21.05$.

$$\text{Calculations:}$$
$$SST = 324.95, \quad SSTr = 240.65, \quad SSE = 84.30$$
$$DF_{\text{treatment}} = 3 - 1 = 2, \quad DF_{\text{error}} = 20 - 3 = 17$$
$$MSTr = \frac{240.65}{2} = 120.33, \quad MSE = \frac{84.30}{17} = 4.96$$
$$F = \frac{120.33}{4.96} = 24.26, \quad F_{0.05, 2, 17} = 3.59$$

* **Decision**: $F_{\text{calc}} (24.26) \gg F_{\text{crit}} (3.59)$. **Reject $H_0$**. Audit completion time is significantly impacted by team composition.

---

## 1.6 Applications of Chi-squared Tests

### 1.6.1 Real-World Case Studies and Calculations

#### Case Study 1: TV Viewership Trends (Andhra Jyothi / Subba Rao - Multinomial)
* **Problem**: Survey of $n=600$ households to evaluate if prime-time Saturday viewership changed after launching a new show. $\alpha = 0.05, k = 4$.

##### Initial Historical Model
* $H_0: p_A = 0.29 \, (\text{ETV}), \, p_B = 0.28 \, (\text{Zee}), \, p_C = 0.25 \, (\text{Star Maa}), \, p_D = 0.18 \, (\text{Gemini})$.
* $H_A: \text{Proportions differ from historical values}$.
* Expected counts: $E_A = 600(0.29)=174, \, E_B = 600(0.28)=168, \, E_C = 600(0.25)=150, \, E_D = 600(0.18)=108$.
* Observed counts: $O_A = 195, \, O_B = 170, \, O_C = 189, \, O_D = 46$.

$$\chi^2 = \frac{(195-174)^2}{174} + \frac{(170-168)^2}{168} + \frac{(189-150)^2}{150} + \frac{(46-108)^2}{108}$$
$$\chi^2 = 2.53 + 0.02 + 10.14 + 35.59 = 48.28$$
$$df = 4 - 1 = 3, \quad \chi^2_{0.05, 3} = 7.81$$

* **Decision**: $\chi^2_{\text{calc}} (48.28) > \chi^2_{\text{crit}} (7.81)$. **Reject $H_0$**. Viewership proportions have changed significantly.

##### Revised Model Test
* $H_0: p_A = 0.30, \, p_B = 0.30, \, p_C = 0.30, \, p_D = 0.10$.
* Expected counts: $E_A = 180, \, E_B = 180, \, E_C = 180, \, E_D = 60$.

$$\chi^2 = \frac{(195-180)^2}{180} + \frac{(170-180)^2}{180} + \frac{(189-180)^2}{180} + \frac{(46-60)^2}{60}$$
$$\chi^2 = 1.25 + 0.56 + 0.45 + 3.27 = 5.53$$
$$df = 3, \quad \chi^2_{0.05, 3} = 7.81, \quad P\text{-value} = 0.14$$

* **Decision**: $\chi^2_{\text{calc}} (5.53) < \chi^2_{\text{crit}} (7.81)$ and $P\text{-value} (0.14) > 0.05$. **Do Not Reject $H_0$**. The revised distribution is a plausible fit.

---

#### Case Study 2: Pediatric Eye Surgeries (Aravind Eye Hospital / Dr. Srinivasan - Binomial)
* **Problem**: Test whether daily pediatric surgeries follow $Binomial(n=6, p=0.5)$ across $N=365$ operating days. $\alpha = 0.05, k = 7$.
* $H_0: \text{Daily pediatric surgeries } X \sim Binomial(6, 0.5)$.
* Binomial Probabilities $P(X=x) = \binom{6}{x} (0.5)^6$:

$$\text{Expected Counts } E_x = 365 \cdot P(X=x)$$

| Surgeries ($x$) | $P(X=x)$ | $E_x$ | $O_x$ | $\frac{(O_x - E_x)^2}{E_x}$ |
| :---: | :---: | :---: | :---: | :---: |
| **0** | $0.0156$ | $5.7$ | $3$ | $\frac{(3-5.7)^2}{5.7} = 1.28$ |
| **1** | $0.0938$ | $34.2$ | $25$ | $\frac{(25-34.2)^2}{34.2} = 2.48$ |
| **2** | $0.2344$ | $85.5$ | $92$ | $\frac{(92-85.5)^2}{85.5} = 0.49$ |
| **3** | $0.3125$ | $114.4$ | $105$ | $\frac{(105-114.4)^2}{114.4} = 0.77$ |
| **4** | $0.2344$ | $85.5$ | $93$ | $\frac{(93-85.5)^2}{85.5} = 0.66$ |
| **5** | $0.0938$ | $34.2$ | $39$ | $\frac{(39-34.2)^2}{34.2} = 0.67$ |
| **6** | $0.0156$ | $5.7$ | $8$ | $\frac{(8-5.7)^2}{5.7} = 0.93$ |
| **Total** | $1.0000$ | $365.0$ | $365$ | **$\chi^2 = 7.28$** |

* Degrees of Freedom $df = 7 - 1 = 6$. Critical Value $\chi^2_{0.05, 6} = 12.59$.
* **Decision**: $\chi^2_{\text{calc}} (7.28) < \chi^2_{\text{crit}} (12.59)$. **Do Not Reject $H_0$**. Pediatric surgeries follow a Binomial distribution with $p=0.5$.

---

#### Case Study 3: Daily Khaja Demand Distribution (Suruchi Foods / Venkatesh Babu - Normal)
* **Problem**: Sample of $n=25$ days to test if daily demand follows $Normal(\mu=70, \sigma=20)$. $\alpha = 0.05$.
* Construct $k=5$ equal-probability intervals ($P_i = 0.20 \implies E_i = 25 \times 0.20 = 5$ for all $i$).
* Cutoffs derived from standard normal $Z$-scores ($Z_{0.20} = -0.842, Z_{0.40} = -0.253, Z_{0.60} = 0.253, Z_{0.80} = 0.842$):
  * $X_1 = 70 + (-0.842)(20) = 53.17$
  * $X_2 = 70 + (-0.253)(20) = 64.93$
  * $X_3 = 70 + (0.253)(20) = 75.07$
  * $X_4 = 70 + (0.842)(20) = 86.83$

| Demand Interval | Expected ($E_i$) | Observed ($O_i$) | $\frac{(O_i - E_i)^2}{E_i}$ |
| :--- | :---: | :---: | :---: |
| **$(-\infty, 53.17]$** | $5$ | $4$ | $\frac{(4-5)^2}{5} = 0.20$ |
| **$(53.17, 64.93]$** | $5$ | $8$ | $\frac{(8-5)^2}{5} = 1.80$ |
| **$(64.93, 75.07]$** | $5$ | $8$ | $\frac{(8-5)^2}{5} = 1.80$ |
| **$(75.07, 86.83]$** | $5$ | $2$ | $\frac{(2-5)^2}{5} = 1.80$ |
| **$(86.83, \infty)$** | $5$ | $3$ | $\frac{(3-5)^2}{5} = 0.80$ |
| **Total** | $25$ | $25$ | **$\chi^2 = 6.40$** |

* Degrees of Freedom $df = 5 - 1 = 4$. Critical Value $\chi^2_{0.05, 4} = 9.48$.
* **Decision**: $\chi^2_{\text{calc}} (6.40) < \chi^2_{\text{crit}} (9.48)$. **Do Not Reject $H_0$**. The $Normal(70, 20)$ demand assumption remains valid.

---

#### Case Study 4: Call Center Duration (Chandarana Bhima / Madhavi - Exponential)
* **Problem**: Sample of $n=50$ call durations to test if data follows $Exponential(\text{mean } \mu = 6 \text{ min}) \implies \lambda = \frac{1}{6}$. $\alpha = 0.05$.
* Construct $k=10$ equal-probability intervals ($P_i = 0.10 \implies E_i = 50 \times 0.10 = 5$ for all $i$).
* Cutoffs via Inverse CDF $x = -6 \cdot \ln(1 - P)$:
  * $P=0.10 \implies x_1 = 0.632$
  * $P=0.20 \implies x_2 = 1.339$
  * $P=0.30 \implies x_3 = 2.140$
  * $P=0.40 \implies x_4 = 3.065$
  * $P=0.50 \implies x_5 = 4.159$
  * $P=0.60 \implies x_6 = 5.500$
  * $P=0.70 \implies x_7 = 7.223$
  * $P=0.80 \implies x_8 = 9.657$
  * $P=0.90 \implies x_9 = 13.816$

| Interval ($i$) | Range (min) | Expected ($E_i$) | Observed ($O_i$) | $\frac{(O_i - E_i)^2}{E_i}$ |
| :---: | :--- | :---: | :---: | :---: |
| **1** | $[0, 0.63)$ | $5$ | $4$ | $0.20$ |
| **2** | $[0.63, 1.34)$ | $5$ | $1$ | $3.20$ |
| **3** | $[1.34, 2.14)$ | $5$ | $3$ | $0.80$ |
| **4** | $[2.14, 3.06)$ | $5$ | $4$ | $0.20$ |
| **5** | $[3.06, 4.16)$ | $5$ | $5$ | $0.00$ |
| **6** | $[4.16, 5.50)$ | $5$ | $5$ | $0.00$ |
| **7** | $[5.50, 7.22)$ | $5$ | $8$ | $1.80$ |
| **8** | $[7.22, 9.66)$ | $5$ | $5$ | $0.00$ |
| **9** | $[9.66, 13.82)$ | $5$ | $7$ | $0.80$ |
| **10** | $[13.82, \infty)$ | $5$ | $8$ | $1.80$ |
| **Total** | | $50$ | $50$ | **$\chi^2 = 8.80$** |

* Degrees of Freedom $df = 10 - 1 = 9$. Critical Value $\chi^2_{0.05, 9} = 16.92$.
* **Decision**: $\chi^2_{\text{calc}} (8.80) < \chi^2_{\text{crit}} (16.92)$. **Do Not Reject $H_0$**. Call durations follow an Exponential distribution with mean $6$ minutes.

---

## 1.7 Covariance and Correlation

### 1.7.1 Measures of Linear Association

#### Formulas and Properties of Covariance and Correlation
Covariance and correlation measure the strength and direction of the **linear relationship** between two quantitative variables $X$ and $Y$ across $n$ paired observations $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$.

#### Sample Covariance ($s_{xy}$)

$$s_{xy} = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{n - 1}$$

* **Interpretation**:
  * $s_{xy} > 0$: Positive linear relationship (points cluster in Quadrants I and III relative to $(\bar{x}, \bar{y})$).
  * $s_{xy} < 0$: Negative linear relationship (points cluster in Quadrants II and IV).
  * $s_{xy} \approx 0$: No linear association.
  * **Generalization**: Covariance of a variable with itself equals its sample variance ($s_{xx} = s_x^2$).
* **Limitation**: Depends on measurement units, making scale comparisons across datasets impossible.

#### Sample Correlation Coefficient ($r_{xy}$)
The Pearson product-moment correlation coefficient normalizes covariance by the product of individual sample standard deviations ($s_x, s_y$):

$$r_{xy} = \frac{s_{xy}}{s_x \cdot s_y} = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^n (x_i - \bar{x})^2} \sqrt{\sum_{i=1}^n (y_i - \bar{y})^2}}$$

* **Key Properties**:
  1. **Scale-Invariant**: Unitless measure bounded in $[-1, +1]$.
  2. $r_{xy} = +1$: Perfect positive linear relationship.
  3. $r_{xy} = -1$: Perfect negative linear relationship.
  4. $r_{xy} = 0$: Absence of **linear** relationship.

#### Case Study Example: Credit Card Expenditures (Canara Bank / Hanumantha)
* Sample size $n = 55$.
* Variable $Y$: Monthly Credit Card Spend ($\text{Mean } \bar{y} = \text{\textrupee} 3852, s_y = \text{\textrupee} 1454$).
* Variable $X_1$: Annual Income ($\text{in } \text{\textrupee} \text{ lakhs}, s_{x1} = 13.74$).
  * $s_{y, x1} = 16109 \implies r_{y, x1} = \frac{16109}{(13.74)(1454)} = 0.81$ (**Strong positive linear association**).
* Variable $X_2$: Household Size ($s_{x2} = 1.76$).
  * $s_{y, x2} = 1610 \implies r_{y, x2} = \frac{1610}{(1.76)(1454)} = 0.63$ (**Moderate positive linear association**).

---

#### Limitations, Nonlinearity, and Spurious Correlation

| Concept | Explanation | Example |
| :--- | :--- | :--- |
| **Nonlinear Relationships** | Pearson $r$ evaluates **linear** association only. If $Y = f(X)$ is quadratic or parabolic, $r$ can be zero despite a perfect deterministic relationship. | Data points $x \in \{-3, -2, -1, 1, 2, 3\}$ and $y = \frac{1}{x^2}$ yield $s_{xy} = 0$ and $r_{xy} = 0$. Utility spend vs. outside temperature forms a U-shape where $r \approx 0$. |
| **Correlation vs. Causation** | High correlation does **not** imply cause-and-effect. | Higher income correlates with higher credit card spend, but high income does not force higher spending. |
| **Spurious Correlation** | A strong statistical correlation driven by an omitted **latent / confounding variable** rather than a true relationship. | 1. Ice cream sales vs. crime rates ($r > 0$) driven by latent variable **Temperature**.<br>2. Number of doctors vs. village deaths ($r > 0$) driven by latent variable **Population Size / Poor Initial Health**.<br>3. Maine divorce rates vs. margarine consumption ($r = 0.99$).<br>4. Hemline Index (George Taylor, 1926): Skirt lengths vs. economic growth. |
| **Non-Quantitative Data** | Pearson correlation applies strictly to quantitative variables. Ordinal/Nominal data require alternative measures (e.g., Spearman rank correlation). | Ranking data, customer satisfaction ratings. |

---

## Quick Revision Summary

### Key Definitions
* **ANOVA**: Hypothesis test assessing equality of $k \ge 2$ population means by analyzing sample variances.
* **Sum of Squares Treatment ($SSTr$)**: Measures between-group variation; sensitive to population mean differences.
* **Sum of Squares Error ($SSE$)**: Measures within-group variation; provides an unbiased estimate of $\sigma^2$ regardless of $H_0$.
* **Chi-Squared Goodness-of-Fit Test**: Evaluates whether sample frequencies conform to a specified discrete or continuous probability distribution.
* **Sample Covariance ($s_{xy}$)**: Measures absolute direction and strength of joint linear variability between two variables.
* **Pearson Correlation ($r_{xy}$)**: Scale-free measure bounded in $[-1, +1]$ quantifying linear association.
* **Spurious Correlation**: High correlation between two variables caused by a hidden confounding variable rather than direct cause-and-effect.

---

### Important Formulas

$$\text{ANOVA Partitioning: } SST = SSTr + SSE$$

$$SSTr = \sum_{j=1}^k n_j (\bar{X}_j - \bar{\bar{X}})^2, \quad SSE = \sum_{j=1}^k \sum_{i=1}^{n_j} (X_{ij} - \bar{X}_j)^2$$

$$\text{ANOVA } F\text{-Statistic: } F = \frac{MSTr}{MSE} = \frac{SSTr / (k - 1)}{SSE / (N_T - k)} \sim F_{k-1, \, N_T-k}$$

$$\text{Chi-Square Test Statistic: } \chi^2 = \sum_{i=1}^k \frac{(O_i - E_i)^2}{E_i} \sim \chi^2_{k-1}$$

$$\text{Multinomial Expected Count: } E_i = n \cdot p_i$$

$$\text{Exponential Cutoff Formula: } x = -\mu \cdot \ln(1 - P)$$

$$\text{Sample Covariance: } s_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n - 1}$$

$$\text{Pearson Correlation: } r_{xy} = \frac{s_{xy}}{s_x \cdot s_y}$$

---

### Must-Remember Points
* ANOVA and Chi-squared Goodness-of-Fit tests are **always upper-tail tests**.
* Rejecting $H_0$ in ANOVA means **at least one** population mean is different, not that all means are distinct. Post-hoc analysis is required to identify specific differing pairs.
* Chi-squared GOF test requires expected frequencies $E_i \ge 5$ in every bin.
* $r_{xy} = 0$ indicates the absence of a **linear** relationship, **not** the absence of any relationship (non-linear associations can yield $r_{xy} = 0$).
* **Correlation does not imply causation.** Always verify potential lurking/confounding variables before drawing business conclusions.