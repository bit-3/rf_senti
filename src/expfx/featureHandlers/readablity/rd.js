import { rate, grade } from "flesch-kincaid";

// get some data from stdin or sys.argv
// process it and return some object {rate and grade}

// we send the batch of things to these process .. it can be one or or 1000 in a single buffer.
//process.stdout.write(JSON.stringify('good'))

// use on the fly exe context when ever we trigger some sub process to this process
(function () {
    //process.stdout.write(JSON.stringify(d.newValue));


    if (process.argv[2]) {
        const data = JSON.parse(process.argv[2]);




        const res = data.rawData.map(item =>{

            return {
                data : item  ,
                name:data.name,
                feature : {

                rate : rate(item.title) ,
                grade: grade(item.title)


                }
            }


        });

        data.buffer = res;
        // for efficiecy
        data.rawData = null;
        process.stdout.write(JSON.stringify(data));

        return;
        // the default value of this proc kill is 0

        // from that text : we just tranform it : to some features
    }

    // make it dynamic more later by adding some info related to the process.
    console.log("no value supplied to this module.: readablity");
    process.stdout.write(JSON.stringify({}));
    return;
})();
//
//

// other helpers and related stuffs can be refrenced here.
