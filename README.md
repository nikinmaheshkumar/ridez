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

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL (optional, SQLite will be used by default)
- OpenRouteService API key (get one free at https://openrouteservice.org/)

### 1️⃣ Backend Setup (Django)

1. **Navigate to the Backend directory**
   ```bash
   cd Backend/ridez
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv env
   source env/bin/activate    # Windows: env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your configuration:
     ```env
     SECRET_KEY=your-secret-key-here
     DEBUG=True
     ORS_API_KEY=your_ors_api_key_here
     # DATABASE_URL=postgresql://user:password@localhost:5432/ridez_db  # Optional
     ```
   - **Note**: If `DATABASE_URL` is not provided, SQLite will be used automatically for local development.

5. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional, for admin access)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://localhost:8000`

### 2️⃣ Frontend Setup (React + Vite)

1. **Navigate to the Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - The default configuration should work:
     ```env
     VITE_API_BASE_URL=http://localhost:8000/api
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### 3️⃣ ORS Proxy Setup (Optional)

The ORS proxy is used to handle OpenRouteService API requests. If you want to use it:

1. **Navigate to the ors-proxy directory**
   ```bash
   cd ors-proxy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Add your OpenRouteService API key:
     ```env
     ORS_API_KEY=your_ors_api_key_here
     PORT=3000
     ```

4. **Start the proxy server**
   ```bash
   npm start
   ```
   The proxy will be available at `http://localhost:3000`

### 📝 Additional Notes

- **Database**: By default, the backend uses SQLite for local development. To use PostgreSQL, set the `DATABASE_URL` environment variable in the backend `.env` file.
- **API Key**: You need an OpenRouteService API key for location features. Get one free at https://openrouteservice.org/
- **CORS**: The backend is configured to allow requests from `localhost:5173` by default.
- **Admin Panel**: Access the Django admin at `http://localhost:8000/admin` after creating a superuser.

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
