## MODULE 1: Analysis of Variance (ANOVA), Goodness of Fit, and Covariance/Correlation

---

### One-Way ANOVA Foundations & Hypothesis Testing

**One-Way ANOVA** is a hypothesis testing technique used to compare the means of $K \ge 2$ independent populations (treatments) based on a single continuous quantitative response variable $X$.

| Concept / Parameter | Notation / Formula | Description |
|---|---|---|
| **Factor / Treatment** | $K$ levels | Categorical grouping variable defining distinct populations |
| **Response Variable** | $X$ | Quantitative measurement taken across observations |
| **Total Sample Size** | $N_T = \sum_{j=1}^K n_j$ | Total number of observations combined across all groups |
| **Null Hypothesis** | $H_0: \mu_1 = \mu_2 = \dots = \mu_K$ | All $K$ population means are equal |
| **Alternative Hypothesis** | $H_A: \text{Not all } \mu_j \text{ are equal}$ | At least one population mean differs from the rest |

> **Q:** A university compares average starting salaries of graduates from Engineering, Science, Commerce, and Arts. Which hypothesis pair is appropriate for a one-way ANOVA? = **$H_0: \mu_1 = \mu_2 = \mu_3 = \mu_4; \; H_A: \text{At least one population mean differs}$** ✓
> **Q:** A researcher performs a one-way ANOVA across 4 training programmes and rejects $H_0$. What is the appropriate conclusion? = **There is sufficient evidence that at least one programme has a different population mean productivity** ✓
> **Q:** In a one-way ANOVA, rejecting the null hypothesis implies that every population mean is different from each other = **FALSE** *(It only indicates that at least one mean differs)* ✓
> **Q:** Why is the technique called "Analysis of Variance" when its objective is to compare population means? = **Differences among population means are assessed by analyzing the variation present within and between the sample groups** ✓
> **Q:** A government evaluates a welfare scheme across six states by comparing household income improvements. In this study, the six states represent = **Six populations (factor levels / treatments)** ✓
> **Q:** Why is ANOVA preferred over conducting multiple pairwise $t$-tests across several populations? = **ANOVA evaluates all population means simultaneously in a single test, controlling family-wise Type I error rate** ✓
> **Q:** Estimating the average salary of employees in a single company can be addressed directly using one-way ANOVA = **FALSE** *(ANOVA requires comparing $K \ge 2$ groups; single mean estimation is a 1-sample test)* ✓
> **Q:** Lower-tail and upper-tail test versions exist under ANOVA = **FALSE** *(ANOVA $F$-tests are strictly upper-tail tests)* ✓

---

### ANOVA Assumptions & Sum of Squares Decomposition

#### Core Model Assumptions
- **Normality:** For each population $j$, the response variable $X \sim N(\mu_j, \sigma^2)$.
- **Homoscedasticity (Equal Variances):** The population variance $\sigma^2$ is identical across all groups ($\sigma_1^2 = \dots = \sigma_K^2 = \sigma^2$).
- **Independence:** Sample observations are independent within and across treatment groups.

$$\text{Total Sum of Squares: } SST = SSTr + SSE$$

$$\sum_{j=1}^K \sum_{i=1}^{n_j} (X_{ij} - \bar{\bar{X}})^2 = \sum_{j=1}^K n_j (\bar{X}_j - \bar{\bar{X}})^2 + \sum_{j=1}^K \sum_{i=1}^{n_j} (X_{ij} - \bar{X}_j)^2$$

| Source of Variation | Sum of Squares ($SS$) | Degrees of Freedom ($DF$) | Mean Square ($MS$) | $F$-Statistic | Unbiased Estimate of $\sigma^2$? |
|---|---|---|---|---|---|
| **Between Treatments** | $SSTr$ | $K - 1$ | $MSTr = \frac{SSTr}{K - 1}$ | $F = \frac{MSTr}{MSE}$ | **Only if $H_0$ is true** (overestimates if $H_0$ false) |
| **Within Groups (Error)** | $SSE$ | $N_T - K$ | $MSE = \frac{SSE}{N_T - K}$ | — | **ALWAYS unbiased** |
| **Total** | $SST$ | $N_T - 1$ | — | — | — |

> **Q:** Under ANOVA, which quantity is **ALWAYS** an unbiased estimator of population variance $\sigma^2$? = **MSE** ✓
> **Q:** When the null hypothesis $H_0$ is false, $MSTr$ will **Overestimate** the population variance $\sigma^2$ ✓
> **Q:** Degrees of freedom for numerator and denominator in ANOVA $F$-test = **Numerator $DF = K - 1$, Denominator $DF = N_T - K$** ✓
> **Q:** What is the primary purpose of post-hoc analysis following an ANOVA test? = **To identify which specific treatment means are significantly different after rejecting $H_0$** ✓

---

### ANOVA Numerical Problem Solving

**Q1 (Palnadu District Investment Study):** Average investment amounts across $K=3$ age groups: Young ($n_1=4, \bar{X}_1=60$), Middle ($n_2=5, \bar{X}_2=57.2$), Senior ($n_3=6, \bar{X}_3=54.8$). Total sample size $N_T = 15$, grand mean $\bar{\bar{X}} = 57$. Given $SST = 132.0$ and $SSTr = 64.37$, test $H_0: \mu_1 = \mu_2 = \mu_3$ at $\alpha = 0.05$.

