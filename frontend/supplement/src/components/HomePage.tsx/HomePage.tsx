import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/auth/authSlice";

export default function HomePage() {
  const token = useSelector(selectCurrentToken);
  console.log(token)
  console.log(localStorage.getItem("exp"));
  return (
    <div>HomePage</div>
  )
}
