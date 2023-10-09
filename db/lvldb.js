// abstract interface toward the leveldb
// we need to search data for that level
// work as the base db and interface to other levels
// base level : get geneal info
// other levels: get additional info toward the logics like news and other sort of stuffs

import { Level } from "level";
import EE from "events";

class lvldb extends EE {
    constructor(path, dbPass, valueEncoding) {
        // this path is the container name .
        super();
        this.db = new Level(path, {
            valueEncoding: valueEncoding,
            encryption: {
                password: dbPass,
            },
        });
    }

    // check if the db has the given sublevel name
    getSubLevelByName(name) {
        if (this.db.lvls.has(name)) {
            return this.db.lvls.get(name);
        }
        return null;
    }

    /// repoen if already exited
    reopen(path) {
        if (this.valueCheck(path)) {
            this.db = new Level(path);
            return this;
        }

        return "CANOT REOPEN THE DB : NOT SUFFICIENT ARG SUPPLY";
    }
    keibos;

    // put value on the db without value check
    async setValue(key, value, lvl) {
        // check with valueCheck
        if (this.valueCheck(key, value, lvl)) {
            return await lvl.put(key, value, "json");
        }
        return "FAILED TO WRITE TO DB : NOT SUFFICIENT ARG SUBPPLY";
    }

    valueCheck(...ars) {
        let flag = true;
        ars.forEach((item) => {
            if (item == undefined) {
                flag = false;
            }
        });

        return flag;
    }

    // set multiple values to the db without value check
    async setMultipleValues(arr, lvl) {
        if (this.valueCheck(arr, lvl)) {
            return await lvl.batch(arr);
        }

        return "CANT WRITE MULTIPLE TO DB : NOT SUFFICIENT ARG SUPPLY";
        // also need to check for occurance of the key and the value
        //[{ type: 'put', key: 'b', value: 2 }]
    }

    // get the current lvldb status
    getDbStat() {
        return this.db.status;
    }

    // lvl because it can happen on the sublevel of it
    // get the value from the supplied lvl
    async getValue(key, lvl) {
        if (this.valueCheck(key, lvl)) {
            let value = await lvl.get(key);
            return value;
        }

        return "FAILED TO GET FROM DB : NOT SUFFICIENT ARG SUBPPLY";
    }

    // alternative to async imple
    // setValueC(key, value, lvl, cb) {
    //     lvl.put(key, value, (err) => {
    //         if (!err) {
    //             cb(true);
    //         } else {
    //             cb(false);
    //         }
    //     });
    // }

    // getValueC(key, lvl, cb) {
    //     lvl.get(key, (err, value) => {
    //         if (!err) {
    //             return cb(value);
    //         }

    //         value = [];
    //         return cb(value);
    //     });
    // }

    // get the db object
    getSubs() {
        return this.db;
    }

    // get multiple values : must be tested
    async getMultiple(arrOfKeys, lvl) {
        if (this.valueCheck(arrOfKeys, lvl)) {
            return await lvl.getMany(arrOfKeys);
        }

        return "CANOT GET MUTIPLES FROM A LVL : NOT SUFFICIENT ARGS SUPPLY";
    }

    // del value from the current lvl
    async delValue(key, lvl) {
        if (this.valueCheck(key, lvl)) {
            return await lvl.del(key);
        }

        return "CANT DELETE KEY FROM LVL : NOT SUF ARGS";
    }

    // gather some keys and return the values.
    async gather(lvl, keys) {
        // keys is a type of array , lvl is object
        //

        if (this.valueCheck(lvl, keys)) {
            let res = await lvl.getMany(keys);
            return res;
        }

        return "CANOT GATHER : NOT SUFFICIENT ARGS SUPPLY";
    }

    argumentValidation(object, flag) {
        switch (flag) {
            case "object":
                if (object) {
                    if (object.lvl && object.keys) {
                        if (typeof (object.keys.__proto__.constructor.name == "Array")) {
                            return true;
                        } else {
                            console.log(
                                "canot validate the object because of keys or lvl deficiency"
                            );
                            return false;
                        }
                    }

                    console.log("object does not have lvl or keys");
                    return false;
                }

                console.log("there is not object");
                return false;

            case "fn":
                if (typeof (object == "function")) {
                    return true;
                }

                console.log("the object is not the function");
                return false;
        }
    }

    async ops(sourceObject, filters) {
        // stands for the operation

        if (this.argumentValidation(sourceObject, "object")) {
            let data = await this.gather(sourceObject.lvl, sourceObject.keys);
            let ex = [];
            filters.map((filterFunc) => {
                if (this.argumentValidation(filterFunc, "fn")) {
                    data = filterFunc(data);
                } else {
                    this.ex.push(filterFunc.name);
                }
            });

            return {
                result: data,
                exclude: ex,
            };
        }
        console.log("canot handle the trans with the sourceObject and other things with that ");
        return false;
    }

    /*
     * await trans({
     *      lvl: tokens,
     *      keys:['rocki', 'shiba']
     * } ,[getWallets, sorts]);
     *
     *
     *
     *
     *
     */

    getEvents(eventName, recs) {
        return recs.map((item) => {
            return item[eventName];
        });
    }

    // create a sub level if you want : this sublevel is not the same as te
    // lvldb sublevel is internal .. to us .
    createSubLevel(subName) {
        let sub;
        if ((sub = this.db.sublevel(subName))) {
            if (!this.db.lvls.has(subName)) {
                this.db.lvls.set(subName, sub);
                return sub;
            }

            console.log("canot create sublevel for this name");
            return sub;
        }
        console.log("canot create the sublevel at all");
        // maybe need some console.log here.
        return sub;
    }

    async getEntries(lvl, lmt) {
        const ents = await lvl.iterator({ limit: lmt }).all();
        return ents;
    }
}

// create the customized instance of the db
function createDataStore(storeName) {
    // create data store sample with a given name

    try {
        return new lvldb(storeName);
    } catch {

        console.log("canot open the db or create one");
    }
}

export const db = createDataStore("./sent.cls.crypto", Bun.env.dbPass, "json");

// test("./lvl_db");
