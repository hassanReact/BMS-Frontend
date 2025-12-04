/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Box, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddLead from './AddLead';
import AddPayments from './AddPayments';

// ----------------------------------------------------------------------

const leadData = [
  {
    id: 1,
    unitname: 'C21',
    buildingname:"c21",
    tenants: 'John F Kennedy',
    contactno: '90909090',
    amount: '2000'
  }
];

const Payments = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const columns = [
    {
      field: 'unitname',
      headerName: 'Unit Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'buildingname',
      headerName: 'Building Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'tenants',
      headerName: 'Tenant Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'contactno',
      headerName: 'Contact No.',
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1
    }
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  return (
    <>
      <AddPayments open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Payments </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
             Add New Payments
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={leadData}
                columns={columns}
                checkboxSelection
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>
      </Container>
    </>
  );
};

export default Payments;
