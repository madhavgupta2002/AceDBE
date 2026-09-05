## MODULE 1: Distributions Related to Normal

---

### Standard Normal Distribution

#### Standardization

$$Z = \frac{X - \mu}{\sigma}$$

#### Inverse Formula

$$X = \mu + Z\sigma$$

* Standard Normal: Mean $= 0$, SD $= 1$

**Q10:** Scores are normally distributed with mean 75, SD 10. Find the z-score of a student that scored 85.

> *Why: Standardize raw score to compare across normal distributions.*
> $z = \frac{85 - 75}{10} = \frac{10}{10}$
> **z = 1.0** ✓

**Q3:** Scores normally distributed with mean 80, variance 36. Lowest score for top 5% merit award?

> *Why: Need cutoff for top 5% — find Z for 95th percentile ($P(Z \le z) = 0.95$), then convert back to raw score.*
> $\sigma = \sqrt{36} = 6$
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** We need the z-score corresponding to the cumulative probability of $0.9500$ (top 5% cutoff).
> * **Row & Column:** Search inside the **body** of the table for $0.9500$:
>   - Row `1.6`, Col `.04` gives $0.9495$
>   - Row `1.6`, Col `.05` gives $0.9505$
>   - Exact midpoint $\implies Z = 1.645$
> $x = \mu + Z\sigma = 80 + (1.645 \times 6) = 80 + 9.87 = 89.87$
> **≈ 90** ✓

---

### Linear Combination of Variables

If $Z = aX + bY + c$:

#### Mean

$$E(Z) = aE(X) + bE(Y) + c$$

#### Variance (Independent Variables)

$$Var(Z) = a^2Var(X) + b^2Var(Y)$$

#### Variance (Dependent Variables)

$$Var(Z) = a^2Var(X) + b^2Var(Y) + 2ab \cdot Cov(X,Y)$$

#### Important Special Cases

| Case | Mean | Variance |
|------|------|----------|
| $X + Y$ | $\mu_X + \mu_Y$ | $\sigma_X^2 + \sigma_Y^2$ |
| $X - Y$ | $\mu_X - \mu_Y$ | $\sigma_X^2 + \sigma_Y^2$ |
| $\bar{X}$ | $\mu$ | $\sigma^2 / n$ |

Standard Error of $\bar{X}$: $\sigma / \sqrt{n}$

**Q20:** $X \sim N(2,4)$, $Y \sim N(3,9)$. Find mean and variance of $Z = 3X + 2Y$.

> *Why: Linear combination of independent normals — apply coefficient rules for E and Var.*
> $E[Z] = 3(2) + 2(3) = 12$
> $Var(Z) = 3^2(4) + 2^2(9) = 36 + 36$
> **Variance = 72** ✓
> *(Variances always add for independent variables; use squared coefficients)*

**Q19:** Which is true about the linear combination of independent normal random variables?

> The linear combination is also normally distributed.
> The mean is the sum of the means, and the variance is the sum of the variances.

**QMay26-1:** Roger invests 80% in Asset A ($\mu_A=4$, $\sigma_A=2$) and 20% in Asset B ($\mu_B=6$, $\sigma_B=3$). Correlation $\rho = -0.5$. Find the standard deviation of portfolio returns.

> *Why: Portfolio is a linear combination of correlated normals — use the full variance formula with covariance term.*
> $\sigma_p^2 = w_A^2\sigma_A^2 + w_B^2\sigma_B^2 + 2w_Aw_B\rho\sigma_A\sigma_B$
> $= (0.8)^2(2)^2 + (0.2)^2(3)^2 + 2(0.8)(0.2)(-0.5)(2)(3)$
> $= 2.56 + 0.36 - 0.96 = 1.96$
> $\sigma_p = \sqrt{1.96} = 1.4$
> **Between 0.0 to 2.0** ✓
> *(Negative correlation reduces portfolio variance — diversification benefit)*

**QMay26-2:** Written assessment: $\mu_W=40$, $\sigma_W=5$. Oral assessment: $\mu_O=30$, $\sigma_O=7$. Correlation $\rho = 0.6$. Find the CV of the cumulative score.

> *Why: Cumulative score = sum of correlated normals. Need mean, then SD, then CV = SD/mean.*
> $E(S) = 40 + 30 = 70$
> $Var(S) = 5^2 + 7^2 + 2(0.6)(5)(7) = 25 + 49 + 42 = 116$
> $\sigma_S = \sqrt{116} \approx 10.77$
> $CV = \frac{10.77}{70} \approx 0.154$
> **Between 0.0 to 0.25** ✓
> *(CV is a unitless measure of relative variability)*

---

### Chi-Square Distribution

$$\chi^2 = \sum Z_i^2, \quad df = k$$

$$\text{Mean} = k, \quad Var = 2k$$

**Q21:** Which is true about the Chi-Square Distribution?

> Used primarily for hypothesis testing of categorical data (goodness-of-fit, independence).
> Right-skewed, only takes non-negative values.

---

### Student's t Distribution

$$t = \frac{Z}{\sqrt{\chi^2 / k}}$$

$$\text{Mean} = 0, \quad Var = \frac{k}{k-2}$$

* Bell-shaped, heavier tails than normal
* Approaches normal as $k \to \infty$

**Q5:** Probability that $t$ with 5 df takes values between −2.0 and 0.5:

> *Why: Direct t-distribution CDF problem — use t-table to bound tail probabilities.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find tail areas for $t = -2.0$ and $t = 0.5$ at $df = 5$.
> * **Row & Column:**
>   - Go to Row $df = 5$.
>   - Under Column $\text{Upper Tail Area} = 0.050$, the critical value is $t = 2.015$.
>   - Since $|-2.0| \approx 2.015$, lower-tail probability $P(t < -2.0) \approx 0.05$.
>   - For $t = 0.5$, cumulative area $P(t < 0.5) \approx 0.68$.
>   - $P(-2.0 < t < 0.5) = P(t < 0.5) - P(t < -2.0) = 0.68 - 0.05 = 0.63$.
> **Between 0.60 and 0.80** ✓

**Q22:** Which is true about the Student's t-Distribution?

> Used when sample size is small and population σ is unknown.
> Symmetric around mean of 0, fatter tails than normal.

---

### F Distribution

$$F = \frac{\chi_1^2 / k_1}{\chi_2^2 / k_2}$$

$$\text{Mean} = \frac{k_2}{k_2 - 2}$$

**Q23:** Which is true about the F-Distribution?

