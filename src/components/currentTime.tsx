import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'

interface ClockProps {
    timezone?: string
}

const Clock: React.FC<ClockProps> = ({ timezone }) => {
    const [calculatedTimezone, setCalculatedTimezone] = useState<string | undefined>(undefined)
    const [time, setTime] = useState<DateTime>(DateTime.now())

    useEffect(() => {
        const updateTimezone = async () => {
            if (timezone) {
                setCalculatedTimezone(timezone)
            }
            else {
                setCalculatedTimezone(undefined)
            }
        };

        updateTimezone()
    }, [timezone]);

    useEffect(() => {
        if (!calculatedTimezone) return

        const updateTime = () => {
            setTime(DateTime.now().setZone(calculatedTimezone))
        };

        updateTime()
        const interval = setInterval(updateTime, 1000)

        return () => clearInterval(interval)
    }, [calculatedTimezone])

    return <>{calculatedTimezone ? time.toFormat('HH:mm') : 'Loading...'}</>
};

export default Clock;
