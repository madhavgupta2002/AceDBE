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

> *Why: Need cutoff for top 5% — find Z for 95th percentile, then convert back to raw score.*
> $\sigma = \sqrt{36} = 6$
> 📋 **Z-Table:** Find cumulative area = 0.95 → Row 1.6, Col .04 → 0.9495; Col .05 → 0.9505 → Z = 1.645
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
> 📋 **t-Table:** df = 5; $t_{0.050}$ = 2.015 → since |−2.0| < 2.015, $P(t < -2.0) \approx 0.05$
> $P(t < 0.5) \approx 0.68$; $P(t < -2.0) \approx 0.05$
> $P(-2.0 < t < 0.5) = 0.68 - 0.05 = 0.63$
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
> 📋 **Z-Table:** Row 1.8, Col .06 → 0.9686; by symmetry P(Z < −1.86) = 0.0314
> $P(-1.86 < Z < 1.86) = 0.9686 - 0.0314 = 0.9372$
> **Between 0.75 and 1.00** ✓

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
> 📋 **Z-Table:** Row 2.0, Col .00 → 0.9772
> $P(Z > 2.0) = 1 - 0.9772 = 0.0228$
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
> 📋 **Z-Table:** Row 0.8, Col .09 → 0.8133; Row 0.9, Col .00 → 0.8159; interpolate for Z = 0.894 ≈ 0.8144
> $P(Z > 0.894) \approx 0.1856$
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
> 📋 **Binomial Table:** n = 20, p = 0.05, k = 1 → P(X ≤ 1) = 0.7358
> **≈ 0.26** ✓

**Q4:** 70% satisfied. Sample of 20. Probability at least 12 NOT satisfied?

> *Why: Reframe as binomial — "not satisfied" has p = 0.30, fixed n = 20.*
> Let $X$ = unsatisfied, $p = 0.30$, $X \sim B(20, 0.30)$
> 📋 **Binomial Table:** n = 20, p = 0.30, k = 11 → P(X ≤ 11) = 0.9949
> $P(X \ge 12) = 1 - P(X \le 11) = 1 - 0.995$
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
> 📋 **Z-Table:** 95% CI → α/2 = 0.025 → Row 1.9, Col .06 → 0.9750 → $Z_{0.025}$ = 1.96
> $ME = 1.96 \times \frac{75}{\sqrt{25}} = 1.96 \times 15 = 29.4$
> CI = $370 \pm 29.4$
> **[341, 399]** ✓

**Q50:** $n=40$, $\bar{x}=18$, $s=4$. Margin of error for 85% CI?

> *Why: Large n (40 ≥ 30) — use Z even though σ unknown; find Z for 85% confidence.*
> 📋 **Z-Table:** 85% CI → α/2 = 0.075 → find area = 0.925 → Row 1.4, Col .04 → 0.9251 → $Z_{0.075} \approx 1.44$
> $ME = 1.44 \times \frac{4}{\sqrt{40}} = 1.44 \times 0.632 \approx 0.91$
> **Between 0.75 and 1.25** ✓

---

### CI for Mean — σ Unknown (t-interval)

$$\bar{x} \pm t_{\alpha/2, \; n-1} \cdot \frac{s}{\sqrt{n}}$$

**Q14:** $n=20$, $\bar{x}=51$, $s=7$. Margin of error for 90% CI?

> *Why: σ unknown, small n (20 < 30) — use t-interval with df = n−1.*
> 📋 **t-Table:** df = 19, α/2 = 0.05 → $t_{0.050, 19}$ = 1.729
> $ME = 1.729 \times \frac{7}{\sqrt{20}} = 1.729 \times 1.565 \approx 2.71$
> **ME ≈ 2.71** ✓

**Q57:** $n=16$, $\bar{x}=19$, $s=5$. Margin of error for 95% CI?

> *Why: σ unknown, small n (16 < 30) — use t-interval.*
> 📋 **t-Table:** df = 15, α/2 = 0.025 → $t_{0.025, 15}$ = 2.131
> $ME = 2.131 \times \frac{5}{4} = 2.66$
> **Between 2.5 and 3.0** ✓

**Q58:** $n=16$, $s=5$. Standard error for 85% CI?

> *Why: SE depends only on s and n, not on confidence level.*
> $SE = \frac{s}{\sqrt{n}} = \frac{5}{4} = 1.25$
> **Between 1.0 and 2.0** ✓
> *(Standard error is independent of confidence level)*

---

### CI for Proportion

$$\hat{p} \pm Z_{\alpha/2} \cdot \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

**Q15:** $n=900$, 396 satisfied. Find 90% CI for proportion.

