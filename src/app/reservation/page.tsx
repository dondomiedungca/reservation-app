"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { addDays, format, isSameDay } from "date-fns";
import { useFormik } from "formik";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Alert,
  AlertTitle,
  Badge,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";

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

const StyledDayContainer = styled.div`
  &.selected {
    button {
      border-radius: 50%;
      background-color: #dadada;
      color: #a6a6a6 !important;

      &.Mui-selected {
        background-color: #838383;
      }
    }
  }
`;

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

    ${(props) => props.theme.breakpoints.down("md")} {
      flex-direction: column-reverse;

      .reservation-container,
      .calendar-container {
        width: 100%;
      }
    }
  }
`;

const now = new Date();

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
  const [reservation, setReservation] = useState<Reservation>();
  const [dateFilter, setDateFilter] = useState(() => now);
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
    data: reservations,
    isFetching,
    refetch,
  } = useQuery<Reservation[]>({
    queryKey: ["reservations", dateFilter],
    queryFn: async () => {
      const response = await axios.get("/api/reservation", {
        params: { dateFilter: format(dateFilter, "yyyy-MM-dd") },
      });
      return response.data;
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
      date: null as unknown as Date,
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
      refetch();
      setOpen(false);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  function ServerDay(props: PickersDayProps & { highlightedDays?: number[] }) {
    const { day, outsideCurrentMonth, ...other } = props;

    const isSelected = reservations?.some((reservation) =>
      isSameDay(reservation.date, day)
    );

    return (
      <StyledDayContainer
        key={day.toString()}
        className={isSelected ? "selected" : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </StyledDayContainer>
    );
  }

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
                Additional 2 hours have additional fee worth of{" "}
                <strong>₱ 2,000</strong>
              </Typography>
            </Alert>
          </div>
          <div className="calendar-container">
            {!values.date && (
              <Typography variant="caption" fontWeight={600}>
                Select Date
              </Typography>
            )}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                timezone="UTC"
                disablePast
                loading={isFetching}
                value={values.date}
                slots={{ day: ServerDay }}
                onChange={(value) => {
                  if (!value) return;
                  const reservation = (reservations || []).find((reservation) =>
                    isSameDay(reservation.date, value)
                  );
                  if (reservation) {
                    setReservation(reservation);
                    return;
                  }
                  setFieldValue("date", value, true);
                }}
                onMonthChange={(value) => {
                  setDateFilter(value);
                }}
              />
            </LocalizationProvider>
            <Button
              fullWidth
              disabled={isFetching || isPending || !values.date}
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
              Create Reservation
            </Button>
          </div>
        </Card>
      </StyledDiv>
      <Dialog open={open}>
        <DialogTitle>
          <Typography>Create Reservation</Typography>
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
                label={
                  <Typography variant="body2">2 hours extended</Typography>
                }
              />
              <Chip
                color={values.extended ? "info" : "secondary"}
                disabled={!values.extended}
                icon={<PaymentIcon />}
                label={`${values.extended ? "With" : "Without"} Additional Fee`}
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
      {reservation && (
        <Dialog
          open
          fullWidth
          maxWidth="xs"
          onClose={() => setReservation(undefined)}
        >
          <DialogTitle>
            <Typography>Reservation Details</Typography>
          </DialogTitle>
          <DialogContent>
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
            >
              <span>Date:</span>
              <span>{format(reservation.date, "MMM. dd, yyyy")}</span>
            </Typography>
            <Typography
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              variant="subtitle2"
            >
              <span>Time:</span>
              <span>
                5pm -{" "}
                <Chip
                  size="small"
                  icon={
                    reservation.extended ? (
                      <StarBorderPurple500Icon fontSize="small" />
                    ) : undefined
                  }
                  color={reservation.extended ? "info" : "secondary"}
                  label={reservation.extended ? "12pm" : "10pm"}
                />
              </span>
            </Typography>
            <br />
            <br />
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
            >
              <span>Reserved by:</span>
              <span>
                {reservation.firstName} {reservation.lastName}
              </span>
            </Typography>
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
            >
              <span>Email:</span>
              <span>{reservation.email}</span>
            </Typography>
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
            >
              <span>Contact:</span>
              <span>{reservation.contact}</span>
            </Typography>
            <Typography
              display="flex"
              justifyContent="space-between"
              variant="subtitle2"
            >
              <span>Persons:</span>
              <span>{reservation.numberOfPersons}</span>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isPending}
              size="small"
              color="secondary"
              onClick={() => setReservation(undefined)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
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
