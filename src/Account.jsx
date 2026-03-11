import { useState, useEffect } from 'react';
import './Account.css';
import { toast } from 'react-hot-toast';

export default function AccountTable({ account, email, lastModifiedTimeStart, lastModifiedTimeEnd,userJson, changeFlag }) {
    const [accounts, setAccounts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if(account == null){
            setLoading(false);
            setAccounts([]);
            return;
        }
        queryAccount();
    },[account, email, lastModifiedTimeStart, lastModifiedTimeEnd,changeFlag]);

    async function queryAccount() {
        const params = new URLSearchParams({
            account: account || '',
            email: email || '',
            lastModifiedTimeStart: lastModifiedTimeStart || '',
            lastModifiedTimeEnd: lastModifiedTimeEnd || ''
        });
        
        try {
            const response = await fetch(`https://localhost:7225/api/accountManage/queryAccount?${params.toString()}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('完成：', data);

                setAccounts(data.accountsJson);
            } 
            else {
                console.error('失敗');
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (account) => {
        //顯示確認視窗
        const isConfirmed = window.confirm(`確定要刪除使用者「${account.userName}」嗎？`);
        
        if (isConfirmed) {
            try {
                const response = await fetch('https://localhost:7225/api/accountManage/accountDelete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ account: account.account }) 
                });

                if (response.ok) {
                    toast.success('刪除完成');
                    queryAccount();
                } else {
                    const errorData = await response.json();
                    toast.error('刪除失敗：' + errorData.message);
                }
            } catch (error) {
                console.error('錯誤：', error);
            }
        }
    };

    if (loading) {return <div>資料載入中...</div>;}
    if (error) {return <div>發生錯誤：{error}</div>;}

    return (
        <div style={{ padding: '20px' }}>
            <h2>使用者列表</h2>
            <table className="table-container">
                <thead>
                    <tr className="table-row">
                        <th className="table-header">操作</th>
                        <th className="table-header">使用者帳號</th>
                        <th className="table-header">使用者名稱</th>
                        <th className="table-header">使用者email</th>
                        <th className="table-header">使用者權限</th>
                        <th className="table-header">最後修改人員</th>
                        <th className="table-header">最後修改時間</th>
                    </tr>
                </thead>
                <tbody>
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                    <tr key={account.account} className="table-row">
                        <td>
                            <button 
                                onClick={() => {
                                    const params = new URLSearchParams({
                                        userJson: JSON.stringify(userJson)
                                    });
                                    window.open(`/accountManageUpdate/${account.account}?${params.toString()}`, '_blank');
                                }}
                                className="update-button"
                                style={{ width: '80px' }}
                            >
                                修改
                            </button>
                            <br/><br/>
                            <button 
                                onClick={() => handleDelete(account)}
                                className="delete-button"
                                style={{ width: '80px' }}
                            >
                                刪除
                            </button>
                        </td>
                        <td>{account.account}</td>
                        <td>{account.userName}</td>
                        <td>{account.email}</td>
                        <td>{account.role}</td>
                        <td>{account.lastModifiedBy}</td>
                        <td>{account.lastModifiedTime}</td>
                    </tr>
                    ))
                ) : (
                    <tr><td colSpan="7">目前沒有資料</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}