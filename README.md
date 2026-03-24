# 🏨 HMS Pro: AI-Powered Hostel Management System

**HMS Pro** is a premium, full-stack hostel management solution that leverages AI matching and secure mutual exchanges to redefine student living. Built for performance and aesthetics, it streamlines operations for administrators while providing students with a high-end, interactive portal.

---

## ✨ Key Innovation Features

### 🤖 Smart Roommate Matching
*   **AI Compatibility Scoring**: Students are matched based on a 4-point lifestyle algorithm (Sleep, Cleanliness, Study, Noise).
*   **Real-time Recommendations**: Instant suggestions of the best potential roommates with percentage-based compatibility scores.

### 🔁 Mutual Room Exchange Hub
*   **Peer-to-Peer Swapping**: Secure system for students to find swap candidates and exchange rooms instantly.
*   **AI Auto-Suggest**: Smart recommendations for the best students to swap with to improve lifestyle harmony.
*   **Mutual Consent Workflow**: Automated atomic swaps once both students accept the request.

### 🍱 Premium Student Experience
*   **Dynamic Dashboard**: Real-time stats on Room, Fee, and Complaints.
*   **SaaS Aesthetic**: Modern UI with glassmorphism, animations, and high-quality data visualizations.
*   **Integrated Payments**: Secure fee payments via Razorpay.

---

## 🛠️ Tech Stack

*   **Frontend**: React.js 18, Vite, React Router, Lucide Icons, Vanilla CSS Design System.
*   **Backend**: Node.js, Express.js.
*   **Database**: Supabase (PostgreSQL) with Real-time triggers.
*   **Payment Gateway**: Razorpay.
*   **Auth**: Supabase Auth (Unified Student/Admin login).

---

## 🚀 Getting Started

### Prerequisites
*   Node.js v18+
*   Supabase Project

### Quick Setup

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/fayzii007/hostel-management-system.git
    cd hostel-management-system
    cd backend && npm install
    cd ../frontend && npm install
    ```

2.  **Database Migration**:
    *   Initialize the core schema using `backend/database.sql`.
    *   Apply AI/Match features using `backend/roommate_matching.sql`.
    *   Apply Room Swap features using `backend/room_swap.sql`.

3.  **Environment Configuration**:
    Configure `.env` files in both `frontend` and `backend` with your Supabase credentials.

4.  **Run Development**:
    *   Backend: `cd backend && npm run dev`
    *   Frontend: `cd frontend && npm run dev`

---

## 🔑 Demo Access

### Student Login
*   **Username**: `user123`
*   **Password**: `impelsys@123`

### Features to Explore
1.  **Dashboard**: View your room and compatible roommates.
2.  **Room Exchange**: Toggle "I want to Swap" and see AI suggestions.
3.  **My Room**: View detailed roommate profiles and shared habits.

---

## 📈 Roadmap
*   [x] AI Roommate Matching
*   [x] Mutual Room Exchange
*   [x] Online Payments (Razorpay)
*   [ ] Mobile App (PWA)
*   [ ] Visitor QR-code Entrance System

---
Managed by **HMS Pro Operations Team**. 🚀