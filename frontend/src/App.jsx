import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Mittel");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Fehler beim Laden der Aufgaben:", err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim() || !dueDate || !dueTime || !priority) {
      alert("Bitte fülle alle Felder aus!"); 
      return;
    }
  
    try {
      const newTask = {
        title,
        description: description.trim() || "Keine Beschreibung verfügbar", 
        dueDate: `${dueDate} ${dueTime}`,
        priority,
      };
  
      const res = await axios.post("http://localhost:5000/tasks", newTask); 
      setTasks((prevTasks) => [...prevTasks, res.data]);
  

      setTitle("");
      setDescription("");
      setDueDate("");
      setDueTime("");
      setPriority("Mittel");
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Aufgabe:", err.response?.data || err.message);
    }
  };
  
  

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Fehler beim Löschen der Aufgabe:", err.response?.data || err.message);
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      const res = await axios.patch(`http://localhost:5000/tasks/${id}`, {
        completed: !completed,
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === id ? res.data : task))
      );
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", err.response?.data || err.message);
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "Kein Datum";
    try {
      const [date, time] = dateTime.split(" ");
      const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
      const formattedDate = new Intl.DateTimeFormat("de-DE", options).format(new Date(date));
      return time ? `${formattedDate}, ${time}` : formattedDate;
    } catch (err) {
      console.error("Fehler beim Formatieren des Datums:", err);
      return dateTime;
    }
  };

  return (
    <div className="container">
      <h1 className="header">Task Manager</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Neue Aufgabe..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-box"
        />
        <textarea
          placeholder="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-box"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-box"
        />
        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="input-box"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select-box"
        >
          <option value="Hoch">Hoch</option>
          <option value="Mittel">Mittel</option>
          <option value="Niedrig">Niedrig</option>
        </select>
        <button onClick={addTask} className="add-btn">
          Hinzufügen
        </button>
      </div>
      <ul className="task-list">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task._id}
              className={`task-item ${task.completed ? "completed" : ""}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="task-info">
                <h3 className="task-title">{task.title || "Unbenannte Aufgabe"}</h3>
                <p className="task-details">
                  Fällig: {formatDateTime(task.dueDate)} | Priorität:{" "}
                  <span className={`priority-${task.priority?.toLowerCase() || "mittel"}`}>
                    {task.priority || "Mittel"}
                  </span>
                </p>
                <p className="task-description">{task.description || "Keine Beschreibung"}</p>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => toggleCompleted(task._id, task.completed)}
                  className={`toggle-btn ${task.completed ? "undo-btn" : "done-btn"}`}
                >
                  {task.completed ? "Rückgängig" : "Erledigt"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="delete-btn"
                >
                  Löschen
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
