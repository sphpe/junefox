import api from '../helpers/api'

export default function api2(url,params,formData,onProgress) {
  return function(dispatch) {    
    let key = url.split("/").join("_");
    let request = api(url,params,formData,onProgress)    
    request.then(data => {
      if (data == "canceled") {
        dispatch({
          type: "api_cancel",
          key: key,
          params: params,
          data: data
        }); 
      } else if (data.error) {
        dispatch({
          type: "api_failure",
          key: key,     
          params: params,   
          error: data.error
        });  
      } else {
        dispatch({
          type: "api_success",
          key: key,
          params: params,
          data: data
        });        
      }        
    })
    dispatch({
      type: "api",
      key: key,      
      params: params,
      request: request
    });
    return request;      
  }
}