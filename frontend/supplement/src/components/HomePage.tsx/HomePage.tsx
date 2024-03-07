import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/auth/authSlice";
import '../../style/HomePage/HomePage.css';

export default function HomePage() {
  const token = useSelector(selectCurrentToken);
  console.log(token)
  console.log(localStorage.getItem("exp"));
  return (
    <div className="sa">HomePage</div>
  )
}
