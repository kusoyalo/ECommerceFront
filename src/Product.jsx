import { useState, useEffect } from 'react';
import './Product.css';

export default function ProductTable({ queryType, productId, productName, lastModifiedTimeStart, lastModifiedTimeEnd,changeFlag }) {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(queryType === 'query' && productId == null){
            setLoading(false);
            setProducts([]);
            return;
        }

        async function queryProduct() {
            let URL = '';
            let requestObject = {};

            if (queryType === 'default') {
                URL = 'https://localhost:7225/api/product/queryDefault';
                requestObject = {
                    method: 'GET',
                };
            }
            else if (queryType === 'query') {
                const params = new URLSearchParams({
                    productId: productId || '',
                    productName: productName || '',
                    lastModifiedTimeStart: lastModifiedTimeStart || '',
                    lastModifiedTimeEnd: lastModifiedTimeEnd || ''
                });
                
                URL = `https://localhost:7225/api/product/queryProduct?${params.toString()}`;
                requestObject = {
                    method: 'GET',
                };
            }

            try {
                const response = await fetch(URL, requestObject);

                if (response.ok) {
                    const data = await response.json();
                    console.log('完成：', data);

                    setProducts(data.productsJson);
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

        queryProduct();
    },[queryType, productId, productName, lastModifiedTimeStart, lastModifiedTimeEnd,changeFlag]);

    if (loading) {return <div>資料載入中...</div>;}
    if (error) {return <div>發生錯誤：{error}</div>;}

    return (
        <div style={{ padding: '20px' }}>
            <h2>商品列表{queryType === 'default' ? '，只列出以商品代碼排序最大的前3筆' : ''}</h2>
            <table className="table-container">
                <thead>
                    <tr className="table-row">
                        <th className="table-header">商品代碼</th>
                        <th className="table-header">品名</th>
                        <th className="table-header">類別</th>
                        <th className="table-header">商品狀態</th>
                        <th className="table-header">最後修改時間</th>
                    </tr>
                </thead>
                <tbody>
                {products.length > 0 ? (
                    products.map((product) => (
                    <tr key={product.productId} className="table-row">
                        <td>{product.productId}</td>
                        <td>
                            {queryType === 'query' ? (
                                <a 
                                    href={`/productDetail/${product.productId}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                >
                                    {product.productName}
                                </a>
                            ) : (
                                product.productName
                            )}
                        </td>
                        <td>{product.productCategory}</td>
                        <td>{product.status}</td>
                        <td>{product.lastModifiedTime}</td>
                    </tr>
                    ))
                ) : (
                    <tr><td colSpan="5">目前沒有資料</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );
}