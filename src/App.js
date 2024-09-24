import './App.css';
import {Routes, Route, BrowserRouter , Link} from 'react-router-dom';
import Home from './Home';
import About from './About';
import Filtertask from './Filtertask';
import Settings from './Settings';


function App () {

  return (
    <BrowserRouter >
      <div tabIndex={0}>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/filter">Filtertask</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
        <p className='text'style={{textAlign:"right"}}>Developed by Subria</p>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/filter" element={<Filtertask />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

    </BrowserRouter>

  );
}

export default App;
