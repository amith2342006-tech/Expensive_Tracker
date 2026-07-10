// Optional: verify a Firebase ID token sent from the client as
// Authorization: Bearer <token>. Requires firebase-admin.
// Uncomment and install firebase-admin to enable real auth
// protection on these routes.
//
// import admin from "firebase-admin";
// admin.initializeApp({ credential: admin.credential.applicationDefault() });
//
// export async function verifyFirebaseToken(req, res, next) {
//   const header = req.headers.authorization || "";
//   const token = header.startsWith("Bearer ") ? header.slice(7) : null;
//   if (!token) return res.status(401).json({ message: "Missing auth token." });
//   try {
//     req.user = await admin.auth().verifyIdToken(token);
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid auth token." });
//   }
// }

export function verifyFirebaseToken(req, res, next) {
  next();
}
