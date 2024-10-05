import React, { useContext, useEffect, useState } from "react";
import {authRoutes, publicRoutes} from "./routes";
import {Route, Routes} from "react-router-dom";
import { observer } from "mobx-react";
import { Authorities } from "./utils/Authorities";
import { useKeycloak } from "./KeycloakPrivoder";

const AppRouter = observer(() => {
    const keycloak = useKeycloak();
    const isAdmin = keycloak.hasResourceRole(Authorities.ADMIN);


    
    return(
        <Routes>
            { isAdmin? authRoutes.map(({path, Component}) =>
                <Route key={path} path = {path} element={Component}/>) : null}

            { publicRoutes.map(({path, Component}) =>
                <Route key={path} path = {path} element={Component}/>)}
        </Routes>
    )
    });

    export default AppRouter;