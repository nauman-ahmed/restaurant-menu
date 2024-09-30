import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import { Toaster } from 'react-hot-toast';
import Student from './pages/student';
import Admin from './pages/admin';
import 'animate.css'


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student" element={<Student />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Toaster />
    </Router>
  );
}


export default App;
