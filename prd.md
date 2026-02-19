# PRODUCT REQUIREMENTS DOCUMENT  
## Subscription Intelligence Tracker  
### Analyze · Track · Optimize Your Recurring Expenses  

---

## Document Info

| Details | Value |
|--------|-------|
| Version | 1.0 |
| Date | February 18, 2026 |
| Status | Draft |
| Project Type | Full-Stack Web Application |
| Stack | Node.js / Express · MongoDB · React |
| Author | Product Team |

---

# 1. Executive Summary

The **Subscription Intelligence Tracker** is a full-stack web application designed to help users manage, analyze, and optimize their recurring expenses. With subscription fatigue on the rise — the average consumer now pays for **4–6 active subscriptions simultaneously** — this tool provides centralized visibility into spending patterns, upcoming renewals, and cost-saving opportunities.

The platform combines intuitive CRUD operations with analytics-driven insights, empowering users to make informed financial decisions backed by real spending data.

---

# 2. Problem Statement

Modern consumers struggle with subscription sprawl. Common pain points include:

- Losing track of active subscriptions and their renewal dates  
- Underutilized services that continue to drain monthly budgets  
- No consolidated view of total recurring spend across categories  
- Inability to identify spending patterns or cost-saving opportunities  
- Manual effort required to audit and manage multiple billing cycles  

The Subscription Intelligence Tracker directly addresses these challenges by providing a centralized, intelligent platform for subscription management.

---

# 3. Goals & Objectives

## 3.1 Primary Goals

- Provide a secure, user-authenticated platform for managing subscription data  
- Deliver meaningful analytics and insights derived from recurring expense data  
- Enable users to quickly find, filter, and act on subscription information  
- Maintain a comprehensive activity history for audit and review purposes  

## 3.2 Success Metrics

| Metric | Target | Priority |
|--------|--------|----------|
| User registration & login success rate | ≥ 99% | Critical |
| Subscription CRUD operation latency | < 300ms | High |
| Dashboard analytics load time | < 1.5s | High |
| Search/filter response time | < 200ms | High |
| Mobile responsiveness score (Lighthouse) | ≥ 90 | Medium |
| Activity log coverage | 100% of mutations | High |

---

# 4. Scope

## 4.1 In Scope

- User authentication (registration, login, JWT session management)  
- Full CRUD for subscription entities  
- Analytics dashboard with derived metrics and visual charts  
- Search, filter, and sort functionality  
- Activity/audit logging  
- Responsive UI for desktop and mobile  
- Input validation and error handling throughout  

## 4.2 Out of Scope

- Third-party bank/card integrations for automatic subscription detection  
- Email or push notification reminders for renewals  
- Multi-currency support (v1 targets single currency)  
- Team/shared workspace features  
- Native mobile applications (iOS / Android)  

---

# 5. User Personas

| Persona | Description | Primary Goal |
|--------|-------------|--------------|
| Budget-Conscious Individual | A working professional managing 5–10 personal subscriptions across entertainment, productivity, and fitness categories. | Identify and cancel underutilized subscriptions to reduce monthly spend. |
| Small Business Owner | An entrepreneur tracking software subscriptions (SaaS tools, cloud services, marketing platforms) for a small team. | Categorize and report on business recurring costs for accounting. |
| Finance Student | A student learning to manage personal finances for the first time. | Understand spending habits and build good financial tracking habits. |

---

# 6. Functional Requirements

## 6.1 User Authentication

The system shall support secure user identity management via JWT-based authentication.

| ID | Requirement | Priority |
|----|------------|----------|
| AUTH-01 | Users can register with name, email, and password. Email must be unique. | Must Have |
| AUTH-02 | Passwords must be hashed using bcrypt before storage. | Must Have |
| AUTH-03 | Users can log in and receive a signed JWT access token. | Must Have |
| AUTH-04 | All protected routes validate the JWT on each request. | Must Have |
| AUTH-05 | Token expiry is enforced; expired tokens return 401 Unauthorized. | Must Have |
| AUTH-06 | Logout clears the client-side token. | Should Have |

