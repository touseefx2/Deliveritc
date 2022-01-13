 
import { Alert } from 'react-native'
import  db  from "../index"
 
 
export function apiCall(method,path,bodyData,headers) {
  
  let header;
     if(headers==""){
        header={
        'Content-Type': 'application/json'
              }
        }else if(headers=="upload"){
          header= {
            'Content-Type': 'multipart/form-data',
           }
        }else{
          header= 
            new Headers({
               Authorization:"Bearer "+headers,
               'Content-Type': 'application/json',
                  }) 
               

        }

  let obj=
  bodyData!=false
  ?
  {
    method:method,
    headers:header,
    body:headers!=="upload"?JSON.stringify(bodyData):bodyData,    
  } 
  :
  {
    method:method,
    headers:header,
  }
  
        
  return new Promise((resolve, reject) => {
 
    return (
      fetch(link.links+path,obj).then(res=>res.json())
        .then(data=>{
            //  console.log("fetch api call response : ",data);
         if(headers!="upload")
          {
            return resolve(data)
          }
          else{
          return  resolve(data.locationArray[0].fileLocation);
         }
        })
      .catch(err=>{
        // var data = { type: 'Api', message: err }
        //  console.log("fetch api call catch error : ",err);
        return reject(err)
      })

          )
    

  })

}
 

export default api={
  apiCall,
 
}

 
