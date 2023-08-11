import {ethers} from 'ethers';
import {getOrThrowEnv} from "../io/utils";
import * as console from "console";
import {saveToMongoDb} from "../mongodb";

interface INetwork {
    chainSelector: string;
    router: IContract;
    onRamp: IContract;
}

export interface IContract {
    address: string;
    abi: any;
    events: string[];
}

interface IProvider {
    jsonRpcProver: ethers.JsonRpcProvider;
    websocketProvider: ethers.WebSocketProvider;
}

interface IProviderSettings {
    httpsUrl: string;
    websocketUrl: string;
}


export const getProviderForNetwork = (network: NetworkNames): IProvider => {
    const providerSettings = getProviderSettings(network);
    const jsonRpcProver = new ethers.JsonRpcProvider(providerSettings.httpsUrl);
    const websocketProvider = new ethers.WebSocketProvider(providerSettings.websocketUrl);
    return {jsonRpcProver, websocketProvider};
}


export enum NetworkNames {
    ETH_MAINNET = "ETH_MAINNET",
    ETH_SEPOLIA = "ETH_SEPOLIA",
    OPTIMISM_MAINNET = "OPTIMISM_MAINNET",
    OPTIMISM_GOERLI = "OPTIMISM_GOERLI",
    ARBITRUM_GOERLI = "ARBITRUM_GOERLI",
    POLYGON_MAINNET = "POLYGON_MAINNET",
    POLYGON_MUMBAI = "POLYGON_MUMBAI",
    AVAX_MAINNET = "AVAX_MAINNET",
    AVAX_FUJI = "AVAX_FUJI",
}


const getProviderSettings = (network: NetworkNames): IProviderSettings => {
    const map: { [key in keyof typeof NetworkNames]: IProviderSettings } = {
        [NetworkNames.ETH_MAINNET]: {
            httpsUrl: getOrThrowEnv('ETH_MAINNET_HTTPS'),
            websocketUrl: getOrThrowEnv('ETH_MAINNET_WS')
        },
        [NetworkNames.ETH_SEPOLIA]: {
            httpsUrl: getOrThrowEnv('ETH_SEPOLIA_HTTPS'),
            websocketUrl: getOrThrowEnv('ETH_SEPOLIA_WS'),
        },
        [NetworkNames.ARBITRUM_GOERLI]: {
            httpsUrl: getOrThrowEnv('ARBITRUM_GOERLI_HTTPS'),
            websocketUrl: getOrThrowEnv('ARBITRUM_GOERLI_WS'),
        },
        [NetworkNames.OPTIMISM_GOERLI]: {
            httpsUrl: getOrThrowEnv('OPTIMISM_GOERLI_HTTPS'),
            websocketUrl: getOrThrowEnv('OPTIMISM_GOERLI_WS'),
        },
        [NetworkNames.OPTIMISM_MAINNET]: {
            httpsUrl: getOrThrowEnv('OPTIMISM_MAINNET_HTTPS'),
            websocketUrl: getOrThrowEnv('OPTIMISM_MAINNET_WS'),
        },
        [NetworkNames.POLYGON_MAINNET]: {
            httpsUrl: getOrThrowEnv('POLYGON_MAINNET_HTTPS'),
            websocketUrl: getOrThrowEnv('POLYGON_MAINNET_WS'),
        },
        [NetworkNames.POLYGON_MUMBAI]: {
            httpsUrl: getOrThrowEnv('POLYGON_MUMBAI_HTTPS'),
            websocketUrl: getOrThrowEnv('POLYGON_MUMBAI_WS'),
        },
        [NetworkNames.AVAX_MAINNET]: {
            httpsUrl: getOrThrowEnv('AVAX_MAINNET_HTTPS'),
            websocketUrl: getOrThrowEnv('AVAX_MAINNET_WS'),
        },
        [NetworkNames.AVAX_FUJI]: {
            httpsUrl: getOrThrowEnv('AVAX_FUJI_HTTPS'),
            websocketUrl: getOrThrowEnv('AVAX_FUJI_WS'),
        },
    }

    return map[network];
}


export interface ILane {
    source: NetworkNames;
    destination: NetworkNames;
    address: string;
    abi: any;
    events: string[];
}


export const createProvider = (network: NetworkNames, lanes: ILane[]) => {

    const url = getProviderSettings(network).websocketUrl;
    const provider = new ethers.WebSocketProvider(url);

    for (const lane of lanes) {
        console.log(`Listening to events for lane ${lane.source} -> ${lane.destination}`);
        listenToEvents(lane, provider);
    }
}

interface EVM2EVMMessage {
    sourceChainSelector: string;
    sequenceNumber: string;
    feeTokenAmount: string;
    sender: string;
    nonce: string;
    gasLimit: string;
    strict: boolean;
    receiver: string;
    data: string;
    tokenAmounts: string[];
    feeToken: string;
    messageId: string;
}

const EVM2EVMMessageFactory = (data: any): EVM2EVMMessage => {
    return {
        sourceChainSelector: data[0].toString(),
        sequenceNumber: data[1].toString(),
        feeTokenAmount: data[2].toString(),
        sender: data[3].toString(),
        nonce: data[4].toString(),
        gasLimit: data[5].toString(),
        strict: data[6],
        receiver: data[7].toString(),
        data: data[8].toString(),
        tokenAmounts: data[9],
        feeToken: data[10].toString(),
        messageId: data[11].toString(),
    }
}


interface IEvent {
    eventName: string;
    message: EVM2EVMMessage;
    timestamp: number;
    senderChain: NetworkNames;
    destinationChain: NetworkNames;
}

const createEvent = (message: EVM2EVMMessage, lane: ILane, eventName: string): IEvent => {
    return {
        eventName,
        message,
        timestamp: Date.now() / 1000,
        senderChain: lane.source,
        destinationChain: lane.destination
    }
}

const listenToEvents = (con: ILane, provider: any) => {

    const res = process.env['ETH_MAINNET_HTTPS'];

    const address = con.address;
    const abi = con.abi;

    const contract = new ethers.Contract(address, abi, provider);

    for (const eventName of con.events) {
        console.log(`Listening to event ${eventName}, on contract ${address}, network ${con.source}`);
        contract.on(eventName, async (data: EVM2EVMMessage) => {
            try {
                const message = EVM2EVMMessageFactory(data);
                const event = createEvent(message, con, eventName);
                await saveToMongoDb(event);
                console.log(`Saved file for event ${eventName}, timestamp: ${Date.now().toString()}`);
            } catch (e) {
                console.log(`Error saving file for event ${eventName}, error: ${e}, JSON: ${JSON.stringify(data)}`);
            }
        });
    }
}
