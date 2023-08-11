## TODO

Currently listen for events on the onramp on eth_sopilia witha websocket

Change websocket to a http request

https://github.com/code-423n4/2023-05-chainlink


https://github.com/code-423n4/2023-05-chainlink/blob/f7a6de4a5292478dbf5b0750a931f8fd957916e8/contracts/onRamp/EVM2EVMOnRamp.sol#L295C5-L325C40

Internal.EVM2EVMMessage memory newMessage = Internal.EVM2EVMMessage({
sourceChainSelector: i_chainSelector,
sequenceNumber: ++s_sequenceNumber,
feeTokenAmount: feeTokenAmount,
sender: originalSender,
nonce: ++s_senderNonce[originalSender],
gasLimit: extraArgs.gasLimit,
strict: extraArgs.strict,
receiver: address(uint160(decodedReceiver)),
data: message.data,
tokenAmounts: message.tokenAmounts,
feeToken: message.feeToken,
messageId: ""
});
newMessage.messageId = Internal._hash(newMessage, i_metadataHash);

    // Lock the tokens as last step. TokenPools may not always be trusted.
    // There should be no state changes after external call to TokenPools.
    for (uint256 i = 0; i < message.tokenAmounts.length; ++i) {
      Client.EVMTokenAmount memory tokenAndAmount = message.tokenAmounts[i];
      getPoolBySourceToken(IERC20(tokenAndAmount.token)).lockOrBurn(
        originalSender,
        message.receiver,
        tokenAndAmount.amount,
        i_destChainSelector,
        bytes("") // any future extraArgs component would be added here
      );
    }

    // Emit message request
    emit CCIPSendRequested(newMessage);
