import logo from './logo.svg';
import './App.css';
import DrugSearch from './DrugSearch';
import Routes from  './Routes';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { Grid } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Grid container justifyContent="center">
        <BrowserRouter>
          <Navbar/>
          <Grid item container sx={{ maxWidth:'1980px'}}>
            <Routes/>
          </Grid>
        </BrowserRouter>
      </Grid>
    </div>
  );
}

export default App;
