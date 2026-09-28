# Live Demo Walkthrough Guide (5-Minute Script)

Use this step-by-step presentation script to demonstrate the **College Placement Manager** to the Thinqloud assessment panel.

---

## 🎬 Step 1: Login & Role-Based Authentication (30 seconds)
1. Open `http://localhost:5173/` in your browser.
2. Explain: *"The application supports stateless JWT authentication with two distinct roles: Placement Officer (Admin) and Student Candidate. I have included 1-click demo evaluation buttons for instant demonstration."*
3. Click the **`Admin Officer`** quick login button.

---

## 🎬 Step 2: Placement Cell Admin Dashboard (1 minute)
1. Point to the top metric cards:
   - **Enrolled Students**
   - **Partner Companies**
   - **Open Placement Drives**
   - **Placed Students & Average CTC Package**
2. Point to the **Application Pipeline Breakdown** showing counts across all stages: `APPLIED`, `SCREENING`, `INTERVIEW`, `SELECTED`, `REJECTED`.
3. Explain: *"The dashboard provides real-time aggregation across the entire hiring lifecycle."*

---

## 🎬 Step 3: Placement Drives & Dynamic Eligibility Engine (1.5 minutes)
1. Click **`Placement Drives`** in the left sidebar.
2. Show the existing drives:
   - **Thinqloud Graduate Software Engineer 2026** (10.5 LPA, Depts: CSE, IT, Min CGPA 7.0, Max Backlogs: 0)
   - **AWS Cloud Operations Associate 2026** (8.2 LPA, Depts: ALL, Min CGPA 6.0, Max Backlogs: 1)
3. Click **`Eligible Pool`** on the Thinqloud drive.
   - Show how the system dynamically evaluates the database and displays only students who satisfy all 4 criteria (e.g. John Doe - CSE and Sarah Jenkins - IT).
   - Close the modal.
4. Show the **`Publish Drive`** / **`Close Drive`** toggle buttons.

---

## 🎬 Step 4: Student Flow & Real-Time Qualification Badges (1.5 minutes)
1. Click **`Sign Out`** in the top navbar.
2. Click **`Rachel (MECH)`** quick login button.
3. Show Rachel's profile summary card (Department: MECH, CGPA: 8.20).
4. Click **`Available Drives`** in the sidebar.
   - **Show Thinqloud Drive:** Notice the red badge **"Criteria Not Met"** with explicit reason: `Department 'MECH' is not eligible. Allowed: CSE, IT`. The apply button is disabled.
   - **Show AWS Drive:** Notice the green badge **"You Meet All Criteria"**.
5. Click **`Apply for this Drive`** on the AWS card.
   - Show the instant success message: *"Application submitted successfully!"*
6. Click **`My Applications`** to show the live application status tracker.
7. Click **`Sign Out`**.

---

## 🎬 Step 5: Interview Rounds & Final Selection Pipeline (1 minute)
1. Click **`Admin Officer`** quick login button.
2. Click **`Applications Pipeline`** in the sidebar.
3. Select Rachel's newly created application for AWS.
4. Click **`Add Round`** $\to$ Schedule *"Round 1: AWS Technical Screening"* $\to$ Click Save.
5. On the scheduled round, click **`Record Result`** $\to$ Select `PASSED` $\to$ Enter feedback *"Strong Linux and networking knowledge"* $\to$ Click Save.
6. Click **`Select Candidate (Create Offer)`**.
   - Show the confirmation alert.
7. Click **`Final Placements`** in the left sidebar.
   - Show the new official **Placement Record** automatically created with company name, student roll number, and CTC package (8.2 LPA).

---

## 💡 Key Architectural Talking Points for the Interview
* **Why Layered Monolith?** Simple, high cohesion, zero network latency overhead, easily demonstrable in under 5 minutes without microservice or distributed transaction failure modes.
* **Why Stateless JWT?** Decoupled authentication allowing horizontal scalability with role claims encoded directly in the payload.
* **How Eligibility is Computed:** Evaluated in the business service layer combining department whitelist matching, CGPA thresholds, active backlog limits, and graduation batch filters with granular reason breakdown.
* **Application Lifecycle State Machine:** Controlled transition matrix (`APPLIED` $\to$ `SCREENING` $\to$ `INTERVIEW` $\to$ `SELECTED`/`REJECTED`) where `SELECTED` automatically triggers the creation of an official `Placement` entity.
