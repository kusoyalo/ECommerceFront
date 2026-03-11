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
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: '#f5f5f5' // 淺灰背景
        }}>
            {/* 1. 頂部導航欄 (確保它在最上面) */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                backgroundColor: 'white',
                borderBottom: '1px solid #ddd',
                zIndex: 100
            }}>
                <div style={{ fontSize: '18px', color: '#333' }}>
                    歡迎回來，<strong>{userJson.account}</strong> 
                    <span style={{ margin: '0 10px', color: '#ccc' }}>|</span> 
                    目前權限：<span style={{ color: '#007bff', fontWeight: 'bold' }}>{userJson.role}</span>
                </div>
                <button 
                    onClick={() => navigate('/')} 
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    登出
                </button>
            </div>

            {/* 2. 下方按鈕區 (確保置中且不超過畫面) */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'flex-start', // 改為靠上排列，不擠在正中間
                paddingTop: '60px' 
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    {allFeatures.map(item => {
                        const hasAccess = canAccess(item.accessRole);
                        return (
                            <button
                                key={item.id}
                                disabled={!hasAccess}
                                onClick={() => hasAccess && navigate(item.path, { state: userJson })}
                                // 【關鍵】這裡強制給顏色，避免它變成白色透明
                                style={{
                                    padding: '30px 20px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: 'white', // 文字強制度為白色
                                    backgroundColor: hasAccess ? '#4CAF50' : '#ccc', // 有權限綠色，無權限灰色
                                    cursor: hasAccess ? 'pointer' : 'not-allowed',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    opacity: hasAccess ? 1 : 0.6
                                }}
                            >
                                {item.name}
                                {!hasAccess && <div style={{fontSize: '12px', marginTop: '5px'}}>(權限不足)</div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

}