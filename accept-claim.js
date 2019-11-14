const acceptCurrentClaim = require('./accept-credit-claim-mn');
const approve = require('./mx_approve_mn');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const creditAbiJson = fs.readFileSync('TestCreditAbi.json');
const creditAbi = JSON.parse(creditAbiJson);

const mxAbiJson = fs.readFileSync('MXAbi.json');
const mxAbi = JSON.parse(mxAbiJson);

exports.acceptCreditOffer = function(req, res) {
	var decoder = new StringDecoder('utf-8');
   	var buffer = '';
	var offerData;
	//var tokenAddress;
	//var contractAddress;
	//var payback;
	var creditAmount;
	var creditId;
	var privateKey;
	
	req.on('data', function(data) {
    	buffer += decoder.write(data);
    });
    req.on('end', function() {
      	buffer += decoder.end();
      	offerData = buffer.split('&');
		
		//payback = offerData[0].slice(offerData[0].indexOf('=') + 1);
		creditId = offerData[0].slice(offerData[0].indexOf('=') + 1);
		creditAmount = offerData[1].slice(offerData[1].indexOf('=') + 1);
		privateKey = offerData[2].slice(offerData[2].indexOf('=') + 1);
		res.write(creditAmount + " " + creditId + " " + payback + " ");
		
		approve.approveMX('0x4Cf11FF20BCC43DFcafBcD0C17a53B98dFb27cEd', mxAbi, '0x2593979b76df2d2f8de2bf62f199bcb530755e3e', creditAmount, privateKey, (err, result) => {
			if(!err) {
				setTimeout(accept, 5000);
			} else {
				res.end("\nERROR by approve: " + err);
			}
		});
		
	});

	function accept() {
		acceptCurrentClaim.acceptClaim(creditId, creditAmount, privateKey, creditAbi, (err, result) => {
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


