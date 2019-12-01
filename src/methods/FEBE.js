import request from "request";

class FEBE {
    static request(options){
        return new Promise((resolve, reject) => {
            options.type = options.type == null ? "get" : options.type;

            let uri = "https://rubidium-api.herokuapp.com/v1/summoner/" + options.type + "?";
            uri += "server=" + options.server + "&";
            uri += "username=" + options.username;

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

export default FEBE;