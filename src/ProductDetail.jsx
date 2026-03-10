import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ProductDetail.css';

export default function ProductDetailPage() {
    const { productId } = useParams();
    //console.log(productId);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function queryDetail() {
            const params = new URLSearchParams({
                productId: productId
            });

            try {
                const response = await fetch(`https://localhost:7225/api/product/queryDetail?${params.toString()}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('完成：', data);

                setProduct(data.productsJson);
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

        queryDetail();
    },[]);

    if (loading) {return <div>資料載入中...</div>;}
    if (error) {return <div>發生錯誤：{error}</div>;}

    return (
        <div className="detail-page">
            <div className="detail-card">
                <h2 className="detail-title">商品詳細</h2>
                <div className="detail-content">
                    <div className="detail-info-section">
                        <div className="info-group">
                            <div className="info-item">
                                <label>商品代碼</label>
                                <span>{product.productId}</span>
                            </div>
                            <div className="info-item full-width">
                                <label>品名</label>
                                <span className="product-name-text">{product.productName}</span>
                            </div>
                            <div className="info-item">
                                <label>商品類別</label>
                                <span>{product.productCategory}</span>
                            </div>
                            <div className="info-item">
                                <label>商品狀態</label>
                                <span>
                                    {product.status}
                                </span>
                            </div>
                            <div className="info-item">
                                <label>商品圖片</label>
                                <img 
                                    src={`data:image/png;base64,${product.imageFile}`} 
                                    className="product-image"
                                />
                            </div>
                            <div className="info-item">
                                <label>新增時間</label>
                                <span>{product.createTime}</span>
                            </div>
                            <div className="info-item">
                                <label>最後修改人員</label>
                                <span>{product.lastModifiedBy}</span>
                            </div>
                            <div className="info-item">
                                <label>最後修改時間</label>
                                <span>{product.lastModifiedTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}