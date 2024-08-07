import {observer} from "mobx-react";
import {useContext, useState} from "react";
import {Context} from "../../index";
import "../../styles/Header.css"
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";


const Header = observer(() => {

    return(
        <div className={"header"}>
            <LeftSection/>
            <MiddleSection/>
            <RightSection/>
        </div>
    )
})

export default Header;