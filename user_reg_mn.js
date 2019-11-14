const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');
const contract = require('./setContract_mn');
const tx = require('./contract_tx_feedelegate');
const rand = require('random-int');

exports.userReg = function(_name, _birthDate, _mothersName, _idDocumentNumber, _country, _city, _residentalAddress, _emailAddress, _phoneNumber, _privateKey, _abi, callback) {
	let personalID = rand(100000000);
	const con = contract.setContract('0x4d47a80e4bD1b262fD18E11D66E8927a52E69945', _abi);
	const contractFunction = con.methods.registerUser(_name, _birthDate, _mothersName, _idDocumentNumber, personalID, _country, _city, _residentalAddress, _emailAddress, _phoneNumber);

	tx.sendTX('0x4d47a80e4bD1b262fD18E11D66E8927a52E69945', _privateKey, contractFunction, (err, res) => {
		if(!err) {
			console.log("RES1: " + res);
			callback(null, res);
		} else {
			console.log("ERR1: " + err);
			callback(err, null);
		}
	});
};


