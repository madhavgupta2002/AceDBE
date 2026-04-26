# ***Business Statistics for Entrepreneurs - II***
# Module 1: Distributions Related to Normal

## 1.1 Recap of Course: Business Statistics for Entrepreneurs - 1
### Continuous Probability Distributions
*   Continuous random variables can take any fractional value within an interval.
*   Probabilities are calculated as areas under the **Probability Density Function (PDF)**.
*   **Normal Distribution**: A symmetric, bell-shaped distribution parameterized by Mean ($\mu$) and Standard Deviation ($\sigma$).
*   **Standard Normal Distribution ($Z$)**: A special case of the normal distribution where $\mu = 0$ and $\sigma = 1$. Used to standardize normal variables via $Z = \frac{X - \mu}{\sigma}$.
*   **Normal Approximation to Binomial**: The continuous normal distribution can approximate the discrete binomial distribution under certain conditions.

## 1.2 Linear Combinations of Normal Random Variables
### 1.2.1 General Properties
*   A fundamental property of the normal distribution is that **linear combinations of normal random variables are also normally distributed**.
*   If $X_1, X_2, \dots, X_n$ are normal random variables, and $a_1, a_2, \dots, a_n$ and $b$ are constants, the new variable $Y = a_1X_1 + a_2X_2 + \dots + a_nX_n + b$ is normally distributed.
*   **Expected Value (Mean)**: 
    $$E(Y) = a_1E(X_1) + a_2E(X_2) + \dots + a_nE(X_n) + b$$
*   **Variance (If Independent)**: 
    $$Var(Y) = a_1^2Var(X_1) + a_2^2Var(X_2) + \dots + a_n^2Var(X_n)$$
*   **Variance (If Dependent/Correlated)**: 
    Covariance terms must be added: $2a_ia_jCov(X_i, X_j)$. 

### 1.2.2 Special Cases of Linear Combinations
| Scenario | Formula Definition | Expected Value | Variance | Standard Deviation |
| :--- | :--- | :--- | :--- | :--- |
| **Single Variable Shift/Scale** | $Y = aX + b$ | $a\mu + b$ | $a^2\sigma^2$ | $\|a\|\sigma$ |
| **Standardization ($Z$)** | $Y = \frac{1}{\sigma}X - \frac{\mu}{\sigma}$ | $0$ | $1$ | $1$ |
| **Sum of Two Variables** | $Y = X_1 + X_2$ | $\mu_1 + \mu_2$ | $\sigma_1^2 + \sigma_2^2$ | $\sqrt{\sigma_1^2 + \sigma_2^2}$ |
| **Difference of Two Variables** | $Y = X_1 - X_2$ | $\mu_1 - \mu_2$ | $\sigma_1^2 + \sigma_2^2$ | $\sqrt{\sigma_1^2 + \sigma_2^2}$ |
| **Sum of $n$ i.i.d. Variables** | $Y = \sum X_i$ | $n\mu$ | $n\sigma^2$ | $\sqrt{n}\sigma$ |
| **Average of $n$ i.i.d. Variables** | $\bar{X} = \frac{\sum X_i}{n}$ | $\mu$ | $\frac{\sigma^2}{n}$ | $\frac{\sigma}{\sqrt{n}}$ |

*   **Averaging Effect**: As sample size $n$ increases, the variance of the sample average $\bar{X}$ decreases, causing values to cluster closer to the mean $\mu$.

## 1.3 Chi-Square Distribution
### 1.3.1 Definition and Parameters
*   Defined as the **sum of the squares of $n$ independent standard normal variables** ($Z_1^2 + Z_2^2 + \dots + Z_n^2$).
*   It is a single-parameter distribution defined entirely by its **Degrees of Freedom ($k$)**.
*   **Notation**: $\chi^2_k$

### 1.3.2 Properties
*   Defined **only for positive values** ($X \ge 0$).
*   **Mean**: $k$ (equals the degrees of freedom).
*   **Variance**: $2k$ (equals twice the degrees of freedom).
*   **Shape**: As $k$ increases, the distribution becomes less skewed and converges to a normal/bell-shaped distribution (due to the Central Limit Theorem).
*   **Applications**: Non-parametric hypothesis tests, Goodness of Fit tests, feature selection, and logistic regression.

