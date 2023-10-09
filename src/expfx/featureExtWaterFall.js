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
        this.nativeSandbox = [];
        this.externalSandbox = [];

        // for thread the dispatch threads
        this.threadTracker = 0;
        this.childPTracker = 0;
    }

    // create local buffer for each thread
    createLocalBuffer(name) {
        return {
            name,
            buffer: [],
        };
    }

    start(cb) {
        this._iterateOverConfig(this.config, cb);
    }

    // create the path to the worker source file
    getWorkerRef(workerPath) {
        return new URL(workerPath, import.meta.url).href;
    }

    nativeHandler(fxObject, bufferContext, isLast) {
        // this will work on the main thread ;
        // so we have to create another thread and talk to it and fill the bufferContext

        let workerRf = this.getWorkerRef(fxObject.scriptSource);
        const worker = new Worker(workerRf, { smol: true });
        //worker.ref();

        const that = this;

        worker.postMessage({ data: { name: "keihan", age: "25", nat: "iran" }, cf: bufferContext });
        worker.onmessage = (event) => {
            that.nativeSandbox.push(event.data);
            worker.terminate();

            if (this.threadTracker == 1) {
                process.nextTick(() => {
                    // here we have the final results of all the threads
                    this.emit("waterfall-end", this.nativeSandbox);
                    this.threadTracker = 0;
                });
            }

            console.log(this.threadTracker);
            //console.log(that.nativeSandbox)
            // this will have the effectcs on the native sandbox for each callstack.
        };

        worker.addEventListener("open", (ev) => {
            worker.ref();
            this.threadTracker++;
        });

        worker.addEventListener("close", (ev) => {
            worker.unref();
            this.threadTracker--;
        });
    } // handle the native stuffs

    // create a context then put on the python object.
    // grab the context on the python
    // put the data on it
    //

    externalHandler(fxObject, bufferContext) {
        console.log("we got shiit little externals");
        console.log(fxObject);

        // check for the path is existed...
        //
        //
        //
        //
        //
        //

        let extCommand;
        if (
            (extCommand = configHelper.getCommand(
                fxObject.scriptSource,
                featureExtConfig.acceptExternals
            ))
        ) {
            const exeObject = exec(
                `${extCommand}3.10 ${fxObject.scriptSource} ${JSON.stringify(bufferContext)}`,
                (err, stdout, stderr) => {
                    if (err) {
                        console.error("Error running Python script:", err);
                        return;
                    } else {


                    this.childPTracker ++;

                    }
                    //
                      // here we have to catch the stuffs and put them on buffer

                    // exeObject.stdout.on("data", (data) => {
                    //     if (data) {
                    //         bufferContext.buffer = data;
                    //         console.log("the data comes from some source");
                    //         this.emit('ex-waterfall-end', bufferContext);
                    //
                    //     }
                    // });
                }
            );

            exeObject.stdout.on("data", (data) => {
                const responseData = JSON.parse(data);
                //console.log(`Data received from Python: ${responseData}`);
                bufferContext.buffer.push(responseData);
                console.log(bufferContext);
                this.emit("ex-waterfall-end", bufferContext);
            });
        }

        //
    } // handle the external stuffs

    merge() {} // have the deep cleaning stuffs and then merge in the single source of the truth

    _iterateOverConfig(config, cb) {
        if (config) {
            for (let c in config.modules) {
                // create the context for the fx object
                const contextBuffer = this.createLocalBuffer(config.modules[c].scriptName);

                switch (config.modules[c].scriptType) {
                    //  handle this with worker threads
                    case "native":
                        console.log("we got some native");
                        this.nativeHandler(config.modules[c], contextBuffer, config.modules.length);
                        // try catch
                        // do some native stuffs and done
                        // break
                        // run them with contextBuffer
                        // handle this with child process.
                        break;
                    case "external":
                        console.log("we also have some externals");

                        this.externalHandler(config.modules[c], contextBuffer);

                        // try catch
                        // handle the external executable twoard sme exe child stuffs and then grab
                        // the results
                        // break
                        // // run the with contextBuffer or some how catch the results
                        break;
                    default:
                        console.log("unkown fx script type");
                        throw new Error(" unknown fx script type");
                        // do nothing.
                        break;
                }
            }

            this.on("waterfall-end", (d) => {
                cb(d);
            });

            this.on("ex-waterfall-end", (d) => {
                this.externalSandbox.push(d);
                console.log(this.externalSandBox);

            });
        }
    }
}

const ff = new expfx(featureExtConfig);
ff.start((d) => {
    console.log("the final data is ");
    console.log(d);
});
