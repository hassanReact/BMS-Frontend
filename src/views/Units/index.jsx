/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Link, Breadcrumbs, Box, Card } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddLead from './AddLead';
import AddUnits from './AddUnits';
import { IconHome } from '@tabler/icons';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

const leadData = [
  {
    id: 1,
    firstName: 'petter',
    lastName: 'jhon',
    gender: 'male',
    phoneNumber: '9981923587',
    emailAddress: 'ap@samyotech.com',
    action: 'Edit'
  }
];

const Units = () => {
  const { t } = useTranslation();
  const [openAdd, setOpenAdd] = useState(false);

  const breadcrumbs = [
    <Link underline="hover" key="1" color="primary" href="/" >
      <IconHome />
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="primary"
      href="/material-ui/getting-started/installation/"
    >
      {t('Add Units')}
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {t('Items')}
    </Typography>,
  ];

  const columns = [
    {
      field: 'unitNo',
      headerName: t('Unit Number'),
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'type',
      headerName: t('Type'),
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'rentamount',
      headerName: t('Rent Amount'),
      flex: 1
    },
    {
      field: 'status',
      headerName: t('Status'),
      flex: 1
    },
    {
      field: 'tenants',
      headerName: t('Tenants'),
      flex: 1
    },
    {
      field: 'building',
      headerName: t('Building'),
      flex: 1
    },
    {
      field: 'discription',
      headerName: t('Description'),
      flex: 1
    },
    {
      field: 'action',
      headerName: t('Action'),
      flex: 1
    }
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  return (
    <>
      <AddUnits open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Card sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }} >
              {t('Units Management')} <Breadcrumbs separator="›" aria-label="breadcrumb">{breadcrumbs}</Breadcrumbs>
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              {t('Add Unit')}
            </Button>
          </Stack>
        </Card>
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

export default Units;
