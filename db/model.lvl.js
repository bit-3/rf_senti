// get the main instance of the lvlCustumized interface
import {db} from './lvldb.js';


// store general infomation about the operation and misc things
// exports.base = db;
// // store info about the posts and things around them
// exports.tokens = db.db.sublevel('posts',{ valueEncoding: 'json' });
// // store info about the classified things
// exports.mines = db.db.sublevel('classified',{ valueEncoding: 'json' });
// // store info about the model and different service
// exports.mines = db.db.sublevel('model',{ valueEncoding: 'json' });
// // store general info like the main base
// exports.wallets = db.db.sublevel('general',{ valueEncoding: 'json' });



// refac

// store general informatin about the operation and misc things
export const base = db;
// store  information about posts
export const posts = db.db.sublevel('posts',{ valueEncoding: 'json' });
// store info about the classified things
export const classified = db.db.sublevel('classified',{ valueEncoding: 'json' });
// store info about the model and different service
export const model = db.db.sublevel('model',{ valueEncoding: 'json' });
// store general info like the main base
export const general = db.db.sublevel('general',{ valueEncoding: 'json' });




/*
 * db
 * posts
 * classified
 * model
 * general
 */;