---

## 6.2 Subscription Management (Core Entity)

Subscriptions are the central data entity. Each subscription belongs to one user.

| ID | Requirement | Priority |
|----|------------|----------|
| SUB-01 | Users can create a subscription with: name, description, category, cost, billing cycle, start date, and status. | Must Have |
| SUB-02 | Users can view a list of all their subscriptions. | Must Have |
| SUB-03 | Users can view full details of a single subscription. | Must Have |
| SUB-04 | Users can update any field of an existing subscription. | Must Have |
| SUB-05 | Users can delete a subscription (soft or hard delete). | Must Have |
| SUB-06 | Subscription status supports: Active, Paused, Cancelled. | Must Have |
| SUB-07 | Billing cycle supports: Monthly, Quarterly, Annually, Custom. | Must Have |

---

## 6.3 Analytics Dashboard

The dashboard provides derived intelligence from stored subscription data.

| ID | Requirement | Priority |
|----|------------|----------|
| DASH-01 | Display total monthly recurring cost across all active subscriptions. | Must Have |
| DASH-02 | Display total annual projected cost. | Must Have |
| DASH-03 | Show breakdown of spend by category (chart). | Must Have |
| DASH-04 | Display count of active vs. paused vs. cancelled subscriptions. | Must Have |
| DASH-05 | Show most expensive subscription and category. | Should Have |
| DASH-06 | Display spending trend over the past 6 months (line/bar chart). | Should Have |
| DASH-07 | Surface insight cards — e.g., "You have 3 unused subscriptions". | Could Have |

---

## 6.4 Search, Filter & Sort

| ID | Requirement | Priority |
|----|------------|----------|
| SFS-01 | Full-text search on subscription name and description. | Must Have |
| SFS-02 | Filter by category. | Must Have |
| SFS-03 | Filter by status (Active / Paused / Cancelled). | Must Have |
| SFS-04 | Filter by billing cycle. | Should Have |
| SFS-05 | Filter by cost range (min/max). | Should Have |
| SFS-06 | Sort by name, cost, category, or date created (asc/desc). | Must Have |
| SFS-07 | Combine multiple filters simultaneously. | Must Have |

---

## 6.5 Activity & History Tracking

| ID | Requirement | Priority |
|----|------------|----------|
| ACT-01 | Every create, update, and delete action on a subscription logs an activity entry. | Must Have |
| ACT-02 | Each log entry records: userId, entityId, action type, timestamp, and changed fields. | Must Have |
| ACT-03 | Users can view their full activity feed in the UI. | Must Have |
| ACT-04 | Activity feed is sortable by date (newest first by default). | Should Have |
| ACT-05 | Activity feed is filterable by action type. | Could Have |

---

## 6.6 Data Visualization

| ID | Requirement | Priority |
|----|------------|----------|
| VIZ-01 | Pie/donut chart showing spend distribution by category. | Must Have |
| VIZ-02 | Bar chart comparing monthly cost of top subscriptions. | Must Have |
| VIZ-03 | Line chart showing cumulative spending trend over time. | Should Have |
| VIZ-04 | Summary KPI cards (total spend, count, avg cost per sub). | Must Have |

---

# 7. Non-Functional Requirements

| Category | Requirement |
|----------|------------|
| Security | Passwords hashed with bcrypt (min cost factor 10). JWT secrets stored in environment variables. All API inputs sanitized to prevent injection attacks. |
| Performance | API responses under 300ms for standard CRUD. Dashboard analytics computed server-side and returned in a single request. |
| Scalability | MongoDB document model supports horizontal scaling. Indexes on userId and category fields for query performance. |
| Usability | Responsive layout supporting viewports from 375px (mobile) to 1440px (desktop). WCAG 2.1 AA color contrast compliance. |
| Reliability | Input validation with descriptive error messages on all API endpoints. Graceful error pages in the UI for 4xx and 5xx responses. |
| Maintainability | RESTful API follows consistent naming conventions. Code organized by feature (auth, subscriptions, analytics, activity). |

---

# 8. Database Schema

