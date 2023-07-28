import { Fragment, useEffect, useState } from "react";
import ListElement from "./ListElement";
import DisplayEntry from "../classes/displayEntry";
import ListSeparator from "./ListSeparator";

function EntryList({ date, entryList, historyList, populateHistory, edit, delete: del, submit: handleSubmit }) {

    let [showShort, setShowShort] = useState(true);

    useEffect(() => {
        populateHistory();
    })

    let displayEntryList = [];

    if (showShort)
        displayEntryList = historyList.slice(-3);
    else
        displayEntryList = historyList;

    entryList.forEach(entry => {
        displayEntryList = [...displayEntryList, ...entry.getDisplayEntries()];
    })

    generateSeparators();

    displayEntryList.sort((a, b) => {
        let dateDifference = a.date.localeCompare(b.date);
        if (dateDifference == 0) {
            let separator = a.separator == true ? -1 : b.separator == true ? 1 : null;
            if (separator != null)
            return separator

            return a.name.localeCompare(b.name);
        }
        return dateDifference;
    })

    function generateSeparators() {
        if (historyList.length != 0) {
            let newSeparatorEntry = new DisplayEntry();
            newSeparatorEntry.name = "History"
            newSeparatorEntry.date = "0/0/0"
            newSeparatorEntry.separator = true;

            displayEntryList.push(newSeparatorEntry);
        }

        let dateCompare = new Date(date);

        for (let i = 0; i <= 2; dateCompare.setDate(dateCompare.getDate() + 1) && i++) {
            if ((i == 0 || i == 1) && !displayEntryList.some((entry) => entry.date == dateCompare.simpleFormat()))
                continue;

            if (i == 2 && !displayEntryList.some((entry) => entry.date.localeCompare(dateCompare.simpleFormat()) == 1))
                continue;


            let newSeparatorEntry = new DisplayEntry();

            if (i == 0)
                newSeparatorEntry.name = "Today";
            else if (i == 1)
                newSeparatorEntry.name = "Tomorrow";
            else if (i == 2)
                newSeparatorEntry.name = "2+ Days From Now";

            newSeparatorEntry.date = dateCompare.simpleFormat();
            newSeparatorEntry.separator = true;
            displayEntryList.push(newSeparatorEntry);
        }
    }

    return (
        <>
            <button onClick={() => { setShowShort(!showShort) }}>{showShort ? "Show History" : "Hide History"}</button>
            {/* <table className="w-full min-w-min max-w-[800px]">
                <tbody>
                    {displayEntryList && displayEntryList.map((entry, i) => {
                        return <ListElement key={entry.id + entry.date} date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
                    })}
                </tbody>
            </table> */}

            {/* <div className="w-full min-w-min max-w-[1200px] grid grid-cols-[minmax(min-content,_1fr)_repeat(2,_minmax(min-content,_100px))]"> */}
            <div className="w-full min-w-min max-w-[1200px] grid grid-cols-[minmax(100px,_5fr)_repeat(2,_1fr)]">
                {displayEntryList && displayEntryList.map(entry => {
                    return <Fragment  key={entry.id + entry.date}>
                                {entry.separator == false ? (
                                    <ListElement date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
                                ) : (
                                    <ListSeparator entry={entry}/>
                                )}
                            </Fragment>
                })}
            </div>
        </>
    );
}


export default EntryList;