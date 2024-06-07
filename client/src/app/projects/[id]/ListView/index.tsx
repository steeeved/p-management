import { Plus } from "lucide-react";
import { useGetTasksQuery } from "@/state/api";
import { Task as TaskType } from "@/state/api";
import TaskCard from "@/app/(components)/TaskCard";
import Header from "@/app/(components)/Header";

export interface ListViewProps {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({ id, setIsModalNewTaskOpen }: ListViewProps) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="p-4">
      <Header
        name="List"
        buttonComponent={
          <button
            className="flex items-center px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
        isSmallText
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks?.map((task: TaskType) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
