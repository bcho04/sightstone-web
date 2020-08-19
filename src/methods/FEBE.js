import request from "request";

class FEBE {
    static request(options){
        return new Promise((resolve, reject) => {
            if(options.type === null || options.type === undefined) reject();

            let uri = `http://localhost:8080/${options.type}?`; // rubidium-api.herokuapp.com
            uri += typeof options.server != 'undefined' ? `server=${options.server}` : '';
            uri += typeof options.username != 'undefined' ? `&username=${options.username}` : '';

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