> *Why: Comparing means of $K=3$ independent populations using One-Way ANOVA.*
> $SSE = SST - SSTr = 132.0 - 64.37 = 67.63$
> $DF_{\text{treatment}} = 3 - 1 = 2, \quad DF_{\text{error}} = 15 - 3 = 12$
> $MSTr = \frac{64.37}{2} = 32.18, \quad MSE = \frac{67.63}{12} = 5.64$
> $F_{\text{calc}} = \frac{32.18}{5.64} = 5.71$
> 📋 **F-Distribution Table:** Lookup $F_{0.05, 2, 12} \rightarrow 3.88 \implies P\text{-value} = 0.018$
> Since $F_{\text{calc}} = 5.71 > 3.88$ ($P \le 0.05$), reject $H_0$.
> **Answer = Reject $H_0$; average investments differ significantly across age groups** ✓
> *(Post-hoc pairwise tests reveal Young vs. Senior differs significantly with $P=0.01$, driving the overall rejection)*

---

### Chi-Squared Goodness of Fit (GOF) Tests

Evaluates whether observed categorical or grouped continuous data conform to a hypothesized theoretical probability distribution.

$$\text{Test Statistic: } \chi^2 = \sum_{i=1}^K \frac{(O_i - E_i)^2}{E_i} \sim \chi^2_{K - 1}$$

| Distribution Tested | Categorization / Binning Rule | Expected Frequency ($E_i$) | Degrees of Freedom |
|---|---|---|---|
| **Multinomial (Discrete)** | Given $K$ historical categories | $E_i = n \cdot p_i$ | $K - 1$ |
| **Binomial (Discrete)** | $K$ outcome bins ($x = 0, 1, \dots, n_t$) | $E_i = N \cdot \binom{n_t}{x} p^x (1-p)^{n_t - x}$ | $K - 1$ |
| **Normal (Continuous)** | $K$ equal-probability intervals ($P_i = 1/K$) | $E_i = n / K$ via $Z$-score cutoffs | $K - 1$ |
| **Exponential (Continuous)** | $K$ equal-probability intervals | $E_i = n / K$ via $x = -\mu \ln(1 - P)$ | $K - 1$ |

> **Q:** Which of the following is TRUE about the Chi-Square Distribution? = **It is non-negative, skewed to the right, and used primarily in hypothesis testing for categorical data** ✓
> **Q:** Chi-square goodness-of-fit tests are always upper-tail tests = **TRUE** ✓
> **Q:** The restriction $E_i \ge 5$ in a Chi-square GOF test applies to = **Expected frequencies $E_i$ only (NOT observed frequencies $O_i$)** ✓
> **Q:** If observed frequencies perfectly match expected frequencies ($O_i = E_i$), the test statistic equals = **$\chi^2 = 0$** ✓

**Q2 (Multinomial TV Viewership - Subba Rao):** Survey of $n=600$ households across $K=4$ channels. Historical probabilities: ETV ($0.29$), Zee ($0.28$), Star Maa ($0.25$), Gemini ($0.18$). Observed counts: $O = [195, 170, 189, 46]$. Test if historical distribution still holds at $\alpha = 0.05$.

> *Why: Multinomial goodness-of-fit test with pre-specified category proportions.*
> $E = [600(0.29), 600(0.28), 600(0.25), 600(0.18)] = [174, 168, 150, 108]$
> $\chi^2 = \frac{(195-174)^2}{174} + \frac{(170-168)^2}{168} + \frac{(189-150)^2}{150} + \frac{(46-108)^2}{108} = 2.53 + 0.02 + 10.14 + 35.59 = 48.28$
> $DF = 4 - 1 = 3$
> 📋 **Chi-Square Table:** Lookup $\chi^2_{0.05, 3} \rightarrow 7.81$
> Since $\chi^2_{\text{calc}} = 48.28 > 7.81$, reject $H_0$.
> **Answer = Reject $H_0$; viewership distribution has changed significantly** ✓

---

### Covariance & Correlation Measures

$$\text{Sample Covariance: } s_{xy} = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{n - 1}$$

$$\text{Pearson Correlation Coefficient: } r_{xy} = \frac{s_{xy}}{s_x s_y} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2} \sqrt{\sum (y_i - \bar{y})^2}}, \quad -1 \le r_{xy} \le +1$$

| Measure | Scale / Unit Dependent? | Bounded Range | Evaluates Non-linear Links? |
|---|---|---|---|
| **Covariance ($s_{xy}$)** | **Yes** (units of $X \times Y$) | $(-\infty, +\infty)$ | No (evaluates linear link only) |
| **Correlation ($r_{xy}$)** | **No** (scale-free / unitless) | $[-1.0, +1.0]$ | No ($r=0$ can occur with strong non-linear link) |

> **Q:** If the covariance between two variables $X$ and $Y$ is zero, what does it imply? = **There is no LINEAR relationship between $X$ and $Y$** ✓
> **Q:** What is the key advantage of using correlation over covariance? = **Correlation does not depend on the scale of variables, making it easier to compare relationships across datasets** ✓
> **Q:** A sample correlation coefficient $r_{xy} = 0$ proves that $X$ and $Y$ are completely independent = **FALSE** *(A non-linear relationship like $Y = X^2$ can yield $r=0$)* ✓
> **Q:** What causes the spurious correlation between ice cream sales and crime rates? = **A hidden/latent confounding variable (Temperature)** ✓
> **Q:** The covariance of a variable with itself ($s_{xx}$) equals = **Sample Variance $s_x^2$** ✓

**Q3 (STAT_MT_Q6):** Supply ($y$) and price ($x$) across 8 weeks are given as $(y, x)$: $(5, 2), (7, 4), (9, 8), (12, 5), (10, 7), (13, 8), (16, 16), (16, 6)$. Find sample covariance.

