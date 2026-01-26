import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/components/pages/HomePage'
import { StoragePage } from '@/components/pages/StoragePage'
import { ShortenerPage } from '@/components/pages/ShortenerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/shortener" element={<ShortenerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
