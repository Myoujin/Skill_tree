import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from './api/axios';
import SkillTreeView from './components/SkillTreeView';
import CourseSidebar from './components/CourseSidebar';
import RoleBar from './components/RoleBar';
import LoginForm from './components/LoginForm';

/** Fetch tree data from backend */
const fetchTree = async () => {
  const { data } = await axios.get('/api/tree');
  return data;
};

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const { data, error, refetch } = useQuery(['tree', loggedIn], fetchTree, { enabled: loggedIn });

  if (!loggedIn) {
    return <LoginForm onAuth={() => { setLoggedIn(true); refetch(); }} />;
  }

  if (error) {
    // If the token is invalid or expired, show the login form
    if ((error as any).response?.status === 401) {
      localStorage.removeItem('token');
      setLoggedIn(false);
      return <LoginForm onAuth={() => { setLoggedIn(true); refetch(); }} />;
    }
    return <div className="p-4">Error loading data</div>;
  }

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r overflow-y-auto bg-[#003a7c]">
          <CourseSidebar
            courses={data.courses}
            skills={data.skills}
            onHover={(ids) => setHighlighted(ids)}
          />
        </div>
        <div className="w-3/4 overflow-y-auto flex justify-center p-4">
          <SkillTreeView
            skills={data.skills}
            completed={data.completedSkillIds}
            highlighted={highlighted}
            onToggle={async (id, isCompleted) => {
              if (isCompleted) {
                await axios.delete(`/api/skill/${id}/complete`);
              } else {
                await axios.post(`/api/skill/${id}/complete`);
              }
              refetch();
            }}
          />
        </div>
      </div>
      <div className="border-t">
        <RoleBar roles={data.roles} completed={data.completedSkillIds} />
      </div>
    </div>
  );
}

export default App;
