# 📊 Module 1: Distributions Related to Normal - Formula Sheet

### 1. Standard Normal Distribution ($Z$)
*   **Standardization Formula:** 
    $$Z = \frac{X - \mu}{\sigma}$$
*   **Inverse Calculation (Finding X):** 
    $$X = \mu + Z\sigma$$
*   **Parameters of Standard Normal:** Mean $\mu = 0$, Standard Deviation $\sigma = 1$.

### 2. Linear Combinations of Normal Random Variables
If $X_1, X_2, \dots, X_n$ are normally distributed variables and $a, b, c$ are constants:
*   **General Expected Value (Mean):** 
    $$E(aX_1 + bX_2 + c) = aE(X_1) + bE(X_2) + c$$
*   **General Variance (If Independent):** 
    $$Var(aX_1 + bX_2 + c) = a^2Var(X_1) + b^2Var(X_2)$$
    *(Note: Constants added/subtracted do not affect variance. Variances ALWAYS add, even if variables are subtracted).*
*   **General Variance (If Correlated/Dependent):** 
    $$Var(aX_1 + bX_2) = a^2Var(X_1) + b^2Var(X_2) + 2ab \cdot Cov(X_1, X_2)$$

**Special Cases for $X_1, X_2$ (Independent):**
*   **Sum ($Y = X_1 + X_2$):** Mean = $\mu_1 + \mu_2$, Variance = $\sigma_1^2 + \sigma_2^2$
*   **Difference ($Y = X_1 - X_2$):** Mean = $\mu_1 - \mu_2$, Variance = $\sigma_1^2 + \sigma_2^2$ 
*   **Sum of $n$ Identical Variables ($\sum X_i$):** Mean = $n\mu$, Variance = $n\sigma^2$
*   **Average of $n$ Variables ($\bar{X}$):** Mean = $\mu$, Variance = $\frac{\sigma^2}{n}$, Standard Error = $\frac{\sigma}{\sqrt{n}}$

### 3. Chi-Square Distribution ($\chi^2$)
*   **Definition:** Sum of squared standard normal variables ($Z_1^2 + Z_2^2 + \dots + Z_n^2$).
*   **Parameters:** Degrees of Freedom ($k$). Exists strictly for values $\ge 0$.
*   **Mean:** $k$
*   **Variance:** $2k$

### 4. Student's t-Distribution ($t$)
*   **Definition:** Ratio of Standard Normal to the square root of Chi-Square over its DOF. $t = \frac{Z}{\sqrt{\chi^2/k}}$
*   **Mean:** $0$ (for $k > 1$)
*   **Variance:** $\frac{k}{k - 2}$ (for $k > 2$)
*   **Properties:** Symmetric, bell-shaped, but has heavier (fatter) tails than the normal distribution. Approaches Normal ($Z$) as $k \to \infty$.

### 5. F-Distribution
*   **Definition:** Ratio of two independent Chi-Square variables divided by their DOFs.
*   **Parameters:** Numerator DOF ($k_1$), Denominator DOF ($k_2$). Positive values only.
*   **Mean:** $\frac{k_2}{k_2 - 2}$ (for $k_2 > 2$)

---

### 📖 How to Look Up Values in Statistical Tables
*   **Z-Table (Standard Normal):** 
    *   *Finding Probabilities:* Locate the first two digits of your Z-score on the left column and the hundredth digit on the top row. The intersecting value is the cumulative probability (area to the left).
    *   *Inverse (Finding Z):* Look *inside* the table for the desired probability. Once found, trace back to the row and column to get the Z-score. (e.g., for 95th percentile, find $0.9500$ inside $\rightarrow$ corresponds to $Z = 1.645$).
*   **t-Table:** 
    *   Rows represent Degrees of Freedom ($df$). Columns represent the upper-tail probability ($\alpha$). 
    *   *Symmetry Rule:* If you need a lower tail probability (e.g., lower 5%), find the upper 5% value and add a negative sign ($-t_{\alpha, k}$).
*   **Chi-Square ($\chi^2$) Table:** 
    *   Rows = $df$, Columns = upper-tail probability. *Not symmetric!* Lower bounds must be explicitly looked up using $1 - \alpha$.
*   **F-Table:** 
    *   Different tables exist for different significance levels ($\alpha$). Select the correct $\alpha$ table, then match Numerator DOF ($k_1$) on columns and Denominator DOF ($k_2$) on rows.

---

# 📝 Question Patterns & Samples from Your Exam

