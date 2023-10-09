/* you have to export this and use it in your collect function */
// api fetch config
export const dFetchTableConfig = [
    // key props : sourceName, sourceBaseUrl, urlManipulation , createTAbleObject.
    {
        sourceName: "cryptoPanic", /// this url must be valid : base url
        sourceBaseUrl: "https://cryptopanic.com/api/v1/",

        urlManipulation: {
            filter: "rising|hot|bullish|bearish|important|saved|lol",
            kind: "media|news",
        },

        createTableRequestObject: function (object) {
            // like that create filter
            // rules are internally will set only for this.
            //

            let that = this;

            const { filter, kind } = object;
            const validator = (rules) => {
                const filterRules = that.urlManipulation.filter.split("|");
                const kindRules = that.urlManipulation.kind.split("|");
                console.log(kindRules);

                let finalObj = {};

                for (let r in rules) {
                    switch (r) {
                        case "filter":
                            if (filterRules.includes(rules[r])) {
                                finalObj[r] = rules[r];
                            }

                            break;
                        case "kind":
                            if (kindRules.includes(rules[r])) {
                                console.log("we go here");
                                finalObj[r] = rules[r];
                            }
                            break;
                    }
                }

                return finalObj;
            };

            return {
                ...validator(object),
                apiMode: "posts/",
                apiKey: this.apiKey,
                base: this.sourceBaseUrl,
            };
            return validator(object);
        },
        // sample real api key
        apiKey: "2790b7274cf4e4208c48e7918139e4036435518b",
    },
];

// usage
// const resi = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });
// const result = await collect(resi, "all");
