# Implementation Plan: FOMO, Campaigns & Theme Engine

This document outlines the phased implementation plan to integrate **FOMO Builders**, **Campaign Management**, and a **Theme Engine** into the existing e-commerce ecosystem.

## Phase 1: Foundation & FOMO Basics (Urgency Controls)
**Goal:** Implement high-impact, low-complexity features to immediately drive user urgency.

### 1. Backend (`/backend`)
*   **Database Schema Updates:**
    *   Create `FOMOSettings` model to store:
        *   **Ticker:** `message`, `bgColor`, `textColor`, `speed`, `link`, `isActive`.
        *   **GlobalTimer:** `endTime`, `isActive`, `displayLocation` (Ticker/Hero/Product).
        *   **LowStock:** `threshold` (default 10), `isActive`.
*   **API Endpoints:**
    *   `GET /api/admin/fomo-settings`: Fetch current settings.
    *   `PUT /api/admin/fomo-settings`: Update settings.
    *   `GET /api/common/fomo-settings`: Public endpoint for frontend to fetch active settings.

### 2. Admin Frontend (`/admin-frontend`)
*   **New Page:** `Marketing > FOMO Controls`.
*   **Components:**
    *   **Ticker Config:** Inputs for text, color pickers (react-color), speed dropdown.
    *   **Timer Config:** Date/Time picker for end time, toggle switches for display locations.
    *   **Stock Config:** Input for "Low Stock Threshold" and toggle for "Show Low Stock Warning".

### 3. Frontend (`/frontend`)
*   **Global State:** Fetch `fomo-settings` on app load (Context/Redux).
*   **Components:**
    *   `RollingTicker`: Fixed top bar component using CSS animations.
    *   `GlobalCountdown`: Reusable timer component.
    *   `LowStockBadge`: Update existing badge logic to use the dynamic threshold from settings.

---

## Phase 2: Campaign Management System
**Goal:** Enable admins to schedule and manage complex sales events.

### 1. Backend (`/backend`)
*   **Database Schema Updates:**
    *   Create `Campaign` model:
        *   `name`, `startDate`, `endDate`, `type` (Flash Sale/Seasonal).
        *   `themeId` (Reference to a theme).
        *   `products` (Array of product IDs with special campaign pricing).
*   **API Endpoints:**
    *   `CRUD /api/admin/campaigns`.
    *   `GET /api/shop/campaigns/active`: Fetch currently active campaigns for the frontend.

### 2. Admin Frontend (`/admin-frontend`)
*   **New Page:** `Marketing > Campaign Manager`.
*   **Features:**
    *   **Campaign List:** View active, upcoming, and past campaigns.
    *   **Campaign Builder:**
        *   Form to set dates.
        *   Product selector to add products to the campaign.
        *   "Flash Sale" toggle (sets strict short-term timer).

### 3. Frontend (`/frontend`)
*   **Home Page Update:** Dynamic "Active Campaign" banner section.
*   **Campaign Page:** Dynamic landing page `/campaign/:id` listing all products in the campaign.
*   **Product Card Update:** Show "Flash Sale" tag and discounted price if product is in an active campaign.

---

## Phase 3: Theme Engine & Visual Enhancements
**Goal:** Allow complete visual transformation of the site for festivals without code changes.

### 1. Backend (`/backend`)
*   **Database Schema Updates:**
    *   Create `ThemePreset` model:
        *   `name` (e.g., "Diwali", "Christmas").
        *   `colors`: Primary, Secondary, Accent, Background.
        *   `assets`: `logoUrl`, `backgroundImageUrl`.
        *   `effects`: `confetti` (bool), `snow` (bool), `lights` (bool).
*   **API Endpoints:**
    *   `CRUD /api/admin/themes`.
    *   `POST /api/admin/themes/activate/:id`: Set the active global theme.

### 2. Admin Frontend (`/admin-frontend`)
*   **New Page:** `Settings > Theme Engine`.
*   **Features:**
    *   **Theme Switcher:** Grid of available themes with "Activate" button.
    *   **Effect Toggles:** Manual overrides for "Snow", "Confetti", etc.
    *   **Asset Upload:** Upload festive logos/icons.

### 3. Frontend (`/frontend`)
*   **Theming Architecture:**
    *   Migrate hardcoded colors in `tailwind.config.js` to CSS variables (e.g., `var(--primary-color)`).
    *   Inject CSS variables into `:root` based on the fetched active theme.
*   **Visual Components:**
    *   `FestiveOverlay`: Canvas-based component for Snow/Confetti effects (using libraries like `react-confetti`).
    *   **Dynamic Logo:** Replace standard logo with the theme-specific logo if available.

---

## Phase 4: Global Notifications & Automation
**Goal:** Proactive user communication and automated alerts.

### 1. Backend (`/backend`)
*   **Database Schema Updates:**
    *   Create `GlobalNotification` model: `message`, `type` (Info/Warning/Success), `link`, `isActive`.
*   **API Endpoints:**
    *   `CRUD /api/admin/notifications`.

### 2. Admin Frontend (`/admin-frontend`)
*   **New Page:** `Marketing > Notifications`.
*   **Features:**
    *   Create/Edit/Delete global alerts.
    *   Preview notification appearance.

### 3. Frontend (`/frontend`)
*   **Component:** `GlobalAlert`: Dismissible banner or toast appearing on specific routes or globally.
*   **Logic:** Poll for active notifications or fetch on route change.

---

## Technical Dependencies & Libraries
*   **Frontend:**
    *   `react-fast-marquee`: For the Rolling Ticker.
    *   `react-countdown`: For robust timer logic.
    *   `react-confetti` / `react-snowfall`: For festive effects.
    *   `react-color`: For Admin color pickers.
*   **Backend:**
    *   `node-cron`: (Optional) If we need to auto-deactivate campaigns/themes at midnight.

## Execution Order Summary
1.  **Backend Models & APIs** (Phase 1-4 basics).
2.  **Admin UI** (Enable control).
3.  **Frontend Integration** (Display to user).
