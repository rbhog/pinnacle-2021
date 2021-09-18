import React from 'react';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import './components/Map/styles.css';

import Map from './components/Map';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Map />
            </Route>
          </Switch>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
