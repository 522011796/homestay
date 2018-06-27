export default {
  clearData(data,isSerialize){
    if(data){
      if(isSerialize){
        var newData = {};
        for(var i=0,length=data.length;i<length;i++){
          if(trim(data[i].value) != '' && trim(data[i].value) != 'null'){
            newData[data[i].name] = $.trim(data[i].value);
          }
        }
        return newData;
      }else{
        for(var key in data){
          if(data[key] === '' || data[key] == 'null' || data[key] == null){
            delete data[key];
          }
        };
        return data;
      }
    }

  }
}

export function trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