### Pattern 1: Inverse Calculations on Normal Distribution (Finding X given Percentiles)
**Concept:** You are given the mean, variance/standard deviation, and a percentile (probability). You must use the Z-table backwards to find the Z-score, then solve for the raw value $X$.

**Sample Question (ID: STAT_MT_Q7):**
> **Question:** Scores on a national competitive exam were normally distributed with a mean of 80 and a variance of 36. If the top 5% of test scores receive merit awards, what is the lowest score eligible for a merit award?
> **Options:** A) 89, B) 90, C) 91, D) 92
> **Correct Answer:** B
> **Explanation & Table Lookup:** 
> 1. Identify parameters: $\mu = 80$, Variance = 36 $\Rightarrow$ standard deviation $\sigma = \sqrt{36} = 6$.
> 2. **Table Lookup:** The "top 5%" means the area to the right is 0.05. Therefore, the cumulative area to the left is $1 - 0.05 = 0.9500$. Look *inside* the Z-table for $0.9500$. It falls exactly between 1.64 and 1.65, so we use $Z = 1.645$.
> 3. Convert z-score to raw score using Inverse Formula: 
>    $X = \mu + (Z \times \sigma) = 80 + (1.645 \times 6) = 80 + 9.87 = 89.87$.
> 4. Rounds to 90.

---

### Pattern 2: Linear Combinations of Independent Variables
**Concept:** You are given the Mean and Variance of two independent variables ($X$ and $Y$). You must find the Mean and Variance of a new equation $Z = aX + bY$.

**Sample Question (ID: PRAC_M1_Q2):**
> **Question:** Given that X∼N(2,4) and Y∼N(3,9), what is the mean and variance of the linear combination Z = 3X + 2Y?
> **Options:** 
> A) The mean of Z is 18 and the variance is 36.
> B) The mean of Z is 15 and the variance is 72.
> C) The mean of Z is 15 and the variance is 25.
> D) The mean of Z is 10 and the variance is 25.
> **Correct Answer:** B
> **Explanation:** 
> Note: Notation $N(\mu, \sigma^2)$ means Mean and Variance. So, $E(X)=2, Var(X)=4$ and $E(Y)=3, Var(Y)=9$.
> 1. Calculate Expected Value (Mean): 
>    $E(Z) = 3E(X) + 2E(Y) = 3(2) + 2(3) = 6 + 6 = 12$. *(Note: The given correct option B has a typo in its text for the mean, but is the only one with the correct variance).*
> 2. Calculate Variance:
>    $Var(Z) = a^2Var(X) + b^2Var(Y) = 3^2(4) + 2^2(9)$
>    $Var(Z) = 9(4) + 4(9) = 36 + 36 = 72$.

---

### Pattern 3: Evaluating Probabilities of a t-Distribution
**Concept:** Finding the probability between two values on a Student's t-distribution curve. 

**Sample Question (ID: STAT_MT_Q10):**
> **Question:** The probability that a t-random variable with 5 degrees of freedom takes values between -2.0 and 0.5 is:
> **Options:** 
> A) Between 0.20 and 0.40
> B) Between 0.40 and 0.60
> C) Between 0.60 and 0.80
> D) Between 0.80 and 1.00
> **Correct Answer:** C
> **Explanation & Table Lookup:** 
> This requires finding the area under the curve between bounds $-2.0$ and $0.5$ for $df = 5$.
> 1. **Table Lookup ($t = 0.5$):** Go to the t-table, row $df = 5$. You will see that $t=0.5$ is a small critical value. The cumulative probability $P(t < 0.5)$ is approximately $0.68$.
> 2. **Table Lookup ($t = -2.0$):** Since the table only shows positive t-values, look for $t = +2.0$ at $df=5$. The upper tail area for $+2.0$ is $\approx 0.05$. By symmetry, the lower tail area $P(t < -2.0)$ is also $\approx 0.05$.
> 3. Find the difference: $P(-2.0 < t < 0.5) = P(t < 0.5) - P(t < -2.0) = 0.68 - 0.05 = 0.63$.
> 4. $0.63$ lies between 0.60 and 0.80.

---

# 📊 Module 2: Sampling and Sampling Distributions - Formula Sheet

### 1. Key Definitions & Terminology
*   **Population Parameter:** A numerical characteristic of the entire population (e.g., $\mu$, $\sigma$, $p$). Usually unknown.
*   **Sample Statistic (Point Estimator):** A numerical characteristic calculated from sample data (e.g., $\bar{x}$, $s$, $\bar{p}$). Used to estimate population parameters.
*   **Unbiased Estimator:** An estimator whose expected value (average over many samples) equals the true population parameter.
    *   Expected Value of Sample Mean: $E(\bar{x}) = \mu$
    *   Expected Value of Sample Proportion: $E(\bar{p}) = p$