> *Why: Compute sample covariance from bivariate data pairs.*
> $n = 8, \quad \bar{x} = \frac{2+4+8+5+7+8+16+6}{8} = 7.0, \quad \bar{y} = \frac{5+7+9+12+10+13+16+16}{8} = 11.0$
> $\sum (x_i - \bar{x})(y_i - \bar{y}) = (-5)(-6) + (-3)(-4) + (1)(-2) + (-2)(1) + (0)(-1) + (1)(2) + (9)(5) + (-1)(5) = 30 + 12 - 2 - 2 + 0 + 2 + 45 - 5 = 80.0$
> $s_{xy} = \frac{80.0}{8 - 1} = \frac{80.0}{7} = 11.43 \approx 11.4$
> **Answer = 11.4** ✓

**Q4 (Sample_Q3):** Discrete joint distribution of Demand ($X \in \{1, 2\}$) and Price ($Y \in \{1, 2\}$): $P(1, 1)=0.30, P(2, 1)=0.40, P(1, 2)=0.20, P(2, 2)=0.10$. Compute correlation $\rho_{xy}$.

> *Why: Joint probability distribution calculation for correlation coefficient.*
> $E[X] = 1(0.50) + 2(0.50) = 1.5, \quad \text{Var}(X) = 0.25 \implies \sigma_x = 0.5$
> $E[Y] = 1(0.70) + 2(0.30) = 1.3, \quad E[Y^2] = 1^2(0.70) + 2^2(0.30) = 1.9 \implies \text{Var}(Y) = 1.9 - 1.3^2 = 0.21 \implies \sigma_y = 0.4583$
> $E[XY] = (1)(1)(0.30) + (2)(1)(0.40) + (1)(2)(0.20) + (2)(2)(0.10) = 0.30 + 0.80 + 0.40 + 0.40 = 1.90$
> $\text{Cov}(X, Y) = E[XY] - E[X]E[Y] = 1.90 - (1.5)(1.3) = 1.90 - 1.95 = -0.05$
> $\rho_{xy} = \frac{-0.05}{(0.5)(0.4583)} = -0.218$
> **Answer = -0.218** ✓

---

## MODULE 2: Simple Linear Regression (SLR)

---

### SLR Model Specification & Parameter Estimation (OLS)

$$y_i = \beta_0 + \beta_1 x_i + \epsilon_i \implies E(y|x) = \beta_0 + \beta_1 x \implies \hat{y}_i = b_0 + b_1 x_i$$

- **OLS Objective:** Minimize $SSE = \sum (y_i - \hat{y}_i)^2$.
- **Slope Formula:** $b_1 = \frac{SS_{xy}}{SS_{xx}} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}$
- **Intercept Formula:** $b_0 = \bar{y} - b_1 \bar{x}$

- **Slope ($b_1$):** Expected change in $Y$ per 1-unit increase in $X$.
- **Linearity Definition:** Model must be **linear in parameters ($\beta_0, \beta_1$)**, not necessarily in the variables ($X^2$ and $\ln(X)$ models remain linear regression models).
- **Extrapolation:** Model is **strictly valid only within the sample range $[x_{\min}, x_{\max}]$**.

> **Q:** Linearity in simple linear regression is defined with respect to = **The parameters $\beta_0$ and $\beta_1$ (NOT necessarily the variables)** ✓
> **Q:** The Ordinary Least Squares (OLS) method chooses $b_0$ and $b_1$ to minimize = **The sum of squared residuals $\sum (y_i - \hat{y}_i)^2$ (SSE)** ✓
> **Q:** Standard dataset split for model development = **75% Training and 25% Validation** ✓
> **Q:** Performing exceptionally well on training data but poorly on validation data is called = **Overfitting** ✓
> **Q:** The assumption that error terms have zero mean $E(\epsilon) = 0$ ensures = **The regression estimators are unbiased** ✓

---

### Variation Decomposition & Coefficient of Determination ($R^2$)

$$SST = SSR + SSE \implies \sum (y_i - \bar{y})^2 = \sum (\hat{y}_i - \bar{y})^2 + \sum (y_i - \hat{y}_i)^2$$

$$R^2 = \frac{SSR}{SST} = 1 - \frac{SSE}{SST}, \quad r_{xy} = \text{sign}(b_1) \cdot \sqrt{R^2}$$

| Metric | Formula | Degrees of Freedom | Meaning |
|---|---|---|---|
| **$SST$** | $\sum (y_i - \bar{y})^2$ | $n - 1$ | Total variation in response variable $Y$ |
| **$SSR$** | $\sum (\hat{y}_i - \bar{y})^2$ | $1$ | Variation explained by regression line |
| **$SSE$** | $\sum (y_i - \hat{y}_i)^2$ | $n - 2$ | Unexplained residual variation |
| **$MSE$ ($s^2$)** | $SSE / (n - 2)$ | $n - 2$ | Unbiased estimator of error variance $\sigma^2$ |
| **Std Error ($s_e$)** | $\sqrt{MSE}$ | — | Standard error of regression estimate |

> **Q:** In simple linear regression with positive slope $b_1 > 0$, the correlation coefficient $r_{xy}$ equals = **$+\sqrt{R^2}$** ✓
> **Q:** An $R^2$ value of $0.65$ indicates that = **65% of the total variation in $Y$ is explained by the regression line with $X$** ✓
> **Q:** In testing $H_0: \beta_1 = 0$, the relationship between $t$-statistic and ANOVA $F$-statistic is = **$F = t^2$ (both yield identical $P$-values)** ✓
> **Q:** Standardized residuals under normality are expected to fall within $[-2, +2]$ approximately = **95% of the time** ✓
> **Q:** A funnel / fan shape in a residual plot indicates = **Heteroscedasticity (non-constant error variance)** ✓
> **Q:** A data point that substantially changes the estimated slope and intercept when removed is an = **Influential Observation** ✓

