import EV from "events";
import { featureExtConfig, configHelper } from "./config.featureExt.js";
import { exec } from "child_process";

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
        this.childPTracker = 0;
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

    // // create the path to the worker source file
    // getWorkerRef(workerPath) {
    //     return new URL(workerPath, import.meta.url).href;
    // }
    //
    //   nativeHandler(fxObject, bufferContext, isLast) {
    //       // this will work on the main thread ;
    //       // so we have to create another thread and talk to it and fill the bufferContext
    //
    //       let workerRf = this.getWorkerRef(fxObject.scriptSource);
    //       const worker = new Worker(workerRf, { smol: true });
    //       worker.ref();
    //       this.threadTracker++;
    //
    //       //worker.ref();
    //
    //       const that = this;
    //
    //       worker.postMessage({ data: this.dataProvider(), cf: bufferContext });
    //       worker.onmessage = (event) => {
    //           that.nativeSandbox.push(event.data);
    //           this.threadTracker --;
    //           // already exit the process inside the process.
    // //          worker.terminate();
    //
    //           // by this we can have the last thread. => its differ from proc.
    //           if (this.threadTracker == 1) {
    //               // here we have the final results of all the threads
    //                   this.emit("waterfall-end");
    //                   this.threadTracker = 0;
    //           }
    //
    //           //console.log(that.nativeSandbox)
    //           // this will have the effectcs on the native sandbox for each callstack.
    //       };
    //
    //       // worker.addEventListener("open", (ev) => {
    //       //     worker.ref();
    //       //     this.threadTracker++;
    //       // });
    //       //
    //       // worker.addEventListener("close", (ev) => {
    //       //     worker.unref();
    //       //     this.threadTracker--;
    //       // });
    //   } // handle the native stuffs
    //
    //

    async bnStd(cb) {
        this.ChildPTracker++;
        return cb();
    }
    async externalHandler(fxObject, bufferContext) {
        console.log("we got  externals");
        console.log(fxObject);

        // TODO check for the path is existed...
        let extCommand;
        if (
            (extCommand = configHelper.getCommand(
                fxObject.scriptSource,
                featureExtConfig.acceptExternals
            ))
        ) {
            /* bun ver */
            // we can also handle we got some stderr.
            const that = this;
            const proc = await Bun.spawn(
                [`${extCommand}`, fxObject.scriptSource, JSON.stringify(this.dataProvider())],
                {
                    onExit(proc, exitCode, signalCode, error) {
                        if (error) {
                            console.log("what is error");
                            return;
                        }
                        // one single external waterfall instance end.
                        console.log("we are exiting child process");
                        that.childPTracker--;


                        if (that.childPTracker == 0) {
                            console.log("all  proces done");

                            that.emit("ex-waterfall-end");
                        }
                    },
                }
            );


            if (proc) {
                this.childPTracker++;
                proc.ref();
                // handle the output of the child process.
                const outputD = await this.bunSpawnOuputGrab(proc);
                bufferContext.buffer.push(outputD);
                this.externalSandbox.push(bufferContext);
            } else {
                console.log("sigmaaaaaaaa");
            }
        }
    }

    async bunSpawnOuputGrab(proc) {
        // this is child proc object : proc

        let outputD = await proc.stdout;

        let assembleBuffer = "";

        const decoder = new TextDecoder();

        for await (const chunk of outputD) {
            assembleBuffer += decoder.decode(chunk);
        }

        try {
            console.log(JSON.parse(assembleBuffer));
            return JSON.parse(assembleBuffer);
        } catch {
            console.log(" the value return from the external module is not json !!");
            return {};
        }
    }

    merge() {} // have the deep cleaning stuffs and then merge in the single source of the truth

    _iterateOverConfig(config, cb) {
        if (config) {
            for (let c in config.modules) {
                // create the context for the fx object
                //
                const contextBuffer = this.createLocalBuffer(config.modules[c].scriptName);

                this.externalHandler(config.modules[c], contextBuffer);

            }

                this.on("ex-waterfall-end", () => {
                    // you can have external sandbox right now
                    cb(this.externalSandbox);
                });
        }
    }
}

const ff = new expfx(featureExtConfig);
await ff.start((d) => {
    console.log("the final data from both external and internal sources are :  ");
    console.log(d);
});
