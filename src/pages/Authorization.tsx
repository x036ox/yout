import {useLocation, useNavigate} from "react-router-dom";
import {useInput} from "../hooks/useInput";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/RoutesConsts";
import {Button, Card, Container, Form, NavLink} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {sendLoginUser, sendNewUser, uploadImage} from "../http-requests/PostRequests";
import {User} from "../model/User";
import "../styles/Auth.css"
import {LOCAL_STORAGE_USER} from "../utils/Consts";
import {Context} from "../index";
import {observer} from "mobx-react";

const Authorization = observer(() =>{
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin:boolean = location.pathname === LOGIN_ROUTE;
    const userStorage = useContext(Context).userService;
    const isAuthed = userStorage.mainUser !== null;

    const imageInput = useInput("");
    const emailInput = useInput("");
    const nicknameInput = useInput("");
    const passwordInput = useInput("");
    const [isUserDataWrong, setIsUserDataWrong] = useState<boolean>(false);

    useEffect(() => {
        if(isAuthed){
            navigate("/");
        }
    }, [isAuthed]);

    function createUser(email:string, nickname:string, password:string){
        if(email.length === 0 || nickname.length === 0 || password.length === 0) {
            alert("Fields must not be empty");
        } else if(imageInput.ref.current !== undefined && imageInput.ref.current?.files != null){
            if(!imageInput.ref.current.files[0]){
                alert("You have to choose picture");
            } else{
                sendNewUser({email:email, username:nickname, password:password, picture: imageInput.ref.current.files[0]} ).then(user =>{
                    if(user === null){
                        setIsUserDataWrong(true);
                    } else{
                        setIsUserDataWrong(false);
                        userStorage.mainUser = user;
                        navigate("/")
                    }
                })
            }
            
        }
        
        
    }

    function loginUser(email:string, password:string){
        if(email.length === 0 || password.length === 0) {
            alert("Fields must not be empty");
        }
        sendLoginUser(email, password).then(user =>{
            if(user === null){
                setIsUserDataWrong(true);
            } else{
                setIsUserDataWrong(false);
                userStorage.mainUser = user;
                navigate("/")
            }
        });
    }

    return(
        <Container className={"auth-page"} >
            <Card className={"auth-container"}>
                <h2 className={"m-auto"}>
                    {isLogin ? "Authorizations" : "Registrations"}
                </h2>
                <Form className={"d-flex flex-column"}>
                    {!isLogin ?
                        <Form.Control className="image-input" {...imageInput} type="file" accept="image/*"/>
                        :
                        null
                    }
                    <Form.Control className={"email-input"} {...emailInput} placeholder={"email..."}/>
                    {!isLogin ?
                        <Form.Control className={"nickname-input"} {...nicknameInput} placeholder={"login..."}/>
                        :
                        null
                    }
                    <Form.Control className={"passw-input"} {...passwordInput} placeholder={"password..."}/>
                </Form>
                {
                    isLogin ?
                        <div className={"reg-link"}>
                            Don't have an account? <div className={"navigate-div"} onClick={() => navigate(REGISTRATION_ROUTE)}>Sign up</div>
                        </div>
                        :
                        <div className={"login-link"}>
                            Already registered? <div className={"navigate-div"} onClick={() => navigate(LOGIN_ROUTE)}>Sign in</div>
                        </div>
                }
                {
                    isLogin ? isUserDataWrong && <div className={"wrong-user-data"}>Incorrect email or password</div>
                        :
                        isUserDataWrong && <div className={"wrong-user-data"}>User with this email already exists or you specified email incorrectly</div>
                }
                {
                    isLogin ?
                        <Button className={"login-button"} onClick={() => loginUser(emailInput.value, passwordInput.value)}  variant={"outline-success"}>
                            Sign in
                        </Button>
                        :
                        <Button className={"reg-button"} onClick={() => createUser(emailInput.value, nicknameInput.value, passwordInput.value)} variant={"outline-success"}>
                            Sign up
                        </Button>
                }

            </Card>
        </Container>
    );
})

export default Authorization;