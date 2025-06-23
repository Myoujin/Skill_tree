import { SkillTree, SkillTreeGroup, SkillProvider, SavedDataType, Skill as STSkill } from 'beautiful-skill-tree';

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
  onComplete: (id: string) => Promise<void>;
}

/** Build hierarchical skill tree data */
const buildTree = (skills: Skill[]): STSkill[] => {
  const byId = new Map(skills.map((s) => [s.id, s]));
  const build = (skill: Skill): STSkill => ({
    id: skill.id,
    title: skill.title,
    tooltip: { content: skill.description },
    children: skills
      .filter((s) => s.prereqIds.includes(skill.id))
      .map(build),
  });
  return skills.filter((s) => s.prereqIds.length === 0).map(build);
};

/** Determine node states based on completed skills */
const buildSavedData = (skills: Skill[], completed: string[]): SavedDataType => {
  const data: SavedDataType = {};
  skills.forEach((s) => {
    const unlocked = s.prereqIds.every((p) => completed.includes(p));
    data[s.id] = {
      optional: false,
      nodeState: completed.includes(s.id)
        ? 'selected'
        : unlocked
        ? 'unlocked'
        : 'locked',
    };
  });
  return data;
};

/** Renders the vertical skill tree */
const SkillTreeView = ({ skills, completed, onComplete }: Props) => {
  const treeData = buildTree(skills);
  const saved = buildSavedData(skills, completed);

  return (
    <SkillProvider>
      <SkillTreeGroup>
        {() => (
          <SkillTree
            treeId="ds-tree"
            title="Skills"
            orientation="vertical"
            data={treeData}
            savedData={saved}
            handleNodeSelect={(e) => onComplete(e.key)}
          />
        )}
      </SkillTreeGroup>
    </SkillProvider>
  );
};

export default SkillTreeView;
