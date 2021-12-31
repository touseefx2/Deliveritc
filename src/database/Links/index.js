 
// const link = "https://c0a23827e3e8.ngrok.io/"

//local link
const links = "http://10.7.148.136:3001/"

const login = "user/loginCaptain"
const signup="user/addCaptain"
const updateUser="user/updateUser/"
const updateTerms="user/termsAccepted/"
const uploadFile="upload/uploadFile"
const getCar="vehicle?owner="
const getUserById="user?_id="
const getTripsbyId="trip/getTrips?_id="
const acceptTrip="trip/acceptTrip/"
const skipTrip="user/skipTrip/"
const arriveTrip="trip/arriveTrip/"

const cancelTrip="trip/cancelTrip/"
// const getAlbumsById = "customer/albums?customer_id=" //login cstmr buy albums
 


export  default link ={
    links,login,signup,updateUser
    ,uploadFile,getCar,updateTerms
    ,getUserById,getTripsbyId,acceptTrip,arriveTrip,
    skipTrip,cancelTrip}
