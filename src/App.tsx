import * as React from 'react';
import GridView from './components/GridView/GridView';

const TypedGridView = GridView as React.ComponentType<{ totalRows: number; rowHeight: number }>;

const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <TypedGridView totalRows={100} rowHeight={20} />
    </div>
  );
};

export default App;
