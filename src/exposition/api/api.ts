import express, { Express } from "express";
import Logger from "../../helpers/logger.helper";
import {
  ContractTransactionReceipt,
  ContractTransactionResponse,
} from "ethers";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let logger: Logger;
let config: any;
let contracts: any;

app.get("/:contractName/retrieve", async (req, res) => {
  logger.info(`GET /${req.params.contractName}/retrieve`);
  logger.debug(
    `GET /${req.params.contractName}/retrieve ${JSON.stringify(req.headers)} ${JSON.stringify(
      req.query
    )} ${JSON.stringify(req.body)}`
  );

  try {
    const contract = contracts[req.params.contractName];

    if (!contract) {
      res
        .status(400)
        .send(`Contract '${req.params.contractName}' could not be found.`);
    }

    let result = await contract.getFunction("retrieve")();

    if (result.toObject instanceof Function) {
      result = result.toObject();
    }

    res.status(200).send(result);
  } catch (err: any) {
    logger.error(err);
    res.status(500).send("An error occurred.");
  }
});

app.post("/:contractName/store", async (req, res) => {
  logger.info(`POST /${req.params.contractName}/store`);
  logger.debug(
    `POST /${req.params.contractName}/store ${JSON.stringify(req.headers)} ${JSON.stringify(
      req.query
    )} ${JSON.stringify(req.body)}`
  );

  try {
    const contract = contracts[req.params.contractName];

    if (!contract) {
      res
        .status(400)
        .send(`Contract '${req.params.contractName}' could not be found.`);
    }

    let executeTransaction: ContractTransactionResponse =
      await contract.getFunction("store")(...req.body.args);

    let receipt: ContractTransactionReceipt | null;
    if (executeTransaction.wait) {
      logger.info("Waiting for confirmations");
      receipt = await executeTransaction.wait();
      logger.debug(`Tx result: ${JSON.stringify(executeTransaction)}`);
      logger.debug(`Tx result: ${JSON.stringify(receipt)}`);
      res.status(200).send(receipt);
    } else {
      res.status(201).send(executeTransaction);
    }
  } catch (err: any) {
    logger.error(err);
    res.status(500).send("An error occurred.");
  }
});

/**
 * Initialize de application
 */
export default async function startApi(
  _config: any,
  _loggger: Logger,
  _contracts: any
) {
  logger = _loggger;
  config = _config;
  contracts = _contracts;

  logger.info("STARTING API");
  const appPort = config.PORT || "3000";
  app.listen(appPort);
  logger.info(`Express server running on port ${appPort}...`);
}
