import EV from "events";
import { featureExtConfig, configHelper } from "./config.featureExt.js";

import { promisify } from "util";

// check for external or internal of the feature extraction model
// collect sandboxes
// merge in place
// and give you single source of turth after the opereation is done.
export class expfx extends EV {
    constructor(config) {
        super();
        this.config = config;
        //console.log(this.config);
        this.externalSandbox = [];
        // for thread the dispatch threads
        this.spawnedChilds = [];
        this.spCounter = 0;
    }

    // create local buffer for each thread
    createLocalBuffer(name) {
        return {
            name,
            buffer: [],
        };
    }

    // for now its not async
    dataProvider() {
        // grab some data from network  like : {news : 'this is the crytpo area'} ;
        // and return the results;
        // or it can talk to another interface

        return {
            news: "this is a crypto era",
        };
    }

    async start(cb) {
        await this._iterateOverConfig(this.config, cb);
    }

     createChildProc(extCommand, fxObject) {
        // this will add one proc to the spawnedChilds
        //const promSpawn = promisify(Bun.spawn);
        // we put the data on the process by argv
         // we catch the data through the stdout

        const that = this;

        const proc = Bun.spawn(
            [`${extCommand}`, fxObject.scriptSource, JSON.stringify(this.dataProvider())],
            {
                onExit(proc, exitCode, signalCode, error) {
                    if (error) {
                        console.log("what is error");
                        return;
                    } // one single external waterfall instance end.

                    console.log("we are exiting child process");

                    that.spCounter --;
                },
            }
        );


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

            const proc = this.createChildProc(extCommand, fxObject);
            // this proc is basicaly a promise and we dont yet await it .
            // and that's the key

            this.spawnedChilds.push(proc);
            this.spCounter++;

            // now we have the promised based spawnedChilds.
            console.log(`spawned number ${this.spCounter} child process`);
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

    }

    async _iterateOverConfig(config, cb) {
        let v = [];
        if (config) {
            for (let c in config.modules) {
                // create the context for the fx object
                const contextBuffer = this.createLocalBuffer(config.modules[c].scriptName);
                this.externalHandler(config.modules[c], contextBuffer);
            }

            const that = this;

            const results = await Promise.all(this.spawnedChilds).then(async(childs) =>{



                const res = childs.map(async(child) =>{

                    return await that.bunSpawnOuputGrab(child);

                });;

                return await Promise.all(res);

            });

            console.log(results);



        }
    }
}

const ff = new expfx(featureExtConfig);
await ff.start((d) => {
    console.log("the final data from both external and internal sources are :  ");
    console.log(d);
});
