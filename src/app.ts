import {getAbiFromMongoDb, getEventsFromMongoDb, getEventWithMessageIdFromMongoDb, saveAbiToMongoDb} from "./mongodb";
import express from 'express'

require('dotenv')
  .config()

import {createProvider, getProviderForNetwork, ILane, NetworkNames} from "./observers/infura";
import {Explorer, ExplorerFactory} from "./explorers/explorer";
import {getOrThrowEnv, listDirs, readFromFile, saveToFile} from "./io/utils";
import {ethers} from "ethers";
import * as console from "console";
import * as process from "process";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
  }

  public async saveAbi(network: NetworkNames, address: string, contractName: string, abi: any): Promise<void> {
    await saveToFile(this.getAbiPath(network, address, contractName), abi);
  }

  public async getAbi(network: NetworkNames, address: string, contractName: string): Promise<any> {
    return await readFromFile(this.getAbiPath(network, address, contractName));
  }

  public async getLanesForNetwork(network: NetworkNames): Promise<ILane[]> {
    const dirs = listDirs(`/addresses/${network}`);
    const onRamps = dirs.filter(dir => dir.startsWith("onRamp-"));
    const createLane = async (dir: string) => {
      const source = network;
      const destination = dir.split("-")[1];
      const address = dir.split("-")[2];
      const abi = await this.getAbi(source, address, `onRamp-${destination}`);
      return {
        source,
        destination,
        address,
        abi,
        events: ['CCIPSendRequested']
      } as ILane;
    }

    return await Promise.all(onRamps.map(createLane));
  }

  private getAbiPath(network: NetworkNames, address: string, contractName: string): string {
    return `/addresses/${network}/${contractName}-${address}/abi.json`;
  }
}

const getAbi = async (address: string, explorer: Explorer) => {
  const abi = await explorer.getContractAbi(address);
  return JSON.stringify(abi);
}

interface Config {
  address: string;
  chainSelector: string;
  isTestNet: boolean;
  network: NetworkNames,
  isEnable: boolean;
}

async function init(configs: Config[]) {
  const fileService = new FileService();

  for (const {network, address, isTestNet} of configs) {
    const explorer = new ExplorerFactory().getExplorer(network);
    const abi = await getAbi(address, explorer);
    await fileService.saveAbi(network, address, "router", abi)

    const {jsonRpcProver} = getProviderForNetwork(network)
    const contract = new ethers.Contract(address, abi, jsonRpcProver);

    const chainSelectors = configs
      .filter(config => config.network !== network)
      .filter(config => config.isTestNet === isTestNet)
      .map(url => url.chainSelector);

    for (const chainSelector of chainSelectors) {
      const destNetwork = configs.find(config => config.chainSelector === chainSelector)?.network;
      try {
        const result = await contract.getOnRamp(chainSelector) as string;
        if (result.startsWith("0x0000000000000000")) {
          console.log(`Lane ${network} -> ${destNetwork} is not configured`)
          continue;
        }
        await sleep(1000);
        const abi = await getAbi(result, explorer);
        await fileService.saveAbi(network, result, `onRamp-${destNetwork}`, abi)
        console.log(`Lane ${network} -> ${destNetwork}, address: ${result}`)
      } catch (error) {
        console.error("Error calling contract method:", error);
      }
    }
  }
}

interface CCIPMessage {
  source: string;
  destination: string;
  isTestNet: boolean;
  senderAddress: string;
  receiverAddress: string;
  data: string;
}


