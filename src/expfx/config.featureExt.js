import path from 'path';

/*


config = {
    modules : [
        kjk{

            scriptName: name..
            scriptType : external | native ,
            scriptSource : some native code | some external exe path with bash
            // the scripts must put the reult in the context buffer  aggregator
            // for extenal we have to catach them from the output or stdout of the file.

            scriptSource : better to  be a path of string. only.



        } ,
        {} ,
        {}



    ]
}

*/
export const featureExtConfig =  {
    // TODO check the input type to this objects by some typeCheckers.

    modules :[

        {scriptName:'getName' , scriptType:'native' , scriptSource:'./native/fx1.js'},

        {scriptName:'getAge' , scriptType:'native' , scriptSource:'./native/fx2.js'} ,

        {scriptName:'getNat' , scriptType:'native' , scriptSource:'./native/fx3.js'},

        {scriptName:'xlNet' , scriptType:'external' , scriptSource:'./external/ex1.py'},

        {scriptName:'bert' , scriptType:'external' , scriptSource:'./external/ex2.py'}




    ],

    acceptExternals : ['py', 'js' ,'go','rs']


}


export const configHelper  =  {

    getExt : (fpath) => {
        return path.extname(path.basename(fpath)).replace(/\./g,'');
    } ,

    validExt : function (ext, acceptExternals)  {

        //console.log(this.getExt(fpath));
        //



        if (acceptExternals.includes(ext)) {

            return true;

        }


        return false;


    },

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
                    return 'python';



            }

        }


        console.log('the external exttension file script does not supported');

        return false;


    }

}
//console.log(configHelper.getCommand('./external/ex1.py', ['py', 'rs','go','js']));


