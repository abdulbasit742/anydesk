# Knowledge Base: Billing Issues

This article provides troubleshooting steps and common solutions for billing-related issues encountered by RemoteDesk users. It is intended for both support agents and users to quickly address subscription, payment, and invoice problems.

## 1. Unable to Upgrade/Downgrade Subscription

**Symptom:** User attempts to change their subscription plan but the action fails or the new plan is not reflected.

**Potential Causes and Solutions:**

*   **Payment Method Issues:** The primary payment method on file might be expired, invalid, or have insufficient funds.
    *   *Solution:* Advise the user to check their payment method details in the billing portal and update if necessary. Suggest trying a different payment method.
*   **Pending Transactions:** There might be a pending transaction or an issue with the payment gateway.
    *   *Solution:* Advise the user to wait a few minutes and try again. If the issue persists, check the payment gateway status or contact support.
*   **Account Restrictions:** Certain account restrictions or outstanding balances might prevent subscription changes.
    *   *Solution:* Review the user's account status in the admin panel. If there's an outstanding balance, guide the user to resolve it.
*   **Browser/Cache Issues:** Browser extensions, ad-blockers, or cached data can sometimes interfere with billing portal functionality.
    *   *Solution:* Advise the user to try upgrading/downgrading in an incognito window or a different browser. Clear browser cache and cookies.

## 2. Incorrect Charges or Unexpected Fees

**Symptom:** User reports being charged an incorrect amount, unexpected fees, or charges for a cancelled subscription.

**Potential Causes and Solutions:**

*   **Proration:** When changing plans mid-billing cycle, proration can lead to charges that might seem unexpected but are correct.
    *   *Solution:* Explain proration clearly to the user. Provide a breakdown of the charges if possible.
*   **Auto-Renewal:** User might have forgotten about auto-renewal for their subscription.
    *   *Solution:* Confirm the subscription status and auto-renewal settings. Guide the user on how to manage auto-renewal.
*   **Multiple Accounts:** User might have multiple RemoteDesk accounts, leading to charges on an account they are not actively using.
    *   *Solution:* Verify if the user has other accounts associated with different email addresses or payment methods.
*   **Tax/VAT:** Applicable taxes or VAT might be added to the base subscription price.
    *   *Solution:* Clarify that taxes are added based on the user's region and are displayed on the invoice.
*   **Usage-Based Charges:** If the plan includes usage-based billing (e.g., for TURN server bandwidth beyond a free tier), these charges might appear as unexpected.
    *   *Solution:* Explain the usage-based components of their plan. Refer to `cost-capacity-turn-bandwidth-calculator.md` for details.

## 3. Invoice or Receipt Not Received

**Symptom:** User claims they have not received their invoice or payment receipt.

**Potential Causes and Solutions:**

*   **Spam Folder:** The email might have landed in the user's spam or junk folder.
    *   *Solution:* Advise the user to check their spam folder and add RemoteDesk to their safe sender list.
*   **Incorrect Email Address:** The email address on file for billing might be incorrect or outdated.
    *   *Solution:* Verify the billing email address in the user's profile and update if necessary. Resend the invoice.
*   **Email Delivery Issues:** Temporary issues with email providers or mail servers.
    *   *Solution:* Resend the invoice manually. If persistent, investigate email delivery logs.
*   **Invoice Access in Portal:** Invoices are always accessible directly from the user's billing portal.
    *   *Solution:* Guide the user on how to download their invoices directly from the RemoteDesk billing dashboard.

## 4. Payment Method Update Fails

**Symptom:** User tries to update their credit card or other payment details, but the update fails.

**Potential Causes and Solutions:**

*   **Invalid Details:** Incorrect card number, expiry date, CVV, or billing address.
    *   *Solution:* Advise the user to double-check all entered payment details.
*   **Bank/Issuer Rejection:** The bank or card issuer might be declining the transaction for various reasons (e.g., fraud prevention, insufficient funds, international transaction restrictions).
    *   *Solution:* Advise the user to contact their bank or card issuer directly. Suggest trying a different card or payment method.
*   **3D Secure/SCA Issues:** Problems with 3D Secure authentication or Strong Customer Authentication (SCA) prompts.
    *   *Solution:* Ensure the user completes any required authentication steps from their bank.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **User Email/Account ID:** The email address or account ID associated with the billing issue.
2.  **Subscription Plan:** Current and desired subscription plan.
3.  **Date/Time of Issue:** When the billing issue occurred or was first noticed.
4.  **Payment Method Used:** Type of card, last 4 digits, or other payment method.
5.  **Error Messages:** Any specific error messages displayed in the billing portal or received via email.
6.  **Screenshots:** If possible, request screenshots of the error or the billing page.
