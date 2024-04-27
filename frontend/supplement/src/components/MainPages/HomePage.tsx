import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../../redux/auth/authSlice";
import '../../style/MainPages/HomePage.css';
import { useEffect } from "react";

export default function HomePage() {
  const user = useSelector(selectCurrentUser);
  useEffect(() => {
    console.log(user);
  }, [])
  return (
    <div className="sa">HomePage</div>
  )
}
