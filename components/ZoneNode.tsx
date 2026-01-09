import React from 'react';
import * as Icons from 'lucide-react';

// Local interface definition since it's not exported from types
interface Zone {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  icon: string;
}

interface ZoneNodeProps {
  zone: Zone;
  fogLevel: number;
  isSelected: boolean;
  onClick: (zone: Zone) => void;
}

const ZoneNode: React.FC<ZoneNodeProps> = ({ zone, fogLevel, isSelected, onClick }) => {
  // Dynamic icon loading
  const IconComponent = (Icons as any)[zone.icon] || Icons.Circle;
  
  // Calculate visual styles based on fog
  const visibility = Math.max(0, 100 - fogLevel) / 100;
  const blurAmount = (fogLevel / 100) * 4;
  
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-500 ease-out`}
      style={{
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        zIndex: isSelected ? 40 : 10,
      }}
      onClick={() => onClick(zone)}
    >
      {/* Glow Effect */}
      <div 
        className={`absolute inset-0 rounded-full bg-current opacity-20 blur-xl transition-all duration-700 ${isSelected ? 'scale-150 opacity-40' : 'scale-0 group-hover:scale-100'}`}
        style={{ color: zone.color }}
      />

      {/* Connection Line Stub (Visual anchor) */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 border-t border-slate-700 opacity-20" />

      {/* Main Node */}
      <div 
        className={`relative flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 bg-raj-800 transition-all duration-300
          ${isSelected ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-slate-700 hover:border-raj-accent shadow-lg'}
        `}
        style={{ 
          borderColor: isSelected ? '#fff' : zone.color,
          filter: `blur(${blurAmount}px)`,
          opacity: 0.4 + (visibility * 0.6)
        }}
      >
        <IconComponent 
          size={24} 
          className={`transition-colors duration-300 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}
          style={{ color: isSelected ? '#fff' : zone.color }}
        />
        
        {/* Fog Overlay */}
        {fogLevel > 50 && (
          <div className="absolute inset-0 bg-raj-900 rounded-full opacity-60 flex items-center justify-center">
            <Icons.CloudFog size={20} className="text-slate-600" />
          </div>
        )}
      </div>

      {/* Label */}
      <div 
        className={`mt-3 text-center transition-all duration-300 px-2 py-1 rounded bg-raj-900/80 backdrop-blur-sm border border-slate-800
        ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-60 group-hover:opacity-100 translate-y-1'}
        `}
      >
        <span 
          className="text-xs font-mono tracking-wider uppercase whitespace-nowrap"
          style={{ color: isSelected ? '#fff' : zone.color }}
        >
          {zone.label}
        </span>
        <div className="h-0.5 w-full bg-slate-800 mt-1 overflow-hidden rounded-full">
            <div 
                className="h-full bg-slate-500 transition-all duration-1000" 
                style={{ width: `${100 - fogLevel}%`, backgroundColor: zone.color }}
            />
        </div>
      </div>
    </div>
  );
};

export default ZoneNode;