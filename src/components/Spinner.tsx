import React from "react";

import "../styles/Spinner.css"

interface SpinnerProps{
    className?:string;
}

const Spinner:React.FC<SpinnerProps> = ({className} ) => {
    return(
        <div style={{display:"flex", justifyContent:"center"}}>
            <span className= {className ? className + " loader" : "loader"}></span>
        </div>
    )
}

export default Spinner;