> Used to test the equality of variances between two populations.
> Ratio of two chi-square variables; used in ANOVA.

---

### Distribution Properties (True/False)

**Q24:** All true:

> Chi-square distribution is used to test independence of categorical variables. ✓
> Student's t approaches normal as sample size increases. ✓
> F-distribution is used to compare two population variances. ✓
> Chi-square, t, and F distributions are all continuous probability distributions. ✓

---

## MODULE 2: Sampling & Sampling Distributions

---

### Standard Error of Mean

$$SE = \frac{\sigma}{\sqrt{n}}$$

### Variance of Sample Mean

$$Var(\bar{X}) = \frac{\sigma^2}{n}$$

### Standard Error of Proportion

$$SE = \sqrt{\frac{p(1-p)}{n}}$$

**Q1:** Average daily earnings = 2400, SD = 360, sample of 45. Probability sample mean between 2300 and 2500?

> *Why: n = 45 ≥ 30, σ known — CLT applies, use Z with SE of sample mean.*
> $SE = \frac{360}{\sqrt{45}} \approx 53.67$
> $Z_1 = \frac{2300 - 2400}{53.67} \approx -1.86$
> $Z_2 = \frac{2500 - 2400}{53.67} \approx 1.86$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Find the area under the standard normal curve between $Z = -1.86$ and $Z = 1.86$.
> * **Row & Column:**
>   - Go to Row `1.8` and Column `.06` $\implies P(Z \le 1.86) = 0.9686$.
>   - By symmetry, lower tail $P(Z \le -1.86) = 1 - 0.9686 = 0.0314$.
>   - $P(-1.86 < Z < 1.86) = 0.9686 - 0.0314 = 0.9372$.
> **Between 0.75 and 1.00** ✓

**QMay26-3:** 18 customers at MTR restaurant. Sample mean = 320, sample SD = 64. Find the standard error.

> *Why: Standard error of the sample mean — direct formula application.*
> $SE = \frac{s}{\sqrt{n}} = \frac{64}{\sqrt{18}} \approx 15.09$
> **Between 12 to 16** ✓

**Q12:** The variance of the sampling distribution of the sample mean is:

> *Why: Variance of X̄ shrinks by factor n — central property of sampling distributions.*
> $Var(\bar{X}) = \frac{\sigma^2}{n}$
> **Answer: $\sigma^2 / n$** ✓

---

### Central Limit Theorem (CLT)

For large $n$ ($\ge 30$):

$$\bar{X} \sim N\left(\mu, \frac{\sigma}{\sqrt{n}}\right)$$

#### Z-score for Sample Mean

$$Z = \frac{\bar{X} - \mu}{\sigma / \sqrt{n}}$$

**Q11:** Muffins: mean 100 gms, SD 5 gms. Sample of 25. Probability sample mean > 102 gms?

> *Why: σ known, finding P(X̄ > value) — standardize to Z and look up normal table.*
> $SE = \frac{5}{\sqrt{25}} = 1$
> $z = \frac{102 - 100}{1} = 2.0$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** We need the upper tail area $P(Z > 2.0)$ because the question asks for mean $> 102$.
> * **Row & Column:** Go to Row `2.0` and Column `.00` $\implies P(Z \le 2.0) = 0.9772$.
> * **Calculation:** $P(Z > 2.0) = 1 - P(Z \le 2.0) = 1 - 0.9772 = 0.0228$.
> **≈ 0.022** ✓

**Q29:** Which statement best describes the CLT?

> The sampling distribution of the sample mean approaches a normal distribution as the sample size increases.

---

### Sampling Distribution of Proportion

$$\hat{p} \sim N\left(p, \sqrt{\frac{p(1-p)}{n}}\right)$$

#### Z-score for Sample Proportion

$$Z = \frac{\hat{p} - p}{\sqrt{\frac{p(1-p)}{n}}}$$

Conditions: $np \ge 5$ and $n(1-p) \ge 5$

**Q6:** 25% of sales are credit sales. Sample of 60. Probability proportion > 30%?

> *Why: np = 15 ≥ 5, n(1−p) = 45 ≥ 5 — normal approximation valid for sample proportion.*
> $SE = \sqrt{\frac{0.25 \times 0.75}{60}} = \sqrt{0.003125} \approx 0.0559$
> $Z = \frac{0.30 - 0.25}{0.0559} \approx 0.894$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Find upper tail probability $P(Z > 0.894)$ for sample proportion exceeding 30%.
> * **Row & Column:**
>   - Row `0.8`, Col `.09` gives $0.8133$ (for $Z = 0.89$)
>   - Row `0.9`, Col `.00` gives $0.8159$ (for $Z = 0.90$)
>   - Linear interpolation for $Z = 0.894 \implies P(Z \le 0.894) \approx 0.8144$.
> * **Calculation:** $P(Z > 0.894) = 1 - 0.8144 \approx 0.1856$.
> **Between 0.00 and 0.25** ✓

**Q30:** Which is true about the sampling distribution of the sample proportion?

> Approaches normal as $n$ increases, given $np$ and $n(1-p)$ are greater than 10.

---

### Sample Variance & Chi-Square Relation

$$s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}$$

$$\frac{(n-1)s^2}{\sigma^2} \sim \chi^2_{n-1}$$

**Q7:** Adoptions over 8 weeks: 5, 8, 6, 12, 10, 9, 7, 11. Find mean and variance.

> *Why: Descriptive stats from raw data — use sample variance formula (divide by n−1).*
> $\bar{x} = \frac{68}{8} = 8.5$
> Squared deviations: 12.25, 0.25, 6.25, 12.25, 2.25, 0.25, 2.25, 6.25 → Sum = 42
> $s^2 = \frac{42}{7} = 6.00$
> **Mean = 8.5, Variance = 6.00** ✓
> *(Always divide by $(n-1)$ for sample variance)*

---

### Binomial Distribution

$$P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}$$

**Q9:** 5% defective bulbs. Sample of 20. Probability at least 2 defective?

> *Why: Fixed n, constant p, two outcomes — use binomial distribution.*
> $P(X=0) = \binom{20}{0}(0.05)^0(0.95)^{20} \approx 0.3585$
> $P(X=1) = \binom{20}{1}(0.05)^1(0.95)^{19} \approx 0.3774$
> $P(X \ge 2) = 1 - (0.3585 + 0.3774) = 1 - 0.7359$
> 📋 **Table Lookup (Cumulative Binomial Distribution Table):**
> * **Table:** Cumulative Binomial Probability Table ($P(X \le k)$).
> * **Why:** We need $P(X \ge 2) = 1 - P(X \le 1)$ for $n = 20, p = 0.05$.
> * **Block, Row & Column:**
>   - Locate section for sample size $n = 20$.
>   - Go to Row $k = 1$ and Column $p = 0.05 \implies P(X \le 1) = 0.7358$.
> * **Calculation:** $P(X \ge 2) = 1 - 0.7358 = 0.2642 \approx 0.26$.
> **≈ 0.26** ✓

