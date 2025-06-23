import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

export interface Skill {
  id: string;
  title: string;
  description: string;
  image: string;
  prereqIds: string[];
}

interface Props {
  skills: Skill[];
  completed: string[];
  highlighted: string[];
  onToggle: (id: string, completed: boolean) => Promise<void>;
}

/** Compute hierarchical levels for skills */
const computeLevels = (skills: Skill[]): Map<string, number> => {
  const byId = new Map(skills.map((s) => [s.id, s]));
  const levels = new Map<string, number>();
  const calc = (id: string): number => {
    if (levels.has(id)) return levels.get(id)!;
    const skill = byId.get(id)!;
    if (skill.prereqIds.length === 0) {
      levels.set(id, 0);
      return 0;
    }
    const lvl = Math.max(...skill.prereqIds.map((p) => calc(p))) + 1;
    levels.set(id, lvl);
    return lvl;
  };
  skills.forEach((s) => calc(s.id));
  return levels;
};

/** Build React Flow nodes and edges */
const buildGraph = (
  skills: Skill[],
  completed: string[],
  highlighted: string[]
): { nodes: Node[]; edges: Edge[] } => {
  const levels = computeLevels(skills);
  const levelMap = new Map<number, Skill[]>();
  skills.forEach((s) => {
    const lvl = levels.get(s.id)!;
    if (!levelMap.has(lvl)) levelMap.set(lvl, []);
    levelMap.get(lvl)!.push(s);
  });
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  levelMap.forEach((levelSkills, lvl) => {
    levelSkills.forEach((s, idx) => {
      nodes.push({
        id: s.id,
        data: { label: <div title={s.description}>{s.title}</div> },
        position: { x: lvl * 250, y: idx * 120 },
        style: {
          border: highlighted.includes(s.id)
            ? '2px solid orange'
            : completed.includes(s.id)
            ? '2px solid green'
            : '1px solid gray',
          padding: 8,
          borderRadius: 4,
          background: '#fff',
        },
      });
      s.prereqIds.forEach((p) => {
        edges.push({ id: `${p}-${s.id}`, source: p, target: s.id });
      });
    });
  });
  return { nodes, edges };
};

const SkillTreeView = ({ skills, completed, highlighted, onToggle }: Props) => {
  const { nodes, edges } = useMemo(
    () => buildGraph(skills, completed, highlighted),
    [skills, completed, highlighted]
  );

  const handleClick = (_: any, node: Node) => {
    const skill = skills.find((s) => s.id === node.id)!;
    const isCompleted = completed.includes(skill.id);
    const prereqsMet = skill.prereqIds.every((p) => completed.includes(p));

    if (!isCompleted && !prereqsMet) return;
    onToggle(skill.id, isCompleted);
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        onNodeClick={handleClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default SkillTreeView;
