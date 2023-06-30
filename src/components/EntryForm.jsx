import { useState, useEffect, useRef } from "react";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Entry from "../classes/entry";

function EntryForm(props) {
    let [dayInputErrorText, setDayInputErrorText] = useState("");

    let [entry, setEntry] = useState(props.entryToEdit);

    const dateRef = useRef(null);
    let date;

    useEffect(() => {
        date = dateRef.current;
    })

    function handleClick() {
        let newEntry = new Entry()
        newEntry.clone(entry);

        let days = 0;

        switch (newEntry.repeatType) {
            case 0:
                days = parseInt(entry.days);
                if (days <= 0) {
                    setDayInputErrorText("Day amount cannot be lower than 1")
                    return;
                }
                else if (isNaN(days)) {
                    setDayInputErrorText("Incorrect day amount")
                    return;
                }
                else
                    setDayInputErrorText("");

                newEntry.days = days;
                break;
            case 1:
                days = entry.dates[0].getDay();
                break;
            case 2:
                days = entry.dates[0].getDate();
                break;
            case 3:
                days = -1;
                break;
        }

        newEntry.days = days;
        newEntry.recalculateNextDates();

        props.handleSubmit(newEntry);
        return;
    }

    function handleKeyDown(e) {
        if (e.key == "Enter")
            handleClick();
    }

    function setNewActiveStartDate(date) {
        const beginningOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        props.setActiveStartDate(beginningOfMonth);
    }

    // 0 = Every X days
    // 1 = Day of the Week
    // 2 = Day of the Month
    // 3 = One Time

    var daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"];

    return (
        <>
            <input type="text" placeholder="Name of the entry" value={entry.name} onChange={(e) => setEntry({...entry, name: e.target.value})} onKeyDown={handleKeyDown} className="border-black border"></input>
            <br/>

            <div className="">
                <Calendar ref={dateRef} minDetail="year"
                value={entry.dates[0]} onChange={(value) => setEntry({...entry, dates: [value]})}
                activeStartDate={props.activeStartDate} onActiveStartDateChange={(a) => {props.setActiveStartDate(a.activeStartDate)}} />
            </div>

            {["Every X Days", "Day of the Week", "Day of the Month", "One Time"].map((text, i) => {
                return <button key={i} className={entry.repeatType == i ? "active" : ""} onClick={() => {
                    if (entry.repeatType != i) {
                        setEntry({...entry, repeatType: i, days: entry.days <= 0 ? 1 : entry.days});
                        setDayInputErrorText("");
                    }
                }
                }>{text}</button>
            })}

            {entry.repeatType == 0 && (
                <>
                    <br/>
                    <input type="number" placeholder="Day amount" value={entry.days} onChange={(e) => { setEntry({...entry, days: e.target.value }) }} id="repeatDays" />
                    <span className="text-red-500">{dayInputErrorText}</span>
                </>
            )}
            {entry.repeatType == 1 && (
                <>
                    <br/>
                    {daysOfTheWeek.map((day, i) => {
                        return <button key={i} className={entry.dates[0].getDay() == i + 1 + (i == 6 ? -7 : 0) ? "active" : ""} onClick={() => {
                            let today = new Date(new Date().setHours(0, 0, 0, 0));
                            let offset = (i + 1) - today.getDay();

                            if (offset <= 0)
                                offset += 7;

                            let newDate = new Date(today.setDate(today.getDate() + offset))

                            setEntry({...entry, dates: [newDate]});
                            setNewActiveStartDate(newDate);
                        }}>{day}</button>
                    })}
                </>
            )}
            <br/>

            <button onClick={handleClick}>Confirm</button>
        </>
    );
}

export default EntryForm;