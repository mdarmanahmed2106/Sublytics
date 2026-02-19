# Trackizer – UI/UX Design Document

## 1. Project Overview
**Trackizer** is a subscription tracking and expense management application designed to help users monitor recurring payments (Netflix, Spotify, Amazon Prime, etc.), track spending habits, and manage monthly budgets efficiently.

The app focuses on providing a clean interface, quick insights, and an easy subscription management experience.

---

## 2. Problem Statement
Users often forget recurring payments and subscriptions, leading to:
- unwanted auto-renewals
- overspending
- lack of financial awareness
- poor budgeting habits

Trackizer solves this by giving users a clear dashboard of active subscriptions and monthly expenses.

---

## 3. Objectives
- Provide a simple subscription tracking system
- Display monthly spending summary clearly
- Help users avoid missing renewal dates
- Offer quick subscription management (add/edit/delete)
- Improve budgeting and awareness

---

## 4. Target Audience

### Primary Users
- Students
- Working professionals
- Freelancers
- People with multiple OTT/music/cloud subscriptions

### User Needs
- Know what subscriptions are active
- Track how much they spend monthly
- Get renewal reminders
- Manage subscriptions quickly

---

## 5. Design Goals
- Minimal and modern UI
- Clear typography and readable layout
- Financial data visibility (graphs/cards)
- Easy navigation with bottom tab bar
- Quick actions like add subscription

---

## 6. User Flow

### Flow 1: New User Journey
1. Open App  
2. Splash Screen  
3. Onboarding Screens  
4. Login/Signup  
5. Dashboard Home Screen  

### Flow 2: Subscription Management
1. Home Screen  
2. Tap “Add Subscription”  
3. Fill details (name, amount, billing cycle)  
4. Save subscription  
5. Subscription appears in list  

### Flow 3: Tracking Spending
1. Home Screen  
2. View Monthly Spend summary  
3. View category-wise breakdown  
4. Check upcoming renewals  

---

## 7. Key Screens & Purpose

### 7.1 Splash Screen
- Branding + logo
- Smooth app entry experience

### 7.2 Onboarding Screens
- Explain app features in 2–3 slides
- CTA: “Get Started”

### 7.3 Login / Signup Screen
- User authentication
- Input fields for email and password

### 7.4 Home / Dashboard Screen
Main screen showing:
- total monthly spending
- active subscriptions list
- upcoming renewal section
- quick add button

### 7.5 Subscription Detail Screen
Shows:
- subscription name
- amount
- renewal date
- billing frequency
- edit/delete actions

### 7.6 Add Subscription Screen
Form with:
- subscription title
- monthly amount
- payment method
- billing cycle (weekly/monthly/yearly)
- reminder toggle

### 7.7 Analytics Screen
Visual spending representation:
- graphs or pie charts
- monthly comparison
- category-based spending

### 7.8 Settings/Profile Screen
Includes:
- account settings
- notification preferences
- theme mode (dark/light)
- logout

---

## 8. Navigation Structure

### Primary Navigation
Bottom Tab Bar:
- Home
- Analytics
- Subscriptions
- Profile/Settings

### Secondary Navigation
- Back button for details pages
- Floating action button for adding subscription

---

## 9. Design System

### 9.1 Typography
- **Primary Font:** Sans-serif (modern, clean)
- Font hierarchy:
  - Headings: Bold / Semi-bold
  - Body text: Regular
  - Small labels: Medium

#### Suggested Sizes
- H1: 24–28px
- H2: 18–20px
- Body: 14–16px
- Captions: 12px

---

### 9.2 Color Palette
Trackizer uses a dark modern finance-theme UI.

#### Primary Colors
- Dark Background: #0B0B0F (approx)
- Card Background: #14141D (approx)
- Primary Accent: Purple/Violet tone
- Secondary Accent: Blue/Pink gradient elements

#### Utility Colors
- Green: for savings/positive balance
- Red: for expense alerts / overdue
- White: main text
- Grey: secondary text

---

### 9.3 Buttons & Components

#### Primary Button
- Rounded corners
- Filled violet/purple
- Used for CTA (Add, Save, Get Started)

#### Secondary Button
- Outline / subtle background
- Used for cancel, back, edit options

#### Cards
Used widely for:
- subscription tiles
- monthly spending summary
- analytics blocks

Card style:
- Rounded corners (12–20px)
- Shadow/blur effect
- Dark fill with subtle border

---

### 9.4 Input Fields
- Rounded textfields
- Label above field
- Placeholder inside
- Error state highlighted in red

---

### 9.5 Icons
Icons used for:
- categories (music, OTT, cloud)
- navigation tabs
- edit/delete actions

Style:
- minimal line icons
- consistent stroke width

---

## 10. Layout & Grid Rules
- Mobile-first design
- Padding: 16px standard
- Card gap: 12–16px
- Rounded corners: 16px
- Consistent spacing between elements

---

## 11. Visual Style Guidelines
- Dark theme premium look
- Neon gradient highlights for key stats
- Smooth minimal animations
- Clean hierarchy (cards + bold headings)

---

## 12. Accessibility Considerations
- Proper contrast ratio between text and background
- Clear icons + labels for navigation
- Large enough touch targets (min 44px)
- Error messages should be readable

---

## 13. Responsive Design Guidelines

### Mobile (Primary)
- single column layout
- bottom tab navigation

### Tablet/Desktop (Optional)
- sidebar navigation
- dashboard in grid format (2–3 columns)

---

## 14. Design Deliverables
- High-fidelity Figma design screens
- UI component library
- Design system (colors, typography, buttons)
- Prototypes with transitions
- Export-ready assets/icons

---

## 15. Future Improvements
- Subscription renewal reminders via push notifications
- Payment integration (UPI/Card tracking)
- Auto-detection of subscriptions from SMS/email
- AI spending recommendations
- Export reports in PDF/Excel
