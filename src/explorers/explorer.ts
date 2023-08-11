interface IExplorer {

}

interface IGetAbiResponse {
    status: string;
    message: string;
    result: string;
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
