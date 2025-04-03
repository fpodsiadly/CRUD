import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Container, Paper, Tabs, Tab, IconButton, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomePage from './pages/HomePage';
import AuthorsPage from './pages/AuthorsPage';
import StatisticsPage from './pages/StatisticsPage';
import AuthorDetailsPage from './pages/AuthorDetailsPage';

function NavTabs() {
  const location = useLocation();
  const getTabValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path === '/authors') return 1;
    if (path === '/statistics') return 2;
    return false;
  };
  return (
    <Tabs
      value={getTabValue()}
      textColor="inherit"
      indicatorColor="secondary"
      sx={{ ml: 2 }}
    >
      <Tab label="Home" component={RouterLink} to="/" />
      <Tab label="Authors" component={RouterLink} to="/authors" />
      <Tab label="Statistics" component={RouterLink} to="/statistics" />
    </Tabs>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: darkMode ? 'background.default' : 'background.paper',
            color: darkMode ? 'text.primary' : 'text.secondary',
          }}
        >
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography
                variant="h6"
                component={RouterLink}
                to="/"
                sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
              >
                CRUD App
              </Typography>
              <NavTabs />
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ ml: 2 }}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container component="main" sx={{ mt: 4, mb: 4, flex: '1 0 auto' }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/authors" element={<AuthorsPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/authors/:id" element={<AuthorDetailsPage />} />
              </Routes>
            </Paper>
          </Container>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} CRUD App
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