**Q4:** 70% satisfied. Sample of 20. Probability at least 12 NOT satisfied?

> *Why: Reframe as binomial — "not satisfied" has p = 0.30, fixed n = 20.*
> Let $X$ = unsatisfied, $p = 0.30$, $X \sim B(20, 0.30)$
> 📋 **Table Lookup (Cumulative Binomial Distribution Table):**
> * **Table:** Cumulative Binomial Probability Table ($P(X \le k)$).
> * **Why:** We need $P(X \ge 12) = 1 - P(X \le 11)$ for $n = 20, p = 0.30$.
> * **Block, Row & Column:**
>   - Locate section for sample size $n = 20$.
>   - Go to Row $k = 11$ and Column $p = 0.30 \implies P(X \le 11) = 0.9949$.
> * **Calculation:** $P(X \ge 12) = 1 - 0.9949 = 0.0051 \approx 0.005$.
> **≈ 0.005 → Between 0.00 and 0.25** ✓
> *(Reframe the problem: "not satisfied" = complement probability)*

---

### Sampling Concepts

**Q25:** Which step is NOT part of the sampling process?

> Analyzing the data is a post-sampling activity, not part of the sampling process itself.

**Q26:** Which is an example of a probability sampling method?

> Simple random sampling — every member has an equal, known, non-zero chance of selection.

**Q27:** Primary objective of analyzing sample data?

> To infer characteristics of the population.

**Q28:** What best describes a sampling distribution?

> The distribution of a sample statistic calculated from repeated samples.

**Q31:** Sampling variance of a sample mean vs sample size?

> Sampling variance $\sigma^2/n$ decreases as $n$ increases.

**Q32:** What is a point estimator?

> A statistic used to estimate a population parameter (e.g., $\bar{x}$ estimates $\mu$).

**Q33:** Example of a non-sampling error?

> Using a sampling frame that excludes part of the population (coverage error).

---

## MODULE 3: Confidence Intervals & Estimation

---

### General Form

$$\text{Point Estimate} \pm \text{Margin of Error}$$

---

### CI for Mean — σ Known (Z-interval)

$$\bar{x} \pm Z_{\alpha/2} \cdot \frac{\sigma}{\sqrt{n}}$$

**Q13:** $n=25$, $\bar{x}=370$, $\sigma=75$. Find 95% CI.

> *Why: σ known — use Z-interval for confidence interval of the mean.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** For a 95% CI, $\alpha = 0.05 \implies$ each tail has $\alpha/2 = 0.025$, requiring cumulative area $= 1 - 0.025 = 0.9750$.
> * **Row & Column:** Search inside the **body** of the table for $0.9750$:
>   - Exactly at Row `1.9` and Column `.06` $\implies Z_{0.025} = 1.96$.
> $ME = 1.96 \times \frac{75}{\sqrt{25}} = 1.96 \times 15 = 29.4$
> CI = $370 \pm 29.4$
> **[341, 399]** ✓

**Q50:** $n=40$, $\bar{x}=18$, $s=4$. Margin of error for 85% CI?

> *Why: Large n (40 ≥ 30) — use Z even though σ unknown; find Z for 85% confidence.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** For an 85% CI, $\alpha = 0.15 \implies \alpha/2 = 0.075$, requiring cumulative area $= 1 - 0.075 = 0.9250$.
> * **Row & Column:** Search inside the **body** of the table for $0.9250$:
>   - Row `1.4`, Column `.04` gives $0.9251$ (closest to $0.9250$) $\implies Z_{0.075} \approx 1.44$.
> $ME = 1.44 \times \frac{4}{\sqrt{40}} = 1.44 \times 0.632 \approx 0.91$
> **Between 0.75 and 1.25** ✓

---

### CI for Mean — σ Unknown (t-interval)

$$\bar{x} \pm t_{\alpha/2, \; n-1} \cdot \frac{s}{\sqrt{n}}$$

**Q14:** $n=20$, $\bar{x}=51$, $s=7$. Margin of error for 90% CI?

> *Why: σ unknown, small n (20 < 30) — use t-interval with df = n−1.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Critical Values Table.
> * **Why:** For 90% confidence with $n = 20$, upper tail area is $\alpha/2 = 0.10 / 2 = 0.050$, and $df = n - 1 = 19$.
> * **Row & Column:** Go to Row $df = 19$, Column $\text{Upper Tail Area} = 0.050$ (or $\text{Two-Tail Area} = 0.10$) $\implies t_{0.050, 19} = 1.729$.
> $ME = 1.729 \times \frac{7}{\sqrt{20}} = 1.729 \times 1.565 \approx 2.71$
> **ME ≈ 2.71** ✓

**Q57:** $n=16$, $\bar{x}=19$, $s=5$. Margin of error for 95% CI?

> *Why: σ unknown, small n (16 < 30) — use t-interval.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Critical Values Table.
> * **Why:** For 95% confidence with $n = 16$, upper tail area is $\alpha/2 = 0.05 / 2 = 0.025$, and $df = 16 - 1 = 15$.
> * **Row & Column:** Go to Row $df = 15$, Column $\text{Upper Tail Area} = 0.025$ (or $\text{Two-Tail Area} = 0.05$) $\implies t_{0.025, 15} = 2.131$.
> $ME = 2.131 \times \frac{5}{4} = 2.66$
> **Between 2.5 and 3.0** ✓

**Q58:** $n=16$, $s=5$. Standard error for 85% CI?

> *Why: SE depends only on s and n, not on confidence level.*
> $SE = \frac{s}{\sqrt{n}} = \frac{5}{4} = 1.25$
> **Between 1.0 and 2.0** ✓
> *(Standard error is independent of confidence level)*

**QMay26-4:** $n=18$, $\bar{x}=320$, $s=64$. Margin of error for 80% CI?