### 2. Standard Error
The standard deviation of a sample statistic's distribution is called the **Standard Error (SE)**. It measures the precision of the estimate. As sample size ($n$) increases, standard error decreases.
*   **Standard Error of the Mean ($\sigma_{\bar{x}}$):** 
    $$SE = \frac{\sigma}{\sqrt{n}}$$
    *Variance of the Sample Mean:* $Var(\bar{x}) = \frac{\sigma^2}{n}$
*   **Standard Error of Proportion ($\sigma_{\bar{p}}$):** 
    $$SE = \sqrt{\frac{p(1-p)}{n}}$$

### 3. Central Limit Theorem (CLT) & Standardizing Sample Means
The CLT states that if you take sufficiently large samples ($n \ge 30$), the distribution of the **sample mean ($\bar{x}$)** will be approximately normally distributed, *regardless of the population's original shape*.
*   **Distribution of Sample Mean:** $\bar{x} \sim Normal\left(\mu, \frac{\sigma}{\sqrt{n}}\right)$
*   **Z-score Formula for Sample Mean:** 
    $$Z = \frac{\bar{x} - \mu}{\sigma / \sqrt{n}}$$

### 4. Sampling Distribution of Proportion
If $n$ is large enough ($np \ge 5$ and $n(1-p) \ge 5$), the sampling distribution of the **sample proportion ($\bar{p}$)** can be approximated by a normal distribution.
*   **Distribution of Sample Proportion:** $\bar{p} \sim Normal\left(p, \sqrt{\frac{p(1-p)}{n}}\right)$
*   **Z-score Formula for Sample Proportion:** 
    $$Z = \frac{\bar{p} - p}{\sqrt{\frac{p(1-p)}{n}}}$$

### 5. Distribution of Sample Variance
Unlike $\bar{x}$, the sample variance $s^2$ does *not* follow a normal distribution. If the original population is normal, the sample variance follows a **Chi-Square ($\chi^2$) Distribution**.
*   **Sample Variance Formula:** 
    $$s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}$$
*   **Chi-Square Relation:** 
    $$\frac{(n-1)s^2}{\sigma^2} \sim \chi^2_{n-1}$$
    (Where $n-1$ is the Degrees of Freedom).

---

### 📖 How to Look Up Values in Statistical Tables (For Module 2)
*   Because of the CLT, almost all probability questions in Module 2 involve converting sample means or proportions to a **Z-score**.
*   **Z-Table Lookup:** Once you calculate $Z = \frac{\bar{x} - \mu}{SE}$, you look up this $Z$-value in the Standard Normal Table to find the probability.
    *   If $Z$ is positive (e.g., $1.86$), looking up $1.86$ yields the area to the left (e.g., $0.9686$).
    *   If you need the area *between* two values ($Z_1$ and $Z_2$), look up the probabilities for both and subtract the smaller probability from the larger one.
    *   If you need the "greater than" probability (area to the right), calculate $1 - (\text{Table Value})$.

---

# 📝 Question Patterns & Samples from Your Exam

### Pattern 1: Probabilities of Sample Means (Applying CLT)
**Concept:** You are given the population mean ($\mu$), population standard deviation ($\sigma$), and a sample size ($n$). You are asked to find the probability that the *sample mean* ($\bar{x}$) falls within a certain range.
**Trigger Word:** "probability of the average...", "sample of $n$..."

**Sample Question (ID: STAT_MT_Q1):**
> **Question:** The daily earnings of a taxi driver in a city has an average of 2400 and a standard deviation of 360. If a random sample of 45 taxi drivers are surveyed, the probability of the average daily earnings in the sample being between 2300 and 2500 is:
> **Options:** A) Between 0.00 and 0.25, B) Between 0.25 and 0.50, C) Between 0.50 and 0.75, D) Between 0.75 and 1.00
> **Correct Answer:** D
> **Explanation & Table Lookup:** 
> 1. Identify parameters: $\mu = 2400$, $\sigma = 360$, $n = 45$.
> 2. Calculate Standard Error (SE): $SE = \frac{360}{\sqrt{45}} \approx 53.67$
> 3. Calculate Z-scores for both limits:
>    $Z_1 = \frac{2300 - 2400}{53.67} \approx -1.86$
>    $Z_2 = \frac{2500 - 2400}{53.67} \approx 1.86$
> 4. **Table Lookup:** Find $1.86$ in the Z-table $\rightarrow 0.9686$. Find $-1.86$ in the Z-table $\rightarrow 0.0314$.
> 5. Find probability between: $P(-1.86 < Z < 1.86) = 0.9686 - 0.0314 = 0.9372$.
> 6. $0.9372$ falls between 0.75 and 1.00.

