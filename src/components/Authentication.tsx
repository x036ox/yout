import React, { useState } from "react"
import { hasAuthParams, useAuth } from "react-oidc-context"


const Authentication = () =>{
    const auth = useAuth();
    const [hasTriedSignin, setHasTriedSignin] = useState(false);
    
    React.useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin
        ) {
            auth.signinRedirect();
            setHasTriedSignin(true);
        }
    }, [auth, hasTriedSignin]);

    if (auth.isLoading) {
        return <div>Signing you in/out...</div>;
    }

    if (!auth.isAuthenticated) {
        return <div>Unable to log in</div>;
    }

    return <button onClick={() => void auth.removeUser()}>Log out</button>;
}

export default Authentication;