import { useState, useMemo } from "react";
import { Gantt, DisplayOption, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { useGetTasksQuery } from "@/state/api";

export interface TimelineViewProps {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

type TaskType = "task" | "milestone" | "project";

const TimelineView = ({ id, setIsModalNewTaskOpen }: TimelineViewProps) => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map((task) => ({
        start: new Date(task.startDate as string),
        end: new Date(task.dueDate as string),
        name: task.title,
        id: `Task-${task.id}`,
        type: "task" as TaskType,
        progress: task.points ? (task.points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoadingTasks) return <div>Loading...</div>;
  if (isTasksError || !tasks)
    return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="bg-white p-5 shadow-lg">
      <div className="flex justify-between mb-4">
        <h1 className="font-bold text-lg">{`Project Tasks Timeline`}</h1>
        <div className="inline-block relative w-64">
          <select
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <Gantt
          tasks={ganttTasks}
          {...displayOptions}
          columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
          listCellWidth="100px"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setIsModalNewTaskOpen(true)}
      >
        Add New Task
      </button>
    </div>
  );
};

export default TimelineView;
