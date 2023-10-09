self.onmessage = async (event) => {
    // we have to put contextBuffer and data on the event.
    console.log(event.data);
    // console.log(event.data.data);
    // console.log(event.data.cf);

    console.log("working on data ....");

    setTimeout(() => {
        console.log("doing hard stuffs");

        console.log(event.data.data.name + "found");

        event.data.cf.buffer.push(event.data.data.nat);

        postMessage(event.data.cf);
    }, 1000);

    //     // do somethings and bind the result at the end to the contextBuffer;

    //     // const {name} = event.data.data;
    //    event.data.cf.buffer.push(name);
};
