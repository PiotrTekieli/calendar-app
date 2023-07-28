import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function ListElement({ date, entry, edit, delete: del, submit }) {
    let dayDifference;
    let timeDifference = new Date().loadSimpleFormat(entry.date) - date.getTime();
    dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));

    const formatDate = (date) => {
        return new Date().loadSimpleFormat(date).toLocaleDateString("en-UK");
    }

    const [appear, setAppear] = useState(false);
    const descriptionRef = useRef();

    function showDescription() {
        if (appear)
            descriptionRef.current.style.maxHeight = "0px";
        else
            setTimeout(() => {
                descriptionRef.current.style.maxHeight = "max-content";
            })

        setAppear(!appear)

        // if (appear) {
        //     descriptionRef.current.style.maxHeight = "0px";
        //     setTimeout(() => {
        //         setAppear(false);
        //     }, 150)
        // }
        // else {
        //     setAppear(true);
        //     setTimeout(() => {
        //         // descriptionRef.current.style.maxHeight = "calc(" + descriptionRef.current.scrollHeight + "px + 1.5rem)";
        //         descriptionRef.current.style.maxHeight = "10000px";
        //     })
        // }
    }

    return (
        <>
            {/* <tr className={(entry.history == true ? "text-gray-400 " : "") + "hover:bg-gray-100 p-1 gap-4"} onClick={() => showDescription()}>
                <td><b>{entry.name == "" ? "Untitled" : entry.name}</b></td>
                <td className="whitespace-nowrap">In {dayDifference} days</td>
                <td>{formatDate(entry.date)}</td>

                <td>
                    {!entry.history && (
                        <button onClick={(e) => {e.stopPropagation(); edit(entry.id)}} className="border-blue-500 hover:bg-blue-100 hover:brightness-100">Edit</button>
                    )}
                </td>
                <td>
                    <button onClick={(e) => {e.stopPropagation(); del(entry.id)}} className="border-0 font-bold text-red-700 text-lg">X</button>
                </td>
            </tr>
            {appear && (
                <tr ref={descriptionRef} className="bg-gray-200 flex transition-all max-h-0 overflow-hidden w-full">
                    <td colSpan={5}></td>
                </tr>
            )} */}

            <div className={(entry.history == true ? "text-gray-400 " : "") + "list-element gap-4 contents cursor-pointer [&>*]:py-3 [&>*]:px-1 sm:[&>*]:px-3"} onClick={() => showDescription()}>
                <div>{entry.name == "" ? "Untitled" : entry.name}</div>
                <div className="whitespace-nowrap">In {dayDifference} days</div>
                <div>{formatDate(entry.date)}</div>
            </div>

            {appear && (
                <div ref={descriptionRef} className="bg-gray-200 col-span-3 flex justify-between items-center gap-4 max-h-0 overflow-hidden w-full [&>*]:py-2 sm:[&>*]:px-3">
                    <div className="italic min-w-[60%]">{entry.description == "" ? "No Description" : entry.description}</div>
                    <div>{entry.repeatDesc}</div>
                    <div className="flex">
                        <div>
                            {!entry.history && (
                                <button onClick={(e) => {e.stopPropagation(); edit(entry.id)}} className="border-blue-500 hover:bg-blue-100 hover:brightness-100">Edit</button>
                            )}
                        </div>
                        <div>
                            <button onClick={(e) => {e.stopPropagation(); del(entry.id)}} className="border-0 font-bold text-red-700 text-lg">X</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


export default ListElement;