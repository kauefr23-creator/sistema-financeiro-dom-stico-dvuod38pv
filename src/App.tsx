import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import Transactions from './pages/Transactions'
import Incomes from './pages/Incomes'
import CategoriesAccounts from './pages/CategoriesAccounts'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'
import MasterDashboard from './pages/MasterDashboard'
import UsersInvites from './pages/UsersInvites'
import ActivityLogs from './pages/ActivityLogs'
import { FinanceProvider } from './context/FinanceContext'
import { ProtectedRoute } from './components/ProtectedRoute'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <TooltipProvider>
      <FinanceProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Index />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/incomes" element={<Incomes />} />
            <Route
              path="/categories-accounts"
              element={<CategoriesAccounts />}
            />
            <Route path="/users" element={<UsersInvites />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route
              path="/master"
              element={
                <ProtectedRoute requireMaster>
                  <MasterDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </FinanceProvider>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
