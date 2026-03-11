import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductTable from './Product.jsx'
import './Login.css';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        account: '',
        password: ''
    });
    const navigate = useNavigate();
    
    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
            })
        );  
    };
    async function handleSubmit(e) {
        e.preventDefault();
        console.log('登入資訊：', formData);

        try {
            const response = await fetch('https://localhost:7225/api/login', {
                method: 'POST', //指定HTTP方法
                headers: {
                    'Content-Type': 'application/json', //告訴後端傳送的是JSON
                },
                body: JSON.stringify(formData), //將物件轉為JSON字串
            });

            if (response.ok) {
                const data = await response.json(); //解析後端回傳的JSON
                console.log('完成：', data);

                if(data.result === 'fail') {
                    toast.error(data.message);
                    return;
                }
                navigate('/home', { replace: true, 
                    state: data.userJson
                });
            } 
            else {
                console.error('失敗');
            }
        } catch (error) {
            console.error('錯誤：', error);
        }
    }
    
    return (
        <>
            <div className="container">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="title">登入</h2>
            
                    <div className="inputGroup">
                    <label>帳號</label>
                    <input
                        type="text"
                        name="account"
                        value={formData.account}
                        onChange={handleChange}
                        className="input"
                        placeholder="請輸入帳號"
                        required
                    />
                    </div>

                    <div className="inputGroup">
                    <label>密碼</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input"
                        placeholder="請輸入密碼"
                        required
                    />
                    </div>
                    <button type="submit" className="button">登入系統</button>
                </form>
            </div>
            <div>
                <ProductTable queryType="default" />
            </div>
        </>
    );
}