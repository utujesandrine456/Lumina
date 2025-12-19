## Lumina (HingaLink flow) — Routes & Screens

This project uses **Expo Router**, which means **file names in `app/` become routes**.

### Main Flow (what users should do)

- **`/`** → Landing screen (`app/index.tsx`)
  - Tap **Get Started** → `/role`
- **`/role`** → Role selection (`app/role.tsx`)
  - Choose **Admin / Cooperative / Driver** → `/login`
- **`/login`** → Login (Phone + PIN) (`app/login.tsx`)
  - After login:
    - Admin → `/admindashboard`
    - Cooperative Officer → `/cooperativedashboard`
    - Driver → `/driverdashboard`

### Why there is no “Farmer Signup”

Per your requirements:
- **No farmer accounts** (farmers are registered by the cooperative).
- Drivers/cooperatives are **registered and/or approved** by Admin/Cooperative.

So “signup” is implemented as **registration screens inside the system**, not self-signup.

### Admin Routes

- **`/admindashboard`** (`app/admindashboard.tsx`)
  - Approve drivers
  - Open “Register Driver” (top-right button) → `/registerdriver`

### Cooperative Officer Routes

- **`/cooperativedashboard`** (`app/cooperativedashboard.tsx`)
  - Register Farmer → `/registerfarmer`
  - Register Driver → `/registerdriver`
  - Farmers List → `/farmerslist`
  - Nearby Drivers → `/nearbydrivers`
  - Trips → `/trips`

### Driver Routes

- **`/driverdashboard`** (`app/driverdashboard.tsx`)
  - Shows assigned trips and status updates
- **`/driverprofile`** (`app/driverprofile.tsx`)
  - Trip History → `/trips`
  - Switch Role → `/role`

### Transport / Trips Routes

- **`/registerfarmer`** (`app/registerfarmer.tsx`) — cooperative registers farmers
- **`/farmerslist`** (`app/farmerslist.tsx`) — select farmers
- **`/createtransportrequest`** (`app/createtransportrequest.tsx`) — create group transport request
- **`/nearbydrivers`** (`app/nearbydrivers.tsx`) — list drivers by GPS distance (verified + available)
- **`/registerdriver`** (`app/registerdriver.tsx`) — register a driver (admin/cooperative)
- **`/bookdriver`** (`app/bookdriver.tsx`) — confirm booking a driver for the pending trip
- **`/trips`** (`app/trips.tsx`) — pending/ongoing/completed trips
- **`/ratedriver`** (`app/ratedriver.tsx`) — rate driver after delivery

### Not Found / Fallback

- **`/+not-found`** (`app/+not-found.tsx`) — shown if you navigate to a route that doesn’t exist.


