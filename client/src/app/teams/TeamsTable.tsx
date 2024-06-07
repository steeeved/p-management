"use client";

import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Header from "@/app/(components)/Header";
import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 200 },
  { field: "productOwnerUsername", headerName: "Product Owner", width: 200 },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    width: 200,
  },
];

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const TeamsTable = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const { data: currentUser } = useGetAuthUserQuery({});

  if (isLoading) return <div>Loading...</div>;
  if (isError || !teams || !currentUser) return <div>Error fetching teams</div>;

  const userRole = currentUser?.userRole;

  return (
    <div className="flex flex-col w-full p-4">
      <Header
        name="Teams"
        buttonComponent={
          userRole === "superAdmin" && (
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3">
              Add Team
            </button>
          )
        }
      />
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className="!border-0  bg-white dark:bg-gray-800 dark:text-gray-200"
          sx={{
            "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell, & .MuiDataGrid-filler": {
              backgroundColor: "var(--header-bg)",
              color: "var(--row-text)",
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
            "& .MuiDataGrid-menuIcon, & .MuiSvgIcon-root": {
              fill: "var(--row-text)",
            },
          }}
        />
      </div>
    </div>
  );
};

export default TeamsTable;
