## MODULE 1: Distributions Related to Normal

---

### Z-Score (Standardization)

$$Z = \frac{X - \mu}{\sigma}$$

**Example:** Test scores are normally distributed with mean 75 and standard deviation 10. A student scored 85. Find the z-score.

> $Z = \frac{85 - 75}{10} = \frac{10}{10} = \mathbf{1.0}$ ✓

---

### Linear Combination — Mean

$$E(Y) = a_1E(X_1) + a_2E(X_2) + \dots + a_nE(X_n) + b$$

### Linear Combination — Variance (Independent)

$$Var(Y) = a_1^2Var(X_1) + a_2^2Var(X_2) + \dots + a_n^2Var(X_n)$$

**Example:** Given $X \sim N(2, 4)$ and $Y \sim N(3, 9)$, find the mean and variance of $Z = 3X + 2Y$.

> $E(Z) = 3(2) + 2(3) = 6 + 6 = 12$
>
> $Var(Z) = 3^2(4) + 2^2(9) = 36 + 36 = \mathbf{72}$ ✓

---

### Special Cases Table

| Scenario | Mean | Variance |
|:---|:---|:---|
| $Y = aX + b$ | $a\mu + b$ | $a^2\sigma^2$ |
| $Y = X_1 + X_2$ | $\mu_1 + \mu_2$ | $\sigma_1^2 + \sigma_2^2$ |
| $Y = X_1 - X_2$ | $\mu_1 - \mu_2$ | $\sigma_1^2 + \sigma_2^2$ |
| $Y = \sum X_i$ (i.i.d.) | $n\mu$ | $n\sigma^2$ |
| $\bar{X} = \frac{\sum X_i}{n}$ | $\mu$ | $\frac{\sigma^2}{n}$ |

> **Key Rule:** Variances always **add**, even when subtracting variables.

---

### Inverse Normal — Finding Unknown $\sigma$

$$\sigma = \frac{X - \mu}{Z}$$

**Example:** Mean filling weight is 658g. Only 3% of bottles weigh ≤ 610g. Find $\sigma$.

> $Z$ for 0.03 = $-1.88$
>
> $\sigma = \frac{610 - 658}{-1.88} = \frac{-48}{-1.88} = \mathbf{25.52}$ ✓

---

### Inverse Normal — Finding Unknown $\mu$

$$\mu = X - Z \cdot \sigma$$

**Example:** $\sigma = 0.05$ and $P(X \ge 11.9) = 0.995$. Find $\mu$.

> $Z$ for lower tail 0.005 = $-2.57$
>
> $\mu = 11.9 - (-2.57)(0.05) = 11.9 + 0.1285 = \mathbf{12.03}$ ✓

---

### Chi-Square Distribution

$$\chi^2_k = Z_1^2 + Z_2^2 + \dots + Z_k^2$$

| Property | Value |
|:---|:---|
| Mean | $k$ |
| Variance | $2k$ |
| Domain | $\ge 0$ only |
| Shape | Right-skewed → Normal as $k$ increases |

---

### Student's t Distribution

$$t = \frac{Z}{\sqrt{\chi^2 / k}}$$

| Property | Value |
|:---|:---|
| Mean | $0$ (for $k > 1$) |
| Variance | $\frac{k}{k-2}$ (for $k > 2$) |
| Shape | Symmetric, heavier tails than Normal |
| Convergence | $t \to Z$ as $k \to \infty$ |

---

### F-Distribution

$$F_{k_1, k_2} = \frac{\chi^2_1 / k_1}{\chi^2_2 / k_2}$$

| Property | Value |
|:---|:---|
| Mean | $\frac{k_2}{k_2 - 2}$ (for $k_2 > 2$) |
| Domain | $\ge 0$ only |
| Shape | Right-skewed |

---

## MODULE 2: Sampling and Sampling Distributions

---

### Standard Error of the Mean

$$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$$

