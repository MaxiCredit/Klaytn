const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');

exports.sendTX = function(_contractAddress, _privateKey, _contractFunction, callback) {
	
	caver.klay.accounts.wallet.clear();
	const account = caver.klay.accounts.wallet.add(_privateKey);
	const feePayer = caver.klay.accounts.wallet.add('...', '...'); //need private-key and address
	console.log(account.address);
	console.log(_contractAddress);
	const functionAbi = _contractFunction.encodeABI();

	caver.klay.accounts.signTransaction({
		//nonce
		type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
		from: account.address,
		to: _contractAddress,
		data: functionAbi,
		gas: '3000000',
		value: '0x00',
	}, account.privateKey, (err, res) => {
		if(!err) {
			console.log("rawTX: " + res);
			console.log("feePayer: " + feePayer.address);
			caver.klay.sendTransaction({
  				senderRawTransaction: res.rawTransaction,
  				feePayer: feePayer.address,
			}, (error, ret) => {
				if(!error) {
					console.log(ret);
					callback(null, ret);
				} else {
					console.log("ERROR at ret: " + error);
					callback(error, null);
				}
			}); //.on('receipt', (receipt) => { console.log(receipt); })
		} else {
			console.log("ERROR");
			callback(err, null);
		}		
	});
};
