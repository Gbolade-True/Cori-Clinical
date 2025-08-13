# Cori Clinical

A modern web application for city search and AI-powered recommendations, built with React, TypeScript, and FastAPI.

## 🚀 Features

-   **City Search**: Search and discover cities with real-time suggestions
-   **AI Recommendations**: Get intelligent recommendations for activities, places, and experiences in any city
-   **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and shadcn/ui components
-   **Dark/Light Theme**: Toggle between dark and light themes for personalization
-   **Type Safety**: Full TypeScript support
-   **RESTful API**: FastAPI backend with comprehensive documentation

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)

-   **Framework**: React 19 with TypeScript
-   **Build Tool**: Vite for fast development and building
-   **Styling**: Tailwind CSS with shadcn/ui components
-   **Routing**: React Router DOM
-   **State Management**: React Context for theme management
-   **HTTP Client**: Axios for API communication
-   **Testing**: Vitest with React Testing Library

### Backend (FastAPI + Python)

-   **Framework**: FastAPI with Python 3.12+
-   **API Documentation**: Automatic OpenAPI/Swagger documentation
-   **Data Validation**: Pydantic models
-   **CORS**: Configured for cross-origin requests
-   **Error Handling**: Comprehensive error handling and logging
-   **Services**: Modular service architecture for city search and recommendations

## 📋 Prerequisites

### For Frontend

-   Node.js 22.14.0
-   Yarn package manager

### For Backend

-   Python 3.12
-   pip (Python package manager)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Cori-Clinical
```

### 2. Install Frontend Dependencies

```bash
# Install all frontend dependencies
yarn install
```

## 🚀 Running the Application

### Start the Backend Server

#### Option 1: Using the provided script (Recommended)

```bash
# From the root directory
yarn server

# Or from the server directory
cd server
chmod +x start.sh
./start.sh
```

#### Option 2: Manual startup

```bash
cd server
python3.12 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend server will start on `http://localhost:8000`

**API Documentation**: Visit `http://localhost:8000/docs` for interactive API documentation

### Start the Frontend Client

#### Option 1: Development mode

```bash
nvm use 22.14.0
```

```bash
# From the root directory
yarn dev
```

#### Option 2: Build and preview

```bash
# Build the application
yarn build

# Preview the built application
yarn preview
```

The frontend application will start on `http://localhost:5173`

## 📁 Project Structure

```
Cori-Clinical/
├── src/                          # Frontend source code
│   ├── api/                      # API hooks and utilities
│   ├── components/               # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # shadcn/ui components
│   ├── contexts/                # React contexts
│   ├── features/                # Feature-based components
│   │   ├── aiRecommendations/   # AI recommendations feature
│   │   └── citySearch/          # City search feature
│   ├── shared/                  # Shared utilities and components
│   └── test/                    # Test setup and utilities
├── server/                      # Backend source code
│   ├── app/                     # Application modules
│   │   ├── core/               # Core configuration
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Pydantic models
│   │   ├── services/           # Business logic services
│   │   └── utils/              # Utility functions
│   ├── tests/                  # Backend tests
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   └── start.sh               # Server startup script
├── public/                     # Static assets
└── package.json               # Frontend dependencies and scripts
```

## 🧪 Testing

### Frontend Tests

```bash
# Run tests in watch mode
yarn test

# Run tests once
yarn test:run
```

### Backend Tests

```bash
cd server
source venv/bin/activate
python -m pytest tests/
```

## 🔧 Available Scripts

### Frontend Scripts

-   `yarn dev` - Start development server
-   `yarn build` - Build for production
-   `yarn preview` - Preview production build
-   `yarn lint` - Run ESLint
-   `yarn test` - Run tests in watch mode
-   `yarn test:run` - Run tests once
-   `yarn server` - Start the backend server

### Backend Scripts

-   `./start.sh` - Complete server setup and startup
-   `python main.py` - Start FastAPI server directly

## 🌐 API Endpoints

### Health Check

-   `GET /health` - Server health status

### City Search

-   `GET /cities?name={city_name}&limit={limit}` - Search for cities

### AI Recommendations

-   `GET /ai_suggestions?city={city}&lat={latitude}&lon={longitude}&category={category}&limit={limit}` - Get AI recommendations

## 🔑 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# API Keys (if required for external services)
# EXTERNAL_API_KEY=your_api_key_here
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the API documentation at `http://localhost:8000/docs`
2. Review the console logs for error messages
3. Ensure all dependencies are properly installed
4. Verify that both frontend and backend are running on the correct ports
