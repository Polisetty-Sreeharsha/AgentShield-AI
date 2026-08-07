const express = require("express");
const router = express.Router();
const { addPolicy, getPolicies, checkPolicy, getLogs } = require("../policyEngine");

router.get("/policies", (req, res) => {
  res.json(getPolicies());
});

router.post("/policy", (req, res) => {
  const policy = addPolicy(req.body);
  res.json({ success: true, policy });
});

router.post("/request", async (req, res) => {
  const result = await checkPolicy(req.body);

  // Set official x402 headers
  res.setHeader("X-402-Payment-Protocol", "Algorand-Testnet");
  res.setHeader("X-402-Status", result.approved ? "Authorized" : "Payment-Required");

  if (!result.approved) {
    return res.status(402).json(result);
  }

  res.status(200).json(result);
});

router.get("/logs", (req, res) => {
  res.json(getLogs());
});

module.exports = router;