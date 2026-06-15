# RemoteDesk Support Macro Templates

## Introduction
This document provides a collection of macro templates for the RemoteDesk support team. These macros are designed to streamline common support interactions, ensure consistent communication, and improve response times. They can be integrated into helpdesk software to automate replies to frequently asked questions and common issues.

## General Inquiry Macros

### 1. Welcome and Initial Acknowledgment
**Macro Name:** `Welcome & Acknowledge`
**Description:** Acknowledges receipt of a new support request and sets expectations.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}}

Hi {{customer.first_name}},

Thank you for reaching out to RemoteDesk Support. We've received your request (Ticket #{{ticket.id}}) and are currently reviewing the details you provided.

We aim to respond to all inquiries within [X] business hours. In the meantime, you might find answers to common questions in our Knowledge Base: [Link to Knowledge Base]

We appreciate your patience and will be in touch shortly.

Best regards,
The RemoteDesk Support Team
```

### 2. Request for More Information
**Macro Name:** `Request More Info`
**Description:** Asks the customer for additional details needed to troubleshoot an issue.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Need More Info

Hi {{customer.first_name}},

Thank you for your patience. To help us investigate your issue regarding [brief issue description] more effectively, could you please provide the following additional information?

-   What operating system and version are you using on both the host and guest machines?
-   What version of the RemoteDesk client are you running?
-   Can you provide screenshots or a short video of the issue?
-   Are there any specific steps to reproduce the issue?
-   Have you tried [common troubleshooting step, e.g., restarting the client/device]?

The more details you can provide, the faster we can help resolve this for you.

Thanks,
The RemoteDesk Support Team
```

## Technical Support Macros

### 3. Troubleshooting Connectivity Issues
**Macro Name:** `Connectivity Troubleshooting`
**Description:** Provides initial steps for resolving common connection problems.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Connectivity Issue

Hi {{customer.first_name}},

It sounds like you're experiencing connectivity issues with RemoteDesk. Here are some common troubleshooting steps that often resolve these problems:

1.  **Check Internet Connection:** Ensure both your host and guest devices have a stable internet connection.
2.  **Firewall/Antivirus:** Temporarily disable any firewall or antivirus software on both devices to see if they are blocking the connection. If this resolves the issue, please add RemoteDesk to your software's whitelist.
3.  **Restart Clients:** Close and restart the RemoteDesk client on both the host and guest machines.
4.  **Router/Modem Restart:** Try restarting your router and modem.
5.  **Network Restrictions:** If you are on a corporate network, please check with your IT administrator to ensure that RemoteDesk's required ports (TCP 443, UDP 3478) are open.

If the issue persists after trying these steps, please reply with the results of each step and any error messages you received.

Thanks,
The RemoteDesk Support Team
```

### 4. Session Performance Issues
**Macro Name:** `Performance Troubleshooting`
**Description:** Guides users through steps to improve session performance.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Performance Issue

Hi {{customer.first_name}},

We understand that you're experiencing performance issues during your RemoteDesk sessions. Here are some suggestions to help improve your experience:

1.  **Internet Speed:** Ensure both devices have a strong and stable internet connection. A wired connection is generally more reliable than Wi-Fi.
2.  **Close Unnecessary Applications:** Close any bandwidth-intensive applications on both the host and guest machines.
3.  **Reduce Display Quality:** In the RemoteDesk client settings, try reducing the display quality or resolution of the remote screen.
4.  **Region Selection:** If possible, ensure both devices are connecting to the nearest RemoteDesk server region.
5.  **Hardware Acceleration:** Verify that hardware acceleration is enabled in your browser (for web client) or graphics settings (for desktop client).

Could you please try these steps and let us know if there's any improvement? Also, please provide details on your internet speed for both devices.

Thanks,
The RemoteDesk Support Team
```

## Account & Billing Macros

### 5. Password Reset Guidance
**Macro Name:** `Password Reset Guide`
**Description:** Provides instructions for resetting a forgotten password.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Password Reset

