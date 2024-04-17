import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../../redux/auth/authSlice";
import '../../style/MainPages/HomePage.css';

export default function HomePage() {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  console.log(user);
  console.log(token);
  return (
    <div className="sa">HomePage</div>
  )
}
