import { supabase } from "../config/supabase.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!["customer", "owner", "driver"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password, role }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(201).json({ message: "User created", user: data });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
