import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const UserTable = ({ users, onEdit, onDelete }) => {
  const columns = [
    { field: 'Name', headerName: 'User Name', flex: 1 },
    { field: 'Email', headerName: 'Email', flex: 1 },
    { field: 'Password', headerName: 'Password', flex: 1.5 },
    { field: 'type', headerName: 'type of User', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => onEdit(params.row)} sx={{ mr: 1, color: 'primary.main' }}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row._id)} sx={{ color: 'error.main' }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <DataGrid
      rows={users}
      columns={columns}
      getRowId={(row) => row.id}
      autoHeight
      slots={{ toolbar: GridToolbar }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 }
        }
      }}
      pageSizeOptions={[5, 10, 25, 50]}
    />
  );
};

export default UserTable;
