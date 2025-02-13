Task Manager

Ein einfacher Task-Manager, mit dem du deine Aufgaben organisieren kannst. Er ermöglicht das Erstellen, Verwalten und Löschen von Aufgaben mit Beschreibung, Fälligkeitsdatum und Priorität.

🚀 Funktionen

Aufgaben hinzufügen mit Titel, Beschreibung, Datum & Priorität

Aufgaben als erledigt markieren oder zurücksetzen

Aufgaben löschen

Animationen für eine flüssige Benutzererfahrung

Live-Hosting möglich

Mobile-Nutzung über lokale IP oder Hosting

🛠️ Installation

1️⃣ Backend (Node.js + Express)

Voraussetzungen:


Node.js (Version 16+ empfohlen)

MongoDB Atlas oder eine lokale MongoDB-Datenbank

# Repository klonen
git clone https://github.com/Adler1312/TaskManager.git
cd TaskManager/backend

# Abhängigkeiten installieren
npm install

# .env Datei erstellen und MongoDB URL einfügen
echo "MONGO_URL=your_mongodb_connection_string" > .env

# Server starten
npm start

2️⃣ Frontend (React + Vite)

Voraussetzungen:

Node.js

cd TaskManager/frontend

# Abhängigkeiten installieren
npm install

# Vite-Entwicklungsserver starten
npm run dev

Der Task Manager ist jetzt erreichbar unter: http://localhost:5173

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
