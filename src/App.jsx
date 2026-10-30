import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import AppRoutes from './AppRoutes.jsx'
import { useShop } from './context/ShopContext.jsx'

function Toast() {
  const { toast } = useShop()

  if (!toast) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[100] max-w-[calc(100%-40px)] px-5 py-4 text-sm text-white shadow-xl ${
        toast.type === 'error' ? 'bg-red-700' : 'bg-[#374432]'
      }`}
    >
      {toast.message}
    </div>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <AppRoutes />
      </div>

      <Footer />

      <Toast />
    </div>
  )
}