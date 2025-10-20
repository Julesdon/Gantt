import * as React from 'react';
import CanvasLayer from '../../components/CanvasLayer';
import { BarsController } from '../../controllers/BarsController';
import { drawBars } from '../../renderers/bars.renderer';
import { useViewport } from '../../state/viewport';
const tasks = require('../../data/mockTasks.json') as any[];

const BarsView: React.FC = () => {
  const viewport = useViewport();
  const controller = React.useMemo(() => new BarsController(tasks as any, viewport.rowHeight, viewport.columnWidth), [viewport.rowHeight, viewport.columnWidth]);
  const bars = controller.computeBars();

  const render = (ctx: CanvasRenderingContext2D) => {
  drawBars({ ctx, viewport } as any, bars.map((b: any) => ({ x: b.x, y: b.y, width: b.width, height: b.height })));
  };

  return (
    <CanvasLayer
      layerId="bars"
      scrollLeft={viewport.scrollLeft}
      scrollTop={viewport.scrollTop}
      viewportWidth={viewport.viewportWidth}
      viewportHeight={viewport.viewportHeight}
      devicePixelRatio={viewport.devicePixelRatio}
      renderLayer={render}
    />
  );
};

export default BarsView;