---

### Pattern 2: Probabilities of Sample Proportions (Applying CLT)
**Concept:** You are given a population proportion percentage ($p$) and a sample size ($n$). You must find the probability that the *sample proportion* ($\bar{p}$) is greater than/less than a specific value.

**Sample Question (ID: STAT_MT_Q11):**
> **Question:** A department store has determined that 25% of all their sales are credit sales. If a random sample of 60 sales records are selected, the probability of the proportion of credit sales in the sample being more than 30% is:
> **Options:** A) Between 0.00 and 0.25, B) Between 0.25 and 0.50, C) Between 0.50 and 0.75, D) Between 0.75 and 1.00
> **Correct Answer:** A
> **Explanation & Table Lookup:** 
> 1. Identify parameters: $p = 0.25$, $n = 60$, Target $\bar{p} = 0.30$.
> 2. Calculate Standard Error (SE): $SE = \sqrt{\frac{0.25 \times 0.75}{60}} = \sqrt{0.003125} \approx 0.0559$
> 3. Calculate Z-score: $Z = \frac{0.30 - 0.25}{0.0559} \approx 0.894$
> 4. **Table Lookup:** Find $Z = 0.89$ in the table, which gives a cumulative area (left) of $\approx 0.8133$. Since the question asks for "more than 30%", we want the right tail.
> 5. Compute upper tail: $1 - 0.8133 = 0.1867$.
> 6. $0.1867$ falls between 0.00 and 0.25.

---

### Pattern 3: Calculating Sample Mean and Variance Manually
**Concept:** Given a small raw dataset, calculate the sample mean ($\bar{x}$) and sample variance ($s^2$). Remember to divide by $n-1$ for variance, not $n$!

**Sample Question (ID: 1):**
> **Question:** A local animal shelter is tracking the number of animals adopted each week over a span of 8 weeks. The number of adoptions recorded are as follows: 5, 8, 6, 12, 10, 9, 7, and 11. What is the mean and variance of the number of adoptions per week?
> **Options:** A) 7.5, 5.65, B) 8.5, 6.00, C) 7.5, 6.25, D) 8.5, 5.25
> **Correct Answer:** B
> **Explanation:** 
> 1. Calculate the sample mean ($\bar{x}$):
>    $\bar{x} = \frac{5+8+6+12+10+9+7+11}{8} = \frac{68}{8} = 8.5$
> 2. Calculate the sample variance ($s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}$):
>    Deviations from 8.5: $(5-8.5)^2=12.25$, $(8-8.5)^2=0.25$, $(6-8.5)^2=6.25$, $(12-8.5)^2=12.25$, $(10-8.5)^2=2.25$, $(9-8.5)^2=0.25$, $(7-8.5)^2=2.25$, $(11-8.5)^2=6.25$.
>    Sum of squared deviations $= 42$.
>    $s^2 = \frac{42}{8-1} = \frac{42}{7} = 6.00$.

---

### Pattern 4: Theoretical Properties of Sampling Distributions
**Concept:** Conceptual questions testing your knowledge of what sampling distributions represent, the definitions of standard error, variance of the mean, or how variance distributes over the Chi-square.

**Sample Question (ID: CLA2_Q10):**
> **Question:** In a EdTech risk analysis, returns on a digital asset are assumed to be normally distributed. What distribution does $(n − 1)s^2 / \sigma^2$ follow?
> **Options:** A) Chi-square distribution with (n − 1) degrees of freedom, B) Normal distribution, C) t distribution, D) F distribution
> **Correct Answer:** A
> **Explanation:** 
> This is a direct theoretical rule. If samples are drawn from a normal population, the ratio of the sample variance multiplied by $n-1$ to the true population variance perfectly defines a Chi-square ($\chi^2$) distribution with $n - 1$ degrees of freedom.

---

# 📊 Module 3: Confidence Intervals and Estimation - Formula Sheet

