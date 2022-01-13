 
// const link = "https://c0a23827e3e8.ngrok.io/"

//local link
const links = "http://10.7.148.141:3001/"
const socket="http://10.7.148.141:3001"

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
const startTrip="trip/startTrip/"
const endTrip="trip/endTrip/"
const getAvgRating="user/getAverageRating?user="
const cancelTrip="trip/cancelTrip/"
const addTripRating="trip/rateCustomer/"
const paycashEqual="trip/paybill/"
const paycashExtra="trip/paybill/addtodebit/"
const paycashLess="trip/paybill/addtocredit/"

const getcustomerWalletinfo="transaction_history/getHistoryByUser?user="

const gettripbyUserwithDate="user/tripbyuser?user="
const getportalwithDate="user/captainPortal?user="
const  gettotaltripCalculationwithDate="user/getTripRecord?user="

const getTripDispute="dispute?trip="
const addTripDispute="dispute/add"

const getTripTransctionHistory="transaction_history/getHistoryByTrip?trip="

// const getAlbumsById = "customer/albums?customer_id=" //login cstmr buy albums
 
 
export  default link ={
     links,login,signup,updateUser
    ,uploadFile,getCar,updateTerms
    ,getUserById,getTripsbyId,acceptTrip,arriveTrip,startTrip,endTrip,socket,addTripDispute,
    skipTrip,cancelTrip,getAvgRating,gettotaltripCalculationwithDate,getTripDispute,getTripTransctionHistory,
    paycashEqual,paycashExtra,paycashLess,addTripRating,getcustomerWalletinfo,gettripbyUserwithDate,getportalwithDate
}


