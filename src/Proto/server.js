import { Elysia } from "elysia";
import { featureExtConfig, configHelper } from "../expfx/config.featureExt";
import { createExpfxInstnace } from "../expfx/featureExtWaterFall.js";
import { dFetchTableConfig } from "../DAgg/dFetchTableConfig.js";
import { collect } from "../DAgg/fetchApi.js";
import { base, general } from "../../db/model.lvl";

// grab the daggs stuffs
// grab the exfp stuffs
// do the job
// grab the db

const app = new Elysia();

const ff = createExpfxInstnace(featureExtConfig);

app.get("/getNews/:mode", (ctx) => {
    let mode = ctx.params.mode;
    // {params:{mode}};

    // the params : one is all
    // the parms : one is single
    //

    // make sure to upppercasae it
    let tq;
    switch (mode) {
        case "single":
            // return single data back to us.
            tq = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });
            return collect(tq, async (d) => {
                //console.log(base);
                await base.setValue("testNews", d, general);
                let rs = await base.getValue("testNews", general);
                rs = await ff.accept([rs[0]]);
                console.log(rs);

                return JSON.stringify(rs);
                //
                // then you have the results;

                // this the data from collect
            });

        case "all":
            // n
            // return lots of data back to us .
            tq = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });
            collect(
                tq,
                async (d) => {
                    await base.setValue("testNewsAll", d, general);
                    let rs = await base.getValue("testNewsAll", general);

                    console.log("this is from db");
                    //console.log(rs);
                    console.log(rs.length);

                    //rs = await ff.accept(res);
                    // console.log(rs);
                    //

                    return "go for all";

                    // this the data from collect
                },
                "all"
            );

        case "batch":
            // return lots of data back to us .
            tq = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });
            return collect(tq, async (d) => {
                await base.setValue("testNewsAll", d, general);
                let rs = await base.getValue("testNewsAll", general);

                rs = await ff.accept(rs);

                console.log(rs);

                return JSON.stringify(rs);
                return "go for batch";

                // this the data from collect
            });

            break;
        default:
            tq = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });
            return collect(tq, async (d) => {
                //console.log(base);
                await base.setValue("testNews", d, general);
                let rs = await base.getValue("testNews", general);

                rs = await ff.accept([rs[0]]);
                console.log(rs);
                return JSON.stringify(rs);
                //
            });
    }
});

app.get("/getNews/", () => {
    // you will go by deafult;

    return "getNews Page";

    // do somthing with the id
    // return the result
});

app.get("/", () => {
    return "home Page";
});

app.listen(3000);
console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
