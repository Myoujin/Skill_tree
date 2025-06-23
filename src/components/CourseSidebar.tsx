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
}

/** Sidebar listing courses */
const CourseSidebar = ({ courses }: Props) => {
  return (
    <ul className="p-4 space-y-2">
      {courses.map((c) => (
        <li key={c.id} className="p-2 border rounded hover:bg-gray-100">
          <h3 className="font-bold">{c.title}</h3>
          <p className="text-sm">{c.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default CourseSidebar;
