import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getUserData, setUserData } from '../common';
import { apiLogin } from '../API';

import HomeLeft from '../component/HomeLeft';
import logo from "../assets/logo.svg";
import loading from "../assets/loading.svg";

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        if (getUserData())
            navigate("/Todo/", { replace: true })
    }, [])

    const [userInput, setUserInput] = useState({
        email: '',
        err_email: '',
        password: '',
        err_password: '',
        err: '',
        isLoading: false,
    })

    const typeInput = e => {
        const { name, value } = e.target;
        setUserInput((origin) => ({ ...origin, [name]: value }));
    }

    const doLogin = () => {
        let passCheck = true;
        let userData = {};
        const { email, password } = userInput;
        if (!email) {
            setUserInput((origin) => ({ ...origin, err_email: "此欄位不可為空" }));
            passCheck = false;
        }

        if (!password) {
            setUserInput((origin) => ({ ...origin, err_password: "此欄位不可為空" }));
            passCheck = false;
        }

        if (passCheck) {
            setUserInput((origin) => ({ ...origin, isLoading: true }));
            apiLogin({ email, password })
                .then(res => {
                    console.log(res);
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
                    const { error, email, nickname } = resJson;
                    if (error)
                        setUserInput((origin) => ({ ...origin, isLoading: false, err: error }));
                    else {
                        userData.email = email;
                        userData.nickname = nickname;
                        setUserData(userData);
                        navigate("/Todo/", { replace: true });
                    }
                })
                .catch(err => {
                    setUserInput((origin) => ({ ...origin, isLoading: false, err: '登入失敗，帳號密碼錯誤' }));
                });
        }
    }

    return (
        <div className='home'>
            <HomeLeft />
            <div className="home_right">
                <img className='mobile_logo' src={logo} alt="mobileLogo" />
                <h2 style={{ marginBottom: '2rem' }}>最實用的線上代辦事項服務</h2>
                <div className="home_right_form">
                    <div className="input_control">
                        <label htmlFor="tbx_email">Email</label>
                        <input className={userInput.err_email ? 'err' : ''} id='tbx_email' name='email' type="email" placeholder="請輸入Email" onChange={typeInput} />
                        <span className="err_text">{userInput.err_email}</span>
                    </div>
                    <div className="input_control">
                        <label htmlFor="tbx_pwd">密碼</label>
                        <input className={userInput.err_password ? 'err' : ''} id='tbx_pwd' name='password' type="password" placeholder="請輸入密碼" onChange={typeInput} />
                        <span className="err_text">{userInput.err_password}</span>
                    </div>
                    <div className="input_control">
                        <span className='err_text'>{userInput.err}</span>
                    </div>
                    <button className='btn login' onClick={doLogin}>登入</button>
                    <div style={{ textAlign: 'center' }}>
                        {userInput.isLoading ? <span><img height="100px" src={loading} /></span> : ''}
                    </div>
                    <div className='signUp'>
                        <Link className='btn_link' to="SignUp">註冊帳號</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}