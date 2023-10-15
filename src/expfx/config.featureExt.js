import path from 'path';


// feature extraction config file : specify the external files that will operate on the dset
export const featureExtConfig =  {
    // TODO check the input type to this objects by some typeCheckers.



    // external modules that will be handled in pararell on the dataset
    modules :[

        {scriptName:'getName' , scriptType:'native' , scriptSource:'./native/fx1.js'},

        {scriptName:'getAge' , scriptType:'native' , scriptSource:'./native/fx2.js'} ,

        {scriptName:'getNat' , scriptType:'native' , scriptSource:'./native/fx3.js'},

        {scriptName:'xlNet' , scriptType:'external' , scriptSource:'./external/ex1.py'},

        {scriptName:'bert' , scriptType:'external' , scriptSource:'./external/ex2.py'}

    ],

    // available external path extensions.
    acceptExternals : ['py', 'js' ,'go','rs']


}




// get some config utility on main config object
export const configHelper  =  {

    // get the current extension on the path
    getExt : (fpath) => {
        return path.extname(path.basename(fpath)).replace(/\./g,'');
    } ,

    // check if we have it or not
    validExt : function (ext, acceptExternals)  {

        if (acceptExternals.includes(ext)) {

            return true;

        }

        return false;

    },
    // get external command exe prefix from file extension
    getCommand : function(fpath,rules){
        const ext = this.getExt(fpath);


        if (this.validExt(ext , rules)) {

            switch (ext) {

                case 'py' :
                    return 'python3.10';
                case 'js' :
                    return 'node';
                case 'rs' :
                    return 'rust';
                case 'go' :
                    return 'go';

                default :
                    return 'python3.10';

            }

        }


        console.log('the external extension file script does not supported');

        return false;


    }



    //TODO func pathExist

}