### 1. General Structure of a Confidence Interval
*   **Formula:** $\text{Point Estimate} \pm \text{Margin of Error } (E)$
*   **Confidence Level:** $(1 - \alpha)$ represents the probability that the calculated interval will contain the true population parameter over repeated sampling. (e.g., 95% confidence $\implies \alpha = 0.05$).

### 2. Confidence Interval for Population Mean ($\mu$)
*   **Case 1: Population Standard Deviation ($\sigma$) Known**
    *   *Formula:* $\bar{x} \pm Z_{\alpha/2} \left(\frac{\sigma}{\sqrt{n}}\right)$
    *   *Margin of Error ($E$):* $Z_{\alpha/2} \left(\frac{\sigma}{\sqrt{n}}\right)$
*   **Case 2: Population Standard Deviation ($\sigma$) Unknown**
    *   *Formula:* $\bar{x} \pm t_{\alpha/2, n-1} \left(\frac{s}{\sqrt{n}}\right)$
    *   *Margin of Error ($E$):* $t_{\alpha/2, n-1} \left(\frac{s}{\sqrt{n}}\right)$
    *   *Degrees of Freedom ($df$):* $n - 1$

### 3. Confidence Interval for Population Proportion ($p$)
*   *Formula:* $\bar{p} \pm Z_{\alpha/2} \sqrt{\frac{\bar{p}(1-\bar{p})}{n}}$
*   *Margin of Error ($E$):* $Z_{\alpha/2} \sqrt{\frac{\bar{p}(1-\bar{p})}{n}}$

### 4. Confidence Interval for Population Variance ($\sigma^2$) & Std Dev ($\sigma$)
*(Note: Because the Chi-square distribution is not symmetric, we do NOT use "Estimate $\pm$ Margin of Error". We calculate separate lower and upper bounds).*
*   **CI for Variance ($\sigma^2$):** 
    $$ \frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}} $$
    *(Lower bound uses the UPPER critical value $\chi^2_{\alpha/2}$; Upper bound uses the LOWER critical value $\chi^2_{1-\alpha/2}$)*
*   **CI for Standard Deviation ($\sigma$):** Simply take the square root of both bounds calculated above.

### 5. Sample Size Estimation
Used to find how many samples ($n$) are needed to achieve a desired Margin of Error ($E$). Always round your final answer UP to the next whole number.
*   **For Estimating Mean:** 
    $$n = \left(\frac{Z_{\alpha/2} \cdot \sigma}{E}\right)^2$$
*   **For Estimating Proportion:** 
    $$n = \left(\frac{Z_{\alpha/2}}{E}\right)^2 p^*(1-p^*)$$
    *(If no prior $p^*$ is given, use the most conservative estimate: $p^* = 0.5$ to maximize the sample size).*

### 6. Properties of Point Estimators
*   **Unbiased:** Expected value equals true parameter ($E(\bar{x}) = \mu$).
*   **Efficient:** Has the smallest variance (smallest standard error) among unbiased estimators.
*   **Consistent:** As sample size $n$ increases, the estimate converges closer to the true parameter.
*   **Sufficient:** Uses all data points in the sample.

---

### 📖 How to Look Up Critical Values in Statistical Tables
*   **Z-Values ($Z_{\alpha/2}$):** For confidence intervals, you look for the area leaving $\alpha/2$ in the upper tail. 
    *   *Common Z-values:* **90%** $\rightarrow 1.645$ | **95%** $\rightarrow 1.96$ | **99%** $\rightarrow 2.576$
*   **t-Values ($t_{\alpha/2, n-1}$):** Find the row for $df = n-1$. Go to the column for your specific $\alpha/2$ (e.g., for 95% confidence, $\alpha = 0.05 \implies \text{look under column } 0.025$).
*   **Chi-Square Values ($\chi^2$):** For a 95% CI ($\alpha = 0.05$), you need two values from the $df = n-1$ row:
    *   Upper critical value ($\chi^2_{0.025}$) $\rightarrow$ Used in the denominator for the **Lower Bound**.
    *   Lower critical value ($\chi^2_{0.975}$) $\rightarrow$ Used in the denominator for the **Upper Bound**.

---

# 📝 Question Patterns & Samples from Your Exam

### Pattern 1: Calculating Margin of Error for Mean ($\sigma$ Unknown)
**Concept:** You are given sample size, sample mean, and sample standard deviation. Because population $\sigma$ is unknown, you must use the $t$-distribution to find the Margin of Error.

