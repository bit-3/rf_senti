import {dFetchTableConfig} from './dFetchTableConfig.js'
import {collect} from './fetchApi.js';
import {base,general} from '../../db/model.lvl.js';


async function main() { 
    // do some main testing stuffs

    // first create the request table config
    const tq = dFetchTableConfig[0].createTableRequestObject({ filter: "bullish", kind: "news" });

    collect(tq, async(d) =>{



        //console.log(base);
        //await base.setValue('kei', d,general)
        let rs= await base.getValue('kei',general);
        console.log(rs);




    // this the data from collect



} );




}

main();