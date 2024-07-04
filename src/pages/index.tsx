import React from 'react';
import Link from 'next/link';
import "./globals.css";
import HabitTracker from '@/app/Habit';
import Navbar from '@/components/Navbar';
import Settings from './Settings';

const MainPage: React.FC = () => {
  return (
    <div className="">
      <></>
      <Navbar/>
      
      <HabitTracker />
    </div>
  );
};

export default MainPage;


// https://codepen.io/suez/pen/gPRjBo