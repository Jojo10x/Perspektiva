import { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase-config";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "../../Firebase-config";
import styles from "../styles/Plans.module.scss";
import Link from "next/link";
import "./globals.css";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Plans = () => {
  const [plans, setPlans] = useState<{
    [key: string]: {
      id: string;
      task: string;
      completed: boolean;
      editing: boolean;
      newTask: string;
    }[];
  }>({});
  const [user, setUser] = useState<any>(null);
  const [currentWeek, setCurrentWeek] = useState<{ start: Date; end: Date }>({
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchPlans(user.uid);
      } else {
        signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, [currentWeek]);

  useEffect(() => {
    fetchPlans(user?.uid);
  }, [user, currentWeek]);

  const fetchPlans = async (uid: string) => {
    if (!uid) return;
    const plansData: any = {};
    const weekQuery = query(
      collection(db, "plans"),
      where("uid", "==", uid),
      where("date", ">=", currentWeek.start),
      where("date", "<=", currentWeek.end)
    );
    const querySnapshot = await getDocs(weekQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const day = format(data.date.toDate(), "EEEE");
      if (!plansData[day]) plansData[day] = [];
      plansData[day].push({
        id: doc.id,
        task: data.task,
        completed: data.completed,
        editing: false,
        newTask: data.task,
      });
    });
    console.log("Fetched plans:", plansData);
    setPlans(plansData);
  };

  const addPlan = async (day: string, task: string) => {
    const date = getDateForDay(day, currentWeek.start);
    const docRef = await addDoc(collection(db, "plans"), {
      day,
      task,
      completed: false,
      date,
      uid: user?.uid,
    });
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: [
        ...(prevPlans[day] || []),
        {
          id: docRef.id,
          task,
          completed: false,
          editing: false,
          newTask: task,
        },
      ],
    }));
  };

  const completePlan = async (day: string, id: string, completed: boolean) => {
    const docRef = doc(db, "plans", id);
    await updateDoc(docRef, { completed: !completed });
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((plan) =>
        plan.id === id ? { ...plan, completed: !completed } : plan
      ),
    }));
  };

  const deletePlan = async (day: string, id: string) => {
    const docRef = doc(db, "plans", id);
    await deleteDoc(docRef);
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].filter((plan) => plan.id !== id),
    }));
  };

  const editPlan = (day: string, id: string) => {
    console.log(`Editing plan: day=${day}, id=${id}`);
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((plan) =>
        plan.id === id ? { ...plan, editing: true } : plan
      ),
    }));
  };

  const savePlan = async (day: string, id: string, task: string) => {
    console.log(`Saving plan: day=${day}, id=${id}, task=${task}`);
    const docRef = doc(db, "plans", id);
    await updateDoc(docRef, { task });
    console.log(`Updated Firestore document for id=${id} with task=${task}`);
    setPlans((prevPlans) => {
      const updatedPlans = {
        ...prevPlans,
        [day]: prevPlans[day].map((plan) =>
          plan.id === id ? { ...plan, task, editing: false } : plan
        ),
      };
      console.log("Updated plans after saving:", updatedPlans);
      return updatedPlans;
    });
  };

  const handleInputChange = (day: string, id: string, value: string) => {
    setPlans((prevPlans) => ({
      ...prevPlans,
      [day]: prevPlans[day].map((plan) =>
        plan.id === id ? { ...plan, newTask: value } : plan
      ),
    }));
  };

  const getDateForDay = (day: string, startOfWeek: Date): Date => {
    const dayIndex = daysOfWeek.indexOf(day);
    return addDays(startOfWeek, dayIndex);
  };

  const totalPlans = Object.values(plans).reduce(
    (total, dayPlans) => total + dayPlans.length,
    0
  );
  const completedPlans = Object.values(plans).reduce(
    (total, dayPlans) => total + dayPlans.filter(plan => plan.completed).length,
    0
  );

  const goToNextWeek = () => {
    setCurrentWeek((prevWeek) => ({
      start: addDays(prevWeek.start, 7),
      end: addDays(prevWeek.end, 7),
    }));
  };

  const goToPreviousWeek = () => {
    setCurrentWeek((prevWeek) => ({
      start: addDays(prevWeek.start, -7),
      end: addDays(prevWeek.end, -7),
    }));
  };


  return (
    <div className={styles.plans__container}>
        <Breadcrumb />
      <h1 className={styles.plans__header}>Weekly Plans</h1>
      <div className={styles.plans__progress_bar}>
        <div
          className={styles.plans__progress}
          style={{
            width: `${
              totalPlans > 0 ? (completedPlans / totalPlans) * 100 : 0
            }%`,
          }}
        >  <span className={styles.plans__progress__label}>
        {totalPlans > 0 ? `${Math.round((completedPlans / totalPlans) * 100)}%` : '0%'}
      </span>

        </div>
      </div>
      <div className={styles.plans__navigation}>
        <button onClick={goToPreviousWeek}>Previous Week</button>
        <span>
          {format(currentWeek.start, "MMM dd")} -{" "}
          {format(currentWeek.end, "MMM dd")}
        </span>
        <button onClick={goToNextWeek}>Next Week</button>
      </div>
      {daysOfWeek.map((day) => (
        <div key={day} className={styles.plans__day}>
          <div className={styles.plans__day_header}>
            <h2>
              {day} - {format(getDateForDay(day, currentWeek.start), "MMM dd")}
            </h2>
          </div>
          <ul className={styles.plans__tasks}>
            {plans[day]?.map((plan) => (
              <li
                key={`${plan.id}-${plan.task}`}
                className={styles.plans__task}
              >
                {plan.editing ? (
                  <>
                    <input
                      type="text"
                      className={styles.plans__task_edit_input}
                      defaultValue={plan.task}
                      onChange={(e) =>
                        handleInputChange(day, plan.id, e.target.value)
                      }
                      onBlur={() => savePlan(day, plan.id, plan.newTask)}
                    />
                    <button
                      onClick={() => savePlan(day, plan.id, plan.newTask)}
                      className={styles.plans__task_button}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={
                        plan.completed
                          ? `${styles.plans__task} ${styles.plans__task_complete}`
                          : styles.plans__task
                      }
                    >
                      {plan.task}
                    </span>
                    <button
                      onClick={() => editPlan(day, plan.id)}
                      className={styles.plans__task_edit}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => completePlan(day, plan.id, plan.completed)}
                      className={styles.plans__task_button}
                    >
                      {plan.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => deletePlan(day, plan.id)}
                      className={styles.plans__task_delete}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="New Task"
            className={styles.plans__task_input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addPlan(day, (e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = "";
              }
            }}
          />
        </div>
      ))}
      <div className="flex space-x-4">
        <Link href="/History" className={styles.plans__history_button}>
        <span>History</span>
        </Link>
      </div>
    </div>
  );
};

export default Plans;


