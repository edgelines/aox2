import { useEffect, useRef } from 'react';

function useInterval(callback, delay, options) {
    const savedCallback = useRef();
    const { startHour, endHour, daysOff } = options;

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            const now = new Date();
            const hour = now.getHours();
            const dayOfWeek = now.getDay();
            const isTimeWithinRange = hour >= startHour && hour < endHour;
            const isDayOff = daysOff.includes(dayOfWeek);

            if (isTimeWithinRange && !isDayOff) {
                savedCallback.current();
            }
        }

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay, startHour, endHour, daysOff]);
}

export default useInterval;
