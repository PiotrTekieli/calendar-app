import { useState, useEffect, useRef } from "react";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Entry from "../classes/entry";

function EntryForm(props) {
    let [dayInputErrorText, setDayInputErrorText] = useState("");

    const dateRef = useRef(null);
    let date;

    useEffect(() => {
        date = dateRef.current;
    })

    function handleClick() {
        let newEntry = new Entry()
        newEntry.clone(props.entry);

        let days = 0;

        switch (newEntry.repeatType) {
            case 0:
                days = parseInt(props.entry.days);
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
                days = props.entry.dates[0].getDay();
                break;
            case 2:
                days = props.entry.dates[0].getDate();
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
            <input type="text" placeholder="Name of the entry" value={props.entry.name} onChange={(e) => props.setEntry({...props.entry, name: e.target.value})} onKeyDown={handleKeyDown} className="border-black border"></input>
            <br/>

            <div className="">
                <Calendar ref={dateRef} minDetail="year"
                value={props.entry.dates[0]} onChange={(value) => props.setEntry({...props.entry, dates: [value]})}
                activeStartDate={props.activeStartDate} onActiveStartDateChange={(a) => {props.setActiveStartDate(a.activeStartDate)}} />
            </div>

            {["Every X Days", "Day of the Week", "Day of the Month", "One Time"].map((text, i) => {
                return <button key={i} className={props.entry.repeatType == i ? "active" : ""} onClick={() => {
                    if (props.entry.repeatType != i) {
                        props.setEntry({...props.entry, repeatType: i, days: props.entry.days <= 0 ? 1 : props.entry.days});
                        setDayInputErrorText("");
                    }
                }
                }>{text}</button>
            })}

            {props.entry.repeatType == 0 && (
                <>
                    <br/>
                    <input type="number" placeholder="Day amount" value={props.entry.days} onChange={(e) => { props.setEntry({...props.entry, days: e.target.value }) }} id="repeatDays" />
                    <span className="text-red-500">{dayInputErrorText}</span>
                </>
            )}
            {props.entry.repeatType == 1 && (
                <>
                    <br/>
                    {daysOfTheWeek.map((day, i) => {
                        return <button key={i} className={props.entry.dates[0].getDay() == i + 1 + (i == 6 ? -7 : 0) ? "active" : ""} onClick={() => {
                            let today = new Date(new Date().setHours(0, 0, 0, 0));
                            let offset = (i + 1) - today.getDay();

                            if (offset <= 0)
                                offset += 7;

                            let newDate = new Date(today.setDate(today.getDate() + offset))

                            props.setEntry({...props.entry, dates: [newDate]});
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