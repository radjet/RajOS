import React, { useRef, useState, useEffect } from 'react';
import { Node, FogState, Sector } from '../types';
import MapNode from './MapNode';
import { SECTORS, INITIAL_NODES, MAP_WIDTH, MAP_HEIGHT, CENTER_X, CENTER_Y } from '../constants';
import { Compass, RotateCcw } from 'lucide-react';

interface WorldMapProps {
  fogState: FogState;
  selectedNode: Node | null;
  onNodeSelect: (node: Node) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ fogState, selectedNode, onNodeSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport State (Camera)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.65 });
  const [rotation, setRotation] = useState({ x: 30, z: 0 }); // Tilt (X), Spin (Z)
  
  const [interactionMode, setInteractionMode] = useState<'PAN' | 'ROTATE' | null>(null);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [focusedSectorId, setFocusedSectorId] = useState<string | null>(null);

  // Initial Center
  useEffect(() => {
    if (containerRef.current) {
      const viewportW = containerRef.current.clientWidth;
      const viewportH = containerRef.current.clientHeight;
      setTransform({
        x: (viewportW - MAP_WIDTH) / 2,
        y: (viewportH - MAP_HEIGHT) / 2,
        scale: 0.65
      });
    }
  }, []);

  // Focus Mode Effect
  useEffect(() => {
    if (containerRef.current) {
        const viewportW = containerRef.current.clientWidth;
        const viewportH = containerRef.current.clientHeight;

        if (focusedSectorId) {
            const sector = SECTORS.find(s => s.id === focusedSectorId);
            if (sector) {
                // Zoom in on sector and flatten view slightly for reading
                setTransform({
                    x: (viewportW / 2) - (sector.x * 1.4),
                    y: (viewportH / 2) - (sector.y * 1.4),
                    scale: 1.4
                });
                setRotation({ x: 10, z: 0 }); // Auto-flatten on focus
            }
        }
    }
  }, [focusedSectorId]);

  const toggleFocus = (sectorId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (focusedSectorId === sectorId) {
          setFocusedSectorId(null);
      } else {
          setFocusedSectorId(sectorId);
      }
  };

  const resetView = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFocusedSectorId(null);
      if (containerRef.current) {
        const viewportW = containerRef.current.clientWidth;
        const viewportH = containerRef.current.clientHeight;
        setTransform({
            x: (viewportW - MAP_WIDTH) / 2,
            y: (viewportH - MAP_HEIGHT) / 2,
            scale: 0.65
        });
        setRotation({ x: 30, z: 0 });
      }
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (focusedSectorId) return; 

    // Middle Mouse (1) or Left Mouse (0)
    if (e.button === 1) {
        setInteractionMode('ROTATE');
        e.preventDefault(); // Prevent scroll cursor
    } else if (e.button === 0) {
        setInteractionMode('PAN');
    }
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactionMode) return;
    
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    
    if (interactionMode === 'PAN') {
        setTransform(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
    } else if (interactionMode === 'ROTATE') {
        setRotation(prev => {
            // Sensitivity
            const nextX = prev.x - dy * 0.2;
            const nextZ = prev.z + dx * 0.2;
            
            // Clamping
            return {
                x: Math.max(10, Math.min(55, nextX)),
                z: Math.max(-20, Math.min(20, nextZ))
            };
        });
    }
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setInteractionMode(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (focusedSectorId) return;
    const MIN_SCALE = 0.4;
    const MAX_SCALE = 1.8;
    const scaleFactor = 0.001;
    let newScale = transform.scale - e.deltaY * scaleFactor;
    newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full overflow-hidden bg-paper-950 relative cursor-default select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ perspective: '1200px' }}
    >
        {/* Reset Button */}
        <div className="absolute top-20 right-6 z-50 flex flex-col items-end space-y-2 pointer-events-none">
             <div className="pointer-events-auto">
                 <button 
                    onClick={resetView}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-paper-800 border border-paper-700 rounded-lg text-paper-500 hover:text-paper-100 hover:border-paper-600 shadow-lg transition-all text-xs font-mono uppercase"
                 >
                     <RotateCcw size={12} />
                     <span>Reset View</span>
                 </button>
             </div>
             <div className="text-[10px] text-paper-600 font-mono opacity-50 text-right">
                 MMB: Rotate Camera
             </div>
        </div>

        {/* Parallax Floor */}
        <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
                transform: `translate(${transform.x * 0.1}px, ${transform.y * 0.1}px) scale(${transform.scale})`,
                transition: interactionMode ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                backgroundImage: 'radial-gradient(circle at 1px 1px, #2d2d35 1px, transparent 0)',
                backgroundSize: '80px 80px',
                width: `${MAP_WIDTH}px`,
                height: `${MAP_HEIGHT}px`,
                transformOrigin: '0 0'
            }}
        />

        {/* MAIN TERRAIN CANVAS */}
        <div 
            className="isometric-container origin-center will-change-transform"
            style={{
                width: `${MAP_WIDTH}px`,
                height: `${MAP_HEIGHT}px`,
                transform: `
                    translate(${transform.x}px, ${transform.y}px) 
                    scale(${transform.scale}) 
                    rotateX(${rotation.x}deg)
                    rotateZ(${rotation.z}deg)
                `,
                transition: interactionMode ? 'none' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                backgroundColor: '#121216', // Dark Charcoal Canvas
                boxShadow: '0 0 150px rgba(0,0,0,0.5)'
            }}
        >
            {/* 1. Global Terrain Texture & Topo Lines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                     <path d="M0 20 Q 30 5, 50 30 T 100 20" fill="none" stroke="#52525b" strokeWidth="0.2" />
                     <path d="M0 50 Q 50 20, 100 50" fill="none" stroke="#52525b" strokeWidth="0.2" />
                     <path d="M0 80 Q 20 90, 50 70 T 100 80" fill="none" stroke="#52525b" strokeWidth="0.2" />
                </svg>
                <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30" />
            </div>

            {/* 2. Center Landmark: ME */}
            <div 
                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
                style={{ 
                    left: CENTER_X, 
                    top: CENTER_Y,
                    opacity: focusedSectorId ? 0.3 : 1, 
                    transition: 'opacity 0.5s',
                }}
            >
                <div className="absolute w-[600px] h-[600px] bg-paper-accent rounded-full blur-[150px] opacity-10 mix-blend-screen" />
                <div className="absolute w-[300px] h-[300px] border border-paper-700 rounded-full opacity-40" />
                
                <div className="text-paper-accent opacity-80 mb-2 transform" style={{ transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` }}>
                    <Compass size={48} strokeWidth={1} />
                </div>
                <div className="text-xs font-display tracking-[0.2em] text-paper-500 uppercase transform" style={{ transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` }}>
                    Central
                </div>
            </div>

            {/* 3. Embedded Region "Districts" */}
            {SECTORS.map(sector => {
                const isFocused = focusedSectorId === sector.id;
                const isDimmed = focusedSectorId && !isFocused;

                return (
                    <div 
                        key={sector.id} 
                        className="absolute transition-all duration-700 ease-out" 
                        style={{ 
                            left: sector.x, 
                            top: sector.y,
                            opacity: isDimmed ? 0.2 : 1,
                            filter: isDimmed ? 'grayscale(0.8)' : 'none',
                        }}
                    >
                        {/* Soft Tint Blob - Low opacity for dark mode */}
                        <div 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-10 pointer-events-none transition-all duration-700 mix-blend-screen"
                            style={{
                                backgroundColor: sector.color,
                                width: isFocused ? '700px' : (sector.id === 'humans' ? '600px' : '400px'), 
                                height: isFocused ? '700px' : (sector.id === 'humans' ? '600px' : '400px'),
                            }}
                        />
                        
                        {/* Region Label - Cormorant Display Font */}
                        <div 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 mt-24 text-center cursor-pointer group z-10"
                            onClick={(e) => toggleFocus(sector.id, e)}
                            style={{ 
                                transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`
                            }}
                        >
                            <span 
                                className="block text-3xl md:text-5xl font-display font-medium text-paper-300 transition-all duration-300 group-hover:text-paper-100 group-hover:scale-105 tracking-wide"
                                style={{ 
                                    textShadow: '0 4px 12px rgba(0,0,0,0.8)'
                                }}
                            >
                                {sector.label}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* 4. Fog Layer (Smoky Dark) */}
            {INITIAL_NODES.map(node => {
                const fog = fogState[node.id] || 0;
                if (fog < 40) return null;
                const isDimmed = focusedSectorId && focusedSectorId !== node.sectorId;
                return (
                    <div 
                        key={`fog-${node.id}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
                        style={{
                            left: node.x,
                            top: node.y,
                            width: '160px',
                            height: '160px',
                            backgroundColor: '#050505', // Deep Shadow
                            opacity: isDimmed ? (fog/100)*0.3 : (fog / 100) * 0.7,
                            mixBlendMode: 'multiply'
                        }}
                    />
                );
            })}

            {/* 5. Nodes (Pins) */}
            {INITIAL_NODES.map(node => {
                const isDimmed = focusedSectorId && focusedSectorId !== node.sectorId;
                return (
                    <div 
                        key={node.id} 
                        className="transition-opacity duration-700"
                        style={{ opacity: isDimmed ? 0.3 : 1 }}
                    >
                        <MapNode
                            node={node}
                            color={SECTORS.find(s => s.id === node.sectorId)?.color || '#000'}
                            fogLevel={fogState[node.id] || 0}
                            isSelected={selectedNode?.id === node.id}
                            onClick={onNodeSelect}
                            rotation={rotation}
                        />
                    </div>
                );
            })}

        </div>
        
        {/* Helper Instructions */}
        {!focusedSectorId && (
             <div className="absolute bottom-6 left-6 pointer-events-none text-paper-500 text-xs font-mono opacity-50">
                 SCROLL TO ZOOM • DRAG TO PAN • MMB TO ROTATE
             </div>
        )}
        
        {/* Back Button */}
        {focusedSectorId && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50">
                <button 
                    onClick={() => setFocusedSectorId(null)}
                    className="px-6 py-2 bg-paper-800/80 backdrop-blur border border-paper-700 text-paper-300 rounded-full text-xs font-bold tracking-widest hover:bg-paper-700 transition-colors shadow-lg"
                >
                    EXIT FOCUS MODE
                </button>
            </div>
        )}
    </div>
  );
};

export default WorldMap;