## 8.1 Users Collection

| Field | Type | Constraints |
|------|------|------------|
| _id | ObjectId | Auto-generated, primary key |
| name | String | Required, trimmed |
| email | String | Required, unique, lowercase |
| password | String | Required, bcrypt hash |
| createdAt | Date | Auto-set on insert |

---

## 8.2 Subscriptions Collection

| Field | Type | Constraints |
|------|------|------------|
| _id | ObjectId | Auto-generated |
| userId | ObjectId | Required, ref: Users, indexed |
| name | String | Required, max 100 chars |
| description | String | Optional, max 500 chars |
| category | String | Enum: Entertainment, Productivity, Fitness, Finance, Other |
| cost | Number | Required, min 0 |
| billingCycle | String | Enum: monthly, quarterly, annually, custom |
| status | String | Enum: active, paused, cancelled — default: active |
| startDate | Date | Required |
| createdAt | Date | Auto-set |
| updatedAt | Date | Auto-updated |

---

## 8.3 ActivityLogs Collection

| Field | Type | Constraints |
|------|------|------------|
| _id | ObjectId | Auto-generated |
| userId | ObjectId | Required, ref: Users, indexed |
| entityId | ObjectId | Required, ref: Subscriptions |
| action | String | Enum: created, updated, deleted |
| changes | Object | Key-value pairs of changed fields |
| timestamp | Date | Auto-set, indexed |

---

# 9. API Route Specification

## 9.1 Authentication Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user account | None |
| POST | /api/auth/login | Authenticate and receive JWT token | None |

---

## 9.2 Subscription Routes — `/api/subscriptions`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/subscriptions | List all subscriptions (supports ?search, ?category, ?status, ?sort, ?order) | JWT |
| POST | /api/subscriptions | Create a new subscription | JWT |
| GET | /api/subscriptions/:id | Get a single subscription by ID | JWT |
| PUT | /api/subscriptions/:id | Update subscription fields | JWT |
| DELETE | /api/subscriptions/:id | Delete a subscription | JWT |

---

## 9.3 Analytics Routes — `/api/analytics`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/analytics/summary | Total monthly/annual cost, counts by status | JWT |
| GET | /api/analytics/by-category | Spend grouped by category for pie chart | JWT |
| GET | /api/analytics/trend | Monthly spend aggregation for trend chart (?months=6) | JWT |
| GET | /api/analytics/insights | Auto-generated insight cards | JWT |

---

## 9.4 Activity Routes — `/api/activity`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/activity | Get user activity feed (supports ?action, ?limit, ?page) | JWT |

---

# 10. Frontend Requirements

## 10.1 Page Structure

| Page / View | Route | Description |
|------------|------|-------------|
| Landing / Login | /login | Authentication entry point |
| Register | /register | New user sign-up form |
| Dashboard | /dashboard | KPI cards, analytics charts, insight cards |
| Subscriptions List | /subscriptions | Filterable, sortable, searchable list |
| Add Subscription | /subscriptions/new | Form to create a new subscription |
| Edit Subscription | /subscriptions/:id/edit | Pre-populated edit form |
| Subscription Detail | /subscriptions/:id | Full detail view with activity log |
| Activity Feed | /activity | Global activity history for the user |

---

## 10.2 Component Requirements

- **NavBar** — persistent navigation with user identity and logout  
- **SubscriptionCard** — summary tile for list views  
- **SubscriptionForm** — reusable form for create and edit  
- **SearchFilterBar** — unified search, filter dropdowns, and sort controls  
- **AnalyticsCharts** — Pie, Bar, and Line chart components (e.g., Recharts)  
- **KPICard** — summary metric display component  
- **ActivityFeedItem** — single log entry with icon, description, and timestamp  
- **ConfirmDialog** — confirmation modal for destructive actions  

---

# 11. Error Handling & Validation

## 11.1 API Error Response Format

All API errors shall return a consistent JSON structure:

```json
{ 
  "success": false, 
  "error": { 
    "code": "VALIDATION_ERROR", 
    "message": "Name is required." 
  } 
}