---

### SLR Exam Numerical Problems

**Q5 (Exam_Oct25_Q20):** In an SLR model with $n=10$ observations, $\sum (X_i - \bar{X})(Y_i - \bar{Y}) = 2840$, $\sum (X_i - \bar{X})^2 = 568$, $\sum (Y_i - \bar{Y})^2 = 15730$, $\bar{X} = 16$, $\bar{Y} = 134$. Find least squares intercept $b_0$.

> *Why: Compute OLS slope and intercept from sample summary deviations.*
> $b_1 = \frac{\sum (X_i - \bar{X})(Y_i - \bar{Y})}{\sum (X_i - \bar{X})^2} = \frac{2840}{568} = 5.0$
> $b_0 = \bar{Y} - b_1 \bar{X} = 134 - (5.0)(16) = 134 - 80 = 54$
> **Answer = 54** ✓

**Q6 (Exam_Jan25_Q236144719):** Using the same dataset ($n=10, b_0=54, b_1=5$), find the expected value of $Y$ when $X = 20$.

> *Why: Plug $X$ into estimated sample regression line $\hat{Y} = b_0 + b_1 X$.*
> $\hat{Y} = 54 + 5(20) = 54 + 100 = 154$
> **Answer = 154** ✓

**Q7 (Exam_Jan25_Q236144720):** Using the same dataset ($SS_{xy}=2840, SS_{xx}=568, SS_{yy}=15730$), find the percentage of variation in $Y$ attributed to $X$.

> *Why: Calculate coefficient of determination $R^2 = \frac{(SS_{xy})^2}{SS_{xx} \cdot SS_{yy}}$.*
> $R^2 = \frac{2840^2}{568 \times 15730} = \frac{8,065,600}{8,934,640} = 0.9027 \approx 0.90$
> **Answer = 0.9** ✓

**Q8 (Exam_Oct25_Q21 / Exam_May25_Q19):** In an SLR model, $SSR = 14200, SSE = 1530, MSE = 191.25$. Find: (i) $R^2$, (ii) Total sample size $n$, (iii) Standard error of regression $s_e$.

> *Why: Connecting sum of squares, MSE degrees of freedom, and standard error in SLR.*
> (i) $SST = SSR + SSE = 14200 + 1530 = 15730 \implies R^2 = \frac{14200}{15730} \approx 0.9027 \approx 0.90$
> (ii) $MSE = \frac{SSE}{n - 2} \implies 191.25 = \frac{1530}{n - 2} \implies n - 2 = \frac{1530}{191.25} = 8 \implies n = 10$
> (iii) $s_e = \sqrt{MSE} = \sqrt{191.25} \approx 13.83 \implies \text{Falls between 10 and 20}$
> **Answer: $R^2 = 0.90$, $n = 10$, Standard Error is between 10 and 20** ✓

**Q9 (Exam_Jan25_Q236144721):** In an SLR model, $SSR = 2530.2, SSE = 2270.7, MSE = 227.1$. Find total observations $n$.

> *Why: In SLR, degrees of freedom for error is $n - 2$.*
> $MSE = \frac{SSE}{n - 2} \implies 227.1 = \frac{2270.7}{n - 2} \implies n - 2 = \frac{2270.7}{227.1} = 10 \implies n = 12$
> **Answer = 12** ✓

**Q10 (Exam_Oct25_Q22 / Exam_May25_Q21):** SLR model with $n=12$ points: $\sum (X-\bar{X})(Y-\bar{Y}) = -997.1$, $\sum (X-\bar{X})^2 = 392.9$, $\sum (Y-\bar{Y})^2 = 4800.9$, $\bar{X} = 28.6$, $\bar{Y} = 227.6$. Find (i) $b_0$, (ii) Expected $Y$ when $X = 30$.

> *Why: Negative slope SLR parameter calculation and conditional expectation.*
> $b_1 = \frac{-997.1}{392.9} = -2.5378$
> (i) $b_0 = \bar{Y} - b_1 \bar{X} = 227.6 - (-2.5378 \times 28.6) = 227.6 + 72.58 = 300.18 \approx 300.1$
> (ii) For $X = 30$: $\hat{Y} = 227.6 + (-2.5378)(30 - 28.6) = 227.6 - 2.5378(1.4) = 227.6 - 3.55 = 224.05 \approx 224$
> **Answer: $b_0 = 300.1$, Expected $Y = 224$** ✓

**Q11 (Quiz_7 / Quiz_8):** (a) If $SST = 1500, SSE = 100$, find $R^2$. (b) If $SST = 2900, SSR = 2400$, find correlation coefficient $r$.

> *Why: Fundamental identities linking SST, SSR, SSE, $R^2$, and $r$.*
> (a) $SSR = SST - SSE = 1500 - 100 = 1400 \implies R^2 = \frac{1400}{1500} = 0.933 \approx 0.93$
> (b) $R^2 = \frac{2400}{2900} = 0.8276 \implies |r| = \sqrt{0.8276} \approx 0.9097 \approx 0.91$
> **Answer: (a) $R^2 = 0.93$, (b) $r = 0.91$** ✓

---

## MODULE 3: Multiple Linear Regression - 1 (MLR)

---

### MLR Model Specification & Partial Coefficients

$$Y_i = \beta_0 + \beta_1 X_{1i} + \beta_2 X_{2i} + \dots + \beta_p X_{pi} + \epsilon_i \implies \hat{Y} = b_0 + b_1 X_1 + \dots + b_p X_p$$

