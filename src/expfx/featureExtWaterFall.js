import EV from "events";
import { featureExtConfig, configHelper } from "./config.featureExt.js";

import { promisify } from "util";
import { result } from "lodash";
import { xmerge } from "./featureExt.helper.js";

// check for external or internal of the feature extraction model
// collect sandboxes
// merge in place
// and give you single source of turth after the opereation is done.

export function createExpfxInstnace(config) {
    return new Expfx(config);
}

export class Expfx extends EV {
    constructor(config) {
        super();
        this.config = config;
        //console.log(this.config);
        this.externalSandbox = [];
        // for thread the dispatch threads
        this.spawnedChilds = [];

    }

    setConfig(newConfig) {
        if (newConfig) {
            this.config = config;
            return;
        }
        return;
    }

    cleanUp() {
        this.externalSandbox = [];

        this.spawnedChilds = [];
    }

    // create local buffer for each thread
    createLocalBuffer(name, raw) {
        // feature extraction user must grab the raw and doi something on and put on the buffer.
        return {
            name,
            rawData: raw,
            buffer: [],
        };
    }

    // for now its not async
    ifJson(data) {
        // first check if the ddata is jons or not
        // if not create a josn and then return ;
        return JSON.stringify(data);
        // grab some data from network  like : {news : 'this is the crytpo area'} ;
        // and return the results;
        // or it can talk to another interface
    }

    // accept data for the feature waterfall.
    async accept(data) {
        const d = await this._iterateOverConfig(this.config, data);
        return d;
    }

    createChildProc(extCommand, fxObject, data) {
        // the data must be a json .
        // this will add one proc to the spawnedChilds
        //const promSpawn = promisify(Bun.spawn);
        // we put the data on the process by argv
        // we catch the data through the stdout

        const that = this;

        // this is only for bun

        const proc = Bun.spawn([extCommand, fxObject.scriptSource, data], {
            onExit(proc, exitCode, signalCode, error) {
                if (error) {
                    console.log("what is error");
                    return;
                } // one single external waterfall instance end.

                console.log("we are exiting child process");

            },
        });

        return proc;
    }

    externalHandler(fxObject, bufferContext) {
        // TODO check for the path is existed... with that config helper
        let extCommand;
        if (
            (extCommand = configHelper.getCommand(
                fxObject.scriptSource,
                featureExtConfig.acceptExternals
            ))
        ) {
            const proc = this.createChildProc(extCommand, fxObject, this.ifJson(bufferContext));
            // this proc is basicaly a promise and we dont yet await it .
            // and that's the key

            this.spawnedChilds.push(proc);

            // now we have the promised based spawnedChilds.
            console.log('sub process spwnd');
        }
    }

    async bunSpawnOuputGrab(proc) {
        // this is child proc object : proc

        //

        let outputD = await proc.stdout;

        let assembleBuffer = "";

        const decoder = new TextDecoder();

        // how to read the data from stream
        for await (const chunk of outputD) {
            assembleBuffer += decoder.decode(chunk);
        }

        try {
            return JSON.parse(assembleBuffer);
        } catch {
            console.log(" the value return from the external module is not json returning {}!!");
            return {};
        }
    }

    // have the deep cleaning stuffs and then merge in the single source of the truth

    merge(resArr) {
        // this is the final stage of the feature extraction
        // when you merge everything to gether
        //

        console.log(resArr);
        return xmerge(resArr);
    }

    async _iterateOverConfig(config, data) {
        let v = [];
        if (config) {
            for (let c in config.modules) {
                // create the context for the fx object
                const contextBuffer = this.createLocalBuffer(config.modules[c].scriptName, data);
                // we can later optimize this to elminate the bufferContexts for efficiency
                this.externalHandler(config.modules[c], contextBuffer);
            }

            const that = this;

            let results = await Promise.all(this.spawnedChilds).then(async (childs) => {
                const res = childs.map(async (child) => {
                    return await that.bunSpawnOuputGrab(child);
                });

                return await Promise.all(res);
            });

            // before we return we also need to merge the results;
            // the cleanup for the next iteration of the accept
            if (results) {
                this.cleanUp();
                // TODO merge;

                //console.log(results);
                results = this.merge(results);
                return results;
            }
        }
        console.log("there is no config for feature itration");
        return {};
    }
}

// accept array of objects
// const ff = createExpfxInstnace(featureExtConfig);
// const res = await ff.accept([
//     {
//         kind: "news",
//         domain: "finbold.com",
//         votes: {
//             negative: 0,
//             positive: 4,
//             important: 3,
//             liked: 3,
//             disliked: 0,
//             lol: 0,
//             toxic: 0,
//             saved: 3,
//             comments: 0,
//         },
//         source: {
//             title: "Finbold",
//             region: "en",
//             domain: "finbold.com",
//             path: null,
//         },
//         title: "Judge rejects SEC’s interlocutory appeal request v. Ripple",
//         published_at: "2023-10-04T08:01:48Z",
//         slug: "Judge-rejects-SECs-interlocutory-appeal-request-v-Ripple",
//         id: 18946455,
//         url: "https://cryptopanic.com/news/18946455/Judge-rejects-SECs-interlocutory-appeal-request-v-Ripple",
//         created_at: "2023-10-04T08:01:48Z",
//     },
// ]);
// console.log(res);

// data.title , data.id , data.created_at , data.published_at , data.votes , data.kind,
// data.domain
