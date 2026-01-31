import { supabase } from "../config/supabase.js";

export const getAnalytics = async (req, res) => {
  try {
    const { count: customers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer");

    const { count: owners } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "owner");

    const { count: drivers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "driver");

    const { count: vehicles } = await supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true });

    const { count: trips } = await supabase
      .from("trips")
      .select("*", { count: "exact", head: true });

    res.json({
      total_customers: customers,
      total_owners: owners,
      total_drivers: drivers,
      total_vehicles: vehicles,
      total_trips: trips
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
