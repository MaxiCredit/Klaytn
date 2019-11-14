const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');
const contract = require('./setContract_mn');
const tx = require('./contract_tx_feedelegate');

exports.acceptOffer = function(_offerId, _amount, _privateKey, _abi, callback) {
	const con = contract.setContract('0x2593979b76df2d2f8de2bf62f199bcb530755e3e', _abi);
	const contractFunction = con.methods.acceptCreditOffer(_offerId, _amount);

	tx.sendTX('0x2593979b76df2d2f8de2bf62f199bcb530755e3e', _privateKey, contractFunction, (err, res) => {
		if(!err) {
			console.log("RES1: " + res);
			callback(null, res);
		} else {
			console.log("ERR1: " + err);
			callback(err, null);
		}
	});
};