**Example:** A bakery produces muffins with average weight 100g and $\sigma = 5$g. For a sample of 25 muffins, find $P(\bar{x} > 102)$.

> $\sigma_{\bar{x}} = \frac{5}{\sqrt{25}} = 1$
>
> $Z = \frac{102 - 100}{1} = 2.0$
>
> $P(Z > 2.0) = 1 - 0.9772 = \mathbf{0.022}$ ✓

---

### Variance of the Sample Mean

$$Var(\bar{X}) = \frac{\sigma^2}{n}$$

**Example:** Population has $\sigma^2 = 4.41$. For $n = 20$ plants, find the variance of the average height.

> $Var(\bar{X}) = \frac{4.41}{20} = \mathbf{0.2205}$ ✓

---

### Z-Score for Sample Mean (CLT)

$$Z = \frac{\bar{x} - \mu}{\sigma / \sqrt{n}}$$

> **CLT Condition:** Applies when $n \ge 30$, regardless of population shape.

---

### Standard Error of Proportion

$$\sigma_{\bar{p}} = \sqrt{\frac{p(1-p)}{n}}$$

**Example:** In a survey of 24 students, 7 spend more than 2 hours on social media. Find the standard error.

> $\hat{p} = 7/24 \approx 0.2917$
>
> $SE = \sqrt{\frac{0.2917 \times 0.7083}{24}} = \sqrt{0.0086} \approx \mathbf{0.093}$ ✓

---

### Z-Score for Proportion

$$Z = \frac{\bar{p} - p}{\sqrt{p(1-p)/n}}$$

> **Normal Approximation Condition:** $np \ge 5$ and $n(1-p) \ge 5$.

---

### Chi-Square Relation for Sample Variance

$$\frac{(n-1)s^2}{\sigma^2} \sim \chi^2_{n-1}$$

> **Condition:** Population must be normally distributed.

---

### Sample Variance

$$s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}$$

**Example:** Weekly adoptions: 5, 8, 6, 12, 10, 9, 7, 11. Find the mean and variance.

> $\bar{x} = \frac{68}{8} = 8.5$
>
> Squared deviations sum = 42
>
> $s^2 = \frac{42}{7} = \mathbf{6.00}$ ✓

---

## MODULE 3: Confidence Intervals and Estimation

---

### CI for Mean ($\sigma$ Known) — Z Interval

$$\bar{x} \pm Z_{\alpha/2} \left( \frac{\sigma}{\sqrt{n}} \right)$$

**Example:** Average daily demand from 25 samples is 370, $\sigma = 75$. Build a 95% CI.

> $ME = 1.96 \times \frac{75}{\sqrt{25}} = 1.96 \times 15 = 29.4$
>
> CI = $370 \pm 29.4$ = $\mathbf{[340.6,\ 399.4]}$ ✓

---

### CI for Mean ($\sigma$ Unknown) — t Interval

$$\bar{x} \pm t_{\alpha/2,\ n-1} \left( \frac{s}{\sqrt{n}} \right)$$

**Example:** 16 weekly reports show mean 19, $s = 5$ contacts. Find the margin of error for a 95% CI.

> $df = 15$, $t_{0.025, 15} = 2.131$
>
> $ME = 2.131 \times \frac{5}{\sqrt{16}} = 2.131 \times 1.25 = \mathbf{2.66}$ ✓

---

### CI for Mean ($\sigma$ Unknown) — Margin of Error at Other Confidence Levels

**Example:** 40 IT projects, $\bar{x} = 18$ weeks, $s = 4$. Find ME for 85% CI.

> $\alpha = 0.15$, $Z_{0.075} \approx 1.44$
>
> $ME = 1.44 \times \frac{4}{\sqrt{40}} = 1.44 \times 0.632 = \mathbf{0.91}$ ✓

---

### Standard Error (Independent of Confidence Level)

$$SE = \frac{s}{\sqrt{n}}$$

**Example:** $n = 16$, $s = 5$. Find standard error.

