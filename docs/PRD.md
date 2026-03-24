# Product Requirement Document (PRD): HMS Pro
## Premium Hostel Management System with AI Matching

### 1. Product Overview
HMS Pro is a state-of-the-art Hostel Management System designed to modernize hostel living through intelligent automation and a premium user experience. Unlike traditional systems, HMS Pro focuses on student satisfaction by integrating AI-driven roommate matching and secure peer-to-peer room exchanges.

---

### 2. Objectives
*   **Intelligent Living**: Match students based on compatible lifestyle habits to reduce conflicts.
*   **Social Flexibility**: Enable secure, mutual room swaps without administrative bottlenecks.
*   **Operational Excellence**: Automate room occupancy, payment tracking, and complaint resolution.
*   **Premium Experience**: Provide a modern, responsive, and aesthetically pleasing interface for both students and admins.

---

### 3. Core Features

#### 🛡️ Authentication & Profiles
*   **Secure Student Signup**: Comprehensive onboarding collecting academic data and **Lifestyle Preferences** (Sleep Time, Cleanliness, Study habits, Noise tolerance).
*   **Role-Based Access**: Specialized portals for Students and Administrators.

#### 🤖 Smart Roommate Matching
*   **Compatibility Engine**: 4-point scoring algorithm that automatically suggests roommates with similar lifestyles.
*   **One-Click Assignment**: Automated room allocation for matched pairs to streamline the move-in process.
*   **Visual Compatibility**: Interactive dashboard showing match percentages and shared traits.

#### 🔁 Room Exchange Hub (Mutual Swap)
*   **Peer Discovery**: Students can toggle their "Swap Interest" to find other students looking for a new room.
*   **Request Workflow**: Secure peer-to-peer notification system for sending and receiving swap requests.
*   **Atomic Swapping**: Instant database-level room exchange upon mutual agreement, ensuring data consistency and updated occupancy records.
*   **AI Swap Suggestions**: AI-powered recommendations for the best students to swap with based on life-style improvements.

#### 💰 Financial & Operations
*   **Razorpay Integration**: Seamless online payment gateway for hostel fees.
*   **Real-time Occupancy**: Dynamic room vacancy tracking as students move or swap rooms.
*   **Complaint System**: Interactive ticketing system with status tracking (Pending → In Progress → Resolved).

---

### 4. System Logic & Rules
*   **Mutual Consent**: Room swaps only occur when both students explicitly "Accept" the request.
*   **Atomic Consistency**: During a swap, the system resets roommate IDs to prevent "ghost roommates" and triggers an occupancy sync for both old and new rooms.
*   **Matching Thresholds**: Strong matches require a minimum score of 3/4 (75% compatibility) to ensure high-quality suggestions.

---

### 5. UI/UX Pillars
*   **Modern Aesthetics**: Dark-mode support, glassmorphism elements, and vibrant, harmonious color palettes.
*   **Interactive Data**: Circular charts for compatibility, dynamic badges for status, and smooth micro-animations.
*   **Responsive Design**: Optimized for desktop and mobile access.

---

### 6. Technical Stack
*   **Frontend**: React.js with Lucide Icons and custom Vanilla CSS design system.
*   **Backend**: Node.js & Express.
*   **Database**: Supabase (PostgreSQL) with Real-time triggers.
*   **Payments**: Razorpay API.
*   **Auth**: Supabase Auth (Email/Username based).

---

### 7. Future Roadmap
*   **AI Insights**: Predictive maintenance for complaints.
*   **Digital Keys**: Integration with smart locks for room access.
*   **Community Feed**: Student-only social announcements and event coordination.