> *Why: σ unknown, small n (18 < 30) — use t-interval with df = n−1.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Critical Values Table.
> * **Why:** For 80% confidence with $n = 18$, upper tail area is $\alpha/2 = 0.20 / 2 = 0.10$, and $df = 18 - 1 = 17$.
> * **Row & Column:** Go to Row $df = 17$, Column $\text{Upper Tail Area} = 0.10$ (or $\text{Two-Tail Area} = 0.20$) $\implies t_{0.10, 17} \approx 1.333$.
> $SE = \frac{64}{\sqrt{18}} \approx 15.09$
> $ME = 1.333 \times 15.09 \approx 20.11$
> **Between 18 to 24** ✓

**QMay26-5:** $n=18$, $\bar{x}=320$, $s=64$. Lower limit for 99% CI?

> *Why: σ unknown, small n — use t-interval. Lower limit = $\bar{x} - ME$.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Critical Values Table.
> * **Why:** For 99% confidence with $n = 18$, upper tail area is $\alpha/2 = 0.01 / 2 = 0.005$, and $df = 18 - 1 = 17$.
> * **Row & Column:** Go to Row $df = 17$, Column $\text{Upper Tail Area} = 0.005$ (or $\text{Two-Tail Area} = 0.01$) $\implies t_{0.005, 17} \approx 2.898$.
> $ME = 2.898 \times \frac{64}{\sqrt{18}} \approx 43.72$
> Lower limit $= 320 - 43.72 = 276.28$
> **Between 260 to 280** ✓

---

### CI for Proportion

$$\hat{p} \pm Z_{\alpha/2} \cdot \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

**Q15:** $n=900$, 396 satisfied. Find 90% CI for proportion.

> *Why: Large n, estimating population proportion — use Z-interval for p̂.*
> $\hat{p} = 396/900 = 0.44$
> $SE = \sqrt{\frac{0.44 \times 0.56}{900}} \approx 0.01655$
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** For a 90% CI, $\alpha = 0.10 \implies \alpha/2 = 0.05$, requiring cumulative area $= 1 - 0.05 = 0.9500$.
> * **Row & Column:** In the body of the table, $0.9500$ lies halfway between Row `1.6`, Col `.04` ($0.9495$) and Col `.05` ($0.9505$) $\implies Z_{0.05} = 1.645$.
> $ME = 1.645 \times 0.01655 \approx 0.0272$
> CI = $0.44 \pm 0.0272$
> **[0.41, 0.47]** ✓

**Q59:** $n=24$, 7 students spend >2 hrs. Margin of error for 80% CI?

> *Why: Proportion CI — use Z-interval with p̂ from sample.*
> $\hat{p} = 7/24 \approx 0.2917$
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** For an 80% CI, $\alpha = 0.20 \implies \alpha/2 = 0.10$, requiring cumulative area $= 1 - 0.10 = 0.9000$.
> * **Row & Column:** In the body of the table, Row `1.2`, Col `.08` gives $0.8997 \approx 0.9000 \implies Z_{0.10} = 1.28$.
> $ME = 1.28 \times \sqrt{\frac{0.2917 \times 0.7083}{24}} \approx 1.28 \times 0.0927 \approx 0.118$
> **Between 0.10 and 0.20** ✓

**Q66:** $n=42$, 18 have MBA. Margin of error for 90% CI?

> *Why: Proportion CI with large n — use Z-interval.*
> $\hat{p} = 18/42 \approx 0.4286$
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 90% CI $\implies \alpha/2 = 0.05 \implies$ cumulative area $= 0.9500$.
> * **Row & Column:** Midpoint of Row `1.6`, Col `.04` ($0.9495$) and Col `.05` ($0.9505$) $\implies Z_{0.05} = 1.645$.
> $ME = 1.645 \times \sqrt{\frac{0.4286 \times 0.5714}{42}} \approx 1.645 \times 0.0763 \approx 0.1256$
> **Between 0.10 and 0.20** ✓

**Q65:** $n=24$, 7 students. Standard error of proportion?

> *Why: SE of proportion depends only on p̂ and n — no table lookup needed.*
> $SE = \sqrt{\frac{0.2917 \times 0.7083}{24}} \approx 0.0927$
> **Between 0.0 and 0.5** ✓

**QMay26-12:** 23 out of 75 vehicles not insured. Margin of error for 80% CI?

> *Why: Proportion CI — use Z-interval with p̂ from sample.*
> $\hat{p} = 23/75 \approx 0.3067$
> $SE = \sqrt{\frac{0.3067 \times 0.6933}{75}} \approx 0.0532$
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 80% CI $\implies \alpha/2 = 0.10 \implies$ cumulative area $= 0.9000$.
> * **Row & Column:** Row `1.2`, Col `.08` gives $0.8997 \approx 0.9000 \implies Z_{0.10} \approx 1.282$.
> $ME = 1.282 \times 0.0532 \approx 0.0682$
> **Between 0.05 and 0.10** ✓

**QMay26-13:** Same data. Lower limit for 90% CI?

> *Why: 90% CI for proportion — compute ME then subtract from p̂.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 90% CI $\implies \alpha/2 = 0.05 \implies$ cumulative area $= 0.9500$.
> * **Row & Column:** Between Row `1.6`, Col `.04` and Col `.05` $\implies Z_{0.05} \approx 1.645$.
> $ME = 1.645 \times 0.0532 \approx 0.0875$
> Lower limit $= 0.3067 - 0.0875 = 0.2192$
> **Between 0.0 to 0.25** ✓

**QMay26-14:** Same data. Upper limit for 99% CI?

> *Why: 99% CI for proportion — compute ME then add to p̂.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 99% CI $\implies \alpha/2 = 0.005 \implies$ cumulative area $= 1 - 0.005 = 0.9950$.
> * **Row & Column:** Row `2.5`, between Col `.07` ($0.9949$) and Col `.08` ($0.9951$) $\implies Z_{0.005} \approx 2.576$.
> $ME = 2.576 \times 0.0532 \approx 0.137$
> Upper limit $= 0.3067 + 0.137 = 0.4437$
> **Between 0.25 to 0.50** ✓

---

### CI for Variance (Chi-Square)

$$\frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}$$

#### CI for Standard Deviation

Take square root of both bounds.

**Q61:** $n=10$, $s=7$. Find 95% CI for standard deviation.

