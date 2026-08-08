const algosdk = require('algosdk');

const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

console.log('\n====================================');
console.log('ADDRESS:', account.addr.toString());
console.log('MNEMONIC:', mnemonic);
console.log('====================================\n');