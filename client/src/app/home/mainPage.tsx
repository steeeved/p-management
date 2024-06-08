"use client";

import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  useGetTasksQuery,
  useGetProjectsQuery,
  useGetUsersQuery,
  Task,
  Priority,
  Project,
} from "@/state/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAppSelector } from "@/app/redux";

const MainPage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery();

  const [taskDistribution, setTaskDistribution] = useState<any[]>([]);
  const [projectStatus, setProjectStatus] = useState<any[]>([]);
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (tasks) {
      const priorityCount = tasks.reduce(
        (acc: Record<string, number>, task: Task) => {
          const { priority } = task;
          acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
          return acc;
        },
        {}
      );

      setTaskDistribution(
        Object.keys(priorityCount).map((key) => ({
          name: key,
          count: priorityCount[key],
        }))
      );
    }
  }, [tasks]);

  useEffect(() => {
    if (projects) {
      const statusCount = projects.reduce(
        (acc: Record<string, number>, project: Project) => {
          const status = project.endDate ? "Completed" : "Active";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      setProjectStatus(
        Object.keys(statusCount).map((key) => ({
          name: key,
          count: statusCount[key],
        }))
      );
    }
  }, [projects]);

  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884d8",
        barGrid: "#E0E0E0",
        pieFill: "#82ca9d",
        text: "#000000",
      };

  if (tasksLoading || isProjectsLoading || isUsersLoading)
    return <div>Loading...</div>;
  if (tasksError || !tasks || !projects || !users)
    return <div>Error fetching data</div>;

  return (
    <div className="container w-[100%] h-full p-8 bg-gray-100 dark:bg-gray-700">
      <header className="text-4xl font-bold mb-6 dark:text-white font-inherit">
        Project Management Dashboard
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            Your Tasks
          </h3>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className="!border-0 "
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "var(--header-bg)",
                  color: "var(--header-text)",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "var(--header-bg)",
                  color: "var(--row-text)",
                  padding: "0",
                  margin: "0",
                },
                "& .MuiDataGrid-menuIcon, & .MuiSvgIcon-root": {
                  fill: "var(--row-text)",
                },
                "& .MuiDataGrid-cell": {
                  // backgroundColor: "var(--row-bg)",
                  color: "var(--row-text)",
                },
                "& .MuiDataGrid-row": {
                  backgroundColor: "var(--row-bg)",
                  "&:hover": {
                    backgroundColor: "var(--row-hover-bg)",
                  },
                  "&.Mui-selected, &.Mui-selected:hover": {
                    backgroundColor: "var(--row-hover-bg) !important",
                  },
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: "var(--header-bg)",
                },
                "& .MuiDataGrid-selectedRowCount, & .MuiTablePagination-selectLabel, & .MuiSelect-select, & .MuiTablePagination-displayedRows":
                  {
                    color: "var(--row-text)",
                  },
                "& .MuiTablePagination-selectIcon": {
                  fill: "var(--row-text)",
                },
                "& ::-webkit-scrollbar": {
                  width: "8px",
                  height: "8px",
                },
                "& ::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--scrollbar-thumb)",
                  borderRadius: "4px",
                },
                "& ::-webkit-scrollbar-track": {
                  backgroundColor: "var(--scrollbar-track)",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
