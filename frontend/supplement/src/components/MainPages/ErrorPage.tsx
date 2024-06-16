import { useNavigate } from 'react-router-dom';
import '../../style/MainPages/ErrorPage.css';
import { useEffect } from 'react';

export const ErrorPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
    })

  return (
    <div className="error-page">
        <div className="error-page-content">
            <div className="error-icon">
                <i className="fa-solid fa-face-frown"/>
            </div>
            <h2 className='text-center'>The page you are looking for not exists..</h2>
            <button onClick={() => navigate("/home")}>Return to the Home Page</button>
        </div>
    </div>
  )
}
