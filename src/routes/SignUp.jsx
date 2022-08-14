import HomeLeft from '../component/HomeLeft';
import logo from "../assets/logo.svg";
import loading from "../assets/loading.svg";
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { apiSignUp, apiLogin } from '../API';
import { checkEmail, setUserData } from '../common';

export default function SignUp() {
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState({
        email: '',
        err_email: '',
        nickname: '',
        err_nickname: '',
        password: '',
        err_password: '',
        password2: '',
        err_password2: '',
        isLoading: false,
    })

    const [errNotice, setErrNotice] = useState('');

    const typeInput = e => {
        const { name, value } = e.target;
        setUserInput((origin) => ({ ...origin, [name]: value }));
    }

    const doSignUp = () => {
        setUserInput((origin) => ({ ...origin, err_email: "", err_nickname: "", err_password: "", err_password2: "", isLoading: true }));
        setErrNotice("");

        let passCheck = true;
        const { email, nickname, password, password2 } = userInput;
        if (!email) {
            setUserInput((origin) => ({ ...origin, err_email: "此欄位不可為空" }));
            passCheck = false;
        } else if (!checkEmail(email)) {
            setUserInput((origin) => ({ ...origin, err_email: "Email 格式錯誤" }));
            passCheck = false;
        }

        if (!nickname) {
            setUserInput((origin) => ({ ...origin, err_nickname: "此欄位不可為空" }));
            passCheck = false;
        }

        if (!password) {
            setUserInput((origin) => ({ ...origin, err_password: "此欄位不可為空" }));
            passCheck = false;
        }

        if (!password2) {
            setUserInput((origin) => ({ ...origin, err_password2: "此欄位不可為空" }));
            passCheck = false;
        }

        if (password && password2 && password !== password2) {
            setUserInput((origin) => ({ ...origin, err_password2: "兩次密碼輸入不同" }));
            passCheck = false;
        }

        if (passCheck) {
            setTimeout(() => {

            }, 1000);
            apiSignUp({
                email,
                nickname,
                password
            })
                .then(res => res.json())
                .then(resJson => {
                    const { error } = resJson;
                    if (error) {
                        error.length > 1 ? setErrNotice(error.join(',')) : setErrNotice(error);
                        setUserInput((origin) => ({ ...origin, isLoading: false }));
                    } else {
                        let userData = {};
                        userData.email = email;
                        userData.nickname = nickname;
                        console.log(userData);
                        apiLogin({ email, password })
                            .then(res => {
                                const { headers, status } = res;
                                if (status !== 200)
                                    return res.json();
                                else {
                                    let authorization = headers.get('authorization');
                                    userData.authorization = authorization;
                                    return res.json();
                                }
                            })
                            .then(resJson => {
                                console.log(resJson, userData);
                                setUserData(userData);
                                setUserInput((origin) => ({ ...origin, isLoading: false }));
                                navigate("/Todo/", { replace: true });
                            })
                            .catch(err => {
                                setErrNotice(err);
                            });
                    }
                })
                .catch(err => {
                    setErrNotice(err)
                })
        } else {
            setUserInput((origin) => ({ ...origin, isLoading: false }));
        }
    }

    return (
        <div className='home'>
            <HomeLeft />
            <div className="home_right">
                <img className='mobile_logo' src={logo} alt="mobileLogo" />
                <h2>註冊帳號</h2>
                <div className="home_right_form">
                    <div className="input_control">
                        <label htmlFor="tbx_email">Email</label>
                        <input className={userInput.err_email ? 'err' : ''} id='tbx_email' name='email' type="email" placeholder="請輸入Email" onChange={typeInput} />
                        <span className="err_text">{userInput.err_email}</span>
                    </div>
                    <div className="input_control">
                        <label htmlFor="tbx_nickname">您的暱稱</label>
                        <input className={userInput.err_nickname ? 'err' : ''} id='tbx_nickname' name='nickname' type="text" placeholder="請輸入您的暱稱" onChange={typeInput} />
                        <span className="err_text">{userInput.err_nickname}</span>
                    </div>
                    <div className="input_control">
                        <label htmlFor="tbx_pwd">密碼</label>
                        <input className={userInput.err_password ? 'err' : ''} id='tbx_pwd' name='password' type="password" placeholder="請輸入密碼" onChange={typeInput} />
                        <span className="err_text">{userInput.err_password}</span>
                    </div>
                    <div className="input_control">
                        <label htmlFor="tbx_pwd2">密碼</label>
                        <input className={userInput.err_password2 ? 'err' : ''} id='tbx_pwd2' name='password2' type="password" placeholder="請再次輸入密碼" onChange={typeInput} />
                        <span className="err_text">{userInput.err_password2}</span>
                    </div>
                    <div className="input_control">
                        <span className='err_text'>{errNotice}</span>
                    </div>
                    <button className='btn login' onClick={doSignUp}>註冊帳號</button>
                    <div style={{ textAlign: 'center' }}>
                        {userInput.isLoading ? <span><img height="100px" src={loading} /></span> : ''}
                    </div>
                    <div className='signUp'>
                        <Link className='btn_link' to="/">登入</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}