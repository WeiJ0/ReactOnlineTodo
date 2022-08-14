import logo from "../assets/logo.svg";
import todo from "../assets/todo.png";
import '../Home.css';
export default function HomeLeft() {
    return (
      <div className="home_left">
        <img className="home_left_logo" src={logo} alt={'HomeLogo'} />
        <img src={todo} alt={'todo'} />
      </div>
    );
  }