export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const role = req.headers.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.role = role;
    next();
  };
};
