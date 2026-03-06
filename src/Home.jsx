import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const userJson = location.state || {}; //這裡就會拿到上一頁傳進來的值

    useEffect(() => {
        // 檢查條件：如果帳號不存在
        if (userJson.account == null) {
            navigate('/', { replace: true });
        }
    }, [userJson.account, navigate]); // 當這兩個變數改變時執行，確保不會一直重覆觸發useEffect

    //如果沒有資料，直接回傳空值或，不讓下方HTML被看到
    if (userJson.account == null) {
        return null; 
    }

    console.log(userJson);
    console.log(userJson.role);
    return (<div>歡迎來到首頁</div>);
}