## 1.4 Student's t Distribution
### 1.4.1 Definition and Parameters
*   Defined as the ratio of a standard normal random variable ($Z$) to the square root of an independent Chi-Square random variable divided by its degrees of freedom ($k$).
    $$t = \frac{Z}{\sqrt{\chi^2 / k}}$$
*   Named after William Sealy Gosset, who published under the pseudonym "Student".

### 1.4.2 Properties
*   **Shape**: Symmetric, bell-shaped curve centered at zero (similar to the standard normal distribution).
*   **Tails**: Flatter and with heavier tails compared to the standard normal distribution.
*   **Mean**: $0$ (for $k > 1$).
*   **Variance**: $\frac{k}{k-2}$ (for $k > 2$).
*   **Convergence**: As degrees of freedom ($k$) approaches infinity, the t-distribution converges to the Standard Normal Distribution ($Z$). Critical values decrease towards $Z$ critical values as $k$ increases.
*   **Applications**: Hypothesis tests for population means (especially small sample sizes), comparing means of two populations, and linear regression diagnostics.

## 1.5 F-Distribution
### 1.5.1 Definition and Parameters
*   Defined as the **ratio of two independent Chi-Square random variables**, each divided by their respective degrees of freedom.
    $$F_{k_1, k_2} = \frac{\chi^2_1 / k_1}{\chi^2_2 / k_2}$$
*   **Parameters**: Requires two degrees of freedom: 
    *   $k_1$: Numerator degrees of freedom.
    *   $k_2$: Denominator degrees of freedom.
*   *Note*: Reversing the degrees of freedom ($F_{k_2, k_1}$) changes the distribution completely.

### 1.5.2 Properties
*   Defined **only for positive values**.
*   **Shape**: Unimodal, right-skewed with a long right-hand tail.
*   **Mean**: $\frac{k_2}{k_2 - 2}$ (for $k_2 \ge 2$).
*   **Standard Deviation**: Decreases as $k_2$ increases. As both $k_1$ and $k_2$ increase, the probability density function spikes sharply around the value of 1.
*   **Applications**: Analysis of Variance (ANOVA), testing overall fitness of multiple linear regression models, and feature selection in machine learning.

## 1.6 Solved Examples
### 1.6.1 Inverse Calculations on Normal Distribution
*   **Finding Unknown $\sigma$**: Given $\mu = 658$ and $P(X \le 610) = 0.03$. Find $Z$ for $0.03$ (which is $-1.88$). Use $Z = \frac{X - \mu}{\sigma} \implies -1.88 = \frac{610 - 658}{\sigma}$ to solve for $\sigma = 25.52$.
*   **Finding Unknown $\mu$**: Given $\sigma = 0.05$ and $P(X \ge 11.9) = 0.995$. Find $Z$ for upper tail $0.995$ (which is $-2.57$). Use $-2.57 = \frac{11.9 - \mu}{0.05}$ to solve for $\mu = 12.03$.

### 1.6.2 Linear Combinations in Practice
*   **Sum of Variables (Inventory)**: Demand over 3 weeks ($X_1, X_2, X_3$) where $Y = X_1 + X_2 + X_3$. 
    *   $Mean = \mu_1 + \mu_2 + \mu_3$. 
    *   $Variance = \sigma_1^2 + \sigma_2^2 + \sigma_3^2$.
*   **Difference of Variables (Gap Analysis)**: Cylinder radius ($X_2$) minus Piston radius ($X_1$). Gap $Y = X_2 - X_1$.
    *   $Mean = \mu_2 - \mu_1$. 
    *   $Variance = \sigma_1^2 + \sigma_2^2$ (Variances always **add**, even when subtracting variables).
*   **Average of Variables ($\bar{X}$)**: For 20 plants with individual variance $\sigma^2 = 4.41$, the variance of the average height is $\frac{\sigma^2}{n} = \frac{4.41}{20} = 0.2205$. 

### 1.6.3 Finding Critical Values using Tables
*   **Chi-Square**: Use degrees of freedom (rows) and the specific upper tail probability (columns) to find critical value $\chi^2_{\alpha, k}$.
*   **Student's t**: Use degrees of freedom and upper tail probability. **Leverage symmetry**: If lower tail $0.05$ is needed, find upper tail $0.05$ value and attach a negative sign ($-t_{\alpha, k}$). 
*   **F-Distribution**: Ensure correct matching of Numerator ($k_1$) and Denominator ($k_2$) degrees of freedom to the correct alpha-level table. 

