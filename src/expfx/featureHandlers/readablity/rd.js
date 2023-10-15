import { rate, grade } from "flesch-kincaid";

// get some data from stdin or sys.argv
// process it and return some object {rate and grade}

// we send the batch of things to these process .. it can be one or or 1000 in a single buffer.



// use on the fly exe context when ever we trigger some sub process to this process
(function () {
    //process.stdout.write(JSON.stringify(d.newValue));
    if (process.argv[2]) {
        const data = JSON.parse(process.argv[2]);

        const res = data.map((item) => {
            return {
                rate: rate(item.news),
                grade: grade(item.news),
            };
        });
        // rate : data.text <- rate
        // grade : data.text <- grade.

        // res is an array

        process.stdiout.write(JSON.stringify(res));
        return;
        // the default value of this proc kill is 0

        // from that text : we just tranform it : to some features
    }

    // make it dynamic more later by adding some info related to the process.
    console.log("no value supplied to this module.: readablity");
    process.stdiout.write(JSON.stringify({}));
    return;
})();



// other helpers and related stuffs can be refrenced here.
