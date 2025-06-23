# 🚕 Ridez

**Ridez** is a ride-booking web app where users can search and request rides, and drivers can accept and complete them. Users can also choose to become drivers anytime.

---

## 🛠 Tech Stack

- **Frontend**: React + Vite  
- **Backend**: Django + Django REST Framework  
- **Database**: PostgreSQL  
- **Authentication**: JWT (JSON Web Token)  
- **Location & Distance**: OpenRouteService APIs

---

## ✨ Features

### 👤 User
- Sign up and log in  
- Search pickup & drop locations (autocomplete)  
- View estimated distance and fare  
- Confirm and book rides  
- View ride history  
- Option to register as a driver

### 🚗 Driver
- Sign up and log in  
- View incoming ride requests  
- Accept and complete bookings  
- View ride history

---

## 🌍 APIs Used

- 🔍 **OpenRouteService Autocomplete API** – For location suggestions  
- 📏 **OpenRouteService Directions API** – To calculate distance and duration

---

## 🚀 How to Run Locally

### Backend (Django)
```bash
cd backend/
python -m venv env
source env/bin/activate    # Windows: env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend/
npm install
npm run dev
```

---

## 📦 API Endpoints

### Auth
- `POST /api/users/Register/` — Sign up  
- `POST /api/users/Login/` — Log in

### Bookings
- `POST /api/bookings/Create/` — Create a new booking  
- `GET /api/bookings/List/` — View booking history (user or driver)  
- `GET /api/bookings/Requests/` — Driver views ride requests  
- `POST /api/bookings/{id}/Accept/` — Driver accepts ride  
- `POST /api/bookings/{id}/Complete/` — Driver completes ride