> *Why: CI for σ uses chi-square distribution — look up both tail critical values.*
> $df = 9$, $s^2 = 49$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** A 95% CI has $\alpha = 0.05$. We need two cutoffs at $df = 10 - 1 = 9$:
>   - $\chi^2_{\alpha/2} = \chi^2_{0.025, 9}$ (upper tail 0.025) for Lower Limit denominator.
>   - $\chi^2_{1-\alpha/2} = \chi^2_{0.975, 9}$ (upper tail 0.975) for Upper Limit denominator.
> * **Row & Column:** Go to Row $df = 9$:
>   - Under Column $\text{Area} = 0.025 \implies \chi^2_{0.025, 9} = 19.023$.
>   - Under Column $\text{Area} = 0.975 \implies \chi^2_{0.975, 9} = 2.700$.
> Lower $= \sqrt{\frac{9 \times 49}{19.023}} = 4.81$
> Upper $= \sqrt{\frac{9 \times 49}{2.7}} = 12.78$
> **CI for σ: [4.8, 12.8] lakhs** ✓
> *(Take square root of variance bounds to get SD bounds)*

**QMay26-15:** 12 flights, variance in fuel consumption $s^2 = 150$. Lower limit for 80% CI of variance?

> *Why: CI for variance uses chi-square — lower limit uses upper-tail chi-square critical value.*
> $df = 12 - 1 = 11$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** For 80% confidence, $\alpha = 0.20 \implies$ lower limit denominator needs upper-tail cutoff $\alpha/2 = 0.10$ at $df = 11$.
> * **Row & Column:** Go to Row $df = 11$, Column $\text{Area} = 0.10 \implies \chi^2_{0.10, 11} \approx 17.275$.
> Lower limit $= \frac{(n-1)s^2}{\chi^2_{\alpha/2}} = \frac{11 \times 150}{17.275} \approx 95.51$
> **Between 0 to 200** ✓

**QMay26-16:** Same data. Upper limit for 90% CI of variance?

> *Why: Upper limit of variance CI uses lower-tail chi-square critical value.*
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** For 90% confidence, $\alpha = 0.10 \implies$ upper limit denominator needs upper-tail area $1 - \alpha/2 = 1 - 0.05 = 0.95$ at $df = 11$.
> * **Row & Column:** Go to Row $df = 11$, Column $\text{Area} = 0.95 \implies \chi^2_{0.95, 11} \approx 4.575$.
> Upper limit $= \frac{11 \times 150}{4.575} \approx 360.66$
> **Between 200 to 400** ✓

**QMay26-17:** Same data. Upper limit for 99% CI of variance?

> *Why: Higher confidence → wider interval → larger upper bound. Use far lower-tail chi-square.*
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** For 99% confidence, $\alpha = 0.01 \implies$ upper limit denominator needs upper-tail area $1 - \alpha/2 = 1 - 0.005 = 0.995$ at $df = 11$.
> * **Row & Column:** Go to Row $df = 11$, Column $\text{Area} = 0.995 \implies \chi^2_{0.995, 11} \approx 2.603$.
> Upper limit $= \frac{11 \times 150}{2.603} \approx 633.88$
> **Between 600 to 800** ✓
> *(Higher confidence level → wider CI → more extreme chi-square critical values)*

---

### Sample Size for Mean

$$n = \left(\frac{Z_{\alpha/2} \cdot \sigma}{E}\right)^2$$

*(E = desired margin of error)*

---

### Sample Size for Proportion

$$n = \frac{Z_{\alpha/2}^2 \cdot p(1-p)}{E^2}$$

If $p$ unknown → use $p = 0.5$

**Q53:** $\hat{p} = 18/42 \approx 0.4286$. Smallest $n$ for 99% CI with $E = 0.1$?

> *Why: Sample size formula for proportion — need Z for 99% confidence.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 99% CI requires $\alpha/2 = 0.005$, corresponding to cumulative area $= 1 - 0.005 = 0.9950$.
> * **Row & Column:** Search table body for $0.9950 \implies$ Row `2.5`, between Col `.07` ($0.9949$) and Col `.08` ($0.9951$) $\implies Z = 2.576$.
> $n = \frac{2.576^2 \times 0.4286 \times 0.5714}{0.01} = \frac{6.636 \times 0.2449}{0.01} \approx 162.5$
> Smallest listed size ≥ 162.5 → **200** ✓

**Q60:** 7/24 students. Smallest $n$ for 90% CI with $E = 0.05$?

> *Why: Sample size for proportion — use p = 0.5 (conservative) since exact p unknown.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Inverse Lookup):**
> * **Table:** Standard Normal (Z) Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** 90% CI requires $\alpha/2 = 0.05$, corresponding to cumulative area $= 0.9500$.
> * **Row & Column:** Midpoint of Row `1.6`, Col `.04` and Col `.05` $\implies Z = 1.645$.
> Conservative: $p = 0.5$, $z = 1.645$
> $n = \frac{1.645^2 \times 0.25}{0.0025} = \frac{0.6765}{0.0025} \approx 271$
> Nearest listed option → **300** ✓
> *(Use $p = 0.5$ when unknown — gives largest conservative estimate)*

---

### Properties of Estimators

* **Unbiased:** $E(\bar{X}) = \mu$
* **Efficient:** Minimum variance
* **Consistent:** Better as $n$ increases
* **Sufficient:** Uses all sample info

---

### Confidence Interval Concepts

**Q34:** What does a 95% confidence interval mean?

> If we take 100 different samples, approximately 95 of the CIs would contain the true parameter.

**Q35:** Effect of sample size on margin of error?

> Increasing $n$ reduces the margin of error → narrower, more precise CI.

**Q36:** When σ is known, which distribution is used?

> The Z-distribution, because the population σ is known.

**Q37:** What does sample standard deviation $s$ represent when σ is unknown?

> An estimate of the population standard deviation.

**Q38:** What info is required to determine sample size for a CI?

> Desired confidence level, population SD (or sample SD), and margin of error.

**Q39:** How to estimate $p$ when unknown for sample size calculation?

> Use $p = 0.5$ — maximizes variance, gives conservative (largest) sample size.

**Q40:** What describes the CI for population variance?

> It estimates the range within which the true population variance lies.

---

## MODULE 4: Hypothesis Testing

---

### Hypotheses

$$H_0 \text{ contains: } =, \le, \ge$$

$$H_a \text{ contains: } \ne, <, >$$

### Type of Tests

| $H_a$ | Test Type |
|--------|-----------|
| $\ne$ | Two-tailed |
| $>$ | Right-tailed |
| $<$ | Left-tailed |

### Decision Rule

$$\text{Reject } H_0 \text{ if } p\text{-value} \le \alpha$$

---

### Hypothesis Formulation Rules

