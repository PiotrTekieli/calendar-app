function ListSeparator({ entry }) {

    return (
        <>
            <div className={(entry.history == true ? "text-gray-400 " : "") + "list-element col-span-3 gap-4 [&>*]:py-3 [&>*]:px-1 sm:[&>*]:px-3"}>
                <div className="font-bold border-b border-gray-800">
                    {entry.name}
                </div>
            </div>
        </>
    );
}

export default ListSeparator;