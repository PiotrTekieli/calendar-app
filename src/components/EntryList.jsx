import { useEffect, useState } from "react";
import ListElement from "./ListElement";

function EntryList({ date, entryList, historyList, populateHistory, edit, delete: del, submit: handleSubmit }) {

    let [showShort, setShowShort] = useState(true);

    // let [shortHistoryList, setShortHistoryList] = useState(historyList.slice(-3));

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
    displayEntryList.sort((a, b) => a.date.getTime() - b.date.getTime())


    return (
        <>
            <button onClick={() => { setShowShort(!showShort) }}>{showShort ? "Show More" : "Show Less"}</button>
            {displayEntryList && displayEntryList.map((entry) =>
                <ListElement key={entry.id + entry.date} date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
            )}
        </>
    );
}


export default EntryList;