import { useEffect, useState } from "react";

import EntryList from "./components/EntryList";
import EntryForm from './components/EntryForm';
import Entry from "./classes/entry";
import DisplayEntry from "./classes/displayEntry";


export default function Index() {
    const DEBUG_DATE = true;
    const HISTORY_AMOUNT = 30;

    let [today, setToday] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

    let [editingForm, setEditingForm] = useState(false);
    let [delayedFormDisplay, setDelayedForm] = useState(false);

    let [entryList, setEntryList] = useState([]);
    let [historyList, setHistoryList] = useState([]);

    // LOADING
    useEffect(() => {
        // let loadedEntryList = JSON.parse(`[{"name":"","dates":["2023-07-02T00:00:00.000Z","2023-07-03T00:00:00.000Z"],"repeatType":0,"days":1,"copyCount":1},{"name":"","dates":["2023-07-11T00:00:00.000Z","2023-07-12T00:00:00.000Z"],"repeatType":0,"days":1,"copyCount":1}]`);
        let loadedEntryList = JSON.parse(localStorage.getItem("entryList"));
        let parsedEntryList = [];
        if (loadedEntryList) {
            loadedEntryList.forEach(e => {
                parsedEntryList.push(new Entry().loadSimplifiedEntry(e));
            })
        }

        // console.log(parsedEntryList)
        setEntryList(parsedEntryList);

        // let loadedHistoryList = JSON.parse(`[{"name":"","date":"2023-06-02T00:00:00.000Z"},{"name":"","date":"2023-06-03T00:00:00.000Z"},{"name":"","date":"2023-06-04T00:00:00.000Z"},{"name":"","date":"2023-06-05T00:00:00.000Z"}]`);
        let loadedHistoryList = JSON.parse(localStorage.getItem("historyList"));
        let parsedHistoryList = [];
        if (loadedHistoryList) {
            loadedHistoryList.forEach(e => {
                parsedHistoryList.push(new DisplayEntry().loadSimplifiedDisplayEntry(e));
            })
        }

        // console.log(parsedHistoryList)
        setHistoryList(parsedHistoryList);

        console.log("Loaded")
    }, [])
    if (entryList.length == 0) {
        //let loadedEntryList = JSON.parse(`[{"name":"","dates":["2023-07-02T00:00:00.000Z","2023-07-03T00:00:00.000Z"],"repeatType":0,"days":1,"copyCount":1},{"name":"","dates":["2023-07-11T22:00:00.000Z","2023-07-12T22:00:00.000Z"],"repeatType":0,"days":1,"copyCount":1}]`);
        //console.log(loadedEntryList);
        //setEntryList(loadedEntryList);
        //setHistoryList([]);
    }

    function saveEntryList(newList) {
        setEntryList(newList);
        let simplifiedList = [];
        console.log(newList)
        newList.forEach(e => {
            simplifiedList.push(e.simplifyEntry())
        })
        console.log(JSON.stringify([...simplifiedList]));
        localStorage.setItem("entryList", JSON.stringify([...simplifiedList]));
    }

    function saveHistoryList(newList) {
        setHistoryList(newList);
        let simplifiedList = [];
        newList.forEach(e => {
            simplifiedList.push(e.simplifyHistoryEntry())
        })
        console.log(JSON.stringify([...simplifiedList]));
        localStorage.setItem("historyList", JSON.stringify([...simplifiedList]));
    }

    function populateHistory() {
        let repeat;
        let historyListToAdd = []
        do {
            repeat = false;
            entryList.forEach(entry => {
                let historyDisplayEntry = entry.moveToHistoryIfNeeded(today);
                if (historyDisplayEntry) {
                    repeat = true;
                    historyListToAdd = [...historyListToAdd.slice(-HISTORY_AMOUNT + 1), historyDisplayEntry]
                }
            })
        } while(repeat)

        if (historyListToAdd.length != 0) {
            let oldHistoryList = [];

            if (-HISTORY_AMOUNT + historyListToAdd.length != 0)
                oldHistoryList = historyList.slice(-HISTORY_AMOUNT + historyListToAdd.length);

            let newHistoryList = [...oldHistoryList, ...historyListToAdd]
            saveHistoryList(newHistoryList);
        }
    }

    function handleSubmit(entry) {
        let filteredEntryList = entryList.filter(e => e.id !== entry.id)

        saveEntryList([...filteredEntryList, entry]);
        showEditingForm(false);
    }

    function deleteItem(id) {
        let index = entryList.findIndex(entry => entry.id == id)
        console.log(id, entryList, historyList);

        if (index >= 0) {
            let l = entryList;
            l.splice(index, 1);
            saveEntryList([...l]);
        } else {
            index = historyList.findIndex(entry => entry.id == id)
            let h = historyList;
            h.splice(index, 1);
            saveHistoryList([...h]);
        }

        // setEntryList(l => {
        //     let index = l.findIndex(entry => entry.id == id);
        //     if (index >= 0)
        //         return l.splice(index, 1);
        //     return l;
        // })
    }

    function editEntry(id = null) {
        let entry = entryList.find(e => e.id == id);
        if (!entry)
            entry = new Entry();

        showEditingForm(true, entry);
    }

    function showEditingForm(state, entry) {
        setEditingForm(state);
        setTimeout(() => setDelayedForm(state), 100);

        if (state) {
            setEntryToEdit(entry);
            setActiveStartDate(entry.getBeginningOfMonth());
        }

    }

    let [entryToEdit, setEntryToEdit] = useState(new Entry());
    let [activeStartDate, setActiveStartDate] = useState(new Date());

    let formProps = {
        handleSubmit,
        entryToEdit,
        activeStartDate, setActiveStartDate,
    }

    return (
        <>
            <div className={"p-12 " + (editingForm ? "show-form" : "hide-form")}>
                {!delayedFormDisplay && (
                    <div className="entry-list absolute">
                        {DEBUG_DATE && (<>Debug Set Date: <input type="date" onChange={e => setToday(e.target.valueAsDate)}/> <button onClick={() => setToday(new Date())}>Reset</button><br/></>)}

                        <button className="bg-blue-400" onClick={editEntry}>New</button>

                        <EntryList date={today} entryList={entryList} historyList={historyList} populateHistory={populateHistory} edit={editEntry} delete={deleteItem} submit={handleSubmit}/>
                    </div>
                )}
                {delayedFormDisplay && (
                    <div className="entry-form absolute">
                        <button className="bg-blue-400" onClick={() => showEditingForm(false)}>Back</button> <br/>

                        <EntryForm {...formProps} />

                        <p>currently editing {entryToEdit?.id ?? "nothing"}</p>
                    </div>
                )}
            </div>
        </>
    );
}