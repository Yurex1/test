const nearAPI = require("near-api-js");
const axios = require("axios");
const fs = require("node:fs/promises");

const { connect } = nearAPI;

const accountsData = `61. parascitizen.near (https://t.me/nearaccbot?start=update_bGVsa29rMjIwLmNyb3dkZm9yY2VzLm5lYXI) 52 Ⓝ 08.06.24
62. v_nyusha_v.crowdforces.near (https://t.me/nearaccbot?start=update_dl9ueXVzaGFfdi5jcm93ZGZvcmNlcy5uZWFy) 33 Ⓝ 05.06.24
63. lzsz1212.crowdforces.near (https://t.me/nearaccbot?start=update_bHpzejEyMTIuY3Jvd2Rmb3JjZXMubmVhcg) 55 Ⓝ 04.06.24
64. moe.crowdforces.near (https://t.me/nearaccbot?start=update_bW9lLmNyb3dkZm9yY2VzLm5lYXI) 35 Ⓝ 02.06.24
65. fairywinx.crowdforces.near (https://t.me/nearaccbot?start=update_ZmFpcnl3aW54LmNyb3dkZm9yY2VzLm5lYXI) 33 Ⓝ 29.05.24
66. mixalchik545.crowdforces.near (https://t.me/nearaccbot?start=update_bWl4YWxjaGlrNTQ1LmNyb3dkZm9yY2VzLm5lYXI) 40 Ⓝ 19.05.24
67. c0olb0y.crowdforces.near (https://t.me/nearaccbot?start=update_YzBvbGIweS5jcm93ZGZvcmNlcy5uZWFy) 60 Ⓝ 12.05.24
68. georgiy_ulanov.crowdforces.near (https://t.me/nearaccbot?start=update_Z2VvcmdpeV91bGFub3YuY3Jvd2Rmb3JjZXMubmVhcg) 45 Ⓝ 12.05.24
69. mesuhdu.crowdforces.near (https://t.me/nearaccbot?start=update_bWVzdWhkdS5jcm93ZGZvcmNlcy5uZWFy) 61 Ⓝ 04.05.24
70. phuthai_29_06_05.crowdforces.near (https://t.me/nearaccbot?start=update_cGh1dGhhaV8yOV8wNl8wNS5jcm93ZGZvcmNlcy5uZWFy) 56.5 Ⓝ 04.05.24`;

const accounts = accountsData.trim().split('\n').map(line => {
  const parts = line.split(' ');
  const id = parts[1];
  const url = parts[2].slice(1, -1); // видаляємо дужки
  const amount = parseFloat(parts[3]);
  const date = parts.slice(-2).join(' ');

  return { id, url, amount, date };
});

const connectionConfig = {
  networkId: "mainnet",
  nodeUrl: "https://rpc.mainnet.near.org",
  walletUrl: "https://wallet.near.org",
  helperUrl: "https://helper.mainnet.near.org",
  explorerUrl: "https://explorer.mainnet.near.org",
};

async function getAccountBalance(accountId) {
  try {
    const response = await axios.post('https://rpc.mainnet.near.org', {
      method: 'query',
      params: {
        request_type: 'view_account',
        finality: 'final',
        account_id: accountId,
      },
      id: 1,
      jsonrpc: '2.0'
    });
    
    return response.data.result;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
}

async function getAccountInfo(accountId) {
  try {
    const nearConnection = await connect(connectionConfig);
    const account = await nearConnection.account(accountId);

    const accountDetails = await account.getAccountDetails();
    console.log('Account Details:', JSON.stringify(accountDetails));

    const balanceData = await getAccountBalance(accountId);
    
    // Перетворення балансу з нанонір в ніри
    const balanceInNear = parseFloat(balanceData.amount) / 1e24;
    await fs.appendFile('/Users/Юрец/Desktop/Near/result.txt', JSON.stringify({ id: accountId, balanceInNear }, null, 2));

    console.log(`Account Balance for ${accountId}: ${balanceInNear} NEAR`);
  } catch (error) {
    console.error(`Error processing account ${accountId}:`, error);
  }
}

// Виконуємо запити для всіх акаунтів одночасно
async function processAccounts() {
  try {
    await Promise.all(accounts.map(account => getAccountInfo(account.id)));
  } catch (error) {
    console.error('Error processing accounts:', error);
  }
}

processAccounts();
