import { useQuery } from '@tanstack/react-query';
import axios from './api/axios';
import SkillTreeView from './components/SkillTreeView';
import CourseSidebar from './components/CourseSidebar';
import RoleBar from './components/RoleBar';

/** Fetch tree data from backend */
const fetchTree = async () => {
  const { data } = await axios.get('/api/tree');
  return data;
};

function App() {
  const { data, refetch } = useQuery(['tree'], fetchTree);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/4 border-r overflow-y-auto">
          <CourseSidebar courses={data.courses} skills={data.skills} />
        </div>
        <div className="w-3/4 overflow-y-auto flex justify-center p-4">
          <SkillTreeView
            skills={data.skills}
            completed={data.completedSkillIds}
            onComplete={async (id) => {
              await axios.post(`/api/skill/${id}/complete`);
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
