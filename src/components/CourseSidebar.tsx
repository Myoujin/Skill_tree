import React from 'react';
import { Skill } from './SkillTreeView';

export interface Course {
  id: string;
  title: string;
  description: string;
  skillIds: string[];
}

interface Props {
  courses: Course[];
  skills: Skill[];
  onHover: (ids: string[]) => void;
}

/** Sidebar listing courses */
const CourseSidebar = ({ courses, onHover }: Props) => {
  return (
    <ul className="p-4 space-y-2">
      {courses.map((c) => (
        <li
          key={c.id}
          className="p-2 border rounded hover:bg-gray-100 bg-[#ffca35]"
          onMouseEnter={() => onHover(c.skillIds)}
          onMouseLeave={() => onHover([])}
        >
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm">{c.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default CourseSidebar;
