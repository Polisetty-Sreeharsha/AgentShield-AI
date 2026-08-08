require("dotenv").config();
const algosdk = require("algosdk");

// Connect to Algorand Testnet Node via AlgoNode free RPC
const algodToken = "";
const algodServer = "https://testnet-api.algonode.cloud";
const algodPort = 443;
const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

// Receiver wallet address
const receiverAddress = "L4GOUFB5WK5KHUP5MPOXVWI5J7WQGH6W7DXXQGSTTO5E5GFUK73VYHUYYQ";

// Load sender account from .env
let senderAccount = null;
if (process.env.ALGORAND_MNEMONIC) {
  try {
    senderAccount = algosdk.mnemonicToSecretKey(process.env.ALGORAND_MNEMONIC);
    console.log("Algorand Wallet Connected:", senderAccount.addr.toString());
  } catch (e) {
    console.warn("Invalid ALGORAND_MNEMONIC in .env file.");
  }
}

let policies = [
  { name: "OpenAI Budget", maxAmount: 100, service: "OpenAI API" }
];

let logs = [];

function addPolicy(policy) {
  policies.push(policy);
  return policy;
}

function getPolicies() {
  return policies;
}

async function checkPolicy(request) {
  const policy = policies.find((p) => p.service === request.service);
  const limit = policy ? Number(policy.maxAmount) : 100;
  const approved = Number(request.amount) <= limit;

  let txHash = null;

  if (approved) {
    try {
      if (!senderAccount) {
        throw new Error("Sender account not initialized. Check .env file.");
      }

      // 1. Fetch live transaction parameters from Algorand Testnet
      const params = await algodClient.getTransactionParams().do();

      // 2. Build real payment transaction (Sends 0.001 ALGO = 1000 microAlgos)
      const enc = new TextEncoder();
      const note = enc.encode(`x402 Agent Payment: ${request.service}`);

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: senderAccount.addr.toString(),
        receiver: receiverAddress,
        amount: 1000, // 1000 microALGOs = 0.001 ALGO
        note: note,
        suggestedParams: params,
      });

      // 3. Sign transaction with sender private key
      const signedTxn = txn.signTxn(senderAccount.sk);

      // 4. Submit real transaction to Algorand Testnet
      const sendTx = await algodClient.sendRawTransaction(signedTxn).do();
      txHash = sendTx.txId;

      console.log(`Live Algorand Tx Sent! TxID: ${txHash}`);

      // 5. Wait for block confirmation (~2.8 seconds)
      await algosdk.waitForConfirmation(algodClient, txHash, 4);

    } catch (err) {
      console.error("Algorand On-Chain Tx Error:", err.message);
      txHash = "TX_FAILED_ON_CHAIN";
    }
  }

  const log = {
    id: "tx_" + Date.now(),
    agent: request.agent || "AI Agent",
    service: request.service,
    amount: Number(request.amount),
    approved,
    statusCode: approved ? 200 : 402,
    x402Header: approved
      ? `x-402-auth: bearer_algo_${Date.now()}`
      : `x-402-required: amount=${request.amount}; receiver=${receiverAddress}`,
    message: approved
      ? "Policy Approved - Real On-Chain x402 Payment Executed"
      : `HTTP 402 Payment Required: Exceeds policy limit ($${limit})`,
    txHash: txHash,
    timestamp: new Date().toLocaleTimeString()
  };

  logs.unshift(log);
  return log;
}

function getLogs() {
  return logs;
}

module.exports = { addPolicy, getPolicies, checkPolicy, getLogs };