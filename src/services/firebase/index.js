// import auth from '@react-native-firebase/auth';
// import utils from "../../utils/index"
// import  {useEffect} from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import firestore from '@react-native-firebase/firestore';
// import allActions from "../../store/redux/allActions"
 


// const firebase={
//   __doSingIn,
//   __doSingUp,
//   FireBaseFunction,
//   __Add_Product 
// }

// export default firebase;

 



//    const __doSingIn = async (email, password) => {
 
//         try {
//       let response = await auth().signInWithEmailAndPassword(email, password)
     
      
  
//       if (response && response.user) {
//        // AlertMessage.alert("Success ✅", "Authenticated successfully")
//         return response;
//       }
      
//     } catch (error) {
        
//           var errorMessage = error.message;
//           var si  = errorMessage.indexOf("]")+1
//           var  ei  = errorMessage.length -1
//           const msg = errorMessage.substr(si,ei)
 
//       utils.AlertMessage("",msg)
//       return false;
     
 
//     }
//     }

//     const __doSingUp = async (email, password) => {
//         try {
//           let response = await  auth().createUserWithEmailAndPassword(email,password) 
         
//           if (response) {
//            // AlertMessage.alert("Success ✅", "Authenticated successfully")
//             return response;
//           }
          
//         } catch (error) {
//               var errorMessage = error.message;
//               var si  = errorMessage.indexOf("]")+1
//               var  ei  = errorMessage.length -1
//               const msg = errorMessage.substr(si,ei)
//               utils.AlertMessage("",msg)
//               return false;
         
//         }
//       }
 
//       const __Add_Product = async (product) => {
//         try {    
//        let response =   firestore().collection("products").add(product)
//           if (response) {
//            // AlertMessage.alert("Success ✅", "Authenticated successfully")
//             return response;
//           }else{
//             return false;
//           }
          
//         } catch (error) {
//               var errorMessage = error.message;
//               var si  = errorMessage.indexOf("]")+1
//               var  ei  = errorMessage.length -1
//               const msg = errorMessage.substr(si,ei)
//               utils.AlertMessage("",msg)
//               return false;
         
//         }
//       }
      
 
//   export    function FireBaseFunction (props) {

//     const dispatch = useDispatch()
//   //  const userData = useSelector(state => state.userReducer)
  
//     useEffect(() => {
//       let type=props.type || ""
//       let uid=props.uid || ""

//       if(type=="set-user-data"){
//         SetUserData(uid)
//       }

//       if(type=="logout-user"){
//         LogOut()
//       }

//       if(type=="set-products-data"){
//         SetProductsData(uid)
//       }
      
   

//     }, [])
  
  
//   function SetUserData  (uid)  {
   
//   try {
//     const unsubscribe = firestore().collection("users").doc(uid).onSnapshot(async  (doc)=>{
//     let  data= []
//     if(doc.exists){
//      data = doc.data()
//      }  
     
//      dispatch(allActions.u_action.setUser(data))
//      //unsubscribe()
//   })
 
// } catch (error) {
//         var errorMessage = error.message;
//         var si  = errorMessage.indexOf("]")+1
//         var  ei  = errorMessage.length -1
//         const msg = errorMessage.substr(si,ei)
//         utils.AlertMessage("",msg)
//   }
   
   
//   }

//   function SetProductsData  (uid)  {
   
    
//     try {
 
//       const unsubscribe = firestore().collection("products").onSnapshot(async  (d )=>{
//        let arr=[]
//        if(d.docs){
//         d.docs.map((data)=>{
//           const u=data.data();
//           if(u.uid==uid)
//           {arr.push(u)}
//         })
       
//       }
      
//        dispatch(allActions.p_acton.setProducts(arr))
//        //unsubscribe()
//     })
   
//   } catch (error) {
//           var errorMessage = error.message;
//           var si  = errorMessage.indexOf("]")+1
//           var  ei  = errorMessage.length -1
//           const msg = errorMessage.substr(si,ei)
//           utils.AlertMessage("",msg)
//     }
     
     
//     }

//   function LogOut()  {
//     console.log("logout functn call")
//     try {
//       auth().signOut()
//       .then(()=>
//       console.log("Logout"),
//       dispatch(allActions.u_action.logOut())
//       )
//       .catch(error=>{ utils.AlertMessage("",error.message)});
// } catch (error) {
//       var errorMessage = error.message;
//       var si  = errorMessage.indexOf("]")+1
//       var  ei  = errorMessage.length -1
//       const msg = errorMessage.substr(si,ei)
//       utils.AlertMessage("",msg)
 
// }


// }
 
//   return null
  
//   }
 

  


