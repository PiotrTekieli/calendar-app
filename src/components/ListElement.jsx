import { v4 as uuidv4 } from "uuid";

function ListElement({ date, entry, edit, delete: del, submit }) {
    var dayDifference;
    var timeDifference = new Date(entry.date).setHours(0, 0, 0, 0) - date.getTime();
    dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));

    const formatDate = (date) => {
        return date.toLocaleDateString("en-UK");
    }

    return (
        <>
            <li>
                <span className={entry.history == true ? "text-gray-400" : ""}>
                    {entry.name == "" ? "Untitled" : entry.name}, In {dayDifference} days, {formatDate(entry.date)}
                </span>

                {!entry.history && (
                    <button onClick={() => edit(entry.id)} className="bg-gray-500">edit</button>
                )}
                <button onClick={() => del(entry.id)} className="bg-red-500">X</button>
            </li>
        </>
    );
}


export default ListElement;