> *Why: Large n, estimating population proportion — use Z-interval for p̂.*
> $\hat{p} = 396/900 = 0.44$
> $SE = \sqrt{\frac{0.44 \times 0.56}{900}} \approx 0.01655$
> 📋 **Z-Table:** 90% CI → α/2 = 0.05 → Row 1.6, Col .04/.05 → Z = 1.645
> $ME = 1.645 \times 0.01655 \approx 0.0272$
> CI = $0.44 \pm 0.0272$
> **[0.41, 0.47]** ✓

**Q59:** $n=24$, 7 students spend >2 hrs. Margin of error for 80% CI?

> *Why: Proportion CI — use Z-interval with p̂ from sample.*
> $\hat{p} = 7/24 \approx 0.2917$
> 📋 **Z-Table:** 80% CI → α/2 = 0.10 → Row 1.2, Col .08 → 0.8997 ≈ 0.90 → $z_{0.10}$ = 1.28
> $ME = 1.28 \times \sqrt{\frac{0.2917 \times 0.7083}{24}} \approx 1.28 \times 0.0927 \approx 0.118$
> **Between 0.10 and 0.20** ✓

**Q66:** $n=42$, 18 have MBA. Margin of error for 90% CI?

> *Why: Proportion CI with large n — use Z-interval.*
> $\hat{p} = 18/42 \approx 0.4286$
> 📋 **Z-Table:** 90% CI → Z = 1.645 (Row 1.6, Col .04/.05)
> $ME = 1.645 \times \sqrt{\frac{0.4286 \times 0.5714}{42}} \approx 1.645 \times 0.0763 \approx 0.1256$
> **Between 0.10 and 0.20** ✓

**Q65:** $n=24$, 7 students. Standard error of proportion?

> *Why: SE of proportion depends only on p̂ and n — no table lookup needed.*
> $SE = \sqrt{\frac{0.2917 \times 0.7083}{24}} \approx 0.0927$
> **Between 0.0 and 0.5** ✓

---

### CI for Variance (Chi-Square)

$$\frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}$$

#### CI for Standard Deviation

Take square root of both bounds.

**Q61:** $n=10$, $s=7$. Find 95% CI for standard deviation.

> *Why: CI for σ uses chi-square distribution — look up both tail critical values.*
> $df = 9$, $s^2 = 49$
> 📋 **χ²-Table:** df = 9, $\chi^2_{0.025}$ = 19.023; $\chi^2_{0.975}$ = 2.700
> Lower $= \sqrt{\frac{9 \times 49}{19.023}} = 4.81$
> Upper $= \sqrt{\frac{9 \times 49}{2.7}} = 12.78$
> **CI for σ: [4.8, 12.8] lakhs** ✓
> *(Take square root of variance bounds to get SD bounds)*

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
> 📋 **Z-Table:** 99% CI → α/2 = 0.005 → Row 2.5, Col .07/.08 → Z = 2.576
> $n = \frac{2.576^2 \times 0.4286 \times 0.5714}{0.01} = \frac{6.636 \times 0.2449}{0.01} \approx 162.5$
> Smallest listed size ≥ 162.5 → **200** ✓

**Q60:** 7/24 students. Smallest $n$ for 90% CI with $E = 0.05$?

> *Why: Sample size for proportion — use p = 0.5 (conservative) since exact p unknown.*
> 📋 **Z-Table:** 90% CI → Z = 1.645
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
> 📋 **Z-Table:** Row 3.0, Col .09 → 0.9990 (table max); Z = 3.16 is beyond table → P ≈ 0.9992
> $P(Z > 3.16) \approx 0.0008$
> **Between 0.00 and 0.01** ✓

---

### t-test for Mean (σ unknown, small n)

$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}, \quad df = n - 1$$

**Q52:** $n=16$, $\bar{x}=19$, $s=5$. Test if $\mu = 15$. Find p-value.

> *Why: σ unknown, small n (16 < 30) — use t-test. Two-tailed since H₁: μ ≠ 15.*
> $H_0: \mu = 15$, $H_a: \mu \ne 15$ (two-tailed)
> $t = \frac{19 - 15}{5/\sqrt{16}} = \frac{4}{1.25} = 3.2$, $df = 15$
> 📋 **t-Table:** df = 15, $t_{0.005}$ = 2.947; since 3.2 > 2.947, single-tail p < 0.005
> $p\text{-value} = 2 \times P(t_{15} > 3.2) < 2 \times 0.005 = 0.01$
> **Between 0.00 and 0.01** ✓

**Q63:** Same setup. Test statistic value?

