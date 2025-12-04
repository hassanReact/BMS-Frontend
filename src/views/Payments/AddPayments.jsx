/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Rating,
  Select,
  TextField
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
// import { useState,useEffect } from 'react';
// import { apiget, apipost } from '../../service/api';
import Palette from '../../ui-component/ThemePalette';

const AddPayments = (props) => {
  const { open, handleClose } = props;
  // const [user, setUser] = useState([]);

  // const userid = localStorage.getItem('user_id');
  // const userdata = JSON.parse(localStorage.getItem('user'));

  // -----------  validationSchema
  const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    dateOfBirth: yup.date().required('Date of Birth is required'),
    gender: yup.string().required('Gender is required'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number is invalid')
      .required('Phone number is required'),
    emailAddress: yup.string().email('Invalid email').required('Email is required'),
    address: yup.string().required('Address is required'),
    desiredCoverageAmount: yup.number(),
    coverageAmount: yup.number(),
    alternatePhoneNumber: yup.string().matches(/^[0-9]{10}$/, 'Phone number is invalid'),
    additionalEmailAddress: yup.string().email('Invalid email')
    // assigned_agent: yup.string().required('Assigned Agent is required')
  });

  // -----------   initialValues
  const initialValues = {
    unitname: '',
    tenants: '',
    buildingname:'',
    contactno: '',
    amount:''
    // createdBy: userid,
    // contact_id: _id
  };

  // add Lead api
  // const addLead = async (values) => {
  //   const data = values;

  //   const result = await apipost('lead/add', data);
  //   setUserAction(result);

  //   if (result && result.status === 201) {
  //     formik.resetForm();
  //     handleClose();
  //     toast.success(result.data.message);
  //   }
  // };

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log('leadValues', values);
      handleClose();
      toast.success('lead Add successfully');
      // addLead(values);
    }
  });
  // user api
  // const fetchUserData = async () => {
  //   const result = await apiget('user/list');
  //   if (result && result.status === 200) {
  //     setUser(result?.data?.result);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserData();
  // }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        // TransitionComponent={Transition}
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
            // backgroundColor: "#2b4054",
            // color: "white",
          }}
        >
          <Typography variant="h6">Add New</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                Payment Information
              </Typography>
              <Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={6}>
    <FormLabel>Unit Name</FormLabel>
    <TextField
      id="unitname"
      name="unitname"
      size="small"
      fullWidth
      value={formik.values.unitname}
      onChange={formik.handleChange}
      error={formik.touched.unitname && Boolean(formik.errors.unitname)}
      helperText={formik.touched.unitname && formik.errors.unitname}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={6}>
    <FormLabel>Building Name</FormLabel>
    <TextField
      id="tenants"
      name="tenants"
      size="small"
      fullWidth
      value={formik.values.tenants}
      onChange={formik.handleChange}
      error={formik.touched.tenants && Boolean(formik.errors.tenants)}
      helperText={formik.touched.tenants && formik.errors.tenants}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={6}>
    <FormLabel>Tenants Name</FormLabel>
    <TextField
      id="tenants"
      name="tenants"
      size="small"
      fullWidth
      value={formik.values.tenants}
      onChange={formik.handleChange}
      error={formik.touched.tenants && Boolean(formik.errors.tenants)}
      helperText={formik.touched.tenants && formik.errors.tenants}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={6}>
    <FormLabel>Contact Number</FormLabel>
    <TextField
      id="contactno"
      name="contactno"
      type="number"
      size="small"
      fullWidth
      value={formik.values.contactno}
      onChange={formik.handleChange}
      error={formik.touched.contactno && Boolean(formik.errors.contactno)}
      helperText={formik.touched.contactno && formik.errors.contactno}
    />
  </Grid>
  <Grid item xs={12} sm={6} md={6}>
    <FormLabel>Amount</FormLabel>
    <TextField
      id="amount"
      name="amount"
      size="small"
      fullWidth
      value={formik.values.amount}
      onChange={formik.handleChange}
      error={formik.touched.amount && Boolean(formik.errors.amount)}
      // eslint-disable-next-line prettier/prettier
      helperText={formik.touched.amount && formik.errors.amount}
    />
  </Grid>
</Grid>

            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPayments;