| Claim | $H_0$ | $H_a$ | Tail |
|-------|--------|--------|------|
| Equal to value | $\mu = k$ | $\mu \ne k$ | Two-tailed |
| More than value | $\mu \le k$ | $\mu > k$ | Upper |
| Less than value | $\mu \ge k$ | $\mu < k$ | Lower |

**Q51:** Test if average contacts = 15.

> *Why: Claim is "equal to" → two-tailed test with equality in H₀.*
> **$H_0: \mu = 15$, $H_a: \mu \ne 15$** ✓ (two-tailed)

**Q56:** Test if average duration > 16 weeks.

> *Why: Claim is "more than" → upper-tailed test.*
> **$H_0: \mu \le 16$, $H_a: \mu > 16$** ✓ (upper-tailed)

**Q64:** Test if average discharge time < 150 min.

> *Why: Claim is "less than" → lower-tailed test.*
> **$H_0: \mu \ge 150$, $H_a: \mu < 150$** ✓ (lower-tailed)

---

### Z-test for Mean (σ known or large n)

$$Z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$

**Q62:** $n=40$, $\bar{x}=18$, $s=4$. Test if $\mu > 16$. Find p-value.

> *Why: Large n (40 ≥ 30) — use Z-test even though σ unknown. Upper-tailed test.*
> $H_0: \mu \le 16$, $H_a: \mu > 16$
> $z = \frac{18 - 16}{4/\sqrt{40}} = \frac{2}{0.632} = 3.16$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Upper-tailed p-value $= P(Z > 3.16) = 1 - P(Z \le 3.16)$.
> * **Row & Column:** Go to Row `3.1`, Col `.06` (or maximum row `3.0`, Col `.09` which gives $0.9990$) $\implies P(Z \le 3.16) \approx 0.9992$.
> * **Calculation:** $P(Z > 3.16) = 1 - 0.9992 = 0.0008$.
> **Between 0.00 and 0.01** ✓

---

### t-test for Mean (σ unknown, small n)

$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}, \quad df = n - 1$$

**Q52:** $n=16$, $\bar{x}=19$, $s=5$. Test if $\mu = 15$. Find p-value.

> *Why: σ unknown, small n (16 < 30) — use t-test. Two-tailed since H₁: μ ≠ 15.*
> $H_0: \mu = 15$, $H_a: \mu \ne 15$ (two-tailed)
> $t = \frac{19 - 15}{5/\sqrt{16}} = \frac{4}{1.25} = 3.2$, $df = 16 - 1 = 15$
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find two-tailed p-value for test statistic $t = 3.2$ at $df = 15$.
> * **Row & Column:** Go to Row $df = 15$:
>   - The critical value for Column $\text{Upper Tail Area} = 0.005$ is $t = 2.947$.
>   - Since our test statistic $t = 3.2 > 2.947$, the single-tail probability is $< 0.005$.
>   - Two-tailed p-value $= 2 \times P(t_{15} > 3.2) < 2 \times 0.005 = 0.01$.
> **Between 0.00 and 0.01** ✓

**Q63:** Same setup. Test statistic value?

> *Why: Same t-test setup as Q52 — just compute the test statistic.*
> $t = \frac{19 - 15}{5/4} = 3.2$
> **More than 2.0** ✓

**Q16:** $n=50$, $\bar{x}=298$, $s=5$. Test if $\mu = 300$.

> *Why: Large n (50 ≥ 30) — t ≈ Z. Two-tailed test for μ = 300.*
> $t = \frac{298 - 300}{5/\sqrt{50}} = \frac{-2}{0.7071} \approx -2.828$, $df=49$
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find two-tailed p-value for $|t| = 2.828$ with $df \approx 50$.
> * **Row & Column:** Go to Row $df = 50$:
>   - Column $\text{Upper Tail Area} = 0.005 \implies t = 2.678$.
>   - Since $|t| = 2.828 > 2.678$, single-tail probability $P(t > 2.828) < 0.005$ ($\approx 0.0035$).
>   - Two-tailed p-value $= 2 \times 0.0035 \approx 0.007$.
> **≈ 0.007** ✓

**QMay26-18:** $n=17$, $\bar{x}=16$, $s=2$. Test if $\mu > 15$. Find standard error.

> *Why: SE for t-test — depends only on s and n.*
> $SE = \frac{s}{\sqrt{n}} = \frac{2}{\sqrt{17}} \approx 0.485$
> **Between 0 to 0.6** ✓

**QMay26-19:** Same data. Find the test statistic.

> *Why: σ unknown, small n — use t-test. Upper-tailed since $H_a: \mu > 15$.*
> $H_0: \mu \le 15$, $H_a: \mu > 15$
> $t = \frac{16 - 15}{2/\sqrt{17}} = \frac{1}{0.485} \approx 2.06$, $df = 16$
> **Between 1.8 to 2.4** ✓

**QMay26-20:** Same data. Find the p-value.

> *Why: Upper-tailed t-test — p-value = P(t > test stat) with df = 16.*
> 📋 **Table Lookup (Student's t-Distribution Table):**
> * **Table:** Student's t Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find upper-tail area $P(t_{16} > 2.06)$ for right-tailed test at $df = 17 - 1 = 16$.
> * **Row & Column:** Go to Row $df = 16$ and locate where $t = 2.06$ falls:
>   - Column $\text{Upper Tail Area} = 0.050 \implies t = 1.746$
>   - Column $\text{Upper Tail Area} = 0.025 \implies t = 2.120$
>   - Since $1.746 < 2.06 < 2.120$, the p-value is between $0.025$ and $0.050$.
> **Between 0.0 to 0.05** ✓
> *(p-value < α = 0.05 → reject $H_0$; evidence supports $\mu > 15$)*

---

### Z-test for Proportion

$$Z = \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}$$

**Q17:** $n=400$, 52 in unions. Test if $p > 0.12$. Find p-value.

> *Why: Testing proportion — use Z-test for proportion. Upper-tailed.*
> $\hat{p} = 52/400 = 0.13$
> $z = \frac{0.13 - 0.12}{\sqrt{\frac{0.12 \times 0.88}{400}}} = \frac{0.01}{0.01625} \approx 0.615$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Upper-tailed test ($H_a: p > 0.12$) $\implies \text{p-value} = P(Z > 0.615) = 1 - P(Z \le 0.615)$.
> * **Row & Column:** Go to Row `0.6`:
>   - Column `.01` gives $0.7291$ (for $Z = 0.61$)
>   - Column `.02` gives $0.7324$ (for $Z = 0.62$)
>   - Midpoint for $Z = 0.615 \implies P(Z \le 0.615) \approx 0.7307$.
> * **Calculation:** $P(Z > 0.615) = 1 - 0.7307 = 0.2693 \approx 0.269$.
> **≈ 0.269** ✓

