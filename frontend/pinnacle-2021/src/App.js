import React, {useState, useEffect, useCallback} from 'react';
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
import AppContext from "./context/AppContext";

function App() {
  const [paths, setPaths] = useState([])
   const [timer, setTimer] = useState(false)

  const [time, setTime] = useState(-1)
  const [timeScalar, setTimeScalar] = useState(1)
  const [startTime, setStartTime] = useState(-1)
  const [endTime, setEndTime] = useState(-1)

  const [map, setMap] = useState(null)

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
