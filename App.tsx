import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { GlobleInfoProvider } from './src/context/GlobleInfoContext';

const App = () => {
  return  (
    <GlobleInfoProvider>
      <AppNavigator />
    </GlobleInfoProvider>
  );

};

export default App;
