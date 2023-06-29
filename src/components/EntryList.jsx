import { useEffect, useState } from "react";
import DisplayEntry from "../classes/displayEntry";
import ListElement from "./ListElement";

function EntryList({ date, entryList, edit, delete: del, submit: handleSubmit }) {
    let [historyList, setHistoryList] = useState([]);

    useEffect(() => {
        entryList.forEach(entry => {
            let historyDisplayEntry = entry.moveToHistoryIfNeeded(date);
            if (historyDisplayEntry) {
                setHistoryList([...historyList, historyDisplayEntry]);
            }
        })
    })


    var fullEntryList = historyList.slice(-3);

    entryList.forEach(entry => {
        fullEntryList = [...fullEntryList, ...entry.getDisplayEntries()];
    })
    fullEntryList.sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
        <>
            {fullEntryList && fullEntryList.map((entry) =>
                <ListElement key={entry.id + entry.date} date={date} entry={entry} edit={edit} delete={del} submit={handleSubmit} />
            )}
        </>
    );
}


export default EntryList;