import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<div className="container"><Login /></div>} />
          <Route path="/register" element={<div className="container"><Register /></div>} />
          <Route path="/products" element={<div className="container"><Products /></div>} />
          <Route path="/products/:id" element={<div className="container"><ProductDetails /></div>} />
          <Route path="/cart" element={<div className="container"><Cart /></div>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
