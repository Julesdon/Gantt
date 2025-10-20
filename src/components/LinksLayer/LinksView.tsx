import * as React from 'react';
import CanvasLayer from '../../components/CanvasLayer';
import { LinksController } from '../../controllers/LinksController';
import { drawLinks } from '../../renderers/links.renderer';
import { useViewport } from '../../state/viewport';

const LinksView: React.FC = () => {
  const viewport = useViewport();
  const links = [] as any[]; // placeholder; derive from tasks later
  const controller = React.useMemo(() => new LinksController(links), [links]);

  const routes = controller.computeRoutes(() => null);

  const render = (ctx: CanvasRenderingContext2D) => {
    drawLinks({ ctx, viewport } as any, routes as any);
  };

  return (
    <CanvasLayer
      layerId="links"
      scrollLeft={viewport.scrollLeft}
      scrollTop={viewport.scrollTop}
      viewportWidth={viewport.viewportWidth}
      viewportHeight={viewport.viewportHeight}
      devicePixelRatio={viewport.devicePixelRatio}
      renderLayer={render}
    />
  );
};

export default LinksView;
