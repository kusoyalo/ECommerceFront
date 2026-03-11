import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './AccountManageCreate.css';
import { toast } from 'react-hot-toast';

export default function AccountManageCreatePage() {
    const [searchParams] = useSearchParams();
    
    const userJson = searchParams.get('userJson');
    
    //console.log(userJson);

    const [formData, setFormData] = useState({
        account: '',
        userName: '',
        email: '',
        password: '',
        role: 'Guest',
        lastModifiedBy: JSON.parse(userJson).account
    });

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
        if (!formData.account.trim()) newErrors.account = '帳號為必填';
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
            const response = await fetch('https://localhost:7225/api/accountManage/accountCreate', {
                method: 'POST',
                body: formDataToSend 
            });

            if (response.ok) {
                toast.success('新增完成');
            } else {
                const errorData = await response.json();
                toast.error('新增失敗：' + errorData.message);
            }
        } catch (error) {
            console.error('錯誤：', error);
        }
    };

    return (
        <div className="create-container">
            <form className="create-form" onSubmit={handleSubmit}>
                <h2>使用者新增</h2>
                
                <div className="form-group">
                    <label>使用者帳號 <span className="required">*</span></label>
                    <input 
                        name="account" 
                        value={formData.account} 
                        onChange={handleChange}
                        className={errors.account ? 'error-input' : ''}
                    />
                    {errors.account && <span className="error-text">{errors.account}</span>}
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
                    <button type="submit" className="create-btn">確認儲存</button>
                    <button type="button" onClick={() => window.close()} className="cancel-btn">取消</button>
                </div>
            </form>
        </div>
    );
}