- **Partial Regression Slope ($b_j$):** Estimated change in $E(Y)$ per unit increase in $X_j$, **holding all other independent variables constant** (*ceteris paribus*).
- **Geometric Surface:** For $p=2$, the response surface is a **flat plane in 3D space**; for $p>2$, a hyperplane.

> **Q:** In the model $\hat{y} = 355.68 + 71.16x_1 + 339.9x_2$ ($x_1=\text{income}, x_2=\text{size}$), interpret $b_1 = 71.16$ = **A ₹1 lakh increase in annual income is associated with an estimated ₹71.16 increase in monthly spending, holding household size constant** ✓
> **Q:** Model A has low training error but high validation error; Model B has balanced errors across both. Which is preferred? = **Model B, because consistent performance indicates lower variance and better generalisation (avoids overfitting)** ✓
> **Q:** The method used to estimate coefficients in Multiple Linear Regression is = **Ordinary Least Squares (OLS) / Least Squares Estimation** ✓
> **Q:** Standard Gauss-Markov error assumption in MLR = **$\epsilon \sim N(0, \sigma^2)$ (Normal distribution with zero mean and constant variance $\sigma^2$)** ✓

---

### Variation Partitioning, Adjusted $R^2$, and Model Testing

$$\text{Partitioning: } SST = SSR + SSE \quad \text{with } DF: (n - 1) = p + (n - p - 1)$$

$$R^2 = \frac{SSR}{SST} = 1 - \frac{SSE}{SST}, \quad R^2_{\text{adj}} = 1 - \left[ (1 - R^2)\left(\frac{n - 1}{n - p - 1}\right) \right] = 1 - \frac{MSE}{SST / (n - 1)}$$

| Test | Null Hypothesis ($H_0$) | Test Statistic Formula | Degrees of Freedom | Scope |
|---|---|---|---|---|
| **Overall $F$-Test** | $\beta_1 = \beta_2 = \dots = \beta_p = 0$ | $F = \frac{MSR}{MSE} = \frac{SSR / p}{SSE / (n - p - 1)}$ | $df_1 = p, \; df_2 = n - p - 1$ | Tests entire model simultaneously |
| **Individual $t$-Test** | $\beta_j = 0$ | $t = \frac{b_j}{SE(b_j)}$ | $df = n - p - 1$ | Tests marginal contribution of $X_j$ |

> **Q:** Why is Adjusted $R^2$ preferred over $R^2$ when evaluating models with multiple predictors? = **$R^2$ artificially increases whenever any variable is added, whereas Adjusted $R^2$ penalizes non-informative predictors** ✓
> **Q:** An MLR model with $n=55, p=4$ has error degrees of freedom equal to = **$55 - 4 - 1 = 50$** *(SSR has $DF = 4$)* ✓
> **Q:** The overall $F$-test has $P\text{-value} = 0.018 < 0.05$. What is the conclusion? = **Reject $H_0$; there is statistically significant evidence that at least one coefficient $\beta_j \neq 0$** ✓
> **Q:** The $t$-statistic for testing an individual coefficient $\beta_j$ in MLR follows a $t$-distribution with = **$n - p - 1$ degrees of freedom** ✓

---

### Multicollinearity & Diagnostics

- **Multicollinearity Symptoms ($|r| > 0.70$):**
  - High overall model significance ($F$-statistic is large with significant $P$-value).
  - Inflated standard errors $SE(b_j)$ leading to statistically insignificant individual $t$-tests.
  - Counter-intuitive, unstable, or wrong coefficient signs.

- **Rule of Thumb:** Pairwise correlation $|r_{x_i, x_j}| > 0.70$ signals potential multicollinearity.
- **Remedy:** Remove one of the redundant, highly correlated independent variables.

> **Q:** Monthly income ($x_1$) and annual income ($x_2$) have $r = 0.83$. Overall $F$-test is significant, but $t$-test for $x_1$ is not significant. Why? = **Due to multicollinearity, monthly income provides redundant explanatory value once annual income is included** ✓
> **Q:** What is the primary technique used to address multicollinearity in MLR? = **Remove one of the highly correlated independent variables** ✓
> **Q:** In an MLR residual plot, a pronounced U-shaped curve against predicted $\hat{Y}$ indicates = **The linear model fails to capture a non-linear relationship (functional form misspecification)** ✓
> **Q:** Heteroscedastic residuals in MLR cause = **Biased standard errors, making $t$-tests and confidence intervals unreliable** ✓

---

### MLR Exam Numerical Problems

**Q12 (Exam_Oct25_Q23):** MLR model with $n=20$ observations, $p=4$ predictors ($x_1, x_2, x_3, x_4$). Regression standard error $s_e = 72.61$, $SSR = 422975.2$. Find Multiple $R$.

> *Why: Reconstructing ANOVA table from regression standard error and SSR.*
> $MSE = s_e^2 = (72.61)^2 = 5272.21$
> $df_{\text{error}} = n - p - 1 = 20 - 4 - 1 = 15$
> $SSE = MSE \times df_{\text{error}} = 5272.21 \times 15 = 79083.18$
> $SST = SSR + SSE = 422975.2 + 79083.18 = 502058.38$
> $R^2 = \frac{SSR}{SST} = \frac{422975.2}{502058.38} = 0.84248$
> $\text{Multiple } R = \sqrt{R^2} = \sqrt{0.84248} = 0.9178 \approx 0.917$
> **Answer = 0.917** ✓