---

## Quick Revision Summary
- **Linear Combinations**: The sum/difference of independent normal variables is normal. Means add/subtract algebraically, but **variances always add**.
- **Averages ($\bar{X}$)**: Variance shrinks by $n$ ($Var = \frac{\sigma^2}{n}$). Standard deviation shrinks by $\sqrt{n}$. 
- **Chi-Square ($\chi^2$)**: Sum of squared Standard Normal variables. Positive values only. Mean = $k$, Variance = $2k$.
- **Student’s t**: Ratio of Standard Normal to $\sqrt{\chi^2/k}$. Symmetric, zero mean, heavy tails. Approaches Standard Normal ($Z$) as $k \to \infty$. 
- **F-Distribution**: Ratio of two Chi-Square variables divided by their degrees of freedom ($k_1, k_2$). Right-skewed, positive values only. Mean approaches 1 as $k_2$ increases.
- **Symmetry Rule**: Normal and Student's t distributions are symmetric around zero. Chi-Square and F-distributions are NOT symmetric and exist strictly $\ge 0$.

# Module 2: Sampling and Sampling Distributions

## 2.1 Sampling Process
### Basic Definitions
*   **Sampling:** The process of selecting a subset of observations from a population to make inferences about population parameters.
*   **Element:** An entity for which data is collected.
*   **Population:** The complete collection of all elements of interest.
*   **Sample:** A subset of the population used for analysis.

### Steps in the Sampling Process
1.  **Identify the Target Population:** Clearly define the boundaries and relevant parameters (e.g., age, gender, occupation).
2.  **Decide the Sampling Frame:** Identify the source or method used to list and access the elements of the target population (e.g., voter registration database).
3.  **Determine Sample Size ($n$):** Balance the cost/time constraints with the required precision and confidence levels.
4.  **Choose the Sampling Method:** Select the specific technique to extract the sample from the sampling frame.

## 2.2 Sampling Methods
### Probabilistic Sampling Methods
Elements are selected according to a known probability distribution. 
*   **Simple Random Sampling:** Every element has an equal probability of selection. Ideal for **homogeneous** populations. (e.g., using `RAND()` in Excel).
*   **Stratified Sampling:** The population is divided into mutually exclusive and collectively exhaustive groups (**strata**). Random sampling is performed within each stratum. Ideal for **heterogeneous** populations where individual strata are homogeneous. Sample size per stratum is proportional to its size in the population.
*   **Cluster Sampling:** The population is divided into separate groups (**clusters**). A random sample of clusters is selected, and all elements within chosen clusters are surveyed. Ideal when elements within a cluster are diverse/heterogeneous (a small-scale replica of the population). Often used in area sampling (e.g., city wards).

### Non-Probabilistic Sampling Methods
Elements are not selected based on known probabilities; highly prone to bias.
*   **Systematic Sampling:** Selecting a random starting point and then picking every $k^{th}$ element in the population list. Easier to execute than simple random sampling for large databases.
*   **Convenience Sampling:** Elements are chosen simply because they are easily accessible (e.g., surveying people at a specific traffic intersection).
*   **Judgment Sampling:** An expert or knowledgeable person selects elements they feel are most representative of the population.
*   **Voluntary Sampling:** Data is collected from individuals who volunteer to participate (e.g., online customer reviews). Highly biased towards extreme experiences.

| Method | Selection Basis | Best Used When |
| :--- | :--- | :--- |
| **Simple Random** | Equal probability | Population is homogeneous |
| **Stratified** | Random within defined strata | Population is heterogeneous; strata are homogeneous |
| **Cluster** | Random selection of entire groups | Clusters are diverse and mirror the population |
| **Systematic** | Every $k^{th}$ item after random start | List of population is readily available and large |

## 2.3 Analysis of Sample Data
### Parameters vs. Statistics
*   **Population Parameter:** A numerical characteristic of the entire population. Usually unknown.
    *   Mean = $\mu$
    *   Standard Deviation = $\sigma$
    *   Proportion = $p$
*   **Sample Statistic:** A numerical characteristic computed from sample data.
    *   Sample Mean = $\bar{x}$
    *   Sample Standard Deviation = $s$
    *   Sample Proportion = $\bar{p}$