**Q54:** $n=42$, 18 have MBA. Test if $p > 0.50$.

> *Why: Testing proportion > 0.50 — Z-test for proportion, upper-tailed.*
> $\hat{p} = 0.4286$, upper-tail test
> $Z = \frac{0.4286 - 0.5}{\sqrt{0.5 \times 0.5/42}} = \frac{-0.0714}{0.07715} \approx -0.925$
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Upper-tail p-value for negative z-score: $P(Z > -0.925) = P(Z < 0.925)$.
> * **Row & Column:**
>   - Go to Row `0.9`, Column `.02` $\implies 0.8212$ (for $Z = 0.92$) and Column `.03` $\implies 0.8238$ (for $Z = 0.93$).
>   - Midpoint $\implies P(Z < 0.925) \approx 0.8225$.
> * **Calculation:** $p\text{-value} = P(Z > -0.925) = 0.8225$.
> **Between 0.80 and 0.95** ✓
> *(Negative z in upper-tail test → large p-value → fail to reject $H_0$)*

**QMay26-6:** 17 out of 30 young men use dating apps. Test if $p < 0.55$. Find the standard error.

> *Why: Under $H_0$, SE for proportion uses the hypothesized $p_0$, not the sample proportion.*
> $H_0: p \ge 0.55$, $H_a: p < 0.55$
> $SE = \sqrt{\frac{p_0(1-p_0)}{n}} = \sqrt{\frac{0.55 \times 0.45}{30}} = \sqrt{0.00825} \approx 0.0908$
> **Between 0.0 to 0.25** ✓
> *(Use hypothesized p₀ for SE in hypothesis testing, not sample p̂)*

**QMay26-7:** Same data. Find the test statistic.

> *Why: Z-test for proportion — standardize sample proportion against hypothesized value.*
> $\hat{p} = 17/30 \approx 0.5667$
> $Z = \frac{0.5667 - 0.55}{0.0908} \approx 0.184$
> **Between 0.0 to 0.25** ✓

**QMay26-8:** Same data. Find the p-value.

> *Why: Lower-tailed test — p-value = P(Z < test statistic). Since Z is positive, p-value > 0.5.*
> 📋 **Table Lookup (Standard Normal / Z-Table — Direct Lookup):**
> * **Table:** Standard Normal Cumulative Distribution Table ($P(Z \le z)$).
> * **Why:** Lower-tailed test ($H_a: p < 0.55$) $\implies \text{p-value} = P(Z < 0.184)$.
> * **Row & Column:** Go to Row `0.1`:
>   - Column `.08` gives $0.5714$ (for $Z = 0.18$)
>   - Column `.09` gives $0.5753$ (for $Z = 0.19$)
>   - Interpolate for $Z = 0.184 \implies P(Z < 0.184) \approx 0.573$.
> $p\text{-value} = P(Z < 0.184) = 0.573$
> **Between 0.50 to 0.75** ✓
> *(Positive Z in a lower-tailed test → p-value > 0.5 → fail to reject $H_0$)*

---

### Chi-Square Test for Variance

$$\chi^2 = \frac{(n-1)s^2}{\sigma_0^2}, \quad df = n-1$$

**Q18:** $n=25$, $s=3$ (so $s^2=9$). Test if $\sigma^2 < 8$.

> *Why: Testing variance — use chi-square test. Lower-tailed since H₁: σ² < 8.*
> $\chi^2 = \frac{24 \times 9}{8} = 27$, $df = 25 - 1 = 24$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** For lower-tailed test ($H_a: \sigma^2 < 8$), find lower-tail probability $P(\chi^2_{24} < 27)$.
> * **Row & Column:** Go to Row $df = 24$:
>   - Column $\text{Area} = 0.90 \implies \chi^2_{0.90, 24} = 15.659$ (lower 10% cutoff)
>   - Column $\text{Area} = 0.10 \implies \chi^2_{0.10, 24} = 33.196$ (upper 10% cutoff)
>   - Since $15.659 < 27 < 33.196$, the lower-tail p-value lies between $0.10$ and $0.90$ (exact value $\approx 0.696$).
> $P(\chi^2 < 27)$ with $df=24 \approx 0.696$
> **p-value ≈ 0.696** ✓
> *(Lower-tailed test for variance)*

**Q55:** $n=25$, $s=35$. Test if $\sigma^2 > 900$.

> *Why: Testing if variance exceeds a value — chi-square test, upper-tailed.*
> $\chi^2 = \frac{24 \times 1225}{900} = \frac{29400}{900} \approx 32.67$, $df = 24$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** Upper-tailed test ($H_a: \sigma^2 > 900$) $\implies$ find upper-tail probability $P(\chi^2_{24} > 32.67)$.
> * **Row & Column:** Go to Row $df = 24$:
>   - Column $\text{Area} = 0.10 \implies \chi^2_{0.10, 24} = 33.196$.
>   - Since test statistic $32.67 < 33.196$, the area to the right is greater than $0.10$ ($> 10\%$).
> **More than 10.0** ✓

**Q67:** $n=10$, $s=7$. Test if $\sigma^2 = 25$.

> *Why: Testing variance equality — chi-square test, two-tailed.*
> $\chi^2 = \frac{9 \times 49}{25} = \frac{441}{25} = 17.64$, $df = 9$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find tail probability for test statistic $\chi^2 = 17.64$ at $df = 9$.
> * **Row & Column:** Go to Row $df = 9$:
>   - Column $\text{Area} = 0.05 \implies \chi^2_{0.05, 9} = 16.919$.
>   - Column $\text{Area} = 0.025 \implies \chi^2_{0.025, 9} = 19.023$.
>   - Since $16.919 < 17.64 < 19.023$, single-tail p-value is between $0.025$ and $0.05$, so two-tailed p-value is between $0.05$ and $0.10$ ($> 0.05$).
> **More than 10.0** ✓

**Q68:** $n=25$, $s=35$. Test if $\sigma^2 > 900$. Find p-value.