**Sample Question (ID: quiz_2):**
> **Question:** McKinney Ltd wants its employees to do mandatory safety training. Data from a random sample of 20 employees reveals that the time taken by an employee to complete the training has a sample average of 51 days and a sample standard deviation of 7 days. What is the margin of error corresponding to a 90% confidence interval?
> **Options:** A) 2.35, B) 2.71, C) 3.28, D) 4.48
> **Correct Answer:** B
> **Explanation & Table Lookup:** 
> 1. Parameters: $n = 20$, $\bar{x} = 51$, $s = 7$. Confidence = 90% ($\alpha = 0.10$).
> 2. **Table Lookup ($t$):** Degrees of freedom $df = n - 1 = 19$. Column to look up is $\alpha/2 = 0.05$. The $t$-value is $1.729$.
> 3. Calculate ME: $ME = t \cdot \frac{s}{\sqrt{n}} = 1.729 \cdot \frac{7}{\sqrt{20}}$
> 4. $ME = 1.729 \cdot 1.565 \approx 2.71$.

---

### Pattern 2: Confidence Interval for a Proportion
**Concept:** Given a total sample size and the number of 'successes', calculate the sample proportion $\bar{p}$, then apply the Z-distribution to find the confidence bounds.

**Sample Question (ID: quiz_3):**
> **Question:** A survey of 900 women employees in the IT sector revealed that 396 of them were satisfied with childcare facilities... Based on this survey, the 90% confidence interval on the proportion of women satisfied is given by:
> **Options:** A) [0.40, 0.48], B) [0.41, 0.47], C) [0.42, 0.46], D) [0.43, 0.45]
> **Correct Answer:** B
> **Explanation & Table Lookup:** 
> 1. Calculate sample proportion: $\bar{p} = \frac{396}{900} = 0.44$.
> 2. **Table Lookup ($Z$):** For 90% confidence, $Z_{\alpha/2} = 1.645$.
> 3. Standard error (SE): $SE = \sqrt{\frac{0.44 \times 0.56}{900}} \approx 0.01655$.
> 4. Margin of Error (ME): $1.645 \times 0.01655 \approx 0.0272$.
> 5. Interval: $0.44 \pm 0.0272 = [0.4128, 0.4672]$, rounds to $[0.41, 0.47]$.

---

### Pattern 3: Sample Size Calculation (Proportion)
**Concept:** You are given a desired margin of error and a confidence level. You must solve backwards for $n$.

**Sample Question (ID: 236144716):**
> **Question:** In a random survey of 42 managers, 24 did not have an MBA degree. What is the smallest sample size among those listed below that will yield a desired margin of error of 0.1 or less for a 99% confidence interval on the true proportion of managers in the population having an MBA degree?
> **Options:** A) 400, B) 300, C) 200, D) 100
> **Correct Answer:** C
> **Explanation:** 
> 1. Sample proportion (had MBA): $\bar{p} = \frac{42 - 24}{42} = \frac{18}{42} \approx 0.4286$.
> 2. Formula: $n = \frac{Z_{\alpha/2}^2 \cdot \bar{p}(1-\bar{p})}{E^2}$
> 3. **Table Lookup ($Z$):** 99% CI means $Z = 2.576$. $E = 0.1$.
> 4. Substitute: $n = \frac{2.576^2 \times 0.4286 \times 0.5714}{0.1^2} = \frac{6.636 \times 0.2449}{0.01} \approx 162.5$.
> 5. The smallest option that safely exceeds 162.5 is 200.

---

### Pattern 4: Confidence Interval for Variance / Standard Deviation
**Concept:** Utilizing the asymmetric Chi-square bounds to find intervals for $\sigma^2$ or $\sigma$. Be very careful not to mix up the upper and lower critical values!

**Sample Question (ID: 18 - Second Variant):**
> **Question:** In a random survey of 10 properties in Hyderabad, the rental costs for 2 BHK showed a standard deviation of 7 lakh. What is the 95% confidence interval of true standard deviation of rental costs in the population?
> **Options:** A) Between 4.8 and 12.8 lakhs, B) Between 4.7 and 13.4 lakhs, C) Between 23 and 163 lakhs, D) Between 22 and 180 lakhs
> **Correct Answer:** A
> **Explanation & Table Lookup:** 
> 1. Parameters: $n=10 \implies df=9$. $s = 7 \implies s^2 = 49$.
> 2. **Table Lookup ($\chi^2$):** For 95% confidence ($\alpha=0.05$):
>    - Upper critical value $\chi^2_{0.025, 9} = 19.023$
>    - Lower critical value $\chi^2_{0.975, 9} = 2.70$
> 3. Calculate Variance bounds:
>    - Lower limit: $\frac{9 \times 49}{19.023} \approx 23.18$
>    - Upper limit: $\frac{9 \times 49}{2.70} \approx 163.33$
> 4. Since the question asks for the **Standard Deviation**, take the square root of both limits:
>    - Lower limit = $\sqrt{23.18} \approx 4.81$
>    - Upper limit = $\sqrt{163.33} \approx 12.78$