### Point Estimation
*   A **point estimator** is a sample statistic used to estimate a population parameter.
*   $\bar{x}$ is the point estimator for $\mu$.
*   $s$ is the point estimator for $\sigma$.
*   $\bar{p}$ is the point estimator for $p$.
*   Point estimates are not unique; taking a different sample will yield a different point estimate.

## 2.4 Sampling Distribution
### Concept of Sampling Distribution
*   Because a sample statistic (like $\bar{x}$) changes with every different sample, it is a **random variable**.
*   The **Sampling Distribution** is the probability distribution of all possible values of a sample statistic over repeated sampling.

### Expected Value and Bias
*   **Expected Value of $\bar{x}$ ($E(\bar{x})$):** The mean of all possible values of $\bar{x}$ equals the population mean $\mu$.
    $$E(\bar{x}) = \mu$$
*   Because $E(\bar{x}) = \mu$, $\bar{x}$ is called an **unbiased estimator** of the population mean.

### Standard Error
*   The standard deviation of a point estimator is called the **Standard Error**. This differentiates it from the standard deviation of the population ($\sigma$).
*   **Standard Error of the Mean ($\sigma_{\bar{x}}$):** 
    $$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$$
*   *Key Insight:* As sample size ($n$) increases, the standard error decreases. Larger samples result in less variation and estimates that cluster closer to the true population mean.

## 2.5 Central Limit Theorem
### Definition and Condition
*   **Central Limit Theorem (CLT):** When selecting random samples of size $n$ from a population, the sampling distribution of the sample mean ($\bar{x}$) can be approximated by a **normal distribution** if the sample size is large.
*   This holds **regardless of the shape of the original population distribution** (whether skewed, uniform, etc.).
*   **Rule of Thumb:** A sample size of **$n \ge 30$** is considered large enough to apply the CLT.

### Standardizing the Sample Mean
*   Under the CLT, $\bar{x} \sim \text{Normal}(\mu, \frac{\sigma}{\sqrt{n}})$.
*   To find probabilities related to $\bar{x}$, convert to the Standard Normal Distribution ($Z$):
    $$Z = \frac{\bar{x} - \mu}{\sigma_{\bar{x}}} = \frac{\bar{x} - \mu}{\frac{\sigma}{\sqrt{n}}}$$

## 2.6 Sampling Distribution of Proportion
### Characteristics
*   The sample proportion $\bar{p}$ is calculated as $\frac{x}{n}$, where $x$ is the number of elements possessing a specific characteristic.
*   The underlying experiment follows a **Binomial Distribution** (success/failure).
*   **Expected Value ($E(\bar{p})$):** The sample proportion is an unbiased estimator of the population proportion.
    $$E(\bar{p}) = p$$

### Standard Error of Proportion
*   The standard deviation of the sampling distribution of $\bar{p}$ is the **Standard Error of Proportion ($\sigma_{\bar{p}}$)**:
    $$\sigma_{\bar{p}} = \sqrt{\frac{p(1-p)}{n}}$$

### Normal Approximation
*   If $n$ is large (specifically, $np \ge 5$ and $n(1-p) \ge 5$), the sampling distribution of $\bar{p}$ can be approximated by a normal distribution.
*   **Standardization Formula:**
    $$Z = \frac{\bar{p} - p}{\sigma_{\bar{p}}}$$

## 2.7 Distribution of Sample Variance
### Sample Variance Formula and Degrees of Freedom
*   **Sample Variance ($s^2$):** 
    $$s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$$
*   **Degrees of Freedom (DOF):** The denominator is $n - 1$ instead of $n$ because calculating $\bar{x}$ first "uses up" one degree of freedom. Only $n - 1$ data points are free to vary.

### Relationship to the Chi-Square Distribution
*   Unlike $\bar{x}$ and $\bar{p}$, the Central Limit Theorem does **not** allow us to assume $s^2$ is normally distributed.
*   **Assumption:** The population from which the sample is drawn must be **normally distributed**.
*   If the population is normal, the sample variance $s^2$ is related to the population variance $\sigma^2$ through the **Chi-Square ($\chi^2$) Distribution**:
    $$\frac{(n - 1)s^2}{\sigma^2} \sim \chi^2_{n-1}$$
*   The quantity $\frac{(n - 1)s^2}{\sigma^2}$ follows a chi-square distribution with **$n - 1$ degrees of freedom**.
*   This relationship is used to find probability intervals for sample variances and standard deviations.

