import React, { useState, useEffect, useRef } from 'react';
import WorldMap from './components/WorldMap';
import Drawer from './components/Drawer';
import QuickLog from './components/QuickLog';
import InboxPage from './components/InboxPage';
import { Node, FogState, LogEntry, ViewMode } from './types';
import { INITIAL_FOG_STATE, SECTORS } from './constants';
import { LayoutGrid, Globe, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.MAP);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [fogState, setFogState] = useState<FogState>(INITIAL_FOG_STATE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  
  const logInputRef = useRef<HTMLInputElement>(null);

  // Boot sequence effect
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node);
  };

  const handleDrawerClose = () => {
    setSelectedNode(null);
  };

  const handleFogChange = (newLevel: number) => {
    if (!selectedNode) return;
    setFogState(prev => ({
      ...prev,
      [selectedNode.id]: newLevel
    }));
  };

  const handleLogSubmit = (text: string) => {
    const sector = selectedNode ? SECTORS.find(s => s.id === selectedNode.sectorId) : undefined;
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      content: text,
      context: selectedNode ? {
          nodeId: selectedNode.id,
          nodeLabel: selectedNode.label,
          sectorLabel: sector?.label
      } : undefined
    };
    
    setLogs(prev => [newLog, ...prev]);

    if (selectedNode) {
      setFogState(prev => ({
        ...prev,
        [selectedNode.id]: Math.max(0, (prev[selectedNode.id] || 0) - 15)
      }));
    }
  };

  // Dev Controls
  const adjustGlobalFog = (amount: number) => {
      setFogState(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
              next[key] = Math.max(0, Math.min(100, next[key] + amount));
          });
          return next;
      });
  };

  const randomizeFog = () => {
       setFogState(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(key => {
              next[key] = Math.floor(Math.random() * 100);
          });
          return next;
      });
  };

  if (isBooting) {
    return (
      <div className="h-screen w-screen bg-paper-950 flex items-center justify-center flex-col space-y-4">
        <div className="w-16 h-16 border-4 border-t-paper-accent border-r-transparent border-b-paper-accent border-l-transparent rounded-full animate-spin" />
        <div className="font-display tracking-widest text-paper-300 text-sm animate-pulse">BOOTING RAJ_OS...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-paper-950 text-paper-300 relative overflow-hidden font-sans">
      
      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 pointer-events-none z-50 bg-gradient-to-b from-paper-950 via-paper-950/90 to-transparent">
        <div className="flex items-center space-x-6 pointer-events-auto">
           <div className="flex items-center space-x-2">
                <div className="font-display text-2xl text-paper-100">RAJ<span className="text-paper-accent">OS</span></div>
                <div className="px-2 py-0.5 bg-paper-800 text-[10px] rounded border border-paper-700 font-mono text-paper-500">v0.4.0-paper</div>
           </div>
           
           {/* Navigation */}
           <div className="flex space-x-1 bg-paper-800/80 p-1 rounded-lg border border-paper-700 shadow-sm backdrop-blur-sm">
               <button 
                onClick={() => setViewMode(ViewMode.MAP)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center transition-all ${viewMode === ViewMode.MAP ? 'bg-paper-600 text-white shadow-sm' : 'text-paper-500 hover:text-paper-100'}`}
               >
                   <Globe size={14} className="mr-2" />
                   Map
               </button>
               <button 
                onClick={() => setViewMode(ViewMode.INBOX)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center transition-all ${viewMode === ViewMode.INBOX ? 'bg-paper-600 text-white shadow-sm' : 'text-paper-500 hover:text-paper-100'}`}
               >
                   <LayoutGrid size={14} className="mr-2" />
                   Inbox
                   {logs.length > 0 && (
                       <span className="ml-2 px-1.5 py-0.5 bg-paper-accent text-white rounded-full text-[10px] font-bold">{logs.length}</span>
                   )}
               </button>
           </div>
        </div>

        {/* Dev Tools (Right) */}
        <div className="pointer-events-auto hidden md:flex items-center space-x-2 bg-paper-800/50 p-1 rounded border border-paper-700/50">
            <span className="text-[10px] text-paper-500 font-mono uppercase px-2">Dev Fog:</span>
            <button onClick={() => adjustGlobalFog(-10)} className="w-6 h-6 flex items-center justify-center bg-paper-800 text-paper-500 hover:text-paper-100 text-xs rounded hover:bg-paper-700 border border-paper-700">-</button>
            <button onClick={() => adjustGlobalFog(10)} className="w-6 h-6 flex items-center justify-center bg-paper-800 text-paper-500 hover:text-paper-100 text-xs rounded hover:bg-paper-700 border border-paper-700">+</button>
            <button onClick={randomizeFog} className="w-6 h-6 flex items-center justify-center bg-paper-800 text-paper-500 hover:text-paper-100 rounded hover:bg-paper-700 border border-paper-700" title="Randomize">
                <ShieldAlert size={12} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute inset-0 pt-16 pb-20">
        {viewMode === ViewMode.MAP ? (
            <WorldMap 
                fogState={fogState} 
                selectedNode={selectedNode} 
                onNodeSelect={handleNodeSelect} 
            />
        ) : (
            <InboxPage 
                logs={logs} 
                onBack={() => setViewMode(ViewMode.MAP)} 
            />
        )}
      </div>

      {/* Overlays (Only on Map) */}
      {viewMode === ViewMode.MAP && (
          <Drawer 
            node={selectedNode} 
            fogLevel={selectedNode ? (fogState[selectedNode.id] ?? 0) : 0} 
            onClose={handleDrawerClose}
            onFogChange={handleFogChange}
            onLogActivity={() => {
                logInputRef.current?.focus();
            }}
          />
      )}

      {/* Quick Log Bar (Always Visible) */}
      <QuickLog 
        ref={logInputRef}
        activeNode={viewMode === ViewMode.MAP ? selectedNode : null}
        onLogSubmit={handleLogSubmit}
      />
    </div>
  );
};

export default App;
