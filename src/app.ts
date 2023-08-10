const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


(async () => {
    console.log("Hello World");
    await sleep(1000);
    console.log("Hello World 1");
})()
