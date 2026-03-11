import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import './ProductCreate.css';
import { toast } from 'react-hot-toast';

export default function ProductCreatePage() {
    const [searchParams] = useSearchParams();
    
    const userJson = searchParams.get('userJson');
    
    //console.log(userJson);

    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        productCategory: '',
        stock: '',
        status: '1',
        imageFile: null,
        lastModifyBy: JSON.parse(userJson).account
    });

    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; //取得第一個檔案
        
        if (file) {
            // 檢查檔案類型是否為圖片
            if (!file.type.startsWith('image/')) {
                toast.error('請上傳圖片檔案');
                return;
            }

            //產生一個暫時的URL供<img>標籤使用
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            setFormData({ ...formData, imageFile: file });
        }
    };
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
        if (!formData.productId.trim()) newErrors.productId = '商品代碼為必填';
        
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
        
        formDataToSend.append('productId', formData.productId);
        formDataToSend.append('productName', formData.productName);
        formDataToSend.append('productCategory', formData.productCategory);
        formDataToSend.append('stock', formData.stock);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('imageFile', formData.imageFile);

        try {
            const response = await fetch('https://localhost:7225/api/product/productCreate', {
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
                <h2>商品新增</h2>
                
                <div className="form-group">
                    <label>商品代碼 <span className="required">*</span></label>
                    <input 
                        name="productId" 
                        value={formData.productId} 
                        onChange={handleChange}
                        className={errors.productId ? 'error-input' : ''}
                    />
                    {errors.productId && <span className="error-text">{errors.productId}</span>}
                </div>

                <div className="form-group">
                    <label>品名</label>
                    <input 
                        name="productName" 
                        value={formData.productName} 
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>商品類別</label>
                        <input 
                            name="productCategory" 
                            value={formData.productCategory} 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>庫存數量</label>
                        <input 
                            name="stock" 
                            value={formData.stock} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>商品狀態</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="1">可銷售</option>
                            <option value="2">凍結</option>
                            <option value="3">數量量不足</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>商品圖片</label>
                        <div className="file-upload-wrapper">
                            <input 
                                type="file" 
                                name="imageFile" 
                                id="imageFile"
                                accept="image/*" 
                                className="file-input-hidden" 
                                onChange={handleFileChange} 
                            />
                            <label htmlFor="imageFile" className="file-upload-btn">
                                <span className="upload-icon">📷</span>
                                {preview ? '更換圖片' : '選擇圖片'}
                            </label>
                            <span className="file-name-hint">
                                {preview ? '✅ 已選取圖片' : '❌ 未選擇任何檔案'}
                            </span>
                        </div>
                        {/* 預覽區塊：放在下拉選單下方或旁邊 */}
                        {preview && (
                            <div className="image-preview-container">
                                <p className="preview-label">圖片預覽：</p>
                                <img src={preview} alt="預覽圖" className="preview-img" />
                                <button type="button" className="remove-img-btn" onClick={() => {setPreview(null);setFormData({ ...formData, imageFile: null })}}>移除</button>
                            </div>
                        )}
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