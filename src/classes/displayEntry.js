import { v4 as uuidv4 } from "uuid"

class DisplayEntry {
    constructor(id = uuidv4(), name = "", date = null, history = false) {
        this.id = id,
        this.name = name;
        this.date = date;
        this.history = history;
    }

    simplifyHistoryEntry() {
        return {
            name: this.name,
            date: this.date,
        }
    }

    loadSimplifiedDisplayEntry(simplifiedEntry) {
        this.name = simplifiedEntry.name,
        this.date = new Date(simplifiedEntry.date);
        this.history = true;

        return this;
    }
}

export default DisplayEntry;