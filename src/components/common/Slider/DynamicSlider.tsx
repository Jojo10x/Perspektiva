import React from 'react';
import dynamic from 'next/dynamic';
import styles from "../../../styles/components/Habits/Habit.module.scss";

const ReactSlider = dynamic(() => import('react-slider'), { ssr: false });

interface DynamicSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

const DynamicSlider: React.FC<DynamicSliderProps> = ({ value, onChange, max = 24 }) => (
  <ReactSlider
    min={0}
    max={max}
    step={0.5}
    value={value}
    onChange={(value: number | readonly number[]) => {
      if (typeof value === 'number') {
        onChange(value);
      }
    }}
    className={styles.slider}
    thumbClassName={styles.sliderThumb}
    trackClassName={styles.sliderTrack}
  />
);

export default DynamicSlider;