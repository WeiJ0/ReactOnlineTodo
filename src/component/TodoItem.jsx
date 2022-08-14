export default function TodoItem(props) {
    const { id, completed_at, content, doFinish, doRemove } = props;
    return (
        <li className="todoItems">
            <label htmlFor={`todo_${id}`}>
                <input
                    checked={completed_at ? "checked" : ""}
                    name={id}
                    id={`todo_${id}`}
                    type="checkbox"
                    onChange={doFinish}
                />
                <span>{content}</span>
            </label>
            <i className="fa-solid fa-xmark" data-todoid={id} onClick={doRemove}></i>
        </li>
    );
}