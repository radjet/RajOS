import { Sector, Node } from './types';

// Canvas Dimensions - Spacious
export const MAP_WIDTH = 2800;
export const MAP_HEIGHT = 1800;

// Center Point
export const CENTER_X = MAP_WIDTH / 2;
export const CENTER_Y = MAP_HEIGHT / 2;

// Layout weights (approximate radii from center)
// Inner Ring: Vitals, Home Ops
// Mid Ring: Commitments, Money, Headspace
// Outer Ring: Humans (Massive), Client Bay, Build Room, Academy

export const SECTORS: Sector[] = [
  // THE WESTERN HEMISPHERE (Personal)
  { id: 'humans', label: 'Humans', color: '#f472b6', x: CENTER_X - 700, y: CENTER_Y - 100 }, // Huge Kingdom West
  { id: 'headspace', label: 'Headspace', color: '#a855f7', x: CENTER_X - 450, y: CENTER_Y - 500 }, // North West
  { id: 'home_ops', label: 'Home Ops', color: '#eab308', x: CENTER_X - 350, y: CENTER_Y + 300 }, // South West

  // THE SOUTHERN POLE (Foundation)
  { id: 'vitals', label: 'Vitals', color: '#ef4444', x: CENTER_X, y: CENTER_Y + 500 }, // Deep South

  // THE EASTERN HEMISPHERE (Work/Output)
  { id: 'commitments', label: 'Commitments', color: '#f97316', x: CENTER_X + 400, y: CENTER_Y - 100 }, // Mid East
  { id: 'client_bay', label: 'Client Bay', color: '#64748b', x: CENTER_X + 800, y: CENTER_Y + 200 }, // Far South East
  { id: 'build_room', label: 'Build Room', color: '#00f0ff', x: CENTER_X + 750, y: CENTER_Y - 400 }, // North East

  // THE NORTHERN POLE (Growth/Future)
  { id: 'academy', label: 'Academy', color: '#3b82f6', x: CENTER_X + 200, y: CENTER_Y - 600 }, // Far North
  { id: 'money', label: 'Money', color: '#22c55e', x: CENTER_X + 500, y: CENTER_Y + 450 }, // South East Pocket
  { id: 'pending', label: 'Pending', color: '#94a3b8', x: CENTER_X, y: CENTER_Y + 750 }, // The Void South
];

const generateNodes = (): Node[] => {
  const nodes: Node[] = [];
  
  // Specific Human Sub-Clusters
  const humanClusters = [
      { name: 'Family', labels: ['Mom', 'Dad', 'Brother'], offsetX: -150, offsetY: -50 },
      { name: 'Partner', labels: ['Girlfriend'], offsetX: 50, offsetY: -120 },
      { name: 'Mentor', labels: ['Mentor'], offsetX: 120, offsetY: 0 },
      { name: 'Friends', labels: ['Friends', 'Bestie'], offsetX: -50, offsetY: 120 },
      { name: 'Founders', labels: ['Cofounder A', 'Cofounder B'], offsetX: 50, offsetY: 80 },
  ];

  // Specific configurations for other sectors
  const specificNodes: Record<string, string[]> = {
    vitals: ['Sleep', 'Exercise', 'Diet', 'Health'],
    academy: ['Courses', 'Reading List', 'Skills', 'Research'],
    commitments: ['Main Arc', 'Side Quest A', 'Side Quest B', 'Maintenance'],
    pending: ['Inbox', 'To Sort', 'Waiting'],
    headspace: ['Journal', 'Therapy', 'Meditation', 'Reflection'],
    money: ['Burn', 'Income', 'Savings', 'Taxes'],
    home_ops: ['Groceries', 'Cleaning', 'Repairs', 'Logistics'],
    client_bay: ['Client A', 'Client B', 'Leads', 'Pipeline'],
    build_room: ['RajOS', 'Website', 'Experiments', 'Shipping']
  };

  SECTORS.forEach(sector => {
    if (sector.id === 'humans') {
        // Special logic for Humans sub-clusters
        humanClusters.forEach(cluster => {
            cluster.labels.forEach((label, i) => {
                // Micro-jitter within cluster
                const jx = (Math.random() - 0.5) * 60;
                const jy = (Math.random() - 0.5) * 60;
                
                nodes.push({
                    id: `humans-${cluster.name}-${i}`,
                    sectorId: 'humans',
                    label: label,
                    x: sector.x + cluster.offsetX + jx,
                    y: sector.y + cluster.offsetY + jy,
                    fogLevel: 20 + Math.random() * 30
                });
            });
        });
    } else {
        // Standard distribution for others
        const labels = specificNodes[sector.id] || ['Node 1', 'Node 2', 'Node 3'];
        
        // Weight influences spread area
        let spreadRadius = 120;
        if (['commitments', 'client_bay', 'build_room'].includes(sector.id)) spreadRadius = 160;
        if (['vitals', 'academy'].includes(sector.id)) spreadRadius = 100;

        labels.forEach((label, i) => {
            const angle = (i / labels.length) * 2 * Math.PI + (Math.random() * 0.5); // somewhat orderly but organic
            const dist = (spreadRadius * 0.4) + (Math.random() * spreadRadius * 0.6);
            
            nodes.push({
                id: `${sector.id}-${i}`,
                sectorId: sector.id,
                label,
                x: sector.x + Math.cos(angle) * dist,
                y: sector.y + Math.sin(angle) * dist,
                fogLevel: 20 + Math.random() * 40
            });
        });
    }
  });

  return nodes;
};

export const INITIAL_NODES = generateNodes();

export const INITIAL_FOG_STATE: Record<string, number> = INITIAL_NODES.reduce((acc, node) => {
  acc[node.id] = 20 + Math.floor(Math.random() * 40); 
  return acc;
}, {} as Record<string, number>);
