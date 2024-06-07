"use client";

import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { useDrop } from "react-dnd";
import { useDrag } from "react-dnd";
import { format } from "date-fns";
import Image from "next/image";
import { MessageSquareMore } from "lucide-react";

export interface BoardProps {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const taskStatuses = ["To Do", "Work In Progress", "Under Review", "Completed"];

const Board = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {taskStatuses.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

interface TaskColumnProps {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const tasksCount = tasks.filter((task) => task.status === status).length;

  const statusColor: any = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    Completed: "#000000",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`p-4 rounded-lg  ${
        isOver ? "bg-blue-100 dark:bg-blue-900" : ""
      }`}
    >
      <div className="flex mb-3 w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-l-lg `}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex justify-between items-center bg-gray-100 py-4 px-5 rounded-lg w-full">
          <h3 className="text-lg font-semibold flex items-center">
            {status}{" "}
            <span
              className="inline-block leading-none ml-2 text-sm text-center p-1 bg-gray-200 rounded-full"
              style={{ width: "1.5rem", height: "1.5rem" }}
            >
              {tasksCount}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button>
              <span>...</span>
            </button>
            <button onClick={() => setIsModalNewTaskOpen(true)}>
              <span>+</span>
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} />
        ))}
    </div>
  );
};

interface TaskProps {
  task: TaskType;
}

const Task = ({ task }: TaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({ isDragging: !!monitor.isDragging() }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";

  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`px-2 py-1 rounded-full text-xs font-semibold 
      ${
        priority === "Urgent"
          ? "bg-red-200 text-red-700"
          : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
          ? "bg-green-200 text-green-700"
          : priority === "Low"
          ? "bg-blue-200 text-blue-700"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </div>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`p-4 rounded-md mb-2 shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="rounded-md"
        />
      )}
      <div className="flex justify-between">
        <div className="flex justify-between items-center mt-2">
          {task.priority && <PriorityTag priority={task.priority} />}
          <div className="flex gap-2 ml-2">
            {taskTagsSplit.map((tag) => (
              <div
                key={tag}
                className="px-2 py-1 bg-blue-100 rounded-full text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
        <button>
          <span>...</span>
        </button>
      </div>

      <div className="flex justify-between">
        <h4 className="text-md font-bold">{task.title}</h4>
        {typeof task.points === "number" && (
          <div className="text-xs font-semibold">{task.points} pts</div>
        )}
      </div>
      <div className="text-xs text-gray-500">
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>
      <p className="text-sm text-gray-600">{task.description}</p>
      <hr />
      <div className="flex items-center justify-between mt-2">
        <div className="flex -space-x-1 overflow-hidden">
          {task.assignee && (
            <Image
              key={task.assignee.userId}
              src={`/${task.assignee.profilePictureUrl!}`}
              alt={task.assignee.username}
              width={30}
              height={30}
              className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
            />
          )}
          {task.author && (
            <Image
              key={task.author.userId}
              src={`/${task.author.profilePictureUrl!}`}
              alt={task.author.username}
              width={30}
              height={30}
              className="h-6 w-6 rounded-full border-2 border-white dark:border-gray-800"
            />
          )}
        </div>
        <div className="flex items-center text-gray-500">
          <MessageSquareMore size={16} />
          <span className="ml-1 text-sm">{numberOfComments}</span>
        </div>
      </div>
    </div>
  );
};

export default Board;
