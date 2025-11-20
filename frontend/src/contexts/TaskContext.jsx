import { createContext, useState, useEffect, useContext } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks(prev => 
        prev.map(task => task._id === id ? updatedTask : task)
      );
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        loading,
        error,
        addTask,
        editTask,
        deleteTask: removeTask,
        refetchTasks: fetchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
