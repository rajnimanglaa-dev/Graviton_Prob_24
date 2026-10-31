# SmartWaste – AI-Powered Smart Garbage Collection Platform
> **Tagline:** Cleaner Streets. Smarter Cities.  
> **Built for:** Municipal Civic Governance & Circular Sustainability (SDG 11 & SDG 12)

---

## 🌟 Executive Summary

**SmartWaste** is a civic-tech SaaS platform that connects **Citizens**, **Municipal Command Centres**, and **Garbage Collection Fleets** into an automated closed-loop lifecycle:

$$\text{REPORT} \longrightarrow \text{DETECT} \longrightarrow \text{PRIORITIZE} \longrightarrow \text{ALLOCATE} \longrightarrow \text{COLLECT} \longrightarrow \text{VERIFY}$$

---

## 🚀 Key Features

### 1. 📸 Citizen Reporting & Spatial Duplicate Detection
- **Geo-Tagged Capture:** Take photos with automatic GPS geocoding or manual pin selection.
- **Real-Time Duplicate Clustered Detection:** Geofenced 100m proximity algorithm prevents duplicate dispatches and groups neighbor reports into upvotes, boosting the attention score.

### 2. 🤖 AI Waste Quantity Index (WQI) Scoring Engine
- **Multi-Factor Algorithmic Index (0–100):**
  - **Estimated Waste Volume (40%):** Volumetric estimation in cubic meters ($m^3$).
  - **Surface Area Spread (25%):** Ground contamination footprint in square meters ($m^2$).
  - **Toxicity & Hazard Level (20%):** Weighted penalty for construction debris, chemicals, or decomposing organics.
  - **Recurring Dumping Frequency (15%):** Prior dumping history at the geohash over the past 30 days.
- **Severity Classification:** Low (0–25), Medium (26–50), High (51–75), Critical (76–100).
- **Computer Vision Ready:** Deterministic CV pipeline structure ready for YOLOv8 or Roboflow model weights.

### 3. 🏛️ Municipal Command Centre
- **Emergency Priority Queue:** Ranked strictly by calculated Priority Score so critical hazards receive prompt dispatch.
- **Interactive Leaflet & OpenStreetMap GIS:** Color-coded priority pins, hotspot density circles, and active fleet tracking.
- **Hotspot Analytics:** Identifies persistent illegal dumping epicenters across city wards.

### 4. 🚛 Smart Fleet Allocation & Multi-Stop TSP Routing
- **Vehicle Recommendation Algorithm:**
  $$\text{Suitability} = (\text{Distance} \times 40\%) + (\text{Capacity Match} \times 30\%) + (\text{Vehicle Type Match} \times 20\%) + (\text{Workload} \times 10\%)$$
- **Greedy Nearest-Neighbor TSP Optimizer:** Sequences collection stops to prioritize critical incidents first while minimizing deadhead mileage and fuel emissions.

### 5. 📱 Driver Portal & Mandatory Photographic Proof
- **Turn-by-turn navigation** connecting the Municipal Depot, assigned pickup stops, and the Regional Waste Processing Facility.
- **Workflow State Progression:** Accept $\to$ On the Way $\to$ Arrived $\to$ Upload Cleaning Proof $\to$ Complete.
- **Mandatory Cleaning Proof:** Drivers must capture an after-cleaning photo of the cleared ground before tickets can be marked as collected.

### 6. 🔄 Real-Time Multi-Portal Data Synchronization
- Changes made in the **Citizen Portal** (e.g. new complaint) immediately appear in the **Admin Command Centre** and **Live GIS Map**.
- When an **Admin** assigns a truck, the **Driver** receives the work order in real time.
- When the **Driver** updates status and uploads cleaning proof, the **Citizen** receives an instant update and earns **EcoPoints**.

---

## 👥 Hackathon Evaluation: Demo Credentials & Quick Switcher

For convenience during evaluation, a persistent **Quick Role Switcher** is located at the top of the screen. You can also use the **1-Click Demo Login** on the `/login` page:

| Role | Demo User | Identifier / Ward | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | Priya Sharma | Ward 7 – Civil Lines | Photo upload, GPS detect, duplicate check, WQI lab, EcoPoints |
| **Administrator** | Dir. Rajiv Verma | Chief Sanitation Controller | Priority queue, GIS map, vehicle allocation, route optimizer, analytics |
| **Driver** | Rajesh Kumar | Fleet Truck #SW-TRUCK-01 | Assigned tasks, navigation map, cleaning proof camera verification |

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 8
- **Routing:** React Router 7
- **Styling:** Tailwind CSS v4 + Plus Jakarta Sans Typography
- **Icons:** Lucide React
- **Maps & GIS:** Leaflet + OpenStreetMap + Custom SVG DivIcons
- **Data Visualizations:** Recharts (Monthly trends, Ward efficiency, Category distributions)
- **State Management:** Reactive Central Context with `localStorage` persistence and multi-portal event propagation.

---

## 💻 How to Run Locally

```bash
# 1. Navigate to the project directory
cd C:\Users\arora\OneDrive\Desktop\Graviton\Graviton_Prob_24

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```
