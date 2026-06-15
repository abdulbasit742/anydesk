# Web UX: Empty State Copy Catalog

Empty states occur when there is no data to display in a particular section of the web application. These moments are opportunities to guide, educate, and encourage users. This document provides a catalog of standardized empty state messages for the RemoteDesk web dashboard.

## 1. Principles for Empty State Copy

*   **Be Clear:** Explain why the section is empty.
*   **Be Encouraging:** Use a positive and supportive tone.
*   **Provide an Action:** Tell the user what they can do next to populate the section.
*   **Keep it Brief:** Use concise language and avoid clutter.
*   **Use Visuals (Optional):** Consider using a simple, relevant illustration to enhance the message.

## 2. Empty State Catalog

### 2.1. Dashboard and Device Management

| Section | Situation | Empty State Message (Title & Body) | Recommended Action (CTA) |
| :------ | :-------- | :--------------------------------- | :----------------------- |
| **Recent Sessions** | New user with no session history. | **No Recent Sessions**<br>Your most recent remote sessions will appear here for quick access. | Start a Session |
| **My Devices** | No devices associated with the account. | **No Devices Added**<br>Install RemoteDesk on your other computers to manage them from here. | Download RemoteDesk |
| **Device Groups** | No groups created yet. | **No Groups Yet**<br>Organize your devices into groups for easier management. | Create a Group |
| **Search Results** | No devices or sessions match the search query. | **No Results Found**<br>We couldn't find anything matching your search. | Clear Search |

### 2.2. Session History and Activity

| Section | Situation | Empty State Message (Title & Body) | Recommended Action (CTA) |
| :------ | :-------- | :--------------------------------- | :----------------------- |
| **Session List** | No sessions recorded in the selected time frame. | **No Sessions Found**<br>There is no session activity for the selected period. | Change Date Range |
| **Audit Logs** | No security events or actions logged yet. | **No Audit Logs**<br>Security and administrative events will be recorded here. | N/A |
| **Notifications** | No active notifications for the user. | **You're All Caught Up!**<br>There are no new notifications at this time. | N/A |

### 2.3. Admin and Management

| Section | Situation | Empty State Message (Title & Body) | Recommended Action (CTA) |
| :------ | :-------- | :--------------------------------- | :----------------------- |
| **User List** | No other users in the organization. | **No Other Users**<br>Invite your team members to start collaborating. | Invite Users |
| **Security Policies** | No custom security policies defined. | **No Custom Policies**<br>Define custom security rules for your organization or groups. | Create a Policy |
| **Billing History** | No past invoices or transactions. | **No Billing History**<br>Your past invoices and payment details will appear here. | View Plans |

## 3. Implementation Guidelines

*   **Consistent Design:** Use a standardized component for all empty states, including an icon/illustration, title, body text, and CTA button.
*   **Contextual Actions:** Ensure the CTA leads directly to the most relevant action for that section.
*   **Responsive Layout:** Ensure empty states look good and are readable on all screen sizes.
*   **Localization:** Ensure all empty state copy is properly localized (refer to `locale-contract.md`).

## 4. Related Documents

*   `web-ux-dashboard.md`
*   `web-ux-admin.md`
*   `web-ux-billing.md`
*   `web-ux-error-states.md`
*   `web-ux-loading-states.md`
*   `locale-contract.md`
