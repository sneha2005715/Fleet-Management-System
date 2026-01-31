import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import tripRoutes from "./routes/trip.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import { logger } from "./middlewares/logger.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger);

app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/trips", tripRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFound);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
