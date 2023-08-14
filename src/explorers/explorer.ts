import {NetworkNames} from "../observers/infura";
import {getOrThrowEnv} from "../io/utils";

interface IExplorer {

}

interface IGetAbiResponse {
    status: string;
    message: string;
    result: string;
}

interface IExplorerConfig {
    apiKey: string;
    explorerUrl: string;
}


export class ExplorerFactory {
    private readonly _config: { [key: string]: IExplorerConfig } =
        {
            [NetworkNames.ETH_SEPOLIA]: {
                apiKey: getOrThrowEnv("ETH_SEPOLIA_API_KEY"),
                explorerUrl: "https://api-sepolia.etherscan.io",
            },
            [NetworkNames.ETH_MAINNET]: {
                apiKey: getOrThrowEnv("ETH_MAINNET_API_KEY"),
                explorerUrl: "https://api.etherscan.io",
            },
            [NetworkNames.OPTIMISM_MAINNET]: {
                apiKey: getOrThrowEnv("OPTIMISM_MAINNET_API_KEY"),
                explorerUrl: "https://api-optimistic.etherscan.io/",
            },
            [NetworkNames.OPTIMISM_GOERLI]: {
                apiKey: getOrThrowEnv("OPTIMISM_GOERLI_API_KEY"),
                explorerUrl: "https://api-goerli-optimistic.etherscan.io/",
            },
            [NetworkNames.ARBITRUM_GOERLI]: {
                apiKey: getOrThrowEnv("ARBITRUM_GOERLI_API_KEY"),
                explorerUrl: "https://api-goerli.arbiscan.io/",
            },
            [NetworkNames.POLYGON_MAINNET]: {
                apiKey: getOrThrowEnv("POLYGON_MAINNET_API_KEY"),
                explorerUrl: "https://api.polygonscan.com/",
            },
            [NetworkNames.POLYGON_MUMBAI]: {
                apiKey: getOrThrowEnv("POLYGON_MUMBAI_API_KEY"),
                explorerUrl: "https://api-testnet.polygonscan.com/",
            },
            [NetworkNames.AVAX_MAINNET]: {
                apiKey: getOrThrowEnv("AVAX_MAINNET_API_KEY"),
                explorerUrl: "https://api.snowtrace.io/",
            },
            [NetworkNames.AVAX_FUJI]: {
                apiKey: getOrThrowEnv("AVAX_FUJI_API_KEY"),
                explorerUrl: "https://api-testnet.snowtrace.io/",
            },
        }

    getExplorer(network: NetworkNames): Explorer {
        const config = this._config[network];
        if (!config) {
            throw new Error(`No explorer config found for network ${network}`);
        }
        return new Explorer(config.explorerUrl, config.apiKey);
    }
}


export class Explorer implements IExplorer {

    constructor(public url: string, private apiKey: string) {
    }

    async getContractAbi(contract: string) {
        const url = `${this.url}/api?module=contract&action=getabi&address=${contract}&apikey=${this.apiKey}`;
        const response = await this.getResponse(url) as IGetAbiResponse;

        if (response.status !== "1") {
            throw new Error(`Failed to get abi for contract ${contract} on url: ${url}. Message: ${response.message}, result: ${response.result}`);
        }

        return JSON.parse(response.result);
    }

    private async getResponse(url: string) {
        // @ts-ignore
        const response = await fetch(url);
        return await response.json();
    }

}
