var user = require('./user_reg_mn');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

exports.registerNewUser = function(req, res) {
	var decoder = new StringDecoder('utf-8');
   	var buffer = '';
	var regData;
	var name;
	var birth;
	var mother;
	var id;
	var country;
	var city;
	var address;
	var email;
	var phone;
	var privateKey;
	var callback;
	const abiJson = fs.readFileSync('TestUsersAbi.json');
	const abi = JSON.parse(abiJson);

    req.on('data', function(data) {
    	buffer += decoder.write(data);
    });
    req.on('end', function() {
      	buffer += decoder.end();
      	regData = buffer.split('&');
		console.log(regData);
		name = regData[0].slice(regData[0].indexOf('=') + 1);
		birth = regData[1].slice(regData[1].indexOf('=') + 1);
		mother = regData[2].slice(regData[2].indexOf('=') + 1);
		id = regData[3].slice(regData[3].indexOf('=') + 1);
		country = regData[4].slice(regData[4].indexOf('=') + 1);
		city = regData[5].slice(regData[5].indexOf('=') + 1);
		address = regData[6].slice(regData[6].indexOf('=') + 1);
		email = regData[7].slice(regData[7].indexOf('=') + 1);
		phone = regData[8].slice(regData[8].indexOf('=') + 1);
		privateKey = regData[9].slice(regData[9].indexOf('=') + 1);
		console.log(name + " " + birth + " " + mother);

		user.userReg(name, birth, mother, id, country, city, address, email, phone, privateKey, abi, (err, res) => {
			if(!err) {
				console.log("RES2: " + res);
				callback = res;
			} else {
				console.log("ERR2: " + err);
				callback = err;
			}
		});
		res.end("Result: " + callback);
	});
};


