import { supabase } from "../config/supabase.js";

export const createTrip = async (req, res) => {
  try {
    const {
      vehicle_id,
      start_date,
      end_date,
      location,
      distance_km,
      passengers
    } = req.body;

    const customer_id = req.headers.userid;

    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", vehicle_id)
      .single();

    if (!vehicle.isAvailable) {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    if (passengers > vehicle.allowed_passengers) {
      return res.status(400).json({ message: "Passenger limit exceeded" });
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .insert([
        {
          customer_id,
          vehicle_id,
          start_date,
          end_date,
          location,
          distance_km,
          passengers
        }
      ])
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    await supabase
      .from("vehicles")
      .update({ isAvailable: false })
      .eq("id", vehicle_id);

    res.status(201).json({ message: "Trip created", trip });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const { data, error } = await supabase
      .from("trips")
      .update(req.body)
      .eq("id", tripId)
      .select()
      .single();

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Trip updated", trip: data });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (error) return res.status(404).json({ message: "Trip not found" });

    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Trip deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const endTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    const { data: trip } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", trip.vehicle_id)
      .single();

    const tripCost = trip.distance_km * vehicle.rate_per_km;

    const { data, error } = await supabase
      .from("trips")
      .update({ isCompleted: true, tripCost })
      .eq("id", tripId)
      .select()
      .single();

    await supabase
      .from("vehicles")
      .update({ isAvailable: true })
      .eq("id", trip.vehicle_id);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Trip ended", trip: data });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
