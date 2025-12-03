import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: false },
    numberOfPersons: { type: Number, required: true },
    date: { type: Date, required: true },
    extended: { type: Number, required: false },
  },
  { timestamps: true }
);

export const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", ReservationSchema);

export default Reservation;
