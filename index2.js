console.clear();
import { Client, AccountId, PrivateKey, Hbar, ContractFunctionParameters } from "@hashgraph/sdk";

import dotenv from "dotenv";
dotenv.config();

import * as queries from "./utils/queries.js";
import * as contracts from "./utils/contractOperations.js";
import accountCreateFcn from "./utils/accountCreate.js";
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
	// console.log(`\nSTEP 1 ===================================\n`);
	// console.log(`- Creating accounts...\n`);

	// const opKey = PrivateKey.generateED25519();
	// const trKey = PrivateKey.generateED25519();
	// const initBal = new Hbar(2500);

	// const [opSt, opAccId] = await accountCreateFcn(opKey, initBal, client);
	// const [trSt, trAccId] = await accountCreateFcn(trKey, initBal, client);

	// console.log(`- Op account: \n- ${opSt} \n- ID: ${opAccId} \n- Key: ${opKey}`);
	// console.log(`\n`);
	// console.log(`- Tr account: \n- ${trSt} \n- ID: ${trAccId} \n- Key: ${trKey}`);

	const contractId = AccountId.fromString("0.0.2505");
	console.log(`${contractId.toSolidityAddress()}`);

	const contractId2 = AccountId.fromString("0.0.2505");
	console.log(`${contractId2.toSolidityAddress()}`);

	console.log(`
====================================================
🎉🎉 THE END - NOW JOIN: https://hedera.com/discord
====================================================\n`);
}
main();
