
function Arrow(props) {
    if (props.faceLeft == undefined)
        props.faceLeft = false;

    return <>
        <button className={props.className ?? "" + (props.faceLeft ? " rotate-180" : "") + " w-8 h-8 bg-[url(/arrow2.png)] bg-contain bg-no-repeat bg-center border-0"} onClick={props.onClick}></button>
    </>
}

export default Arrow;