> $SE = \frac{5}{\sqrt{16}} = \frac{5}{4} = \mathbf{1.25}$ ✓
>
> *(Standard error does not change with confidence level)*

---

### CI for Proportion

$$\bar{p} \pm Z_{\alpha/2} \sqrt{\frac{\bar{p}(1-\bar{p})}{n}}$$

**Example:** In a survey of 900 women IT employees, 396 are satisfied with childcare facilities. Build a 90% CI.

> $\hat{p} = 396/900 = 0.44$, $Z_{0.05} = 1.645$
>
> $SE = \sqrt{\frac{0.44 \times 0.56}{900}} \approx 0.01655$
>
> $ME = 1.645 \times 0.01655 \approx 0.027$
>
> CI = $0.44 \pm 0.027$ = $\mathbf{[0.41,\ 0.47]}$ ✓

---

### Margin of Error for Proportion

$$ME = Z_{\alpha/2} \sqrt{\frac{\bar{p}(1-\bar{p})}{n}}$$

**Example:** 24 students surveyed, 7 spend >2 hrs on social media. Find ME for 80% CI.

> $\hat{p} = 7/24 \approx 0.2917$, $Z_{0.10} = 1.28$
>
> $ME = 1.28 \times \sqrt{\frac{0.2917 \times 0.7083}{24}} = 1.28 \times 0.0927 \approx \mathbf{0.119}$ ✓

---

### CI for Variance (Chi-Square Bounds)

$$\frac{(n-1)s^2}{\chi^2_{\alpha/2}} \le \sigma^2 \le \frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}$$

> For **standard deviation**: take square root of both limits.

**Example:** 10 properties in Hyderabad, rental $s = 7$ lakh. Find 95% CI for $\sigma$.

> $df = 9$, $s^2 = 49$, $\chi^2_{0.025, 9} = 19.023$, $\chi^2_{0.975, 9} = 2.7$
>
> Lower = $\sqrt{\frac{9 \times 49}{19.023}} = \sqrt{23.18} = 4.81$
>
> Upper = $\sqrt{\frac{9 \times 49}{2.7}} = \sqrt{163.33} = 12.78$
>
> CI for $\sigma$ = $\mathbf{[4.81,\ 12.78]}$ lakhs ✓

---

### Sample Size for Estimating Mean

$$n = \left( \frac{Z_{\alpha/2} \cdot \sigma}{E} \right)^2$$

> **Planning value for $\sigma$:** Use historical data, pilot study, or $\frac{\text{Range}}{4}$.

---

### Sample Size for Estimating Proportion

$$n = \left( \frac{Z_{\alpha/2}}{E} \right)^2 p^*(1 - p^*)$$

> Use $p^* = 0.5$ if no prior estimate exists (most conservative).

**Example:** Desired ME = 0.05 for 90% CI on proportion. Find minimum sample size.

> $Z_{0.05} = 1.645$, $p^* = 0.5$
>
> $n = \frac{1.645^2 \times 0.25}{0.05^2} = \frac{0.6765}{0.0025} \approx \mathbf{271}$ ✓

---

### Sample Size for Proportion (with prior estimate)

**Example:** 42 managers surveyed, 18 have MBA. Find smallest $n$ for ME ≤ 0.1 at 99% CI.

> $\hat{p} = 18/42 \approx 0.4286$, $Z_{0.005} = 2.576$, $E = 0.1$
>
> $n = \frac{2.576^2 \times 0.4286 \times 0.5714}{0.01} = \frac{6.636 \times 0.2449}{0.01} \approx \mathbf{163}$ ✓

---

## MODULE 4: Hypothesis Testing, Covariance & Correlation

---

### Hypothesis Setup Rules

| Claim Direction | $H_0$ | $H_a$ | Test Type |
|:---|:---|:---|:---|
| "more than $A$" | $\mu \le A$ | $\mu > A$ | Upper Tail |
| "less than $A$" | $\mu \ge A$ | $\mu < A$ | Lower Tail |
| "equal to $A$" | $\mu = A$ | $\mu \neq A$ | Two-Tailed |