> *Why: Same t-test setup as Q52 — just compute the test statistic.*
> $t = \frac{19 - 15}{5/4} = 3.2$
> **More than 2.0** ✓

**Q16:** $n=50$, $\bar{x}=298$, $s=5$. Test if $\mu = 300$.

> *Why: Large n (50 ≥ 30) — t ≈ Z. Two-tailed test for μ = 300.*
> $t = \frac{298 - 300}{5/\sqrt{50}} = \frac{-2}{0.7071} \approx -2.828$, $df=49$
> 📋 **t-Table:** df ≈ 50, $t_{0.005}$ = 2.678; since |2.828| > 2.678, single-tail p < 0.005
> $p = 2 \times P(t > 2.828) \approx 0.007$
> **≈ 0.007** ✓

---

### Z-test for Proportion

$$Z = \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}$$

**Q17:** $n=400$, 52 in unions. Test if $p > 0.12$. Find p-value.

> *Why: Testing proportion — use Z-test for proportion. Upper-tailed.*
> $\hat{p} = 52/400 = 0.13$
> $z = \frac{0.13 - 0.12}{\sqrt{\frac{0.12 \times 0.88}{400}}} = \frac{0.01}{0.01625} \approx 0.615$
> 📋 **Z-Table:** Row 0.6, Col .01 → 0.7291; Col .02 → 0.7324; interpolate Z = 0.615 ≈ 0.7307
> $P(Z > 0.615) = 1 - 0.7307 = 0.2693$
> **≈ 0.269** ✓

**Q54:** $n=42$, 18 have MBA. Test if $p > 0.50$.

> *Why: Testing proportion > 0.50 — Z-test for proportion, upper-tailed.*
> $\hat{p} = 0.4286$, upper-tail test
> $Z = \frac{0.4286 - 0.5}{\sqrt{0.5 \times 0.5/42}} = \frac{-0.0714}{0.07715} \approx -0.925$
> 📋 **Z-Table:** Row 0.9, Col .02 → 0.8212; by symmetry P(Z < −0.925) ≈ 1 − 0.8225 = 0.1775
> $p\text{-value} = P(Z > -0.925) = 1 - 0.1775 = 0.8225$
> **Between 0.80 and 0.95** ✓
> *(Negative z in upper-tail test → large p-value → fail to reject $H_0$)*

---

### Chi-Square Test for Variance

$$\chi^2 = \frac{(n-1)s^2}{\sigma_0^2}, \quad df = n-1$$

**Q18:** $n=25$, $s=3$ (so $s^2=9$). Test if $\sigma^2 < 8$.

> *Why: Testing variance — use chi-square test. Lower-tailed since H₁: σ² < 8.*
> $\chi^2 = \frac{24 \times 9}{8} = 27$, $df = 24$
> 📋 **χ²-Table:** df = 24; $\chi^2_{0.90}$ = 15.659, $\chi^2_{0.10}$ = 33.196; since 15.659 < 27 < 33.196, p-value is between 0.10 and 0.90
> $P(\chi^2 < 27)$ with $df=24 \approx 0.696$
> **p-value ≈ 0.696** ✓
> *(Lower-tailed test for variance)*

**Q55:** $n=25$, $s=35$. Test if $\sigma^2 > 900$.

> *Why: Testing if variance exceeds a value — chi-square test, upper-tailed.*
> $\chi^2 = \frac{24 \times 1225}{900} = \frac{29400}{900} \approx 32.67$
> 📋 **χ²-Table:** df = 24; $\chi^2_{0.10}$ = 33.196; since 32.67 < 33.196, p-value > 0.10
> **More than 10.0** ✓

**Q67:** $n=10$, $s=7$. Test if $\sigma^2 = 25$.

> *Why: Testing variance equality — chi-square test, two-tailed.*
> $\chi^2 = \frac{9 \times 49}{25} = \frac{441}{25} = 17.64$
> 📋 **χ²-Table:** df = 9; $\chi^2_{0.05}$ = 16.919, $\chi^2_{0.025}$ = 19.023; since 16.919 < 17.64 < 19.023, upper-tail p is between 0.025 and 0.05
> **More than 10.0** ✓

**Q68:** $n=25$, $s=35$. Test if $\sigma^2 > 900$. Find p-value.

> *Why: Same chi-square test as Q55 — now find the p-value range from the table.*
> $\chi^2 = 32.67$, $df = 24$
> 📋 **χ²-Table:** df = 24; $\chi^2_{0.10}$ = 33.196, $\chi^2_{0.05}$ = 36.415; since 32.67 < 33.196, p-value > 0.10
> $P(\chi^2 > 32.67)$ falls between 0.05 and 0.25
> **Between 0.05 and 0.25** ✓

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