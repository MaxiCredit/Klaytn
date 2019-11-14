const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');
const contract = require('./setContract_mn');
const tx = require('./contract_tx_feedelegate');

exports.newOffer = function(_loanAmount, _loanType, _loanLength, _periodNumber, _interestRate, _minCreditScore, _lastTo, _privateKey, _abi, callback) {
	const con = contract.setContract('0x2593979b76df2d2f8de2bf62f199bcb530755e3e', _abi);
	const contractFunction = con.methods.createCreditOffer(_loanAmount, _loanType, _loanLength, _periodNumber, _interestRate, _minCreditScore, _lastTo);

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

/*
string memory _firstName,
        //string _lastName,
        uint _birthDate,
        string memory _mothersFirstName,
        //string _mothersLastName,
        uint _idDocumentNumber,
        uint _personalID,
        string memory _country,
        string memory _city,
        string memory _residentalAddress,
        string memory _emailAddress,
        uint _phoneNumber);
console.log(con);*/