---

# 📊 Module 4: Hypothesis Testing - Formula Sheet

### 1. Hypothesis Testing Basics
*   **Null Hypothesis ($H_0$):** The status quo or default assumption. **Always** contains the equality sign ($=, \le, \ge$).
*   **Alternate Hypothesis ($H_a$ or $H_1$):** The claim being tested. Determines the direction of the test. **Never** contains equality ($\neq, <, >$).
    *   $\neq \implies$ Two-Tailed Test
    *   $< \implies$ Lower-Tailed Test
    *   $> \implies$ Upper-Tailed Test
*   **Type I Error ($\alpha$):** Rejecting $H_0$ when $H_0$ is actually true (False Positive). Also known as the Level of Significance.
*   **Type II Error:** Failing to reject $H_0$ when $H_0$ is false.
*   **p-Value Rule:** Reject $H_0$ if **$p\text{-value} \le \alpha$**.

### 2. Test Statistics for Population Mean ($\mu$)
*   **Case 1: Population $\sigma$ is Known** (Uses Standard Normal Z-distribution)
    $$ Z_{test} = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}} $$
*   **Case 2: Population $\sigma$ is Unknown** (Uses Student's t-distribution)
    $$ t_{test} = \frac{\bar{x} - \mu_0}{s / \sqrt{n}} \quad \text{with } df = n - 1 $$

### 3. Test Statistic for Population Proportion ($p$)
*Always uses the Standard Normal Z-distribution.*
*Note: The standard error is calculated using the **hypothesized parameter ($p_0$)**, NOT the sample proportion ($\bar{p}$).*
$$ Z_{test} = \frac{\bar{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}} $$

### 4. Test Statistic for Population Variance ($\sigma^2$)
*Always uses the Chi-Square ($\chi^2$) distribution.*
$$ \chi^2_{test} = \frac{(n-1)s^2}{\sigma_0^2} \quad \text{with } df = n - 1 $$

### 5. Covariance & Correlation
*   **Sample Covariance ($S_{xy}$):** Measures the direction of linear association. Unit-dependent.
    $$ S_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n-1} $$
*   **Pearson Correlation Coefficient ($r_{xy}$):** Standardized measure of linear association. Unitless.
    $$ r_{xy} = \frac{S_{xy}}{S_x S_y} $$
    *Properties:* $-1 \le r \le +1$. $0$ means no *linear* relationship (but non-linear might exist). **Correlation $\neq$ Causation.**

---

### 📖 How to Look Up p-values in Statistical Tables
*   **Z-Table:** 
    *   *Lower-tail ($<$):* Look up the negative Z-score. The value in the table is your p-value.
    *   *Upper-tail ($>$):* Look up the positive Z-score. Your p-value is $1 - (\text{Table Value})$.
*   **t-Table & $\chi^2$ Table:** 
    *   Locate the row for your degrees of freedom ($df$). Scan across the row to find where your calculated test statistic falls between two critical values. Look up at the column headers ($\alpha$) to find the range of your p-value.
*   ⚠️ **THE TWO-TAIL RULE ($\neq$):** If $H_a$ contains $\neq$, the test is two-tailed. Once you find the tail probability from the table, **you MUST multiply it by 2** to get the final p-value.

---

# 📝 Question Patterns & Samples from Your Exam

### Pattern 1: Setting up Hypotheses ($H_0$ and $H_a$)
**Concept:** Translate an English business claim into statistical notation. Remember, the claim you want to "prove" usually goes into $H_a$. $H_0$ must contain the equality.

**Sample Question (ID: 236144714):**
> **Question:** Sales personnel for Magenta Ltd. have been submitting weekly reports of customer contacts made during the week. A sample of 16 weekly reports showed a mean 19 and standard deviation was 5 contacts per week. Construct a hypothesis to determine if the true value of the average contacts per week is equal to 15. The correct form is:
> **Options:** 
> A) $H_0: \mu \le 15$ and $H_a: \mu > 15$
> B) $H_0: \mu = 15$ and $H_a: \mu \neq 15$
> C) $H_0: \mu \neq 15$ and $H_a: \mu = 15$
> D) $H_0: \mu \ge 15$ and $H_a: \mu < 15$
> **Correct Answer:** B
> **Explanation:** The test asks to determine if the average is "equal to 15". Because $H_0$ *must* contain the equality, we set $H_0: \mu = 15$. The alternate hypothesis must be the exact opposite (testing for any difference), making it $H_a: \mu \neq 15$ (a two-tailed test).