**Q13 (Exam_Oct25_Q24 / Exam_Jan25_Q23 / Exam_May25_Q23):** MLR with $n=31$ observations, $p=4$ variables ($x_1, x_2, x_3, x_4$). $SST = 760, MSR = 125$. Standard errors: $SE = [8, 48, 36, 2]$. $t$-stats: $t = [1.5, 0.5, -1.0, 8.0]$. Find: (i) $b_1$, (ii) $b_2$, (iii) $b_3$, (iv) Multiple $R$, (v) Adjusted $R^2$.

> *Why: Exploit $t_j = \frac{b_j}{SE(b_j)} \implies b_j = t_j \times SE(b_j)$, and build $R^2$ and $R^2_{\text{adj}}$.*
> (i) $b_1 = t_1 \times SE(b_1) = 1.5 \times 8 = 12$
> (ii) $b_2 = t_2 \times SE(b_2) = 0.5 \times 48 = 24.0$
> (iii) $b_3 = t_3 \times SE(b_3) = -1.0 \times 36 = -36$
> (iv) $SSR = MSR \times p = 125 \times 4 = 500 \implies R^2 = \frac{500}{760} = 0.6579 \implies \text{Multiple } R = \sqrt{0.6579} \approx 0.811 \approx 0.81$
> (v) $R^2_{\text{adj}} = 1 - \left[(1 - 0.6579)\frac{31 - 1}{31 - 4 - 1}\right] = 1 - \left[0.3421 \times \frac{30}{26}\right] = 1 - 0.3947 = 0.6053 \approx 0.60$
> **Answer: $b_1 = 12, b_2 = 24.0, b_3 = -36, \text{Multiple } R = 0.81, R^2_{\text{adj}} = 0.60$** ✓

**Q14 (Exam_Oct25_Q25):** MLR model with $n=56$ observations, $p=8$ predictors. $R^2 = 0.80, SSR = 4280$. Find $SST$.

> *Why: $R^2 = \frac{SSR}{SST} \implies SST = \frac{SSR}{R^2}$.*
> $SST = \frac{4280}{0.80} = 5350$
> **Answer = 5350** ✓

**Q15 (Exam_Jan25_Q24 / Exam_Jan25_Q25 / Exam_May25_Q24 / Exam_May25_Q25):** MLR model with $n=18$ observations, $p=4$ predictors. $R^2 = 0.36$, regression standard error $s_e = 4.8$. Find: (i) $MSE$, (ii) $SSE$, (iii) $MSR$, (iv) Overall $F$-statistic.

> *Why: Comprehensive ANOVA reconstruction from $R^2$ and standard error.*
> (i) $MSE = s_e^2 = (4.8)^2 = 23.04$
> (ii) $df_{\text{error}} = 18 - 4 - 1 = 13 \implies SSE = MSE \times 13 = 23.04 \times 13 = 299.52 \approx 299$
> (iii) $R^2 = \frac{SSR}{SSR + SSE} \implies 0.36 = \frac{SSR}{SSR + 299.52} \implies 0.64(SSR) = 0.36(299.52) = 107.8272 \implies SSR = 168.48$
> $MSR = \frac{SSR}{p} = \frac{168.48}{4} = 42.12 \approx 42$
> (iv) $F_{\text{calc}} = \frac{MSR}{MSE} = \frac{42.12}{23.04} = 1.828 \approx 1.8$
> **Answer: $MSE = 23.04, SSE = 299, MSR = 42, F = 1.8$** ✓

**Q16 (CLA_M3_Q3):** MLR model with $n=55, p=2, R^2=0.80$. Compute Adjusted $R^2$.

> *Why: Calculate $R^2_{\text{adj}} = 1 - (1 - R^2)\frac{n-1}{n-p-1}$.*
> $R^2_{\text{adj}} = 1 - (1 - 0.80)\frac{54}{52} = 1 - 0.20(1.03846) = 1 - 0.20769 = 0.7923 \approx 0.793$
> **Answer = 0.793** ✓

**Q17 (Quiz_9):** MLR model with $n=15, p=2, SSR=100, SSE=50$. Compute the $F$-statistic.

> *Why: Calculate $MSR, MSE$ and compute ratio $F = MSR / MSE$.*
> $MSR = \frac{100}{2} = 50, \quad MSE = \frac{50}{15 - 2 - 1} = \frac{50}{12} = 4.167 \implies F = \frac{50}{4.167} = 12.0$
> **Answer = Between 10 and 15 (F = 12)** ✓

---

## MODULE 4: Multiple Linear Regression - 2 (Categorical, Interaction, and OVB)

---

### Categorical Dummies & Parallel Regression Lines

- **$(k - 1)$ Dummy Rule:** A qualitative variable with $k$ categories requires **exactly $k - 1$ binary ($0/1$) dummy variables** when an intercept is present (omitting one avoids the dummy variable trap).
- **Baseline Interpretation:** Intercept $b_0$ represents the baseline group mean ($X_d = 0$). Each dummy coefficient $b_d$ measures the differential shift in $E(Y)$ relative to baseline, *ceteris paribus*.
- **Additive Dummies (No Interactions):** Generates **parallel lines / hyperplanes** (identical slopes, different intercepts).

- **Additive Dummy Model Form:**
  - $\text{Baseline Group } (D = 0): \hat{Y} = b_0 + b_1 X_1$
  - $\text{Category 1 } (D = 1): \hat{Y} = (b_0 + b_d) + b_1 X_1$
  - *Note:* Both lines share the exact same slope $b_1$ and are parallel, separated vertically by the shift $b_d$.

