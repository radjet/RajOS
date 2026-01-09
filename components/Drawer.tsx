import React from 'react';
import { Node } from '../types';
import { X, CloudFog, Target, FileText } from 'lucide-react';
import { SECTORS } from '../constants';

interface DrawerProps {
  node: Node | null;
  fogLevel: number;
  onClose: () => void;
  onFogChange: (newLevel: number) => void;
  onLogActivity: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ node, fogLevel, onClose, onFogChange, onLogActivity }) => {
  const sector = node ? SECTORS.find(s => s.id === node.sectorId) : null;
  const isFoggy = fogLevel > 60;

  return (
    <div 
      className={`absolute top-4 bottom-24 right-4 w-80 md:w-96 bg-paper-800/95 backdrop-blur-md border border-paper-700 shadow-xl rounded-xl transform transition-transform duration-300 ease-out flex flex-col z-40
        ${node ? 'translate-x-0' : 'translate-x-[120%]'}
      `}
    >
        {node && (
            <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-paper-700/50">
                <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-paper-500 mb-1 uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector?.color }} />
                        <span>{sector?.label}</span>
                    </div>
                    <h2 className="text-3xl font-display font-medium tracking-wide text-paper-100 mt-1">
                        {isFoggy ? 'Unknown Node' : node.label}
                    </h2>
                </div>
                <button 
                onClick={onClose}
                className="p-2 hover:bg-paper-700 rounded-full transition-colors text-paper-500 hover:text-paper-100"
                >
                <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Fog Control */}
                <div className="space-y-3 bg-paper-900/50 p-4 rounded-xl border border-paper-700/50">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center text-paper-accent font-semibold">
                        <CloudFog size={14} className="mr-2" />
                        Visibility / Dust
                        </span>
                        <span className="font-mono text-paper-500 text-xs">{fogLevel}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={fogLevel} 
                        onChange={(e) => onFogChange(parseInt(e.target.value))}
                        className="w-full h-1 bg-paper-700 rounded-lg appearance-none cursor-pointer accent-paper-accent"
                    />
                </div>

                {isFoggy ? (
                    <div className="text-center py-10 text-paper-500 italic font-serif">
                        This area is gathering dust. <br/> Log activity to clear it.
                    </div>
                ) : (
                    <>
                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={onLogActivity}
                            className="flex flex-col items-center justify-center p-4 bg-paper-900/50 hover:bg-paper-accent/10 border border-paper-700 hover:border-paper-accent rounded-xl transition-all duration-300 group shadow-sm"
                        >
                            <Target size={20} className="mb-2 text-paper-accent" />
                            <span className="text-xs font-bold uppercase text-paper-300 group-hover:text-paper-accent">Log Activity</span>
                        </button>
                         <button className="flex flex-col items-center justify-center p-4 bg-paper-900/50 hover:bg-paper-700/30 border border-paper-700 rounded-xl transition-all duration-300 shadow-sm">
                            <FileText size={20} className="mb-2 text-paper-500" />
                            <span className="text-xs font-bold uppercase text-paper-500">Notes</span>
                        </button>
                    </div>

                    {/* Stub Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase text-paper-500 tracking-wider">Status</h3>
                        <div className="flex items-center justify-between p-3 bg-paper-900/50 border border-paper-700/50 rounded-lg">
                            <span className="text-sm text-paper-500">Sync</span>
                            <span className="text-xs font-mono text-emerald-600">Active</span>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-paper-900/50 border border-paper-700/50 rounded-lg">
                            <span className="text-sm text-paper-500">Last Touch</span>
                            <span className="text-xs font-mono text-paper-600">2d ago</span>
                        </div>
                    </div>
                    </>
                )}
            </div>
            </>
        )}
    </div>
  );
};

export default Drawer;
