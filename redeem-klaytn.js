var fs = require("fs");
var tx = require("./contract_tx_feedelegate");
var Caver = require('caver-js');
var caver = new Caver('https://api.cypress.klaytn.net:8651/');


var loanCounter;
var loanID = 1;
var round = 0;

var account;
var privateKey = '...'; 

var creditContractAddress = "0x2593979b76df2d2f8de2bf62f199bcb530755e3e";
var creditRawAbi = fs.readFileSync('TestCreditAbi.json');
var creditAbi = JSON.parse(creditRawAbi);
//console.log(creditAbi);
var creditFrame = new caver.klay.Contract(creditAbi, creditContractAddress);

var debtAddress = new Array();
var debtRawAbi = fs.readFileSync("TestCreditContractAbiNode.json");
var debtAbi = JSON.parse(debtRawAbi);
//console.log(debtAbi);

start();
function justASec() {
	getLoans(loanID); 
}

function start() {
	console.log("ROUND: " + round);
	caver.klay.accounts.wallet.clear();
	account = caver.klay.accounts.wallet.add(privateKey);
	creditFrame.methods.creditCounter().call().then((result) => {
			console.log("creditCounter: " + result + " type: " + typeof(result));
			loanCounter = result;
			getLoans(loanID); 
	});
}

function getLoans(id) {
	creditFrame.methods.Credits(id).call((err, res) => {	
		if(!err) {
			//console.log("CREDIT ADDRESS: " + res);
		} else {
			console.log("ERROR at get credit address: " + err);
		}

		debtAddress[id] = res;
		var debt = new caver.klay.Contract(debtAbi, debtAddress[id]);
		debt.methods.periods().call((err, res) => {

			if(!err) {
				//console.log("PERIODS: " + res);
				var expiredLoan = false;
				var expiredRedeem = false;
				var periodNumber = parseInt(res);
			} else {
				console.log("ERROR at get periods: " + err);
			}

			debt.methods.lastReedem().call((err, res) => {
				if(!err) {
					var lastReedemId = parseInt(res);
					if(lastReedemId < periodNumber) {
						console.log("credit address: " + debtAddress[id] + " id: " + id);
						console.log("last redeem: " + lastReedemId + " periods: " + periodNumber);
						debt.methods.loanExpiration(lastReedemId + 1).call((err, res) => {
							if(!err) {
								//console.log("LOAN EXPIRATION: " + res);
								var date = new Date();
								var now = Math.floor(date.getTime() / 1000);
								if(now > res) {
									expiredRedeem = true;
								}
								console.log("Redeem expiration: " + res + " now: " + now + " expired: " + expiredRedeem);

								debt.methods.toPayBack().call((err, res) => {
									if(!err) {
										if(res > 0) {
											console.log("toPayBack: " + res);

											if(expiredRedeem == true) {
												setToRedeemed(id);
												//console.log("SHOULD PAY IT");
											}
										} else {
											console.log("PAID Redeem");
										}
										loanID++;
										if(loanID < loanCounter) {
											setTimeout(justASec, 3000);
										} else {
											loanID = 1;
											round++;
											setTimeout(start, 60000);
										}
									} else {
										console.log("ERROR at get to payback: " + err);
									}
								});
							} else {
								console.log("ERROR at get loan expiration: " + err);
							}
						});
					} else {
						console.log("Last redeem already paid! " + debtAddress[id] + " id: " + id);
						expiredLoan = true;
						loanID++;
						if(loanID < loanCounter) {
							setTimeout(justASec, 3000);
						} else {
							loanID = 1;
							round++;
							setTimeout(start, 60000);
						}
					}
				} else {
					console.log("ERROR at get last redeem: " + err);
				}
			});
		});
	});
}

function setToRedeemed(id) {
	const contractFunction = creditFrame.methods.redeem(id);

	tx.sendTX(creditContractAddress, privateKey, contractFunction, (err, res) => {
		if(!err) {
			console.log(res);
		} else {
			console.log("Redeem ERROR: " + err);
		}
	});
}
