import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/home';
import DestinyAndDate from './pages/destinyAndDate';
import HoursAvailable from './pages/hoursAvailable';
import Identification from './pages/identification';
import SitSelect from './pages/sitSelect';
import SummaryBuy from './pages/summaryBuy';
import Payment from './pages/payment';
import Confirmation from './pages/confirmation';
import Companies from './pages/companies/index.jsx';
import ServiceType from './pages/serviceType';
import AdminLogin from './pages/pagesAdmins/AdminLogin.jsx';
import SuperAdminDashboard from './pages/pagesAdmins/SuperAdminDashboard.jsx';
import AdminDashboard from './pages/pagesAdmins/AdminDashboard.jsx';
import CompanyManagement from './pages/pagesAdmins/CompanyManagement.jsx';
import ProtectedRoute from './components/protectedRoute/index.jsx';
import AdminsManagement from './pages/pagesAdmins/AdminsManagement.jsx';
import TripsManagement from './pages/pagesAdmins/TripsManagement.jsx';



function App() {


  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/empresas' element={<Companies />} />
          <Route path='/destino-e-data' element={<DestinyAndDate />} />
          <Route path='/horario-disponivel' element={<HoursAvailable />} />
          <Route path='/identificacao' element={<Identification />} />
          <Route path='/assentos-disponiveis' element={<SitSelect />} />
          <Route path='/tipo-de-servico' element={<ServiceType />} />
          <Route path='/resumo-da-compra' element={<SummaryBuy />} />
          <Route path='/pagamento' element={<Payment />} />
          <Route path='/confirmacao' element={<Confirmation />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/companies"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <CompanyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/admins"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <AdminsManagement />
              </ProtectedRoute>
            }
          />
          {/* Rotas do Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <TripsManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
