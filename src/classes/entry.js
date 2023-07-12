import { v4 as uuidv4 } from "uuid"
import DisplayEntry from "./displayEntry";

class Entry {
    constructor() {
        this.id = uuidv4();
        this.name = "";

        this.dates = [new Date(new Date().setHours(0, 0, 0, 0)).simpleFormat()];
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
        this.dates = [simplifiedEntry.date];
        this.repeatType = simplifiedEntry.repeatType;
        this.days = simplifiedEntry.days;
        this.copyCount = simplifiedEntry.copyCount;

        this.recalculateNextDates();
        return this;
    }

    simplifyEntry() {
        return {
            name: this.name,
            date: this.dates[0],
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
        let nextDate = new Date().loadSimpleFormat(this.dates[this.dates.length-1]);

        if (this.repeatType == 3)
            return;

        switch(this.repeatType) {
            case 0:
                nextDate.setDate(nextDate.getDate() + this.days);
                break;
            case 1:
                let day = nextDate.getDay();
                if (day == 0)
                    day = 7;

                let days = String(this.days).split("").map(n => Number(n));

                let nextDay = -1;
                days.forEach(d => {
                    if (nextDay == -1 && d > day) {
                        nextDay = d;
                    }
                })

                if (nextDay == -1)
                    nextDay = days[0];

                let dayDifference = nextDay - day;
                if (dayDifference <= 0)
                    dayDifference += 7;
                nextDate.setDate(nextDate.getDate() + dayDifference);

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
        this.dates = [...this.dates, nextDate.simpleFormat()];
    }

    getBeginningOfMonth() {
        let firstDate = new Date().loadSimpleFormat(this.dates[0])
        const beginningOfMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        return beginningOfMonth;
    }

    getDisplayEntries() {
        let displayEntries = []
        this.dates.forEach(date => {
            displayEntries.push(new DisplayEntry(this.id, this.name, date))
        })
        return displayEntries;
    }

    moveToHistoryIfNeeded(today) {
        if (today.getTime() - new Date().loadSimpleFormat(this.dates[0]).getTime() > 0) {
            this.addNextDate();

            let displayEntry = new DisplayEntry(undefined, this.name, this.dates[0], true);
            this.dates.splice(0, 1);

            return displayEntry;
        }
        else return null;
    }
}

export default Entry;