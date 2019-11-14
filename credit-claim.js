const createOffer = require('./create_claim_mn');
const approve = require('./mx_approve_mn');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const creditAbiJson = fs.readFileSync('TestCreditAbi.json');
const creditAbi = JSON.parse(creditAbiJson);

const mxAbiJson = fs.readFileSync('MXAbi.json');
const mxAbi = JSON.parse(mxAbiJson);

exports.newClaim = function(req, res) {
	var decoder = new StringDecoder('utf-8');
   	var buffer = '';
	var claimData;
	//var tokenAddress;
	//var contractAddress;
	var toAllow;
	var creditAmount;
	var creditType;
	var loanLength;
	var periods;
	var interestRate;
	var lastTo;
	var prKey;
	
	req.on('data', function(data) {
    	buffer += decoder.write(data);
    });
    req.on('end', function() {
      	buffer += decoder.end();
      	claimData = buffer.split('&');
		//console.log(claimData);
		toAllow = claimData[1].slice(claimData[1].indexOf('=') + 1);
		creditAmount = claimData[3].slice(claimData[3].indexOf('=') + 1);
		creditType = claimData[4].slice(claimData[4].indexOf('=') + 1);
		loanLength = claimData[5].slice(claimData[5].indexOf('=') + 1);
		periods = claimData[6].slice(claimData[6].indexOf('=') + 1);
		interestRate = claimData[7].slice(claimData[7].indexOf('=') + 1);
		lastTo = claimData[8].slice(claimData[8].indexOf('=') + 1);
		privateKey = claimData[9].slice(claimData[9].indexOf('=') + 1);
		res.write(creditAmount + " " + loanLength + " " + periods + " " + interestRate + " " + lastTo + " ");
		
		approve.approveMX('0x4Cf11FF20BCC43DFcafBcD0C17a53B98dFb27cEd', mxAbi, '0x2593979b76df2d2f8de2bf62f199bcb530755e3e', toAllow, privateKey, (err, result) => {
			if(!err) {
				setTimeout(createCreditClaim, 5000);
			} else {
				res.end("\nERROR by approve: " + err);
			}
		});
		
	});

	function createCreditClaim() {
		createOffer.newClaim(creditAmount, creditType, loanLength, periods, interestRate, lastTo, privateKey, creditAbi, (err, result) => {
			if(!err) {
				res.end(result);
			} else {
				res.end("\nERROR by create credit claim: " + err);
			}
		});
	}
	//approve.approveMX(_contractAddress, _abi, _sender, _sum, _privateKey, callback);
	//_loanAmount, _loanType, _loanLength, _periodNumber, _interestRate, _minCreditScore, _lastTo, _privateKey, _abi, callback
};


