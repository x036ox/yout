import React, { useContext, useEffect, useState } from "react";
import {authRoutes, publicRoutes} from "./routes";
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import { Context } from ".";
import { observer } from "mobx-react";
import { useAuth } from "react-oidc-context";
import { checkIsUserAdmin } from "./utils/AuthorityUtils";

const AppRouter = observer(() => {
    const auth = useAuth();
    const isAdmin = checkIsUserAdmin(auth.user?.profile.authorities);


    
    return(
        <Routes>
            { isAdmin? authRoutes.map(({path, Component}) =>
                <Route path = {path} element={Component}/>) : null}

            { publicRoutes.map(({path, Component}) =>
                <Route path = {path} element={Component}/>)}
        </Routes>
    )
    });

    export default AppRouter;