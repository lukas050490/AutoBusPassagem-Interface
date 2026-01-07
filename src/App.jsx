import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import DestinyAndDate from './pages/destinyAndDate';
import HoursAvailable from './pages/hoursAvailable';
import Identification from './pages/identification';
import SitSelect from './pages/sitSelect';
import SummaryBuy from './pages/summaryBuy';
import Payment from './pages/payment';
import Confirmation from './pages/confirmation';
import Companies from './pages/companies';
import ServiceType from './pages/serviceType';

function App() {


  return (
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
    </Routes>
  )
}

export default App
