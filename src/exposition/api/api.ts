import express, { Express } from "express";
import Logger from "../../helpers/logger.helper";
import { BaseContract, ContractTransactionReceipt, ContractTransactionResponse, Transaction, TransactionRequest } from 'ethers';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let logger: Logger;
let config: any;
let contract: BaseContract;

app.post("/storage/retrieve", async (req, res) => {
  logger.info("POST /storage/retrieve");
  logger.debug(
    `POST /storage/retrieve ${JSON.stringify(req.headers)} ${JSON.stringify(
      req.query
    )} ${JSON.stringify(req.body)}`
  );

  try {
    let result = await contract.getFunction('retrieve')();
    res.status(200).send(result.toObject());
  } catch (err: any) {
    logger.error(err);
    res.status(500).send('An error occurred.');
  }
});

app.post("/storage/store", async (req, res) => {
  logger.info("POST /storage/store");
  logger.debug(
    `POST /storage/store ${JSON.stringify(req.headers)} ${JSON.stringify(
      req.query
    )} ${JSON.stringify(req.body)}`
  );

  try {
    let executeTransaction: ContractTransactionResponse = await contract.getFunction('store')(req.body);
    let receipt: ContractTransactionReceipt | null;
    if (executeTransaction.wait) {
      logger.info('Waiting for confirmations');
      receipt = await executeTransaction.wait();
      logger.debug(`Tx result: ${JSON.stringify(executeTransaction)}`);
      logger.debug(`Tx result: ${JSON.stringify(receipt)}`);
      res.status(200).send(JSON.stringify(receipt));
    } else {
      res.status(201).send(JSON.stringify(executeTransaction));
    }
  } catch (err: any) {
    logger.error(err);
    res.status(500).send('An error occurred.');
  }
});

/**
 * Initialize de application
 */
export default async function startApi(_config: any, _loggger: Logger, _contract:BaseContract) {
  logger = _loggger;
  config = _config;
  contract = _contract

  logger.info("STARTING API");
  const appPort = config.PORT || "3000";
  app.listen(appPort);
  logger.info(`Express server running on port ${appPort}...`);
}