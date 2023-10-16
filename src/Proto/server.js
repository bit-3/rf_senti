import { Elysia } from "elysia";

// grab the daggs stuffs
// grab the exfp stuffs
// do the job
// grab the db

const app = new Elysia();

app.get("/getNews/:id", ({ params: { id } }) => {
    // the params : one is all
    // the parms : one is single
    //

    // make sure to upppercasae it
    switch (id) {
        case "single":
            return "go for single";
            break;

        case "all":
            return "go for all";
            break;


        default :
            return 'go for single';

            // we have to wroute to the getNews
            // or do something on the get news.
    } // do somthing with the id
    // return the result
});

app.get("/getNews/", () => {
    // you will go by deafult;

    return "getNews Page";

    // do somthing with the id
    // return the result
});

app.get("/", () => "home Page");

app.listen(3000);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
