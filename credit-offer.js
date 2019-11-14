const createOffer = require('./create_offer_mn');
const approve = require('./mx_approve_mn');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const creditAbiJson = fs.readFileSync('TestCreditAbi.json');
const creditAbi = JSON.parse(creditAbiJson);

const mxAbiJson = fs.readFileSync('MXAbi.json');
const mxAbi = JSON.parse(mxAbiJson);

exports.newOffer = function(req, res) {
	var decoder = new StringDecoder('utf-8');
   	var buffer = '';
	var offerData;
	//var tokenAddress;
	//var contractAddress;
	var creditAmount;
	var creditType;
	var loanLength;
	var periods;
	var interestRate;
	var creditScore;
	var lastTo;
	var prKey;
	
	req.on('data', function(data) {
    	buffer += decoder.write(data);
    });
    req.on('end', function() {
      	buffer += decoder.end();
      	offerData = buffer.split('&');
		//console.log(offerData);
		creditAmount = offerData[2].slice(offerData[2].indexOf('=') + 1);
		creditType = offerData[3].slice(offerData[3].indexOf('=') + 1);
		loanLength = offerData[4].slice(offerData[4].indexOf('=') + 1);
		periods = offerData[5].slice(offerData[5].indexOf('=') + 1);
		interestRate = offerData[6].slice(offerData[6].indexOf('=') + 1);
		creditScore = offerData[7].slice(offerData[7].indexOf('=') + 1);
		lastTo = offerData[8].slice(offerData[8].indexOf('=') + 1);
		privateKey = offerData[9].slice(offerData[9].indexOf('=') + 1);
		res.write(creditAmount + " " + loanLength + " " + periods + " " + interestRate + " " + creditScore + " " + lastTo + " ");
		
		approve.approveMX('0x4Cf11FF20BCC43DFcafBcD0C17a53B98dFb27cEd', mxAbi, '0x2593979b76df2d2f8de2bf62f199bcb530755e3e', creditAmount, privateKey, (err, result) => {
			if(!err) {
				setTimeout(createCreditOffer, 5000);
			} else {
				res.end("\nERROR by approve: " + err);
			}
		});
		
	});

	function createCreditOffer() {
		createOffer.newOffer(creditAmount, creditType, loanLength, periods, interestRate, creditScore,  lastTo, privateKey, creditAbi, (err, result) => {
			if(!err) {
				res.end(result);
			} else {
				res.end("\nERROR by create credit offer: " + err);
			}
		});
	}
	//approve.approveMX(_contractAddress, _abi, _sender, _sum, _privateKey, callback);
	//_loanAmount, _loanType, _loanLength, _periodNumber, _interestRate, _minCreditScore, _lastTo, _privateKey, _abi, callback
};


