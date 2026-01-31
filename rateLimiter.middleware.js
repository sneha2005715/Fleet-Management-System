const requests = {};

export const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();

  if (!requests[ip]) requests[ip] = [];

  requests[ip] = requests[ip].filter(time => now - time < 60000);

  if (requests[ip].length >= 3) {
    return res.status(429).json({ message: "Too many requests. Try later." });
  }

  requests[ip].push(now);
  next();
};
