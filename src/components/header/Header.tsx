import {observer} from "mobx-react";
import {useContext} from "react";
import {Context} from "../../index";
import "../../styles/Header.css"
import LeftSection from "./LeftSection";
import MiddleSection from "./MiddleSection";
import RightSection from "./RightSection";
import {User} from "../../model/User";


const Header = observer(() => {
    const mainUser:User | null = useContext(Context).userService.mainUser;

    return(
        <div className={"header"}>
            <LeftSection/>
            <MiddleSection mainUser={mainUser}/>
            <RightSection mainUser={mainUser}/>
        </div>
    )
})

export default Header;