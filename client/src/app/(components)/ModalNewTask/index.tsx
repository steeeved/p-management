import { useState } from "react";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import { format } from "date-fns";
import Modal from "@/app/(components)/Modal";

interface ModalNewTaskProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNewTask = ({ isOpen, onClose }: ModalNewTaskProps) => {
  const [createTask] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const handleCreateTask = async () => {
    await createTask({
      title,
      description,
      status,
      priority,
      tags: tags,
      startDate: format(startDate!, "yyyy-MM-dd"),
      dueDate: format(dueDate!, "yyyy-MM-dd"),
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Title"
          className="p-2 border rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <textarea
          placeholder="Description"
          className="p-2 border rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <select
          className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded"
          value={status}
          onChange={(e) =>
            setStatus(Status[e.target.value as keyof typeof Status])
          }
        >
          <option value="">Select Status</option>
          <option value={Status.ToDo}>To Do</option>
          <option value={Status.WorkInProgress}>Work In Progress</option>
          <option value={Status.UnderReview}>Under Review</option>
          <option value={Status.Completed}>Completed</option>
        </select>
        <select
          className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded"
          value={priority}
          onChange={(e) =>
            setPriority(Priority[e.target.value as keyof typeof Priority])
          }
        >
          <option value="">Select Priority</option>
          <option value={Priority.Urgent}>Urgent</option>
          <option value={Priority.High}>High</option>
          <option value={Priority.Medium}>Medium</option>
          <option value={Priority.Low}>Low</option>
          <option value={Priority.Backlog}>Backlog</option>
        </select>
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="p-2 border rounded w-full"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setStartDate(e.target.valueAsDate)}
        />
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={dueDate ? format(dueDate, "yyyy-MM-dd") : ""}
          onChange={(e) => setDueDate(e.target.valueAsDate)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="text"
          placeholder="Author User ID"
          className="p-2 border rounded w-full"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Assigned User ID"
          className="p-2 border rounded w-full"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700`}
          onClick={handleCreateTask}
        >
          Create Task
        </button>
      </div>
    </Modal>
  );
};

export default ModalNewTask;
