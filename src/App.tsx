import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthorsPage from './pages/AuthorsPage';
import StatisticsPage from './pages/StatisticsPage';
import AuthorDetailsPage from './pages/AuthorDetailsPage';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="bg-primary text-white py-3">
          <nav className="container d-flex justify-content-between">
            <h1 className="h3">
              <Link className="text-white text-decoration-none" to="/">CRUD App</Link>
            </h1>
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/authors">Authors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/statistics">Statistics</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="container my-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authors" element={<AuthorsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/authors/:id" element={<AuthorDetailsPage />} />
          </Routes>
        </main>
        <footer className="bg-light text-center py-3">
          <p className="mb-0">© {new Date().getFullYear()} CRUD App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
