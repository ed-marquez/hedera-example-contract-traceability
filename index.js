console.clear();
import { Client, AccountId, PrivateKey, Hbar, ContractFunctionParameters } from "@hashgraph/sdk";

import dotenv from "dotenv";
dotenv.config();

import * as queries from "./utils/queries.js";
import * as contracts from "./utils/contractOperations.js";
import counterContract from "./contracts/Counter.json" assert { type: "json" };
import counterCallerContract from "./contracts/CounterCaller.json" assert { type: "json" };

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PVKEY);
const network = process.env.HEDERA_NETWORK;
const client = Client.forNetwork(network).setOperator(operatorId, operatorKey);
client.setDefaultMaxTransactionFee(new Hbar(1000));
client.setMaxQueryPayment(new Hbar(50));

async function main() {
	// STEP 1 ===================================
	console.log(`\nSTEP 1 ===================================\n`);
	console.log(`- Deploying contracts...\n`);

	// Deploy the called contract (counter)
	let gasLim = 8000000;
	const bytecode = counterContract.object;
	const params = [];
	const [calledContractId, calledContractAddress] = await contracts.deployContractFcn(bytecode, params, gasLim, client);
	console.log(`- Contract ID: ${calledContractId}`);
	console.log(`- Contract ID in Solidity address format: ${calledContractAddress}`);

	// Deploy the caller contract (counter caller)
	const bytecode1 = counterCallerContract.object;
	const params1 = new ContractFunctionParameters().addAddress(calledContractAddress);
	const [callerContractId, callerContractAddress] = await contracts.deployContractFcn(bytecode1, params1, gasLim, client);
	console.log(`- Contract ID: ${callerContractId}`);
	console.log(`- Contract ID in Solidity address format: ${callerContractAddress}`);

	// STEP 2 ===================================
	console.log(`\nSTEP 2 ===================================\n`);
	console.log(`- Executing the caller contract...\n`);

	// Execute the contract
	const contractExecuteRec = await contracts.executeContractFcn(callerContractId, "counterIncrement", gasLim, client);
	console.log(`- Contract execution: ${contractExecuteRec.receipt.status} \n`);

	// Check a Mirror Node Explorer
	const [randNumInfo, randNumExpUrl] = await queries.mirrorTxQueryFcn(contractExecuteRec, network);
	console.log(`\n- See details in mirror node explorer: \n${randNumExpUrl}`);

	console.log(`
====================================================
🎉🎉 THE END - NOW JOIN: https://hedera.com/discord
====================================================\n`);
}
main();