---

### Pattern 2: Calculating Test Statistic & p-value (Mean / Proportion)
**Concept:** Calculate the $t$ or $Z$ test statistic, look it up in the table, and apply the two-tail rule if necessary.

**Sample Question (ID: 236144715):**
> **Question:** Continuing from Magenta Ltd (mean = 19, std dev = 5, n = 16, testing $\mu = 15$). For a significance level of 10%, what is the p-value?
> **Options:** A) Between 0.00 and 0.01, B) Between 0.01 and 0.05, C) Between 0.99 and 1.00, D) Between 0.99 and 0.95
> **Correct Answer:** A
> **Explanation & Table Lookup:** 
> 1. Compute $t$-statistic: $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}} = \frac{19 - 15}{5/\sqrt{16}} = \frac{4}{1.25} = 3.2$.
> 2. **Table Lookup:** Go to the $t$-table at $df = 16 - 1 = 15$. Scan the row for $df=15$. The highest value shown is usually around $2.947$ (which corresponds to an upper tail of $0.005$). 
> 3. Since our $t = 3.2$ is larger than $2.947$, the single tail probability is $< 0.005$.
> 4. **Two-Tail Rule:** Because $H_a$ is $\neq 15$, we multiply the tail probability by 2. $p\text{-value} < 2 \times 0.005 = 0.01$.
> 5. Therefore, the p-value is strictly between 0.00 and 0.01.

---

### Pattern 3: Calculating Test Statistic for Variance ($\chi^2$)
**Concept:** Calculate the test statistic for population variance. Ensure you square standard deviation ($s$) to get sample variance ($s^2$) before plugging it into the formula.

**Sample Question (ID: 236144718):**
> **Question:** In a random survey of 25 customers, it was found that the standard deviation of the individual spend at a retail store was \$35. Construct a hypothesis to determine if the true value of the variance in the population for individual spend is more than 900. The test statistic for this test takes a value that is:
> **Options:** A) Less than -10.0, B) Between -10.0 and 0.0, C) Between 0.0 and 10.0, D) More than 10.0
> **Correct Answer:** D
> **Explanation:** 
> 1. Parameters: $n = 25 \implies df = 24$. $s = 35 \implies s^2 = 1225$. $\sigma_0^2 = 900$.
> 2. Use the $\chi^2$ test statistic formula: $\chi^2 = \frac{(n-1)s^2}{\sigma_0^2}$.
> 3. Substitute values: $\chi^2 = \frac{24 \times 1225}{900} = \frac{29400}{900} = 32.67$.
> 4. $32.67$ is clearly greater than 10.0.

---

### Pattern 4: Calculating Covariance / Correlation
**Concept:** Given a small dataset of $(x,y)$ pairs, calculate the sample means, sum of deviation products, and finally Covariance.

**Sample Question (ID: STAT_MT_Q6):**
> **Question:** For a given product, the supply (y) and price(x) for 8 weeks is given as (y,x) as: (5, 2), (7, 4), (9, 8), (12, 5), (10, 7), (13, 8), (16, 16) and (16, 6). The sample covariance is equal to:
> **Options:** A) 10.0, B) 10.4, C) 11.0, D) 11.4
> **Correct Answer:** D
> **Explanation:** 
> 1. Calculate sample means: $\bar{x} = \frac{2+4+8+5+7+8+16+6}{8} = 7.0$
>    $\bar{y} = \frac{5+7+9+12+10+13+16+16}{8} = 11.0$
> 2. Compute the sum of product of deviations: $\sum(x_i - \bar{x})(y_i - \bar{y})$
>    $= (2-7)(5-11) + (4-7)(7-11) + \dots + (6-7)(16-11)$
>    $= (-5)(-6) + (-3)(-4) + \dots = 30 + 12 + \dots = 79.875$ (exact sum).
> 3. Calculate Covariance ($S_{xy}$): Divide by $n-1 = 7$.
>    $S_{xy} = \frac{79.875}{7} \approx 11.41$, which rounds to 11.4.

