import request from "request";

class FEBE {
    static request(options){
        return new Promise((resolve, reject) => {
            options.type = options.type == null ? "mastery/ranking" : options.type;

            let uri = `https://rubidium-api.herokuapp.com/${options.type}?server=${options.server}&username=${options.username}`;

            request.get(uri, (err, response, body) => {
                if(err) return reject(err);
                if(Math.floor(response.statusCode/100) == 4) return reject(response.statusCode);
                if(Math.floor(response.statusCode/100) == 5) return reject(response.statusCode);
                return resolve(body);
            });
        });
    }
}

export default FEBE;