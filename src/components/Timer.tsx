import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
}

const Timer: React.FC<TimerProps> = ({ duration }) => {
  const [time, setTime] = useState<number>(() => {
    const savedTime = localStorage.getItem('timer');
    return savedTime ? parseInt(savedTime, 10) : duration;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          return 0;
        } else {
          const newTime = prevTime - 1;
          localStorage.setItem('timer', newTime.toString());
          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    // Clear the localStorage when the timer is reset (if duration prop changes)
    return () => localStorage.removeItem('timer');
  }, [duration]);

  return (
    <p>
      Time left: {`${Math.floor(time / 60)}`.padStart(2, '0')}:
      {`${time % 60}`.padStart(2, '0')}
    </p>
  );
};

export default Timer;
