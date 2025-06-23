import React from 'react';

export interface Role {
  id: string;
  title: string;
  description: string;
  requiredSkillIds: string[];
}

interface Props {
  roles: Role[];
  completed: string[];
}

/** Displays roles unlocked by completed skills */
const RoleBar = ({ roles, completed }: Props) => {
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {roles.map((r) => {
        const unlocked = r.requiredSkillIds.every((id) => completed.includes(id));
        return (
          <div
            key={r.id}
            className={`p-2 border rounded min-w-[150px] ${unlocked ? 'bg-green-100' : 'bg-gray-100 opacity-50'}`}
            title={r.description}
          >
            {r.title}
          </div>
        );
      })}
    </div>
  );
};

export default RoleBar;
