import React, { useState, useEffect, useCallback } from 'react';
import randomColor from 'randomcolor';
import Promise from 'bluebird';

import Map from './components/Map';

import styles from './styles.scss';

const App = () => {
  return (
    <div>
      <nav className={styles.nav}>
        <h1>Covid Contact Tracing (UMD)</h1>
      </nav>

      <div className={styles.content}>
        <Map className={styles.map} />
      </div>
    </div>
  );
};

export default App;
