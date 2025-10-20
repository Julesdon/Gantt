import * as React from "react";

interface CanvasLayerProps {
  layerId: string;
  scrollLeft: number;
  scrollTop: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  renderLayer: (ctx: CanvasRenderingContext2D) => void;
}

const CanvasLayer: React.FC<CanvasLayerProps> = ({
  layerId,
  scrollLeft,
  scrollTop,
  viewportWidth,
  viewportHeight,
  devicePixelRatio,
  renderLayer,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match viewport dimensions
    canvas.width = viewportWidth * devicePixelRatio;
    canvas.height = viewportHeight * devicePixelRatio;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;

    // Scale context for high DPI screens
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Clear and render the layer
    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
    renderLayer(ctx);
  }, [scrollLeft, scrollTop, viewportWidth, viewportHeight, devicePixelRatio, renderLayer]);

  return (
    <canvas
      id={layerId}
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none", // Ensure layers don't block interactions
      }}
    />
  );
};

export default CanvasLayer;