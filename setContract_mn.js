const Caver = require('caver-js');
const caver = new Caver('https://api.cypress.klaytn.net:8651/');
const fs = require('fs');

exports.setContract = function (_contractAddress, _abi) {
	const con = new caver.klay.Contract(_abi, _contractAddress);
	return(con);
};






