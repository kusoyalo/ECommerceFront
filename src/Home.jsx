import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Home.css';

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

    // console.log(userJson);
    // console.log(userJson.role);
    
    //定義所有可能的選單功能
    const allFeatures = [
        { id: 'productQuery', name: '商品查詢', path: '/productQuery', accessRole: ['Guest','Normal','Store','System','Admin'] },
        { id: 'productManage', name: '商品上架管理', path: '/productManage', accessRole: ['Store','System','Admin'] },
        { id: 'accountManage', name: '系統帳號管理', path: '/accountManage', accessRole: ['System','Admin'] }
    ];

    //根據角色決定哪些按鈕可以顯示(或點擊)
    function canAccess(accessRole) {
        return accessRole.includes(userJson.role);
    }

    return (
        <div className="container">
            <h2>歡迎回來，{userJson.account}</h2>
            <hr />
            <p>目前權限：<span style={{color: 'blue'}}>{userJson.role}</span></p>
            <hr />

            <div className="menu-grid">
                {allFeatures.map(item => {
                    const hasAccess = canAccess(item.accessRole);

                    return (
                        <button
                            key={item.id}
                            onClick={() => hasAccess && navigate(item.path,{state: userJson})}
                            className="menu-item" 
                            style={{
                                backgroundColor: hasAccess ? '#4CAF50' : '#ccc',
                                cursor: hasAccess ? 'pointer' : 'not-allowed',
                                opacity: hasAccess ? 1 : 0.6
                            }}
                            disabled={!hasAccess}
                        >
                            {item.name}
                        </button>
                    );
                })}
            </div>
            
            <button onClick={() => navigate('/')} className="logout-button">登出</button>
        </div>
    );

}