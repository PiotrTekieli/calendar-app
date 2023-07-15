import { useEffect, useState } from "react";
import ListElement from "./ListElement";

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

    displayEntryList.sort((a, b) => {
        let difference = a.date.localeCompare(b.date);
        if (difference == 0)
            return a.name.localeCompare(b.name);
        return difference;
    })


    return (
        <>
            <button onClick={() => { setShowShort(!showShort) }}>{showShort ? "Show More" : "Show Less"}</button>
            {/* <table className="w-full min-w-min max-w-[800px]">
                <tbody>
                    {displayEntryList && displayEntryList.map((entry, i) => {
                        return <ListElement key={entry.id + entry.date} date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
                    })}
                </tbody>
            </table> */}

            <div className="w-full min-w-min max-w-[800px] grid grid-cols-[minmax(min-content,_250px)_repeat(2,_minmax(min-content,_100px))]">
                {displayEntryList && displayEntryList.map((entry, i) => {
                    return <ListElement key={entry.id + entry.date} date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
                })}
            </div>
        </>
    );
}


export default EntryList;