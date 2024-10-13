//Common code that is used across the project
import { TIME_OUT } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const AJAX = async function(url, uploadData = undefined){
  try{
      const fetchPro = uploadData ? fetch(url,{
        method: "POST",
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(uploadData),
      }) : fetch(url);

      //Bringing the race into building to prevent from eternal fetching due to bad internet connection. if the timeout win the race the promise will be rejected!!
      const response = await  Promise.race([fetchPro,timeout(TIME_OUT)]);
      const data = await response.json();
        if (!response.ok) throw new Error(`${data.message} ${response.status}`);
      return data;

  }catch(error){
    throw error;
  }
  
}

// export const getJSON = async function(url){
//     try{
//       const fetchPro = fetch(url);
//        //Bringing the race into building to prevent from eternal fetching due to bad internet connection. if the timeout win the race the promise will be rejected!!
//         const response = await  Promise.race([fetchPro,timeout(TIME_OUT)]);
//         const data = await response.json();
//     if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//         return data;
//     }catch(error){
//        throw error;
//     }
    
// }

// export const sendJSON = async function(url,uploadData){
//   try{

//     const fetchPro = fetch(url,{
//       method: "POST",
//       headers:{
//         'Content-Type': 'application/json'
//       },
//       body:JSON.stringify(uploadData),
//     })
//      //Bringing the race into building to prevent from eternal fetching due to bad internet connection. if the timeout win the race the promise will be rejected!!
//       const response = await  Promise.race([fetchPro,timeout(TIME_OUT)]);
//       const data = await response.json();
//   if (!response.ok) throw new Error(`${data.message} ${response.status}`);
//       return data;
//   }catch(error){
//      throw error;
//   }
  
// }
