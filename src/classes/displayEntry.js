import { v4 as uuidv4 } from "uuid"

class DisplayEntry {
    constructor(id, name, date, history = false) {
        this.id = id,
        this.name = name;
        this.date = date;
        this.history = history;
    }
}

export default DisplayEntry;