---

## Quick Revision Summary
- **Target Population vs. Sample Frame:** The population is everyone of interest; the frame is the actual list used to draw the sample.
- **Unbiased Estimator:** A sample statistic whose expected value equals the actual population parameter (e.g., $E(\bar{x}) = \mu$, $E(\bar{p}) = p$).
- **Standard Error:** The standard deviation of a sampling distribution. It measures the precision of the point estimator and shrinks as sample size $n$ increases.
- **Central Limit Theorem (CLT):** $\bar{x}$ becomes normally distributed as $n \ge 30$, regardless of the population's shape.
- **Important Formulas:**
  - **Standard Error of Mean:** $\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$
  - **$Z$-score for Sample Mean:** $Z = \frac{\bar{x} - \mu}{\sigma / \sqrt{n}}$
  - **Standard Error of Proportion:** $\sigma_{\bar{p}} = \sqrt{\frac{p(1-p)}{n}}$
  - **$Z$-score for Proportion:** $Z = \frac{\bar{p} - p}{\sqrt{p(1-p)/n}}$
  - **Chi-Square Relation for Variance:** $\frac{(n-1)s^2}{\sigma^2} \sim \chi^2_{n-1}$ (requires normal population).

# Module 3: Confidence Intervals and Estimation

## 3.1 Properties of Point Estimator
A **point estimator** is a sample statistic (like $\bar{x}$, $\bar{p}$, or $s^2$) used to estimate an unknown population parameter ($\mu$, $p$, or $\sigma^2$). A reliable point estimator must possess four desirable properties:
*   **Unbiased**: The expected value of the sample statistic equals the population parameter being estimated ($E(\bar{x}) = \mu$). Over repeated sampling, estimation errors balance out to zero.
*   **Efficient**: When comparing two unbiased estimators, the one with the smaller **standard error** (lower variance) is relatively more efficient. For example, the sample mean is a more efficient estimator than the sample median.
*   **Consistent**: As the sample size ($n$) increases, the value of the point estimator tends to get closer to the true population parameter because the standard error decreases.
*   **Sufficient**: The estimator utilizes *all* available data points and information in the sample to compute the estimate (e.g., $\bar{x}$ includes all values, whereas the median ignores the magnitude of extreme values).

## 3.2 Sampling Error vs Non-sampling Errors
*   **Sampling Error**: The natural deviation between a sample statistic and the population parameter caused purely by the random selection process. It is unavoidable but can be reduced by increasing the sample size.
*   **Non-sampling Errors**: Errors introduced by flaws in study design or data collection that cause the sample to fail in representing the target population. Increasing sample size does *not* fix these errors.
    *   **Coverage Error**: Occurs when the sampling frame does not align with the target population (e.g., systematically excluding a specific demographic or competitor's customer base).
    *   **Non-response Error**: Occurs when segments of the target population are systematically over-represented or under-represented because they are more or less likely to participate (e.g., surveying only in-store customers while ignoring online buyers).
    *   **Measurement Error**: Occurs when data collection methods yield inaccurate responses due to ambiguous questions, confusing forms, lack of anonymity, or respondents providing deliberately incorrect answers.

## 3.3 Introduction to Confidence Interval
*   A **Confidence Interval (CI)** is a range of values constructed from sample data that is likely to contain the true population parameter.
*   **General Form**: $\text{Point Estimate} \pm \text{Margin of Error (E)}$
*   **Confidence Coefficient ($1 - \alpha$)**: The probability that the established interval will actually contain the population parameter (e.g., a $0.95$ coefficient equals a $95\%$ confidence level).
*   **The Trade-off**: Increasing the confidence level (e.g., from $90\%$ to $99\%$) widens the interval, making the estimate less precise. The optimal confidence level depends on the opportunity cost or risk associated with making an incorrect decision. 

## 3.4 Confidence Interval for Population Mean
### Case 1: Population Standard Deviation ($\sigma$) Known
*   When $\sigma$ is known (and $n \ge 30$ or the population is normal), the sampling distribution of $\bar{x}$ follows a standard normal distribution.
*   **Formula**: 
    $$ \bar{x} \pm Z_{\alpha/2} \left( \frac{\sigma}{\sqrt{n}} \right) $$
*   **Margin of Error ($E$)**: $Z_{\alpha/2} \left( \frac{\sigma}{\sqrt{n}} \right)$

### Case 2: Population Standard Deviation ($\sigma$) Unknown
*   In most practical scenarios, $\sigma$ is unknown and must be estimated using the sample standard deviation ($s$).
*   Replacing $\sigma$ with $s$ introduces extra variation, so the **Student’s t-distribution** is used instead of the $Z$-distribution.
*   **Formula**: 
    $$ \bar{x} \pm t_{\alpha/2, n-1} \left( \frac{s}{\sqrt{n}} \right) $$
*   **Degrees of Freedom ($df$)**: $n - 1$
*   *Note*: The $t$-distribution is flatter than the normal distribution but converges to standard normal as $n$ increases. 

## 3.5 Confidence Interval for Proportion
*   Used to estimate a population proportion ($p$) using a sample proportion ($\bar{p}$).
*   Assumes a large sample size so the binomial distribution can be approximated by the normal distribution.
*   **Formula**: 
    $$ \bar{p} \pm Z_{\alpha/2} \sqrt{ \frac{\bar{p}(1-\bar{p})}{n} } $$
*   **Margin of Error ($E$)**: $Z_{\alpha/2} \sqrt{ \frac{\bar{p}(1-\bar{p})}{n} }$

## 3.6 Confidence Interval for Variance
*   Used to establish intervals for population variance ($\sigma^2$) and population standard deviation ($\sigma$).
*   This calculation uses the **Chi-Square ($\chi^2$) distribution**, which is strictly positive and asymmetric.
*   Because of the asymmetry, the interval is *not* written as "Estimate $\pm$ Margin of Error". It uses distinct upper and lower critical values.
*   **Formula for Variance ($\sigma^2$)**:
    $$ \frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}} $$
