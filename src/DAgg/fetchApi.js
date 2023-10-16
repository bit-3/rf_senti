
//import libs
import ax from "axios";
import EventEmitter from "events";
import _ from 'lodash';

const ev = new EventEmitter();

// init the eventEmitter object


// collect a 200 object through pagination from one source with one method of config
export async function collect(tableObjectReq, cb, mode) {
    // all  : get all the pages of news total : 200
    //
    const buffer = [];
    try {
        const response = await ax.get(`${tableObjectReq.base}${tableObjectReq.apiMode}`, {
            params: {
                auth_token: tableObjectReq.apiKey,
                public: "true",
                filter: tableObjectReq.filter,
                kind: tableObjectReq.kind,
            },
        });

        buffer.push(response.data.results);

        if (mode == "all") {
            // you must fix this... not work or hard to work on the webserver
            //await filler(response, 10);
            await simpleGetRq(response.data.next, (res) => {
                buffer.push(res.data.results);
            });

            ev.on("done", async () => {
                //await Bun.write(`./${tableObjectReq.filter}.json`, JSON.stringify(buffer));
               cb(_.flatten(buffer));
            });
        } else {
            // return buffer for the sinble fetch

             return cb(_.flatten(buffer));

        }

        //await Bun.write("./data.json", JSON.stringify(buffer));
    } catch (error) {
        // TODO if we are in the mode all check for it
        // then get the current url and refech from there with simpleGetRq and the correspondent
        // cycle
        //
        // suppose we dont have netowrk error and have reliablity in the infstructure.
        console.error(error);
    }
}

// simple static url get request
async function simpleGetRq(url, callback) {
    let counter = 0;

    const id = setInterval(async () => {
        if (counter > 8) {
            clearInterval(id);
            ev.emit("done");
            return;
        }

        try {
            console.log(url + "at counter" + counter);
            const response = await ax.get(url);
            url = response.data.next;
            callback(response);
            counter++;
        } catch (error) {
            console.error(error);
        }
    }, 900);
}

