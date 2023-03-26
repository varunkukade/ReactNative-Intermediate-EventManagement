export const checkIfEmpty = (value: string | object | number) => {
   if(!value) return true;
   else {
    //here value can be string/object/number
    if(value instanceof Object){
        //if value is either object or array
        if(value instanceof Array){
            //if value is array
            if(value.length === 0) return true;
            else return false;
        }else {
            //if value is object
            if(Object.keys(value).length === 0) return true;
            else return false;
        }

    }else return false //if string/number exist return false
   }
}  