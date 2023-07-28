import { useState, useEffect, useRef, Fragment } from "react";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Entry from "../classes/entry";

function EntryForm(props) {
    let [dayInputErrorText, setDayInputErrorText] = useState("");
    let [copyCountErrorText, setCopyCountErrorText] = useState("");


    let [entry, setEntry] = useState(props.entryToEdit);
    let [daysOfTheWeek, setDaysOfTheWeek] = useState(String(props.entryToEdit.days).split("").map(n => Number(n)));

    let [selectedDate, setSelectedDate] = useState(new Date(props.entryToEdit.dates[0]));
    let [activeStartDate, setActiveStartDate] = useState(props.entryToEdit.getBeginningOfMonth());

    const dateRef = useRef(null);
    let date;

    useEffect(() => {
        date = dateRef.current;
        console.log(props.entryToEdit.dates[0])
    }, [])

    function handleClick() {
        let newEntry = new Entry()
        newEntry.clone(entry);

        let detectError = false;
        let days = 0;

        switch (newEntry.repeatType) {
            case 0:
                days = checkIfNumberAndPositive(entry.days, setDayInputErrorText);
                if (days == 0) {
                    setDayInputErrorText("Day repeat cannot be 0");
                    detectError = true;
                } else if (days == null)
                    detectError = true;

                newEntry.days = days;
                newEntry.repeatDesc = "Every " + days + " days";
                break;
            case 1:
                // days = entry.dates[0].getDay();
                if (daysOfTheWeek.length == 0) {
                    setDayInputErrorText("Select at least one day")
                    detectError = true;
                }
                days = parseInt(daysOfTheWeek.join(""));
                newEntry.repeatDesc = "Every ";

                daysOfTheWeek.forEach((day, i) => {
                    if (i != 0) {
                        if (i != daysOfTheWeek.length - 1)
                            newEntry.repeatDesc += ", ";
                        else
                            newEntry.repeatDesc += " and ";
                    }

                    switch(day) {
                        case 1:
                            newEntry.repeatDesc += "Mon";
                            break;
                        case 2:
                            newEntry.repeatDesc += "Tue";
                            break;
                        case 3:
                            newEntry.repeatDesc += "Wed";
                            break;
                        case 4:
                            newEntry.repeatDesc += "Thu";
                            break;
                        case 5:
                            newEntry.repeatDesc += "Fri";
                            break;
                        case 6:
                            newEntry.repeatDesc += "Sat";
                            break;
                        case 7:
                            newEntry.repeatDesc += "Sun";
                            break;
                    }
                })

                break;
            case 2:
                days = selectedDate.getDate();
                newEntry.repeatDesc = days + ((days % 10 == 1 && (days <= 10 || days >= 20)) ? "st" : (days % 10 == 2 && (days <= 10 || days >= 20) ? "nd" : "th")) + " of every month"
                break;
            case 3:
                days = -1;
                newEntry.repeatDesc = "No repeat";
                break;
        }

        newEntry.copyCount = checkIfNumberAndPositive(entry.copyCount, setCopyCountErrorText);
        if (newEntry.copyCount == null)
            detectError = true;

        newEntry.days = days;

        newEntry.dates = [selectedDate.simpleFormat()];
        console.log(newEntry)

        if (detectError)
            return;

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
        setActiveStartDate(beginningOfMonth);
    }

    function checkIfNumberAndPositive(number, setErrorCallback) {
        let n = parseInt(number);
        if (n < 0) {
            setErrorCallback("Value cannot be lower than 1");
            return null;
        }
        else if (isNaN(n)) {
            setErrorCallback("Invalid number");
            return null;
        }
        else
            setErrorCallback("");

        return n;
    }

    // 0 = Every X days
    // 1 = Day of the Week
    // 2 = Day of the Month
    // 3 = One Time

    let Week = ["Monday", "Tuesday", "Wednesday", "Thrusday", "Friday", "Saturday", "Sunday"];

    return (
        <>
            <div className="form p-3 w-full max-w-[800px] min-w-min">
                <label className="label">Name: </label>
                <input type="text" placeholder="Name of the entry" value={entry.name} onChange={(e) => setEntry({...entry, name: e.target.value})} onKeyDown={handleKeyDown} />
                <br/><br/>
                <label className="label">Description: </label> <br/>
                <input className="w-full md:w-[80%]" type="text" placeholder="Description" value={entry.description} onChange={(e) => setEntry({...entry, description: e.target.value})} onKeyDown={handleKeyDown} />
                <br/><br/>

                <label className="label">Repeat Type: </label>
                <div className="rounded-[0.375em] border border-gray-800 max-w-[800px]">
                    <div className="w-full flex justify-evenly border-b border-gray-800 overflow-hidden">
                        {["Day Delay", "Days of the Week", "Day of the Month", "One Time"].map((text, i) => {
                            return <button key={i} className={(entry.repeatType == i ? "active " : "")+ (i == 0 ? "rounded-tl-[0.3em] " : "") + (i == 3 ? "rounded-tr-[0.3em] " : "border-r ") + "m-0 py-2 px-4 flex-1 border-0"} onClick={() => {
                                if (entry.repeatType != i) {
                                    setEntry({...entry, repeatType: i, days: entry.days <= 0 ? 1 : entry.days});
                                    setDaysOfTheWeek([]);
                                    setDayInputErrorText("");
                                }
                            }
                            }>{text}</button>
                        })}
                    </div>

                    <div className="p-3">
                        {entry.repeatType != 1 && (
                            <>
                                <label className="label">Starting Date: </label>
                                <Calendar ref={dateRef} minDetail="year"
                                value={selectedDate} onChange={(value) => setSelectedDate(value)}
                                activeStartDate={activeStartDate} onActiveStartDateChange={(a) => {setActiveStartDate(a.activeStartDate)}} />
                                <br/>
                            </>
                        )}

                        {entry.repeatType == 0 && (
                            <>
                                <label className="label">Day amount: </label>
                                <input type="number" placeholder="Day amount" value={entry.days} onChange={(e) => { setEntry({...entry, days: e.target.value }) }} id="repeatDays" />
                                <span className="text-red-500"> {dayInputErrorText}</span>
                            </>
                        )}
                        {entry.repeatType == 1 && (
                            <>
                                <label className="label">Days of the week: </label>
                                <div className="m-3 flex flex-wrap border border-gray-800">
                                    {Week.map((day, i) => {
                                        return <Fragment key={i}>
                                                <button className={(daysOfTheWeek.includes(i + 1) ? "active " : "") + (i != 6 ? "border-r " : "") + "flex-1 m-0 p-2 border-0"} onClick={() => {
                                                    let offset = i + 1;
                                                    let index = daysOfTheWeek.findIndex(i => i == offset);

                                                    let newList;
                                                    if (index == -1) {
                                                        newList = [...daysOfTheWeek, offset].sort();
                                                        setDaysOfTheWeek(newList);
                                                    }
                                                    else {
                                                        newList = [...daysOfTheWeek];
                                                        newList.splice(index, 1);
                                                        setDaysOfTheWeek(newList);
                                                    }

                                                    // let today = new Date(new Date().setHours(0, 0, 0, 0));

                                                    // let nextDay = -1;
                                                    // newList.forEach(d => {
                                                    //     if (nextDay == -1 && d > today.getDay()) {
                                                    //         nextDay = d;
                                                    //     }
                                                    // })
                                                    // if (nextDay == -1)
                                                    //     nextDay = newList[0];

                                                    // let dayDifference = nextDay - today.getDay();
                                                    // if (dayDifference <= 0)
                                                    //     dayDifference += 7;

                                                    // let newDate = new Date(today.setDate(today.getDate() + dayDifference))

                                                    // setEntry({...entry, dates: [newDate]});
                                                    // setNewActiveStartDate(newDate);
                                                }}>{day}</button>
                                                {i == 3 && (
                                                    <span className="basis-[100%] sm:basis-0 h-0 w-0" />
                                                )}
                                            </Fragment>
                                    })}
                                </div>
                                <span className="text-red-500"> {dayInputErrorText}</span>
                            </>
                        )}

                        <br/>

                        {entry.repeatType != 3 && (
                            <>
                                <label className="label">Display Copy Count: </label>
                                <input type="number" placeholder="Display copy count" value={entry.copyCount} onChange={(e) => setEntry({...entry, copyCount: e.target.value})} onKeyDown={handleKeyDown} />
                                <span className="text-red-500"> {copyCountErrorText}</span>
                                <br/>
                            </>
                        )}
                    </div>

                </div>

                <br/>
                <button className="active px-4 py-2" onClick={handleClick}>Save Changes</button>
            </div>
        </>
    );
}

export default EntryForm;