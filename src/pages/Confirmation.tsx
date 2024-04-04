import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { confirmEmail } from "../http-requests/GetRequests";
import Spinner from "../components/Spinner";

const Confirmation = () => {

    
    const [isEmailConfirmed, setEmailConfirmed] = useState<boolean | undefined>(undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get("u")

    useEffect(()=>{
        if(user != undefined){
            confirmEmail(user).then(isConfirmed => setEmailConfirmed(isConfirmed))
            .then(() => setTimeout(() =>{navigate("/")}, 5000));
        }
            
    },[user]);

    return(
        <div>
            { 
                isEmailConfirmed == undefined ?
                <Spinner/>
                :
                "Success. Redirecting in 5 seconds"
            }
        </div>
    )

}

export default Confirmation;