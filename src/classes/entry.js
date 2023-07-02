import { v4 as uuidv4 } from "uuid"
import DisplayEntry from "./displayEntry";

class Entry {
    constructor() {
        this.id = uuidv4();
        this.name = "";

        let time = new Date().getTime();
        time = time - (time % 86400000);
        this.dates = [new Date(time)];

        this.repeatType = 0;
        this.days = 1;
        this.copyCount = 1;
    }

    clone(entry) {
        this.id = entry.id;
        this.name = entry.name;
        this.dates = entry.dates;
        this.repeatType = entry.repeatType;
        this.days = entry.days;
        this.copyCount = entry.copyCount;

        return this;
    }

    loadSimplifiedEntry(simplifiedEntry) {
        this.name = simplifiedEntry.name;

        this.dates = [];
        simplifiedEntry.dates.forEach(date => {
            this.dates.push(new Date(date));
        })

        this.repeatType = simplifiedEntry.repeatType;
        this.days = simplifiedEntry.days;
        this.copyCount = simplifiedEntry.copyCount;

        return this;
    }

    simplifyEntry() {
        return {
            name: this.name,
            dates: this.dates,
            repeatType: this.repeatType,
            days: this.days,
            copyCount: this.copyCount,
        }
    }

    recalculateNextDates() {
        this.dates = [this.dates[0]];

        for(let i = 0; i < this.copyCount; i++) {
            this.addNextDate();
        }
    }

    addNextDate() {
        let nextDate = new Date(this.dates[this.dates.length-1]);

        if (this.repeatType == 3)
            return;

        switch(this.repeatType) {
            case 0:
                nextDate.setDate(nextDate.getDate() + this.days);
                break;
            case 1:
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 2:
                let newDays;
                let daysInMonth = new Date(nextDate.getFullYear(), nextDate.getMonth() + 2, 0).getDate();
                if (nextDate.getDate() > daysInMonth)
                    newDays = daysInMonth;
                else
                    newDays = this.days;

                nextDate = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, newDays, 0);
                break;
        }
        this.dates = [...this.dates, nextDate];
    }

    getBeginningOfMonth() {
        const beginningOfMonth = new Date(this.dates[0].getFullYear(), this.dates[0].getMonth(), 1);
        return beginningOfMonth;
    }

    getDisplayEntries() {
        var displayEntries = []
        this.dates.forEach(date => {
            displayEntries.push(new DisplayEntry(this.id, this.name, date))
        })
        return displayEntries;
    }

    moveToHistoryIfNeeded(today) {
        if (today.getTime() - this.dates[0].getTime() > 0) {
            this.addNextDate();

            var displayEntry = new DisplayEntry(undefined, this.name, this.dates[0], true);
            this.dates.splice(0, 1);

            return displayEntry;
        }
        else return null;
    }
}

export default Entry;