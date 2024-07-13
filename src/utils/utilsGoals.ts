import { Timestamp } from 'firebase/firestore';

export const formatDate = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleDateString();
};

export const calculateDeadline = (createdAt: Timestamp, timeframe: number) => {
  const deadlineDate = new Date(createdAt.toDate());
  deadlineDate.setMonth(deadlineDate.getMonth() + timeframe);
  return deadlineDate;
};

export const calculateTimeLeft = (createdAt: Timestamp, timeframe: number) => {
  const now = new Date();
  const deadline = calculateDeadline(createdAt, timeframe);
  const totalDuration = deadline.getTime() - createdAt.toDate().getTime();
  const timeElapsed = now.getTime() - createdAt.toDate().getTime();
  const timeLeftPercentage = Math.max(0, Math.min(100, (timeElapsed / totalDuration) * 100));
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  return { timeLeftPercentage, daysLeft };
};
