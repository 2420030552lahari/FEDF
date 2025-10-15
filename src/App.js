import React, { useState, useEffect } from "react";
import tasksData from "./data/tasks.json";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🟢 Load tasks from localStorage or tasks.json
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks && savedTasks.length > 0) {
      setTasks(savedTasks);
    } else {
      setTasks(tasksData);
    }
  }, []);

  // 🟢 Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ➕ Add new task
  const addTask = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    const newTask = { id: uuidv4(), title: input, completed: false };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  // ✅ Toggle completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // ❌ Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // ✏️ Start editing a task
  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  // 💾 Save edited task
  const saveEdit = (id) => {
    if (editText.trim() === "") return;
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: editText } : task
      )
    );
    setEditId(null);
    setEditText("");
  };

  // ❌ Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        📝 To-Do List Application
      </h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 w-full max-w-md mb-6">
        <input
          type="text"
          className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center border-b py-2"
              >
                {editId === task.id ? (
                  // 🟡 Edit Mode
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      className="flex-grow border border-gray-300 p-1 rounded"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  // 🟢 Normal Mode
                  <>
                    <span
                      onClick={() => toggleTask(task.id)}
                      className={`cursor-pointer flex-1 ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task.id, task.title)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
