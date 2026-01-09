import React from 'react';
import { Node } from '../types';

interface MapNodeProps {
  node: Node;
  color: string;
  fogLevel: number;
  isSelected: boolean;
  onClick: (node: Node) => void;
  rotation: { x: number; z: number };
}

const MapNode: React.FC<MapNodeProps> = ({ node, color, fogLevel, isSelected, onClick, rotation }) => {
  // Visual logic
  const neglect = fogLevel / 100; 
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
    >
      <div className={`flex flex-col items-center transition-all duration-300 ${isSelected ? 'scale-110 z-30' : 'hover:scale-105 z-20'}`}>
          
          {/* Shadow on Terrain */}
          <div 
             className="absolute w-3 h-1 bg-black/60 blur-[1px] rounded-full translate-y-2 transition-all duration-300"
             style={{
                 opacity: Math.max(0.2, 0.5 - neglect * 0.4)
             }}
          />

          {/* The Pin/Bead */}
          <div 
            className="relative w-4 h-4 rounded-full shadow-lg transition-all duration-500"
            style={{
                // Light Metallic/Paper contrast for dark mode
                backgroundColor: isSelected ? color : '#e4e4e7', 
                border: `1.5px solid ${isSelected ? '#fff' : '#1c1c21'}`,
                opacity: isSelected ? 1 : Math.max(0.5, 1 - neglect * 0.6),
                filter: neglect > 0.5 ? 'grayscale(0.8) brightness(0.6)' : 'none',
                transform: `rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)`,
                boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
            }}
          >
             {/* Specular highlight */}
             <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-white/80 blur-[0.5px]" />
             
             {/* Selected Ping Ring */}
             {isSelected && (
                <div className="absolute inset-0 -m-1.5 border rounded-full animate-ping opacity-50" style={{ borderColor: color }}/>
             )}
          </div>

          {/* Label */}
          <div 
            className={`mt-2 px-2 py-0.5 rounded-sm backdrop-blur-[2px] transition-all duration-300 whitespace-nowrap border border-transparent
              ${isSelected ? 'bg-paper-800 text-paper-100 shadow-xl border-paper-700' : 'text-paper-400 group-hover:text-paper-100 group-hover:bg-paper-800/80'}
            `}
            style={{
                opacity: isSelected ? 1 : Math.max(0.0, 1 - neglect * 1.5), 
                // Dynamic counter-rotation
                transform: `translateY(${isSelected ? '-4px' : '0px'}) rotateZ(${-rotation.z}deg) rotateX(${-rotation.x}deg)` 
            }}
          >
            <span className="text-[10px] font-sans font-semibold tracking-wide drop-shadow-md">
              {node.label}
            </span>
          </div>
      </div>
    </div>
  );
};

export default MapNode;
