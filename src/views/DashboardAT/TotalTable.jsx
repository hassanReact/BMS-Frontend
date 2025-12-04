/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import {
  Stack, Container, Typography, Card, Box, Breadcrumbs
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import TableStyle from '../../ui-component/TableStyle';
import { getApi } from '@/core/apis/api';
import { urls } from '@/core/Constant/urls';
import { tokenPayload } from '@/helper';
import { useTranslation } from 'react-i18next';
import { IconHome } from '@tabler/icons';

const TotalTable = () => {
  const { t } = useTranslation();
  const Payload = tokenPayload();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [tenantRes, propertyRes, agentRes] = await Promise.all([
          getApi(urls.tenant.getAllTenants, { id: Payload.companyId }),
          getApi(urls.property.getPropertyById, { id: Payload.companyId }),
          getApi(urls.agent.agentdata, { id: Payload.companyId }),
        ]);

        const tenants = tenantRes?.data || [];
        const properties = propertyRes?.data || [];
        const agents = agentRes?.data || [];

        const finalData = [{
          _id: Payload.companyId,
          companyName: Payload.companyName || 'Company',
          totalTenants: tenants.length,
          totalAgents: agents.length,
          totalProperties: properties.length,
        }];

        setTableData(finalData);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };

    fetchAllData();
  }, []);

  const columns = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      renderCell: (params) => 1,
    },
    { field: 'companyName', headerName: 'Company Name', flex: 1 },
    { field: 'totalAgents', headerName: 'Total Agents Listed', flex: 1 },
    { field: 'totalTenants', headerName: 'Total Tenants Listed', flex: 1 },
    { field: 'totalProperties', headerName: 'Total Properties Listed', flex: 1 },
  ];

  const breadcrumbs = [
    <Link key="home" to="/dashboard/default" style={{ color: 'inherit', textDecoration: 'none' }}>
      <IconHome />
    </Link>,
    <Link key="property-management" to="/dashboard/vacantproperty" style={{ color: 'inherit', textDecoration: 'none' }}>
      {t('Vacant Properties')}
    </Link>,
  ];

  return (
    <Container>
      {/* <Card sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            {t('Vacant Property')}
            <Breadcrumbs separator="›">{breadcrumbs}</Breadcrumbs>
          </Typography>
        </Stack>
      </Card> */}

      <TableStyle>
        <Box width="100%">
          <Card style={{ height: '600px', paddingTop: '15px' }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              getRowId={(row) => row._id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{ toolbar: { showQuickFilter: true } }}
            />
          </Card>
        </Box>
      </TableStyle>
    </Container>
  );
};

export default TotalTable;
