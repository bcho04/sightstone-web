const request = require('request');

class FEBE {
    static get(server, username, options = {}){
        return new Promise((resolve, reject) => {
            let uri = "http://127.0.0.1:8080/summoner/get/?";
            uri += "server=" + server + "&";
            uri += "username=" + username;
            request.get(uri, (err, response, body) => {
                if(err) return reject(err);
                body = JSON.parse(body);
                if(Math.floor(body.requestInfo.statusCode/100) == 4) return reject(body.requestInfo.statusCode);
                if(Math.floor(body.requestInfo.statusCode/100) == 5) return reject(body.requestInfo.statusCode);
                return resolve(body);
            });
        });
    }
}

module.exports = FEBE;
