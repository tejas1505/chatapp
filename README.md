# Peer-to-Peer Chat Messaging Assignment

The objective of this application is - Develop a simple peer-to-peer (P2P) chat application that allows two users to communicate directly with each other without keeping messages in a central server. The primary goal of this assignment is to assess the candidate's understanding of networking concepts, socket programming, security and basic UI development.

## Getting Started

Follow these steps to set up and run the application.

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

#### Frontend Setup
1. Navigate to the project root directory:
   ```sh
   cd /
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
#### Environment Variables

1. For Frontend
   ```sh
   REACT_APP_FRONTEND_URL=http://localhost:5173
   VITE_API_URL=http://localhost:8000
   ```
2. For Backend
   ```sh
   BACKEND_URL=http://localhost:8000
   FRONTEND_URL=http://localhost:5173
   SECRET_KEY=pumkin
   ```
#### Database Setup

1. Open MySQL and create the database:
```sh
CREATE DATABASE chatapp;
```
2. Import the SQL dump file:
```sh
mysql -u your_username -p chatapp < chatapp.sql
```
Start the backend server:
#### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   npm start
   ```
## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the frontend app in development mode.

### `npm start`
Runs the backend server.

### `npm run build`
Builds the frontend for production.