(async () => {


  const configs: Config[] = [
    {
      network: NetworkNames.ETH_SEPOLIA,
      address: "0xD0daae2231E9CB96b94C8512223533293C3693Bf",
      chainSelector: "16015286601757825753",
      isTestNet: true,
      isEnable: true,
    },
    {
      network: NetworkNames.ETH_MAINNET,
      address: "0xE561d5E02207fb5eB32cca20a699E0d8919a1476",
      chainSelector: "5009297550715157269",
      isTestNet: false,
      isEnable: true,
    },
    {
      network: NetworkNames.OPTIMISM_MAINNET,
      address: "0x261c05167db67B2b619f9d312e0753f3721ad6E8",
      chainSelector: "3734403246176062136",
      isTestNet: false,
      isEnable: true,
    },
    {
      network: NetworkNames.OPTIMISM_GOERLI,
      address: "0xEB52E9Ae4A9Fb37172978642d4C141ef53876f26",
      chainSelector: "2664363617261496610",
      isTestNet: true,
      isEnable: true,

    },
    {
      network: NetworkNames.ARBITRUM_GOERLI,
      address: "0x88E492127709447A5ABEFdaB8788a15B4567589E",
      chainSelector: "6101244977088475029",
      isTestNet: true,
      isEnable: true,
    },
    {
      network: NetworkNames.POLYGON_MAINNET,
      address: "0x3C3D92629A02a8D95D5CB9650fe49C3544f69B43",
      chainSelector: "4051577828743386545",
      isTestNet: false,
      isEnable: true,

    },
    {
      network: NetworkNames.POLYGON_MUMBAI,
      address: "0x70499c328e1E2a3c41108bd3730F6670a44595D1",
      chainSelector: "12532609583862916517",
      isTestNet: true,
      isEnable: true,
    },
    {
      network: NetworkNames.AVAX_MAINNET,
      address: "0x27F39D0af3303703750D4001fCc1844c6491563c",
      chainSelector: "6433500567565415381",
      isTestNet: false,
      isEnable: false,
    },
    {
      network: NetworkNames.AVAX_FUJI,
      address: "0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8",
      chainSelector: "14767482510784806043",
      isTestNet: true,
      isEnable: true,
    }
  ]
  const enableConfigs = configs.filter(value => value.isEnable);

  if (process.env.INIT) {
    await init(enableConfigs);
  }

  const events = await getEventsFromMongoDb(new Date("2021-10-01T00:00:00.000Z").getTime() / 1000);

  const convertEvent = (event: any) => {
    const ccipMessage: CCIPMessage = {
      source: event.senderChain,
      destination: event.destinationChain,
      isTestNet: !event.senderChain.endsWith('MAINNET'),
      senderAddress: event.message.sender,
      receiverAddress: event.message.receiver,
      data: event.message.data,
    }
    return ccipMessage;
  }

  const processEvent = async (convertedEvent: CCIPMessage, type: 'sender' | 'receiver') => {
    const explorerType = type === 'sender' ? convertedEvent.source : convertedEvent.destination;
    const address = type === 'sender' ? convertedEvent.senderAddress : convertedEvent.receiverAddress;
    const chainName = type === 'sender' ? 'source' : 'destination';

    const explorer = new ExplorerFactory().getExplorer(explorerType as NetworkNames);
    const contract = await getAbiFromMongoDb(explorerType, address);
    if (!contract) {
      let abi;
      try {
        abi = await explorer.getContractAbi(address);
      } catch (e) {
        console.log(`${type.charAt(0)
                           .toUpperCase() + type.slice(1)} address ${address} not found on ${convertedEvent[chainName]}`);
      } finally {
        await saveAbiToMongoDb(explorerType, address, abi, true);
      }
    }
  };

  const processAllEvents = async (events: any) => {
    const ccipMessages = [];
    for (const event of events) {
      const convertedEvent = convertEvent(event);

      await processEvent(convertedEvent, 'sender');
      await processEvent(convertedEvent, 'receiver');
      await sleep(300);

      ccipMessages.push(convertedEvent);
    }
    return ccipMessages;
  };

  // const ccipMessages = await processAllEvents(events);
  //
  // console.log(`Total events: ${ccipMessages.length}`);

  return
  const fileService = new FileService();

  for (const {network} of enableConfigs) {
    const lanes = await fileService.getLanesForNetwork(network as NetworkNames);
    console.log(`Lanes for ${network}: ${lanes.map(value => value.destination)
                                              .join(", ")}`);
    await sleep(300);
    createProvider(network as NetworkNames, lanes);
  }
  //22:18:00 last event on ccip.chain.link

  // while (true) {
  //     await sleep(500);
  // }
})();

