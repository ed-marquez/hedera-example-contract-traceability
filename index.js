console.clear();
import { Client, AccountId, PrivateKey, Hbar, ContractFunctionParameters } from "@hashgraph/sdk";

import * as queries from "./utils/queries.js";
import * as contracts from "./utils/contractOperations.js";
import counterContract from "./contracts/Counter.json" assert { type: "json" };
import counterCallerContract from "./contracts/CounterCaller.json" assert { type: "json" };

import dotenv from "dotenv";
dotenv.config();

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

	let idx = 0;
	const runs = 3;
	const incrementRec = [];
	for (idx; idx < runs; idx++) {
		// Execute the caller contract
		incrementRec[idx] = await contracts.executeContractFcn(callerContractId, "counterIncrement", gasLim, client);
		console.log(`- Contract execution: ${incrementRec[idx].receipt.status} \n`);
	}

	// Check a Mirror Node Explorer for the last contract execution
	const [incrementInfo, incrementExpUrl] = await queries.mirrorTxQueryFcn(incrementRec[runs - 1], network);
	console.log(`- See details in mirror node explorer: \n${incrementExpUrl}`);

	console.log(`
====================================================
🎉🎉 THE END - NOW JOIN: https://hedera.com/discord
====================================================\n`);
}
main();
