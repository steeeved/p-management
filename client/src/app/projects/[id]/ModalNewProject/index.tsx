import { useState } from "react";
import { useCreateProjectMutation } from "@/state/api";
import Modal from "@/app/(components)/Modal";

interface ModalNewProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalNewProject = ({ isOpen, onClose }: ModalNewProjectProps) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [teamId, setTeamId] = useState("");

  const handleSubmit = async () => {
    if (!projectName || !teamId || !startDate || !endDate) return;

    await createProject({
      name: projectName,
      description,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate && teamId;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="space-y-6 mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded shadow-sm"
          placeholder="Team ID"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <button
          type="submit"
          className={`mt-4 w-full flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !isFormValid() || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