> **Q:** If a categorical variable has 5 distinct categories, how many dummy variables must be defined? = **4** ✓
> **Q:** A regression model includes a binary dummy coded 1 for "Yes" and 0 for "No", with coefficient $5.2$ ($P < 0.001$). Interpretation = **On average, the "Yes" group has a $Y$ value 5.2 units higher than the "No" group, holding other variables constant** ✓
> **Q:** How should categorical variables be included in Multiple Linear Regression? = **Use dummy variables (0 or 1) to represent each category** ✓
> **Q:** In a multiple regression with 3 predictors and $n=25$, why is MSE calculated dividing SSE by 21? = **Degrees of freedom are reduced by $p+1 = 4$ estimated parameters ($n - p - 1 = 25 - 4 = 21$)** ✓

---

### Interaction Terms & Moderation Models

An **interaction variable** is formed by multiplying a continuous predictor with a dummy variable: $X_1 \cdot X_2$.

$$\hat{Y} = b_0 + b_1 X_1 + b_2 X_2 + b_3 (X_1 X_2)$$

| Group | Dummy ($X_2$) | Regression Equation | Effective Intercept | Effective Slope wrt $X_1$ |
|---|:---:|---|:---:|:---:|
| **Baseline Group** | $X_2 = 0$ | $\hat{Y} = b_0 + b_1 X_1$ | $b_0$ | $b_1$ |
| **Comparison Group** | $X_2 = 1$ | $\hat{Y} = (b_0 + b_2) + (b_1 + b_3) X_1$ | $b_0 + b_2$ | $b_1 + b_3$ |

- **Moderation Variable:** $X_2$ moderates the effect of $X_1$ on $Y$, producing **non-parallel regression lines** (different slopes).
- **Linearity:** The model remains a **linear regression model** because it is linear in parameters $\beta_0, \beta_1, \beta_2, \beta_3$.

> **Q:** What does an interaction variable in Multiple Linear Regression represent? = **A product of two independent variables used to test whether the effect of one variable depends on the level of another (moderation)** ✓
> **Q:** A regression model with an interaction term $X_1 X_2$ is considered non-linear = **FALSE** *(It is strictly linear in parameters $\beta$)* ✓

---

### Omitted Variable Bias (OVB) Resolution

- **Omitted Variable Bias Conditions (Variable $Z$):**
  - **Condition 1:** $Z$ is correlated with the response variable $Y$ ($r_{zy} \neq 0$).
  - **Condition 2:** $Z$ is correlated with the included predictor $X$ ($r_{zx} \neq 0$).

- **OVB Effects:** Biased slope estimates ($b_1$), deflated $R^2$, inflated standard error ($s_e$).
- **Resolution:** Adding the omitted variable restores unbiased slope coefficients, increases $R^2$, and sharply reduces $s_e$.

> **Q:** Simple regression of $Y$ on $X_1$ yields $R^2 = 0.25$. Adding $X_2$ raises $R^2$ to $0.78$. Most likely explanation = **$X_1$ alone was suffering from omitted variable bias, absorbing the effect of the excluded $X_2$** ✓
> **Q:** Which situation leads to omitted variable bias in regression? = **An important variable that influences both the dependent variable and an included predictor is excluded** ✓
> **Q:** A regression model's Adjusted $R^2$ is very close to $R^2$ across variations. This suggests = **The added independent variables contribute genuine explanatory power rather than artificially inflating $R^2$** ✓
> **Q:** In an ANOVA table for MLR, $MSR = 1200, MSE = 40$. What is $F$ and what does a small $P$-value imply? = **$F = 30$; we reject the null hypothesis that all slope coefficients are simultaneously zero** ✓

---

### Module 4 Applied Case Problems

**Q18 (Chroma Computer Satisfaction - Basaraju):** $n = 36$ computers. Model with Price ($X_1$, Lakhs) and Brand ($X_2 = 1$ if Lenovo, $0$ if Dell): $\hat{Y} = 46.83 + 1.29 X_1 + 3.93 X_2$. $R^2 = 0.45, s = 4.85, SE(b_2) = 1.63$. Interpret $b_2$ and derive separate equations.

> *Why: Interpreting binary dummy variable shifts in parallel regressions.*
> $\text{Dell } (X_2 = 0): \hat{Y}_{\text{Dell}} = 46.83 + 1.29 X_1$
> $\text{Lenovo } (X_2 = 1): \hat{Y}_{\text{Lenovo}} = (46.83 + 3.93) + 1.29 X_1 = 50.76 + 1.29 X_1$
> $t_{\text{brand}} = \frac{3.93}{1.63} = 2.41 \implies P < 0.05 \implies \text{Significant}$
> **Answer = For the same price, Lenovo computers achieve an estimated 3.93 points higher satisfaction than Dell** ✓

**Q19 (IIIT Dharwad Salary Interaction Model - Jyothi Hegde):** $n = 30$ graduates. Model: $\hat{Y} = 13450.2 - 7771.68 X_1 + 293.8 X_2 - 241.6 (X_1 X_2)$, where $X_1 = 1$ (Women), $0$ (Men) and $X_2 = \text{Experience (months)}$. Derive equations and marginal returns.

> *Why: Sub-group decomposition of interaction regression models.*
> $\text{Men } (X_1 = 0): \hat{Y}_{\text{Men}} = 13450.2 + 293.8 X_2 \implies \text{Marginal return } = \text{₹}293.80/\text{month}$
> $\text{Women } (X_1 = 1): \hat{Y}_{\text{Women}} = (13450.2 - 7771.68) + (293.8 - 241.6) X_2 = 5678.52 + 52.20 X_2 \implies \text{Marginal return } = \text{₹}52.20/\text{month}$
> **Answer = Men gain ₹293.80/month of experience while Women gain ₹52.20/month (Gender moderates salary returns)** ✓

---

## Quick Reference: Decision Table

