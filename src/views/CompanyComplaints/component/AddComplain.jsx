"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { urls } from "@/core/Constant/urls";
import { postApi, getApi } from "@/core/apis/api";
import { toast } from "react-toastify";
import { tokenPayload } from "@/helper";

const AddComplaintsByAdmin = ({
  open,
  setOpen,
  fetchComplaints,
}) => {
  const { t } = useTranslation();
  const payload = tokenPayload();
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState("");

  const validationSchema = Yup.object({
    concernTopic: Yup.string().required(t("Title is required")),
    description: Yup.string().required(t("Description is required")),
  });

  const { values, handleChange, handleSubmit, resetForm, errors, touched } =
    useFormik({
      initialValues: {
        concernTopic: "",
        description: "",
      },
      validationSchema,
      onSubmit: async (values) => {
        try {
          const complaintData= {
            ...values,
            companyId: payload._id,
          };

          if (selectedStaff) {
            const assigned = staffList.find(
              (s) => s._id === selectedStaff
            );
            complaintData.staffId = selectedStaff;
            complaintData.staffName = assigned?.staffName || "";
          }

          await postApi(urls.Complaints.create, complaintData);
          toast.success(t("Complaint created"));
          resetForm();
          setSelectedStaff("");
          setOpen(false);
          fetchComplaints();
        } catch (err) {
          toast.error(t("Failed to create complaint"));
        }
      },
    });

  const fetchStaffList = async () => {
    try {
      const res = await getApi(urls.staff.staffdata, {
        id: payload.companyId,
      });
      setStaffList(res.data || []);
    } catch (err) {
      toast.error(t("Failed to fetch staff list"));
    }
  };

  useEffect(() => {
    if (open) {
    //   fetchPropertyData();
      fetchStaffList();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{t("Add Complaint")}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={t("Title")}
                name="concernTopic"
                fullWidth
                value={values.concernTopic}
                onChange={handleChange}
                error={touched.title && Boolean(errors.concernTopic)}
                helperText={touched.concernTopic && errors.concernTopic}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label={t("Description")}
                name="description"
                fullWidth
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>

            {payload.role === "companyAdmin" && (
              <Grid item xs={12}>
                <FormLabel>{t("Assign Staff (optional)")}</FormLabel>
                <Select
                  fullWidth
                  size="small"
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="">{t("None")}</MenuItem>
                  {staffList.map((staff) => (
                    <MenuItem key={staff._id} value={staff._id}>
                      {staff.staffName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            {t("Cancel")}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {t("Submit")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddComplaintsByAdmin;
