import { v4 as uuidv4 } from "uuid";

function ListElement({ date, entry, edit, delete: del, submit }) {
    let dayDifference;
    let timeDifference = new Date().loadSimpleFormat(entry.date) - date.getTime();
    dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));

    const formatDate = (date) => {
        return new Date().loadSimpleFormat(date).toLocaleDateString("en-UK");
    }

    return (
        <>
            <tr className={(entry.history == true ? "text-gray-400 " : "") + "hover:bg-gray-100 p-1 gap-4"}>
                <td><b>{entry.name == "" ? "Untitled" : entry.name}</b></td>
                <td className="whitespace-nowrap">In {dayDifference} days</td>
                <td>{formatDate(entry.date)}</td>

                <td>
                    {!entry.history && (
                        <button onClick={() => edit(entry.id)} className="border-blue-500 hover:bg-blue-100 hover:brightness-100">Edit</button>
                    )}
                </td>
                <td>
                    <button onClick={() => del(entry.id)} className="border-0 font-bold text-red-700 text-lg">X</button>
                </td>
            </tr>
        </>
    );
}


export default ListElement;