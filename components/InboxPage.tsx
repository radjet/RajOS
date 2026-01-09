import React from 'react';
import { LogEntry } from '../types';
import { ArrowLeft, Clock, MapPin, Database } from 'lucide-react';

interface InboxPageProps {
  logs: LogEntry[];
  onBack: () => void;
}

const InboxPage: React.FC<InboxPageProps> = ({ logs, onBack }) => {
  return (
    <div className="h-full w-full bg-paper-900 overflow-y-auto p-6 md:p-12 relative z-10">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
        <div>
            <h1 className="text-4xl font-display font-bold text-paper-100 mb-2 flex items-center">
                <Database className="mr-3 text-paper-accent" />
                SYSTEM LOGS
            </h1>
            <p className="text-paper-500 font-mono text-sm">/var/log/raj_os/inbox</p>
        </div>
        <button 
            onClick={onBack}
            className="px-4 py-2 border border-paper-700 rounded hover:bg-paper-800 text-paper-500 hover:text-paper-100 transition-colors flex items-center shadow-sm bg-paper-950"
        >
            <ArrowLeft size={16} className="mr-2" />
            Return to Map
        </button>
      </div>

      {/* Log Table */}
      <div className="max-w-4xl mx-auto">
        {logs.length === 0 ? (
            <div className="text-center py-24 border-2 border-dashed border-paper-700 rounded-xl">
                <div className="text-paper-600 mb-2 font-display text-xl">No entries found</div>
                <div className="text-xs text-paper-500 font-mono">Use the command line to capture data</div>
            </div>
        ) : (
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="bg-paper-800/80 border border-paper-700/50 p-4 rounded-lg hover:border-paper-accent/50 transition-colors group shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                             <div className="flex items-center space-x-3 text-xs font-mono text-paper-500">
                                <span className="flex items-center text-paper-accent/80 font-bold">
                                    <Clock size={12} className="mr-1" />
                                    {log.timestamp.toLocaleTimeString()}
                                </span>
                                <span>{log.timestamp.toLocaleDateString()}</span>
                             </div>
                             {log.context?.sectorLabel && (
                                 <div className="flex items-center text-xs px-2 py-1 rounded bg-paper-900 text-paper-500 border border-paper-700">
                                     <MapPin size={10} className="mr-1" />
                                     {log.context.sectorLabel} 
                                     {log.context.nodeLabel && ` :: ${log.context.nodeLabel}`}
                                 </div>
                             )}
                        </div>
                        <div className="text-paper-300 leading-relaxed font-medium">
                            {log.content}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