*   To find the confidence interval for the **standard deviation ($\sigma$)**, simply take the square root of both the lower and upper limits of the variance interval.

## 3.7 Sample Size Estimation
*   Determining the required sample size *before* conducting a study ensures the data yields a specific, desired Margin of Error ($E$).
### Sample Size for Estimating Mean ($\mu$)
*   **Formula**: 
    $$ n = \left( \frac{Z_{\alpha/2} \cdot \sigma}{E} \right)^2 $$
*   **Planning Value for $\sigma$**: Can be estimated from historical data, a pilot study, or roughly approximated as $\frac{\text{Range}}{4}$.

### Sample Size for Estimating Proportion ($p$)
*   **Formula**: 
    $$ n = \left( \frac{Z_{\alpha/2}}{E} \right)^2 p^*(1 - p^*) $$
*   **Planning Value for $p^*$**: Can be derived from past studies or pilot surveys. If completely unknown, use the **most conservative estimate ($p^* = 0.5$)**, which maximizes the required sample size to guarantee the margin of error is met.

---

## Quick Revision Summary
- **Point Estimator Properties**: Unbiased ($E(\bar{x}) = \mu$), Efficient (lowest variance), Consistent (improves as $n$ grows), Sufficient (uses all data).
- **Non-Sampling Errors**: Coverage (wrong frame), Non-response (bias in who answers), Measurement (bad survey design).
- **Mean CI ($\sigma$ known)**: $\bar{x} \pm Z_{\alpha/2} (\frac{\sigma}{\sqrt{n}})$
- **Mean CI ($\sigma$ unknown)**: $\bar{x} \pm t_{\alpha/2, n-1} (\frac{s}{\sqrt{n}})$
- **Proportion CI**: $\bar{p} \pm Z_{\alpha/2} \sqrt{\frac{\bar{p}(1-\bar{p})}{n}}$
- **Variance CI**: Uses asymmetric Chi-Square bounds ($\frac{(n-1)s^2}{\chi^2_{\alpha/2}}$ and $\frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}$).
- **Sample Size (Mean)**: $n = (\frac{Z \cdot \sigma}{E})^2$
- **Sample Size (Proportion)**: $n = (\frac{Z}{E})^2 p^*(1 - p^*)$ (Use $p^* = 0.5$ for maximum safety margin).


# Module 4: Hypothesis Testing

## 4.1 Hypothesis Testing
### 4.1.1 Introduction
*   **Hypothesis Testing** is a statistical inference technique used to determine whether sample data provides enough evidence to validate a claim about a population parameter (e.g., $\mu$, $p$, $\sigma^2$).
*   The primary goal is to take limited sample evidence and test competing statements to make decisions that impact the entire population.