> **Rule:** $H_0$ always contains equality ($=, \le, \ge$). $H_a$ never does.

**Example:** A government agency wants to determine if average IT project duration is more than 16 weeks.

> $H_0: \mu \le 16$ and $H_a: \mu > 16$ → **Upper Tail Test** ✓

**Example:** Test if true average contacts per week equals 15.

> $H_0: \mu = 15$ and $H_a: \mu \neq 15$ → **Two-Tailed Test** ✓

---

### Test Statistic for Mean ($\sigma$ Unknown — t-test)

$$t_{n-1} = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$

**Example:** 16 weekly reports: $\bar{x} = 19$, $s = 5$. Test if $\mu = 15$.

> $t = \frac{19 - 15}{5/\sqrt{16}} = \frac{4}{1.25} = \mathbf{3.2}$ ✓
>
> $df = 15$. Two-tailed p-value $= 2 \times P(t_{15} > 3.2) < 2 \times 0.005 = \mathbf{0.01}$ ✓

---

### Test Statistic for Mean ($\sigma$ Known or large $n$ — Z-test)

$$Z = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$

**Example:** 40 IT projects: $\bar{x} = 18$, $s = 4$. Test if $\mu > 16$ at $\alpha = 0.05$.

> $Z = \frac{18 - 16}{4/\sqrt{40}} = \frac{2}{0.632} = 3.16$
>
> $P(Z > 3.16) \approx \mathbf{0.0008}$ → Reject $H_0$ ✓

---

### Test Statistic for Mean — p-value Interpretation

**Example:** Scarlet Inc. claims filter lasts 300 days. $n = 50$, $\bar{x} = 298$, $s = 5$. Test $H_0: \mu = 300$ (two-tailed).

> $t = \frac{298 - 300}{5/\sqrt{50}} = \frac{-2}{0.7071} = -2.828$, $df = 49$
>
> Two-tailed p-value $= 2 \times P(t > 2.828) \approx \mathbf{0.007}$ ✓

---

### Test Statistic for Proportion (Z-test)

$$Z = \frac{\bar{p} - p_0}{\sqrt{\frac{p_0(1-p_0)}{n}}}$$

> **Key:** Standard error uses hypothesized $p_0$ (not sample $\hat{p}$).

**Example:** 400 workers surveyed, 52 belong to unions. Test if proportion > 12%.

> $\hat{p} = 52/400 = 0.13$, $p_0 = 0.12$
>
> $Z = \frac{0.13 - 0.12}{\sqrt{0.12 \times 0.88/400}} = \frac{0.01}{0.01625} = 0.615$
>
> $P(Z > 0.615) = 1 - 0.7307 = \mathbf{0.269}$ → Do Not Reject $H_0$ ✓

---

### Upper-Tail Proportion Test — Negative Z

**Example:** 42 managers, 18 have MBA. Test if proportion with MBA > 50% at $\alpha = 0.10$.

> $\hat{p} = 18/42 \approx 0.4286$, $p_0 = 0.5$
>
> $Z = \frac{0.4286 - 0.5}{\sqrt{0.5 \times 0.5/42}} = \frac{-0.0714}{0.07715} = -0.925$
>
> Upper-tail p-value $= P(Z > -0.925) = 1 - 0.1775 = \mathbf{0.8225}$ → Do Not Reject $H_0$ ✓

---

### Test Statistic for Variance (Chi-Square Test)

$$\chi^2_{n-1} = \frac{(n-1)s^2}{\sigma_0^2}$$

**Example:** 10 properties, $s = 7$ lakh. Test if $\sigma^2 = 25$ (two-tailed).

> $\chi^2 = \frac{9 \times 49}{25} = \frac{441}{25} = \mathbf{17.64}$ ✓

---

### Chi-Square Variance Test — p-value

