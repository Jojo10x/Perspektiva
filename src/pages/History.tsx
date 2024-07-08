import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../Firebase-config";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import styles from "../styles/History.module.scss";
import { format, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
const History = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [filter, setFilter] = useState("all");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          fetchTasks(user.uid);
        } else {
          signInAnonymously(auth);
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const fetchTasks = async (uid: string) => {
      if (!uid) return;
      const tasksData: any[] = [];
      const taskQuery = query(
        collection(db, "plans"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(taskQuery);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasksData.push({
          id: doc.id,
          task: data.task,
          completed: data.completed,
          date: data.date ? data.date.toDate() : new Date(),
        });
      });
      console.log("Fetched tasks:", tasksData);
      setTasks(tasksData);
    };
  
    const filterTasks = (tasks: any[]) => {
      if (filter === "all") {
        return tasks;
      } else if (filter === "day" && selectedDate) {
        return tasks.filter(task => isSameDay(task.date, selectedDate));
      } else if (filter === "week") {
        const now = new Date();
        return tasks.filter(task => isSameWeek(task.date, now, { weekStartsOn: 1 }));
      } else if (filter === "month") {
        return tasks.filter(task => isSameMonth(task.date, new Date()));
      } else {
        return tasks;
      }
    };
  
    const filteredTasks = filterTasks(tasks);
  
    return (
      <div className={styles.history__container}>
        <Breadcrumb />
        <h1 className={styles.history__header}>Task History</h1>
        <div className={styles.history__filters}>
          <button onClick={() => setFilter("all")} className={filter === "all" ? styles.history__filter_active : ""}>All</button>
          <button onClick={() => setFilter("day")} className={filter === "day" ? styles.history__filter_active : ""}>Day</button>
          <button onClick={() => setFilter("week")} className={filter === "week" ? styles.history__filter_active : ""}>Week</button>
          <button onClick={() => setFilter("month")} className={filter === "month" ? styles.history__filter_active : ""}>Month</button>
          {filter === "day" && (
            <div className={styles.history__datepicker_wrapper}>
              <button 
                className={styles.history__datepicker_button}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              >
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select Date"}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isDatePickerOpen && (
                <div className={styles.history__datepicker}>
                  <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    setSelectedDate(date);
                    setIsDatePickerOpen(false);
                  }}
                  inline
                />
                </div>
              )}
            </div>
          )}
        </div>
        <ul className={styles.history__tasks}>
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.history__task}>
              <span className={task.completed ? styles.history__task_completed : ""}>{task.task}</span>
              <span>{format(task.date, "MMM dd, yyyy")}</span>
            </li>
          ))}
        </ul>
        <Link href="/plans" className={styles.plans__history_button}>
        <span>Main</span>
        </Link>
      </div>
    );
  };
  
  export default History;