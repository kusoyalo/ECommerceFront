import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AccountTable from './Account.jsx';
import './AccountManage.css';

export default function AccountManagePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const userJson = location.state || {};

    const getLocalDate = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; //取得時區偏移毫秒數
        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 10);
        return localISOTime;
    };
    const [account, setAccount] = useState('');
    const [email, setEmail] = useState('');
    const [lastModifiedTimeStart, setLastModifiedTimeStart] = useState(getLocalDate());
    const [lastModifiedTimeEnd, setLastModifiedTimeEnd] = useState(getLocalDate());
    const [changeFlag, setChangeFlag] = useState(false);

    const [searchParams, setSearchParams] = useState({
        account: null,
        email: null,
        lastModifiedTimeStart: null,
        lastModifiedTimeEnd: null,
        changeFlag: changeFlag
    });

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

    function handleSearch() {
        // console.log(changeFlag);
        
        if(changeFlag === false) {
            setChangeFlag(true);
        }else{
            setChangeFlag(false);
        }

        setSearchParams({
            account: account,
            email: email,
            lastModifiedTimeStart: lastModifiedTimeStart,
            lastModifiedTimeEnd: lastModifiedTimeEnd,
            changeFlag: changeFlag
        });
    }
    function handleCreate() {
        const params = new URLSearchParams({
            userJson: JSON.stringify(userJson)
        });

        const url = `${window.location.origin}/accountManageCreate?${params.toString()}`;
        window.open(url, '_blank');
    }

    return (
        <div className="account-container">
            <header className="account-header">
                <h2>系統帳號管理</h2>
                <button onClick={() => navigate('/home', { state: location.state })} className="back-button">返回首頁</button>
            </header>

            {/* 搜尋與篩選區塊 */}
            <div className="filter-section">
                <span>使用者帳號：</span>
                <input 
                    type="text" 
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="filter-section">
                <span>使用者email：</span>
                <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="filter-section">
                <span>日期區間起：</span>
                <input 
                    type="date" 
                    value={lastModifiedTimeStart} 
                    onChange={(e) => setLastModifiedTimeStart(e.target.value)} 
                    className="date-input"
                />
            </div>
            <div className="filter-section">
                <span>日期區間迄：</span>
                <input 
                    type="date" 
                    value={lastModifiedTimeEnd} 
                    onChange={(e) => setLastModifiedTimeEnd(e.target.value)} 
                    className="date-input"
                />
            </div>
            <button onClick={handleSearch} className="search-button">
                查詢
            </button>
            <button onClick={handleCreate} className="create-button">
                新增
            </button>
            {/* 使用者列表 */}
            <AccountTable account={searchParams.account} email={searchParams.email} lastModifiedTimeStart={searchParams.lastModifiedTimeStart} lastModifiedTimeEnd={searchParams.lastModifiedTimeEnd} userJson={userJson} changeFlag={searchParams.changeFlag}/>
        </div>
    );
}