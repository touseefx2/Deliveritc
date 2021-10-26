import axios from 'axios'
import { Alert } from 'react-native'
import { link } from '../Links/Links'
 
//setting authorization token
export function setTokenHeader(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

 
//this function will be used for making the api calls inside the actions
export function apiCall(method, path, data={}, header) {
  return new Promise((resolve, reject) => {
 
    return (
 
      axios[method](link + path, data, { header: header })
       
        .then((res) => {
     
          return resolve(res.data);
        })
        .catch((err) => {
          // console.log("err res : ",err);
          if (err.response) {
            let msg=err.response.data.message

            if(err.response.data.errors.email){
              msg=err.response.data.errors.email
            }

            if(err.response.data.errors.password){
              msg=err.response.data.errors.password
            }

            var data = { type: 'Api', message: msg }
            console.log("res errors  :  ",err.response.data.errors)
            Alert.alert(
              'Error',
              data.message
            )
            return reject(data)
          }
          else if (err.request) {
            var data = { type: 'Network', message: 'No Server Response ! \n Please reopen app after some time' }
            Alert.alert(
              'Error',
              data.message
            )
            return reject(data)
          }
          else {
            Alert.alert(
              'Error',
              "Something Went wrong!"
            )
            return reject("Something Went wrong!");
          }
        })
    );
  })
}

//this.function will be used for uploading files

// export function handleFileSubmit(currFile) {

//   if (currFile) {
//     Aws.config.update({
//       //getting credential of aws from .env file
//       accessKeyId: process.env.REACT_APP_AWS_ID,
//       secretAccessKey: process.env.REACT_APP_AWS_SECRET
//     });

//     // Instanciating a new S3 object and gathering a pre-signed url
//     let s3 = new Aws.S3({ signatureVersion: 'v4', region: 'ap-southeast-1' });
//     let param = {
//       Bucket: 'virtualclassroombucket',
//       Fields: {
//         Key: 'attachment/' + currFile.name,
//       }
//     };

//     s3.createPresignedPost(param, (err, data) => {
//       if (err) {
//         console.log('error : ' + err);
//         return;
//       }
//       //The post datas are created and can be appended to the formData object
//       let formData = new FormData();
//       Object.keys(data.fields).map((key) => {
//         formData.append(key, data.fields[key])
//       });
//       //We add our file to the formData
//       formData.append('file', currFile);
//       //Instanciating, and sending our XmlHttpRequest
//       let request = new XMLHttpRequest();

//       // https://virtualclassroomapp.s3-ap-southeast-1.amazonaws.com/attachment/mcqBack.png
//       request.addEventListener('loadstart', (e) => {
//         console.log('started', e)
//       });
//       request.addEventListener('load', (e) => {
//         console.log('loaded', e)
//       });
//       request.addEventListener('loadend', (e) => {
//         console.log('ended', e.currentTarget.responseURL)
//         return 'true';
//       });
//       request.addEventListener('progress', (e) => {
//         console.log('progress', e)
//       });
//       request.addEventListener('error', (e) => {
//         console.log('error', e)
//       });
//       request.addEventListener('abort', (e) => {
//         console.log('aborted', e)
//       });

//       request.open('POST', data.url);
//       request.send(formData);
//     });
//   } else {
//     return
//   }

// }

