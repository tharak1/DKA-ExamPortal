import React, { useState, useEffect } from 'react';

interface TimerProps {
    duration: number; // Duration in seconds
    onTimerFinish: () => void; // Callback function when timer finishes
}

const Timer: React.FC<TimerProps> = ({ duration, onTimerFinish }) => {
    const [seconds, setSeconds] = useState(() => {
        // Retrieve the saved time from localStorage, or use the initial duration
        const savedTime = localStorage.getItem('remainingTime');
        return savedTime ? parseInt(savedTime, 10) : duration;
    });

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => {
                    const newSeconds = prevSeconds - 1;
                    localStorage.setItem('remainingTime', newSeconds.toString());
                    return newSeconds;
                });
            }, 1000);
        } else {
            onTimerFinish(); // Execute the callback when timer finishes
            localStorage.removeItem('remainingTime'); // Clear the saved time
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [seconds, onTimerFinish]);

    // Function to format seconds to MM:SS
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <p>Timer: {formatTime(seconds)}</p>
        </div>
    );
};

export default Timer;
