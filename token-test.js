const jwt = require('jsonwebtoken');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODBhMzMwZTU4MTZlMzFkN2E5N2ZlOGQiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDYwMzY4MDEsImV4cCI6MTc0NjA0MDQwMX0._1jO7Ix3LENvDk5g6S-uNzlvbvnfjkaCVUMobqko6aM";
const secret ="plCyCNec9l1L_HzcUEdhN7OQrUWgo3VO7C9-GQrnbvQ"
try {
  const decoded = jwt.verify(token, secret);
  console.log("Successful verification:", decoded);
} catch (err) {
  console.log("Verification failed:", err.message);
}