> *Why: Same chi-square test as Q55 — now find the p-value range from the table.*
> $\chi^2 = 32.67$, $df = 24$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** Find upper-tail area $P(\chi^2_{24} > 32.67)$.
> * **Row & Column:** Go to Row $df = 24$:
>   - Column $\text{Area} = 0.10 \implies \chi^2_{0.10, 24} = 33.196$.
>   - Column $\text{Area} = 0.05 \implies \chi^2_{0.05, 24} = 36.415$.
>   - Since $32.67 < 33.196$, p-value $> 0.10$, falling in the bracket between $0.05$ and $0.25$.
> $P(\chi^2 > 32.67)$ falls between 0.05 and 0.25
> **Between 0.05 and 0.25** ✓

**QMay26-9:** $n=22$, $\bar{x}=62$, $s=4.5$. Test if $\sigma^2 > 20$ at $\alpha = 0.1$. Find the test statistic.

> *Why: Testing variance — use chi-square test. $s^2 = 4.5^2 = 20.25$.*
> $H_0: \sigma^2 \le 20$, $H_a: \sigma^2 > 20$ (upper-tailed)
> $\chi^2 = \frac{(n-1)s^2}{\sigma_0^2} = \frac{21 \times 20.25}{20} = 21.2625$
> **Between 12 to 24** ✓

**QMay26-10:** Same data. Find the p-value.

> *Why: Upper-tail probability of chi-square distribution at the test statistic.*
> $\chi^2 = 21.2625$, $df = 22 - 1 = 21$
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Probabilities).
> * **Why:** For upper-tailed test ($H_a: \sigma^2 > 20$), find upper tail $P(\chi^2_{21} > 21.2625)$.
> * **Row & Column:** Go to Row $df = 21$:
>   - Since the expected mean of $\chi^2_{21}$ is $k = 21$, our test statistic $21.2625 \approx 21$ is right at the center/median of the distribution.
>   - Therefore, upper-tail area $P(\chi^2_{21} > 21.2625) \approx 0.443$.
> **Between 0.50 to 0.75** ✓
> *(Test stat ≈ df → p-value ≈ 0.5 — fail to reject $H_0$)*

**QMay26-11:** Same data. Find the critical value.

> *Why: Upper-tailed chi-square test — critical value at α = 0.1 with df = 21.*
> 📋 **Table Lookup (Chi-Square / $\chi^2$-Distribution Table):**
> * **Table:** Chi-Square ($\chi^2$) Distribution Table (Upper-Tail Critical Values).
> * **Why:** Upper-tailed rejection region cutoff with significance level $\alpha = 0.10$ and $df = 21$.
> * **Row & Column:** Go to Row $df = 21$, Column $\text{Upper Tail Area} = 0.10 \implies \chi^2_{0.10, 21} \approx 29.615$.
> **Between 24 to 36** ✓
> *(Since test stat 21.26 < critical value 29.615 → fail to reject $H_0$)*

---

### Hypothesis Testing Concepts

**Q41:** What is the purpose of significance level α?

> Probability of rejecting the null hypothesis when it is true (Type I error).

**Q42:** When do we reject $H_0$?

> When the p-value is less than or equal to α.

**Q43:** What is a Type I error?

> Rejecting a true null hypothesis (false positive).

**Q44:** Which test for population mean when $n > 30$?

> Z-test — CLT ensures normality of sample mean.

**Q45:** Which test for population proportion?

> Z-test — uses normal approximation to binomial.

**Q46:** Which test for population variance?

> Chi-square test.
## Covariance & Correlation

---

### Sample Covariance

$$S_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n-1}$$

**Q2:** Supply and price for 8 weeks: (5,2), (7,4), (9,8), (12,5), (10,7), (13,8), (16,16), (16,6). Find covariance.

> *Why: Measuring how two variables move together — use sample covariance formula (divide by n−1).*
> $\bar{x} = 7.0$, $\bar{y} = 11.0$
> $\sum(x_i - \bar{x})(y_i - \bar{y}) = 79.875$
> $Cov(X,Y) = \frac{79.875}{7} \approx 11.41$
> **≈ 11.4** ✓

---

### Pearson Correlation Coefficient

$$r = \frac{S_{xy}}{S_x \cdot S_y}, \quad -1 \le r \le 1$$

* $r = 0$: No linear relationship (non-linear may exist)
* Correlation ≠ Causation

**Q8:** Joint distribution of X and Y. Find correlation.

> *Why: Correlation = standardized covariance — scale-free measure of linear relationship.*
> $E[X]=1.5$, $Var(X)=0.25$, $\sigma_X=0.5$
> $E[Y]=1.3$, $Var(Y)=0.21$, $\sigma_Y=0.4582$
> $E[XY] = 1.9$
> $Cov(X,Y) = 1.9 - (1.5)(1.3) = -0.05$
> $r = \frac{-0.05}{0.5 \times 0.4582} \approx -0.218$
> **r ≈ −0.218** ✓

---

### Covariance & Correlation Concepts

**Q47:** If covariance between X and Y is zero, what does it imply?

> No **linear** relationship — a non-linear relationship could still exist.

**Q48:** Which statement about correlation is NOT true?

> "Correlation of 0 implies no relationship" is false — only no *linear* relationship.

**Q49:** Key advantage of correlation over covariance?

> Correlation is scale-free ($-1$ to $1$), making comparisons across datasets easier.

---

## Quick Reference: Which Test to Use

| Situation | Test | Distribution |
|-----------|------|--------------|
| Mean, σ known | Z-test | Standard Normal |
| Mean, σ unknown, small n | t-test | Student's t ($df = n-1$) |
| Proportion | Z-test | Standard Normal |
| Variance | Chi-square test | $\chi^2$ ($df = n-1$) |
| Compare two variances | F-test | F-distribution |

---

## Quick Reference: Critical Values

| Confidence Level | $Z_{\alpha/2}$ |
|------------------|----------------|
| 80% | 1.28 |
| 85% | 1.44 |
| 90% | 1.645 |
| 95% | 1.96 |
| 99% | 2.576 |

---

## Key Decision Rules Summary

| Rule | Detail |
|------|--------|
| Reject $H_0$ | p-value ≤ α |
| Sample Variance | Always divide by $(n-1)$ |
| σ unknown | Use t-distribution |
| σ known | Use Z-distribution |
| CLT condition | $n \ge 30$ |
| Proportion condition | $np \ge 5$ and $n(1-p) \ge 5$ |
| Unknown $p$ for sample size | Use $p = 0.5$ (conservative) |
| Chi-square | Right-skewed, never negative |
| Variances always ADD | Even in subtraction: $Var(X-Y) = \sigma_X^2 + \sigma_Y^2$ |
| Two-tailed p-value | Multiply single-tail probability by 2 |
| Correlation = 0 | No **linear** relationship (non-linear may exist) |