### 4.1.2 Null and Alternate Hypothesis
Every hypothesis test involves two mutually exclusive, competing statements:
*   **Null Hypothesis ($H_0$)**: The tentative assumption or status quo regarding a population parameter. By convention, the null hypothesis **always contains the equality sign** ($=, \le, \ge$). In a legal analogy, it represents "innocent until proven guilty".
*   **Alternate Hypothesis ($H_a$)**: The claim or conclusion we are trying to prove using the sample data. It is the exact opposite of $H_0$ and contains strict inequalities ($\neq, <, >$).

### 4.1.3 Outcomes of a Hypothesis Test
There are only two possible conclusions in a hypothesis test:
1.  **Reject $H_0$**: The sample provides definitive evidence, beyond a reasonable doubt, that $H_0$ is false and the claim ($H_a$) is true.
2.  **Do Not Reject $H_0$**: The sample does not provide enough evidence to conclusively prove $H_a$. The test is inconclusive, and the status quo ($H_0$) is maintained. We never "accept" $H_0$; we merely fail to reject it.

## 4.2 Errors in Hypothesis Testing
Because hypothesis tests rely on sample data, there is always a risk of drawing an incorrect conclusion.
*   **Type 1 Error**: Wrongly **rejecting** the null hypothesis when the null hypothesis is actually **true**.
*   **Type 2 Error**: Wrongly **failing to reject** the null hypothesis when the alternate hypothesis is actually **true**.
*   **Level of Significance ($\alpha$)**: The maximum allowable probability of making a Type 1 Error. It is chosen by the decision-maker before the test (commonly $0.05$ or $0.01$).
    *   If the cost of a Type 1 Error is very high, a smaller $\alpha$ is chosen.
    *   Tests that strictly control for Type 1 Error are known as **significance tests**.

## 4.3 Hypothesis Testing for Population Mean
### 4.3.1 Five-Step Process
1.  Identify the Null ($H_0$) and Alternate ($H_a$) hypotheses.
2.  Decide on the significance level ($\alpha$).
3.  Assume $H_0$ is true at exact equality ($\mu = \mu_0$).
4.  Compute the test statistic and use the **p-value approach** (or critical value approach) to make a rejection decision.
5.  Provide the managerial implication of the decision.

### 4.3.2 Types of Tests
The direction of the test is strictly determined by the sign in the **Alternate Hypothesis ($H_a$)**.

| Test Type | Alternate Hypothesis ($H_a$) | Null Hypothesis ($H_0$) | Rejection Rule |
| :--- | :--- | :--- | :--- |
| **Lower Tail Test** | $\mu < A$ | $\mu \ge A$ | Reject if $p$-value $\le \alpha$ |
| **Upper Tail Test** | $\mu > A$ | $\mu \le A$ | Reject if $p$-value $\le \alpha$ |
| **Two-Tailed Test** | $\mu \neq A$ | $\mu = A$ | Reject if $p$-value $\le \alpha$ |

#### 4.3.3 The p-Value Approach
*   **p-value**: The probability of obtaining a test statistic as extreme as, or more extreme than, the actual sample value observed, assuming $H_0$ is true.
*   For a **two-tailed test**, the computed tail probability must be **doubled** due to the symmetry of the distribution.
*   **Decision Rule**: If $p\text{-value} \le \alpha$, **Reject $H_0$**. If $p\text{-value} > \alpha$, **Do Not Reject $H_0$**.

### 4.3.4 Test Statistic Formulas for Mean
*   **When Population Standard Deviation ($\sigma$) is Unknown:**
    Use the sample standard deviation ($s$) and the **Student's t-distribution** with $n - 1$ degrees of freedom.
    $$ t_{n-1} = \frac{\bar{x} - \mu_0}{s / \sqrt{n}} $$
*   **When Population Standard Deviation ($\sigma$) is Known:**
    Use the **Standard Normal (Z) distribution**.
    $$ Z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}} $$

