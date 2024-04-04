import React, { useContext, useEffect, useState } from "react";
import {authRoutes, publicRoutes} from "./routes";
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import { Context } from ".";
import { observer } from "mobx-react";

const AppRouter = observer(() => {
    const user = useContext(Context).userService.mainUser;
    const isAdmin = user?.isAdmin;


    
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