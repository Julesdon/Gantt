import * as React from 'react';
import GridView from '../components/GridView/GridView';
import BarsView from '../components/BarsLayer';
import LinksView from '../components/LinksLayer';

const GanttPage: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <GridView />
      <BarsView />
      <LinksView />
    </div>
  );
};

export default GanttPage;
