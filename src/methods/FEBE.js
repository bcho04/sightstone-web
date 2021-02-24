import request from 'request';

class FEBE {
    static request(options) {
        return new Promise((resolve, reject) => {
            if (options.type === null || options.type === undefined) reject();

            let uri = process.env.API_URL;
            uri += `/${options.type}?`;
            uri += typeof options.server !== 'undefined' ? `server=${options.server}` : '';
            uri += typeof options.username !== 'undefined' ? `&username=${options.username}` : '';

            request.get(uri, (err, response, body) => {
                if (err) return reject(err);
                if (response.statusCode === 429) return resolve({ statusCode: 429, timeLeft: JSON.parse(body).timeLeft });
                if (Math.floor(response.statusCode / 100) === 4) return reject({ statusCode: response.statusCode });
                if (Math.floor(response.statusCode / 100) === 5) return reject({ statusCode: response.statusCode });
                return resolve(body);
            });
        });
    }
}

export default FEBE;
