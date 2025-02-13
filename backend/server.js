import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch((err) => console.error("❌ MongoDB-Verbindung fehlgeschlagen:", err));


const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    dueDate: { type: String, required: true },
    priority: { type: String, required: true, enum: ["Hoch", "Mittel", "Niedrig"] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error("Fehler beim Abrufen der Aufgaben:", err);
    res.status(500).json({ error: "Fehler beim Abrufen der Aufgaben" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    console.log("Empfangene Daten:", req.body); 

    if (!title || !dueDate || !priority) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

    
    const newTask = new Task({ title, description, dueDate, priority });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Fehler beim Hinzufügen der Aufgabe:", err);
    res.status(500).json({ error: "Fehler beim Hinzufügen der Aufgabe" });
  }
});




app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Ungültige ID" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Aufgabe nicht gefunden" });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Aufgabe:", err);
    res.status(500).json({ error: "Serverfehler beim Aktualisieren der Aufgabe" });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Ungültige ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Aufgabe nicht gefunden" });
    }

    res.status(200).json({ message: "Aufgabe gelöscht", task: deletedTask });
  } catch (err) {
    console.error("Fehler beim Löschen der Aufgabe:", err);
    res.status(500).json({ error: "Serverfehler beim Löschen der Aufgabe" });
  }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf http://localhost:${PORT}`));
