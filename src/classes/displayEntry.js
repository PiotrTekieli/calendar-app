import { v4 as uuidv4 } from "uuid"

class DisplayEntry {
    constructor(date = null, history = false) {
        this.id = uuidv4();
        this.name = "";
        this.description = "";
        this.repeatDesc = "";
        this.date = date;
        this.history = history;
        this.separator = false;
    }

    getDataFromEntry(entry) {
        this.id = entry.id;
        this.name = entry.name;
        this.description = entry.description;
        this.repeatDesc = entry.repeatDesc;

        return this;
    }

    // constructor(id = uuidv4(), name = "", description = "", date = null, history = false) {
    //     this.id = id,
    //     this.name = name;
    //     this.description = description;
    //     this.date = date;
    //     this.history = history;
    // }

    simplifyHistoryEntry() {
        return {
            name: this.name,
            description: this.description,
            repeatDesc: this.repeatDesc,
            date: this.date,
        }
    }

    loadSimplifiedDisplayEntry(simplifiedEntry) {
        this.name = simplifiedEntry.name,
        this.description = simplifiedEntry.description
        this.repeatDesc = simplifiedEntry.repeatDesc;
        this.date = simplifiedEntry.date;
        this.history = true;

        return this;
    }
}

export default DisplayEntry;