import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetTasksQuery } from "@/state/api";
import Header from "@/app/(components)/Header";

export interface TableViewProps {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 100 },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        {params.value}
      </span>
    ),
  },
  { field: "priority", headerName: "Priority", width: 75 },
  { field: "tags", headerName: "Tags", width: 130 },
  { field: "startDate", headerName: "Start Date", width: 130 },
  { field: "dueDate", headerName: "Due Date", width: 130 },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const TableView = ({ id, setIsModalNewTaskOpen }: TableViewProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred while fetching tasks</div>;

  return (
    <div style={{ height: 650, width: "100%" }} className="p-4">
      <Header
        name="Table"
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
      <DataGrid rows={tasks || []} columns={columns} />
    </div>
  );
};

export default TableView;
