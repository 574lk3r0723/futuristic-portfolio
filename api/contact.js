export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req.body); // For testing
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
