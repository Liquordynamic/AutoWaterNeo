import React, { useRef, useEffect } from 'react';

const CanvasOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const resizeCanvas = () => {
                const mapContainer = document.getElementById('map-container');
                if (mapContainer) {
                    const width = mapContainer.offsetWidth;
                    const height = mapContainer.offsetHeight;
                    canvasRef.current!.width = width;
                    canvasRef.current!.height = height;
                }
            };
            window.addEventListener('resize', resizeCanvas);
            resizeCanvas();
            return () => {
                window.removeEventListener('resize', resizeCanvas);
            };
        }
        return undefined;
    }, []);

    return (
        <div id='tube'>
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 -z-50"
                id="deck"
            ></canvas>
        </div>
    );
};

export default CanvasOverlay;