**Example:** 25 customers, $s = \$35$. Test if $\sigma^2 > 900$.

> $\chi^2 = \frac{24 \times 1225}{900} = \frac{29400}{900} = 32.67$, $df = 24$
>
> Upper-tail: $P(\chi^2_{24} > 32.67)$ → p-value is **between 0.05 and 0.25** ✓

---

### Lower-Tail Chi-Square Test

**Example:** 25 soft drink bottles, $s = 3$ ml. Test if $\sigma^2 < 8$.

> $\chi^2 = \frac{24 \times 9}{8} = 27$, $df = 24$
>
> Lower-tail p-value $= P(\chi^2_{24} < 27) \approx \mathbf{0.696}$ → Do Not Reject $H_0$ ✓

---

### p-Value Decision Rule

$$\text{If } p\text{-value} \le \alpha \implies \textbf{Reject } H_0$$

$$\text{If } p\text{-value} > \alpha \implies \textbf{Do Not Reject } H_0$$

> For **two-tailed tests**: double the one-tail probability.

---

### Covariance

$$s_{xy} = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{n - 1}$$

> Positive → same direction. Negative → opposite direction. Near zero → no linear association.
> **Limitation:** Sensitive to units of measurement.

---

### Correlation (Pearson's $r$)

$$r_{xy} = \frac{s_{xy}}{s_x \cdot s_y}$$

> Range: $-1 \le r \le +1$. Unitless. $r = 0$ means no **linear** relationship (non-linear may exist).

**Example:** Demand ($X$) and Price ($Y$) joint distribution: $Cov(X,Y) = -0.05$, $\sigma_X = 0.5$, $\sigma_Y = 0.4582$.

> $r = \frac{-0.05}{0.5 \times 0.4582} = \frac{-0.05}{0.2291} = \mathbf{-0.218}$ ✓

---

### Covariance from Joint Distribution

$$Cov(X,Y) = E[XY] - E[X] \cdot E[Y]$$

**Example:** Joint distribution table for $X \in \{1,2\}$, $Y \in \{1,2\}$ with $P(1,1)=0.3, P(2,1)=0.4, P(1,2)=0.2, P(2,2)=0.1$.

> $E[X] = 1(0.5) + 2(0.5) = 1.5$
>
> $E[Y] = 1(0.7) + 2(0.3) = 1.3$
>
> $E[XY] = 1(1)(0.3) + 2(1)(0.4) + 1(2)(0.2) + 2(2)(0.1) = 1.9$
>
> $Cov = 1.9 - (1.5)(1.3) = 1.9 - 1.95 = \mathbf{-0.05}$ ✓

---

## Quick Reference: Which Distribution to Use

| Testing | Distribution | Test Statistic |
|:---|:---|:---|
| Mean ($\sigma$ known, $n \ge 30$) | **Z** | $\frac{\bar{x} - \mu_0}{\sigma/\sqrt{n}}$ |
| Mean ($\sigma$ unknown) | **t** ($df = n-1$) | $\frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ |
| Proportion | **Z** | $\frac{\hat{p} - p_0}{\sqrt{p_0(1-p_0)/n}}$ |
| Variance | **$\chi^2$** ($df = n-1$) | $\frac{(n-1)s^2}{\sigma_0^2}$ |
| Two Variances | **F** ($k_1, k_2$) | $\frac{s_1^2 / \sigma_1^2}{s_2^2 / \sigma_2^2}$ |

---

## Key Decision Rules Summary

| Scenario | Rule |
|:---|:---|
| CI wider or narrower? | Higher confidence → wider; Larger $n$ → narrower |
| $\sigma$ known vs unknown? | Known → Z; Unknown → t |
| Proportion SE in CI vs HT | CI uses $\hat{p}$; HT uses $p_0$ |
| Variance always adds? | **Yes** — even when subtracting variables |
| Most conservative $p^*$? | Use $p^* = 0.5$ to maximize sample size |
| Two-tailed p-value? | Double the one-tail probability |