## 4.4 Hypothesis Testing for Population Proportion
*   Used to test claims regarding a population proportion ($p$).
*   Assumes the sample size is large enough ($np_0 \ge 5$ and $n(1-p_0) \ge 5$) so the binomial distribution can be approximated by the **Normal distribution**.
*   **Test Statistic**: Computed assuming $H_0$ is true at equality ($p = p_0$). Therefore, the standard error uses the hypothesized parameter $p_0$, not the sample proportion $\bar{p}$.
    $$ Z = \frac{\bar{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}} $$
*   Follows the identical lower, upper, and two-tail structure and p-value rejection rule ($p\text{-value} \le \alpha \implies \text{Reject } H_0$) as tests for the mean.

## 4.5 Hypothesis Testing for Population Variance
*   Used to test claims regarding population variance ($\sigma^2$) or standard deviation ($\sigma$).
*   Assumes the sample is drawn from a normal population.
*   The sampling distribution relies on the **Chi-Square ($\chi^2$) Distribution** with $n - 1$ degrees of freedom.
*   **Test Statistic**:
    $$ \chi^2_{n-1} = \frac{(n-1)s^2}{\sigma_0^2} $$
    *   Where $n$ is the sample size, $s^2$ is the sample variance, and $\sigma_0^2$ is the hypothesized population variance.
*   Follows the identical lower, upper, and two-tail testing structure, utilizing the asymmetric Chi-Square probabilities to compute the p-value.

## 4.6 Covariance and Correlation
### 4.6.1 Covariance
*   **Covariance ($s_{xy}$)** is a descriptive measure of the **linear association** between two quantitative variables.
*   **Formula**:
    $$ s_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n - 1} $$
*   **Interpretation using Quadrants**:
    *   **Positive Covariance**: Points lie mostly in Quadrants 1 and 3 (both variables move in the same direction). Indicates positive linear relationship.
    *   **Negative Covariance**: Points lie mostly in Quadrants 2 and 4 (variables move in opposite directions). Indicates negative linear relationship.
    *   **Near Zero**: Points are evenly distributed across quadrants. Indicates no linear association.
*   **Limitation**: Covariance is highly sensitive to the **units of measurement**. Scaling variables (e.g., from lakhs to rupees) changes the magnitude of covariance without changing the actual relationship strength.

### 4.6.2 Correlation
*   **Pearson Product Moment Correlation Coefficient ($r_{xy}$)** standardizes covariance to eliminate the unit of measurement problem.
*   **Formula**:
    $$ r_{xy} = \frac{s_{xy}}{s_x s_y} $$
    *   Where $s_{xy}$ is sample covariance, and $s_x, s_y$ are the sample standard deviations.
*   **Properties**:
    *   Takes values exclusively between **$-1$ and $+1$**.
    *   $+1$ = Perfect positive linear relationship.
    *   $-1$ = Perfect negative linear relationship.
    *   $0$ = No **linear** relationship (a non-linear relationship may still perfectly exist).

### 4.6.3 Causation vs. Spurious Correlation
*   **Correlation is not Causation**: High correlation between variables does not mean a change in one variable *causes* a change in the other.
*   **Explainable Correlation**: The linear relationship can be logically explained.
*   **Spurious Correlation**: The correlation is driven by a third, hidden (or latent) variable rather than a direct relationship (e.g., ice cream sales and crime rates are highly correlated, but both are actually driven by the hidden variable of summer temperatures).

---

## Quick Revision Summary
- **Null Hypothesis ($H_0$)**: Status quo, always contains equality ($\le, \ge, =$).
- **Alternate Hypothesis ($H_a$)**: The claim to be tested, never contains equality ($<, >, \neq$). Determines if the test is lower-tail, upper-tail, or two-tail.
- **Type 1 Error**: Rejecting a true Null Hypothesis. Max probability is $\alpha$.
- **Type 2 Error**: Failing to reject a false Null Hypothesis.
- **p-Value Rule**: Reject $H_0$ if $p\text{-value} \le \alpha$. For a two-tailed test, double the calculated tail probability.
- **Mean Test Statistic (unknown $\sigma$)**: $t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$
- **Proportion Test Statistic**: $Z = \frac{\bar{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}$
- **Variance Test Statistic**: $\chi^2 = \frac{(n-1)s^2}{\sigma_0^2}$
- **Covariance ($s_{xy}$)**: Measures direction of linear relationship but depends heavily on units.
- **Correlation ($r_{xy}$)**: Standardized measure of linear relationship between $-1$ and $+1$. Correlation $\neq$ Causation; beware of spurious correlations caused by latent variables.