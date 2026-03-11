import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AccountManageUpdate.css';
import { toast } from 'react-hot-toast';

export default function AccountManageUpdatePage() {
    const { account } = useParams();
    //console.log(account);

    const [searchParams] = useSearchParams();
    const userJson = searchParams.get('userJson');
    //console.log(userJson);

    const [formData, setFormData] = useState({
        account: account,
        userName: '',
        email: '',
        password: '',
        role: 'Guest',
        lastModifiedBy: JSON.parse(userJson).account
    });

    // useEffect(() => {
    //     console.log('formData 已更新：', formData);
    // }, [formData]);

    useEffect(() => {
            async function queryDetail() {
                const params = new URLSearchParams({
                    account: account
                });
    
                try {
                    const response = await fetch(`https://localhost:7225/api/accountManage/queryDetail?${params.toString()}`, {
                    method: 'GET',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('完成：', data);
    
                    setFormData(prev => ({
                        ...prev,
                        ...data.usersJson,
                        account: account,
                        lastModifiedBy: JSON.parse(userJson).account
                    }));

                } 
                else {
                    console.error('失敗');
                }
                } catch (error) {
                    console.error('錯誤：', error);
                }
            }
    
            queryDetail();
        },[]);

    
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        //輸入時即時清除該欄位的錯誤提示
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.password.trim()) newErrors.password = '密碼為必填';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; //若無錯誤回傳true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        console.log('formData：', formData);

        const formDataToSend = new FormData();
        
        formDataToSend.append('account', formData.account);
        formDataToSend.append('userName', formData.userName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('role', formData.role);
        formDataToSend.append('lastModifiedBy', formData.lastModifiedBy);

        try {
            const response = await fetch('https://localhost:7225/api/accountManage/accountUpdate', {
                method: 'POST',
                body: formDataToSend 
            });

            if (response.ok) {
                toast.success('修改完成');
            } else {
                const errorData = await response.json();
                toast.error('修改失敗：' + errorData.message);
            }
        } catch (error) {
            console.error('錯誤：', error);
        }
    };

    return (
        <div className="update-container">
            <form className="update-form" onSubmit={handleSubmit}>
                <h2>使用者修改</h2>
                
                <div className="form-group">
                    <label>使用者帳號</label>
                    <label>{formData.account}</label>
                </div>

                <div className="form-group">
                    <label>使用者名稱</label>
                    <input 
                        name="userName" 
                        value={formData.userName} 
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>使用者email</label>
                        <input 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>使用者密碼 <span className="required">*</span></label>
                        <input 
                            name="password" 
                            type="password"
                            value={formData.password} 
                            onChange={handleChange}
                            className={errors.password ? 'error-input' : ''}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>使用者權限</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Guest">Guest</option>
                            <option value="Normal">Normal</option>
                            <option value="Store">Store</option>
                            <option value="System">System</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div className="button-group">
                    <button type="submit" className="update-btn">修改</button>
                    <button type="button" onClick={() => window.close()} className="cancel-btn">取消</button>
                </div>
            </form>
        </div>
    );
}