Hi {{customer.first_name}},

If you've forgotten your RemoteDesk password, you can easily reset it by following these steps:

1.  Go to the RemoteDesk login page: [Link to Login Page]
2.  Click on the 

    `Forgot Password?` link.
3.  Enter your registered email address and click `Send Reset Link`.
4.  Check your email inbox (and spam/junk folder) for a password reset link.
5.  Click the link in the email and follow the instructions to set a new password.

If you encounter any issues during this process, please let us know.

Thanks,
The RemoteDesk Support Team
```

### 6. Billing Inquiry Acknowledgment
**Macro Name:** `Billing Inquiry Acknowledge`
**Description:** Acknowledges a billing inquiry and informs the customer that the billing team will respond.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Billing Inquiry

Hi {{customer.first_name}},

Thank you for contacting us regarding your billing inquiry (Ticket #{{ticket.id}}). Your request has been forwarded to our dedicated billing team, who will review your account and get back to you shortly.

Please allow [X] business days for a detailed response. In the meantime, you can review your past invoices and subscription details in your RemoteDesk dashboard under `Settings > Billing`.

We appreciate your patience.

Best regards,
The RemoteDesk Support Team
```

## Feature Request Macros

### 7. Feature Request Acknowledgment
**Macro Name:** `Feature Request Acknowledge`
**Description:** Acknowledges a feature request and explains the process.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Feature Request

Hi {{customer.first_name}},

Thank you for your suggestion regarding [brief feature description]! We truly appreciate your feedback and are always looking for ways to improve RemoteDesk.

Your feature request (Ticket #{{ticket.id}}) has been logged and shared with our product development team for consideration. While we can't guarantee immediate implementation, we regularly review all suggestions as we plan our product roadmap.

We may reach out if we need further details or clarification on your idea.

Thanks for helping us make RemoteDesk better!

Best regards,
The RemoteDesk Product Team
```

## Escalation Macros

### 8. Escalation to Tier 2 Support
**Macro Name:** `Escalate to Tier 2`
**Description:** Informs the customer that their issue is being escalated to a higher level of support.
**Template:**
```markdown
Subject: Re: Your RemoteDesk Support Request - #{{ticket.id}} - Escalated to Tier 2

Hi {{customer.first_name}},

Thank you for your patience. We've thoroughly reviewed your issue regarding [brief issue description] and determined that it requires specialized attention. We are escalating your ticket (Ticket #{{ticket.id}}) to our Tier 2 support team, who have advanced expertise in these matters.

You may be contacted by a Tier 2 specialist directly for further troubleshooting. We will continue to monitor your case and keep you updated on its progress.

We apologize for any inconvenience and are working to resolve this as quickly as possible.

Best regards,
The RemoteDesk Support Team
```

## Internal Use Macros (for agents)

### 9. Internal Note - Issue Replicated
**Macro Name:** `Internal - Issue Replicated`
**Description:** Internal note for agents to quickly document that an issue has been replicated.
**Template:**
```markdown
Internal Note: Issue #{{ticket.id}} replicated by agent {{agent.name}}. Details: [brief description of replication steps and environment].
```

### 10. Internal Note - Solution Found
**Macro Name:** `Internal - Solution Found`
**Description:** Internal note for agents to quickly document a solution found for an issue.
**Template:**
```markdown
Internal Note: Solution found for issue #{{ticket.id}}. Solution: [brief description of solution]. To be communicated to customer by {{agent.name}}.
```

## Best Practices for Using Macros
-   **Personalize:** Always personalize macros with the customer's name and specific ticket details.
-   **Review Before Sending:** Read through the macro before sending to ensure it accurately addresses the customer's query and sounds natural.
-   **Customize as Needed:** Macros are templates; feel free to add specific details or rephrase sentences to better fit the context of the conversation.
-   **Keep Updated:** Regularly review and update macros to reflect new features, policy changes, or improved troubleshooting steps.
-   **Create New Macros:** If you find yourself typing the same response repeatedly, consider creating a new macro for it.
