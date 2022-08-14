import { getAuthToken } from "./common";

const API_URL = "https://todoo.5xcamp.us";

const userRequest = (method, path, data) => {
  if (method === "POST") {
    return fetch(`${API_URL}/users/${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(data),
    });
  } else {
    return fetch(`${API_URL}/users/${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method,
    });
  }
};
const todoRequest = (method, path, data) => {
  if (method === "POST") {
    return fetch(`${API_URL}/todos/${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthToken(),
      },
      method,
      body: JSON.stringify(data),
    });
  } else {
    return fetch(`${API_URL}/todos/${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: getAuthToken(),
      },
      method,
    });
  }
};
// User
export const apiLogin = (data) =>
  userRequest("POST", "sign_in", {
    user: {
      email: data.email,
      password: data.password,
    },
  });
export const apiLogout = (data) => userRequest("DELETE", "sign_out", {});
export const apiSignUp = (data) =>
  userRequest("POST", "", {
    user: {
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    },
  });

// Todo
export const apiTodoList = (data) => todoRequest("GET", "", {});
export const apiAddTodo = (data) =>
  todoRequest("POST", "", {
    todo: {
      content: data.content,
    },
  });

export const apiEditTodo = (data) =>
  todoRequest("PUT", data.id, {
    todo: {
      content: data.content,
    },
  });

export const apiDelTodo = (data) => todoRequest("DELETE", data.id, {});
export const apiFinishTodo = (data) =>
  todoRequest("PATCH", `${data.id}/toggle`, {});
