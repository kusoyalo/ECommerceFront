import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom' //引入路由元件
import LoginPage from './Login.jsx'
import HomePage from './Home.jsx'
import ErrorPage from './Error.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 設定網址與元件的對應關係 */}
        {/* 預設路徑導向登入頁 */}
        <Route path="/" element={<LoginPage/>} />
        {/* 定義各個頁面的路由 */}
        <Route path="/home" element={<HomePage/>} />
        <Route path="/error" element={<ErrorPage/>} />
        {/* 404 頁面處理 */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
