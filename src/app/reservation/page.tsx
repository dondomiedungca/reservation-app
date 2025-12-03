"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import axios from "axios";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Alert,
  AlertTitle,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addDays, format } from "date-fns";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";

interface Reservation {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  numberOfPersons: number;
  date: Date;
  extended: boolean;
}

interface SnackbarProps {
  open: boolean;
  severity: "error" | "success";
  message: string;
}

const StyledDiv = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;

  .MuiCard-root {
    margin-top: 20px;
    display: flex;
    align-items: start;
    justify-content: center;
    gap: 32px;
    min-height: 200px;
    padding: 20px 20px;

    .reservation-container {
      width: 520px;
    }
  }
`;

const tomorrow = addDays(new Date(), 1);

const reservationSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  email: Yup.string().email().required(),
  contact: Yup.string(),
  numberOfPersons: Yup.number().required(),
  date: Yup.date().required(),
  extended: Yup.boolean().nullable(),
});

const Page = () => {
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    isPending,
    mutateAsync: reserve,
    reset,
  } = useMutation({
    mutationFn: (reservation: Reservation) => {
      return axios.post("/api/reservation", reservation);
    },
  });

  const {
    values,
    handleBlur,
    handleChange,
    setFieldValue,
    submitForm,
    resetForm,
    isValid,
    errors,
    touched,
  } = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    validationSchema: reservationSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      numberOfPersons: 5,
      date: tomorrow,
      extended: false,
    } as Reservation,
    onSubmit: async (values) => {
      const response = await reserve(values);
      const ok = response.status === 201;
      setSnackbar({
        open: true,
        message: ok
          ? "Reservation saved successfully"
          : "Something went wrong. Please try again later",
        severity: ok ? "success" : "error",
      });
      resetForm();
      setOpen(false);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledDiv>
        <Card>
          <div className="reservation-container">
            <Alert severity="info">
              <AlertTitle>
                <Typography variant="body2" fontWeight={600}>
                  Note
                </Typography>
              </AlertTitle>
              <Typography variant="caption">
                Extended hours have additional fee worth of ₱ 2,000
              </Typography>
            </Alert>
            <Typography variant="subtitle2" mt={2} mb={2}>
              Details
            </Typography>
          </div>
          <div className="calendar-container">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                disablePast
                value={values.date}
                onChange={(value) => setFieldValue("date", value, true)}
              />
            </LocalizationProvider>
            <Button
              fullWidth
              className="reserve-button"
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AccessTimeIcon />}
              onClick={() => {
                reset();
                setOpen(true);
              }}
            >
              Submit Reservation
            </Button>
          </div>
        </Card>
      </StyledDiv>
      <Dialog open={open}>
        <DialogTitle>
          <Typography>
            Create Reservation for{" "}
            <strong>{format(values.date, "MMM dd, yyyy")}</strong>
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container mt={1} spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="First Name"
                name="firstName"
                value={values.firstName}
                error={!!(touched.firstName && errors.firstName)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Last Name"
                name="lastName"
                value={values.lastName}
                error={!!(touched.lastName && errors.lastName)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Email"
                name="email"
                value={values.email}
                error={!!(touched.email && errors.email)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Contact"
                name="contact"
                value={values.contact}
                error={!!(touched.contact && errors.contact)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={12}>
              {/* <FormControl fullWidth size="small">
                <InputLabel>Pax</InputLabel>
                <Select
                  label="Pax"
                  value={values.pax}
                  error={!!(touched.pax && errors.pax)}
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {paxes.map((pax, index) => (
                    <MenuItem key={index} value={pax}>
                      {pax}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
              <TextField
                fullWidth
                type="number"
                size="small"
                variant="outlined"
                label="Number of persons"
                name="numberOfPersons"
                value={values.numberOfPersons}
                error={!!(touched.numberOfPersons && errors.numberOfPersons)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    label="From"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        inputProps: {
                          readOnly: true,
                          onPaste: (e) => e.preventDefault(),
                        },
                        onKeyDown: (e) => e.preventDefault(),
                        onFocus: (e) => {
                          console.log("Focused!");
                          e.currentTarget.querySelector("button")?.click(); // open TimePicker
                        },
                      },
                    }}
                    value={values.from}
                    onChange={(value) => setFieldValue("from", value, true)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid size={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    label="To"
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        inputProps: {
                          readOnly: true,
                          onPaste: (e) => e.preventDefault(),
                        },
                        onKeyDown: (e) => e.preventDefault(),
                      },
                    }}
                    value={values.to}
                    onChange={(value) => setFieldValue("to", value, true)}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid> */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={values.extended}
                    onChange={(_, checked) =>
                      setFieldValue("extended", checked, true)
                    }
                  />
                }
                label="2 hours extended"
              />
              <Chip
                color="info"
                disabled={!values.extended}
                icon={<PaymentIcon />}
                label="With Additional Fee"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isPending}
            size="small"
            color="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            disabled={isPending || !isValid}
            startIcon={
              isPending ? (
                <CircularProgress color="inherit" size={20} />
              ) : undefined
            }
            size="small"
            variant="contained"
            onClick={isValid ? submitForm : undefined}
            autoFocus
          >
            Reserve
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Page;
