import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiTodoList, apiAddTodo, apiDelTodo, apiFinishTodo, apiLogout } from '../API';
import { getUserData, clearUserData } from '../common';

import logo from "../assets/logo.svg";
import loading from "../assets/loading.svg";
import empty from "../assets/empty.png";

import TodoItem from "../component/TodoItem";
import '../Todo.css';

const statusList = [
    {
        code: 0,
        name: "全部"
    },
    {
        code: 1,
        name: "待完成"
    },
    {
        code: 2,
        name: "已完成"
    }
];

export default function Todo() {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [newTodo, setNewTodo] = useState("");
    const [currentStatus, setCurrentStatus] = useState(0);
    const [todoListItems, setTodoListItems] = useState([]);
    const [errNotice, setErrNotice] = useState("");
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        let userData = getUserData();
        if (!userData)
            navigate("/", { replace: true })
        else
            setUser(userData);

        document.title = `${userData.nickname} 的代辦事項`;
        getTodoList();
    }, []);

    const getTodoList = () => {
        setErrNotice("");
        apiTodoList({})
            .then(res => res.json())
            .then(resJson => {
                const { todos, message } = resJson;
                if (message) {
                    setErrNotice("請輸入待辦事項內容");
                }
                else {
                    setTodoListItems(todos);
                    setLoading(false);
                }
            })
    }
    const currentTodoListItems = () => {
        if (currentStatus === 0)
            return todoListItems;
        else if (currentStatus === 1)
            return todoListItems.filter((item) => !item.completed_at);
        else
            return todoListItems.filter((item) => item.completed_at);
    };
    const addTodo = async (e) => {
        setErrNotice("");
        if (newTodo === "") {
            setErrNotice("請輸入待辦事項內容");
            return
        };
        setNewTodo("")
        setLoading(true);
        await apiAddTodo({ content: newTodo }).then(res => res.json()).then(resJson => {
            const { message } = resJson;
            if (message)
                setErrNotice(message);
        }).catch(err => setErrNotice(err));
        await getTodoList();
    };
    const finishTodo = async (e) => {
        setErrNotice("");
        setLoading(true);
        const { name } = e.target;
        await apiFinishTodo({ id: name }).catch(err => {
            setErrNotice(err);
        });
        await getTodoList();
    };
    const removeTodo = async (e) => {
        setLoading(true);
        let id = e.target.getAttribute("data-todoid");
        await apiDelTodo({ id }).catch(err => {
            setErrNotice(err);
        });
        await getTodoList();
    };
    const removeFinished = async () => {
        setLoading(true);
        let finished = todoListItems.filter((item) => item.completed_at);
        for (let i = 0; i < finished.length; i++) {
            await apiDelTodo({ id: finished[i]["id"] }).catch(err => {
                setErrNotice(err);
            });
        }
        await getTodoList();
    };
    const logout = () => {
        apiLogout();
        clearUserData();
        setUser({});
        navigate("/", { replace: true });
    }
    return (
        <div className="bg">
            <header>
                <img className="header_logo" src={logo} alt={"logo"} />
                <div className="header_tool">
                    <h3>{user.nickname}的待辦</h3>
                    <a onClick={logout}>登出</a>
                </div>
            </header>
            <section className="content">
                <div className="newTodo">
                    <input value={newTodo} type="text" placeholder="新增待辦事項" onChange={(e) => setNewTodo(e.target.value)} />
                    <button onClick={addTodo}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    {errNotice ? <span className="todoErr">{errNotice}</span> : ''}
                    {isLoading ? <span><img height="100px" src={loading} /></span> : ''}
                </div>
                {todoListItems.length > 0 ? (
                    <div className="todoList">
                        <ul className="todoList_tab">
                            {statusList.map((item) => {
                                const { code, name } = item;
                                return (
                                    <li key={code} className={currentStatus === code ? "active" : ""}
                                        onClick={(e) => setCurrentStatus(code)}>
                                        {name}
                                    </li>
                                );
                            })}
                        </ul>
                        <ul className="todoList_items">
                            {currentTodoListItems().map((item) => {
                                const { id, completed_at, content } = item;
                                return (
                                    <TodoItem
                                        key={id}
                                        id={id}
                                        completed_at={completed_at ? true : false}
                                        content={content}
                                        doFinish={finishTodo}
                                        doRemove={removeTodo}
                                    />
                                );
                            })}
                        </ul>
                        <div className="todoList_footer">
                            <p>
                                {todoListItems.filter((item) => !item.finished).length}
                                個待完成項目
                            </p>
                            <a onClick={removeFinished}>清除已完成項目</a>
                        </div>
                    </div>
                ) : (
                    <div className="todoEmpty">
                        <p>目前尚無待辦事項</p>
                        <img src={empty} />
                    </div>
                )}
            </section>
        </div>
    );
}