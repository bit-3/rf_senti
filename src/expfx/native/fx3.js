// self.onmessage = async (event) => {
//     // we have to put contextBuffer and data on the event.
//     console.log(event.data);
//     // console.log(event.data.data);
//     // console.log(event.data.cf);
//
//     console.log("working on data ....");
//
//     setTimeout(() => {
//         console.log(event.data.data.news + " xfound");
//         // do something on the data
//         event.data.data.news = 'we mutate teh news by worker js 1';
//
//         event.data.cf.buffer.push(event.data.data.news);
//
//         postMessage(event.data.cf);
//         process.exit(1);
//     }, 1000);
//
//     //     // do somethings and bind the result at the end to the contextBuffer;
//
//     //     // const {name} = event.data.data;
//     //    event.data.cf.buffer.push(name);
//
// };


const d = JSON.parse(process.argv[2]);
d.newValue = 'some shiti thing ljsdlfj from js module';
process.stdout.write(JSON.stringify(d.newValue));


