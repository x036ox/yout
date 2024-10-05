import {
    ADMIN_ROUTE,
    CHANNEL_ROUTE,
    EMAIL_CONFIRMATOIN_ROUTE,
    VIDEO_EDIT_ROUTE,
    VIDEO_UPLOAD_ROUTE, VIDEO_SEARCH_ROUTE, WATCH_ROUTE, USER_EDIT_ROUTE, USER_HISTORY_ROUTE,
    USER_LIKES_ROUTE,
    USER_SUBSCRIBES_ROUTE,
    CHOOSE_PICTURE_ROUTE,
    SILENT_CHECK_SSO_ROUTE as SILENT_CHECK_SSO_ROUTE
} from "./utils/RoutesConsts";
import React, {Component, ReactNode} from "react";
import MainPage from "./pages/MainPage";
import VideoEdit from "./pages/VideoEdit";
import VideoUpload from "./pages/VideoUpload";
import VideoSearch from "./pages/VideoSearch";
import Channel from "./pages/Channel";
import Watch from "./pages/Watch";
import Confirmation from "./pages/Confirmation";
import Admin from "./pages/Admin";
import UserEdit from "./pages/UserEdit"
import History from "./pages/History"
import UserSubscribes from "./pages/UserSubscribes"
import UserLikes from "./pages/UserLikes"






export const authRoutes = [
    {
        path:ADMIN_ROUTE,
        Component: <Admin/>
    }
]


export const publicRoutes = [
    {
        path:"",
        Component: <MainPage/>
    },{
        path:VIDEO_EDIT_ROUTE,
        Component: <VideoEdit/>
    },{
        path:VIDEO_UPLOAD_ROUTE,
        Component: <VideoUpload/>
    },{
        path:CHANNEL_ROUTE,
        Component:<Channel/>
    },{
        path:WATCH_ROUTE,
        Component: <Watch/>
    },{
        path:EMAIL_CONFIRMATOIN_ROUTE,
        Component:<Confirmation/>
    },{
        path:VIDEO_SEARCH_ROUTE,
        Component:<VideoSearch/>
    },{
        path:USER_EDIT_ROUTE,
        Component:<UserEdit/>
    },{
        path:USER_HISTORY_ROUTE,
        Component:<History/>
    },{
        path:USER_SUBSCRIBES_ROUTE,
        Component:<UserSubscribes/>
    }
]