| Diagnostic / Scenario | Observable Indicator | Correct Statistical Decision / Action |
|---|---|---|
| **Compare $K \ge 2$ Group Means** | Continuous $Y$, Categorical $X$ | Use **One-Way ANOVA** ($F = MSTr / MSE$) |
| **Test Categorical Distribution Fit** | $K$ categories, sample counts | Use **Chi-Square GOF** ($\chi^2 = \sum \frac{(O-E)^2}{E}$, all $E_i \ge 5$) |
| **Linear Association Strength** | Two continuous variables | Use **Pearson Correlation $r_{xy} \in [-1, +1]$** |
| **Model Fit with $p$ Predictors** | Comparing different sized models | Evaluate **Adjusted $R^2$** (never rely on $R^2$ alone) |
| **Multicollinearity Warning** | Pairwise $|r| > 0.70$, high $F$, low $t$ | **Drop redundant collinear predictor** |
| **Categorical Variable ($k$ levels)** | Qualitative predictor in MLR | Create **$k - 1$ dummy variables** with 1 baseline |
| **Moderation / Varying Slopes** | Effect of $X_1$ depends on $X_2$ | Include **Interaction Term $(X_1 \cdot X_2)$** |
| **Curved Residual Pattern** | Residuals vs $\hat{Y}$ display U-shape | **Modify functional form** (add non-linear / quadratic terms) |
| **Funnel Residual Pattern** | Residual spread grows with $\hat{Y}$ | Signals **Heteroscedasticity**; transform dependent variable |

---

## Key Decision Rules Summary

| Rule Name | Mathematical Formula / Criterion | Operational Takeaway |
|---|---|---|
| **ANOVA Null Hypothesis** | $H_0: \mu_1 = \mu_2 = \dots = \mu_K$ | Tests equality of all population means simultaneously |
| **ANOVA Alternative Hypothesis** | $H_A: \text{Not all means are equal}$ | At least one pair differs (does NOT mean all are distinct) |
| **ANOVA Variance Identity** | $SST = SSTr + SSE$ | Total variance partitions additively |
| **MSE Unbiasedness** | $MSE = SSE / (N_T - K)$ | **ALWAYS** unbiased estimate of $\sigma^2$ |
| **SLR Slope Formula** | $b_1 = SS_{xy} / SS_{xx}$ | Marginal change in $Y$ per unit change in $X$ |
| **SLR Intercept Formula** | $b_0 = \bar{Y} - b_1 \bar{X}$ | Valid only within observed training data range |
| **ANOVA in SLR Identity** | $F_{\text{calc}} = (t_{\text{calc}})^2$ | $F$-test and $t$-test on slope yield identical results |
| **MLR Error Degrees of Freedom** | $df_{\text{error}} = n - p - 1$ | Deducts $p$ slope parameters + 1 intercept parameter |
| **Adjusted $R^2$ Calculation** | $R^2_{\text{adj}} = 1 - (1 - R^2)\left(\frac{n-1}{n-p-1}\right)$ | Penalizes model complexity; decreases if predictor is useless |
| **Individual $t$-Test in MLR** | $t = b_j / SE(b_j)$ | Evaluates marginal contribution holding other predictors fixed |
| **Dummy Variable Count** | $k - 1$ dummies for $k$ categories | Prevents perfect multicollinearity (dummy variable trap) |
| **Standardized Residual Outlier** | $|z_{e_i}| = |e_i / s_e| > 2$ (or $> 3$) | Identifies potential outliers (~95% expected in $[-2, +2]$) |

---

## RAPID-FIRE: Most Repeated Q&A Patterns

| Question Keyword / Concept Stem | Direct Exam Answer |
|---|---|
| Primary objective of One-Way ANOVA | **Determine if differences among sample means indicate $\ge 1$ population mean differs** ✓ |
| Why called Analysis of Variance? | **Assesses mean differences by analyzing within-group and between-group variance** ✓ |
| ANOVA $H_A$ interpretation | **At least one population mean differs (NOT all means are different)** ✓ |
| Quantity always unbiased for $\sigma^2$ | **Mean Square Error (MSE)** ✓ |
| Chi-Square GOF $E_i \ge 5$ applies to | **Expected frequencies ($E_i$) only** ✓ |
| Correlation $r = 0$ implies | **No LINEAR relationship exists (non-linear relationship may exist)** ✓ |
| Linearity in regression defined with respect to | **Regression parameters ($\beta$), NOT variables** ✓ |
| OLS optimization criterion | **Minimize Sum of Squared Residuals ($\sum e_i^2 = SSE$)** ✓ |
| Standardized residuals normal bounds | **~95% lie within $[-2, +2]$** ✓ |
| Funnel shape in residual plot | **Heteroscedasticity (non-constant variance)** ✓ |
| Curved / U-shape in residual plot | **Non-linear relationship / functional form misspecification** ✓ |
| High overall $F$, non-significant $t$-tests | **Multicollinearity (predictors correlated with each other)** ✓ |
| Threshold rule of thumb for multicollinearity | **Pairwise correlation $|r| > 0.70$** ✓ |
| Adding predictors to MLR model | **$R^2$ never decreases; Adjusted $R^2$ may increase or decrease** ✓ |
| Number of dummies for $k$ categories | **$k - 1$ dummy variables** ✓ |
| Interpretation of dummy coefficient $b_d$ | **Differential mean shift relative to baseline category, ceteris paribus** ✓ |
| Purpose of interaction term ($X_1 \cdot X_2$) | **Tests moderation (allows slope of $X_1$ to vary across categories of $X_2$)** ✓ |
| Low $R^2$ jumping drastically when adding $X_2$ | **Omitted Variable Bias (OVB) in the original single-variable model** ✓ |