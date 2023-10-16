import { _ } from "lodash";

// iterate over buffers and for each id gather them .

function flatBuffers(resultContext) {
    // this will union buffer of all the services into single arr;

    let res = [];
    if (resultContext) {
        resultContext.map((item) => {
            res.push([...item.buffer]);
        });

        return _.flattenDeep(res);
    }

    return [];
}

// for each of those

// grab similars by id same objects with same id but differnet props
function groupById(arr, id) {
    let res = arr.filter((item) => {
        return item.data.id == id;
    });
    return res;

}

function getBuffIds(arr) {
    if (arr) {
        let res = arr.map((item) => {
            return item.data.id;
        });

        // make the ids uniq
        return Array.from(new Set(res));
    }

    return [];
}



export function segmentById(resultArray) {
    if (resultArray) {
        let fb = flatBuffers(resultArray);
        let ids = getBuffIds(fb);
        if (ids.length != 0) {
            return ids.map((id) => groupById(fb, id));
        }

        console.log("there is not id to segment on it ");
    }

    console.log("segment doesnt work correctly");
    console.log("return the originalOne");

    return resultArray;
}

        // data.title , data.id , data.created_at , data.published_at , data.votes , data.kind,
        // data.domain

//TODO  addon: array of object properties that you want to build at time of your object build.
// if you hardcode the properties you have to combine and aggreate all the sources into methods
// objects as properteis and methods.
export function xmerge(resultArr) {
    let segmentData = segmentById(resultArr);
    const final = [];

    segmentData.map((seg) => {
        let res = [];
        seg.map((obj) => {

            // and other realted properties that you need for each object
            res.push({
                [obj.name]:obj.feature , // main feature name .
                title:obj.data.title ,
                id : obj.data.id ,
                createdAt:obj.data.created_at ,
                publishedAt:obj.data.published_at ,
                votes:obj.data.votes,
                kind:obj.data.kind,
                source:obj.data.source,
                slug:obj.data.slug // something like title.

            });
        });

        // flat the res then push it on the final

        res = _.flattenDeep(res);

        res =  _.merge({}, ...res);
        final.push(res);
    });

    return final;
}


