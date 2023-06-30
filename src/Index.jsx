import { useState } from "react";

import EntryList from "./components/EntryList";
import EntryForm from './components/EntryForm';
import Entry from "./classes/entry";


export default function Index() {
    const DEBUG_DATE = true;
    const HISTORY_AMOUNT = 30;

    let [today, setToday] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

    let [editingForm, setEditingForm] = useState(false);
    let [delayedFormDisplay, setDelayedForm] = useState(false);

    let [entryList, setEntryList] = useState([]);
    let [historyList, setHistoryList] = useState([]);

    console.log("Loaded")
    // LOADING
    // if (entryList.length == 0) {
    //     setEntryList([]);
    //     setHistoryList([]);
    // }

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
            setHistoryList(newHistoryList);
        }
    }

    function handleSubmit(entry) {
        let filteredEntryList = entryList.filter(e => e.id !== entry.id)

        setEntryList([...filteredEntryList, entry]);
        showEditingForm(false);
    }

    function deleteItem(id) {
        setEntryList(l => {
            let index = l.findIndex(entry => entry.id == id);
            if (index >= 0)
            return l.splice(index, 1);
            return l;
        })
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