 
// const link = "https://c0a23827e3e8.ngrok.io/"

//local link
const link = "http://localhost:5000/"

const getAlbums = "album/list"
const getAlbumsById = "customer/albums?customer_id=" //login cstmr buy albums
const getArtists = "display/artists"
const getSongs = "songs/list"
const getWishlist = "wishlist?user_id="   //get wishlist customer
const addWishlist= "wishlist/add?user_id="
const removeWishlist= "wishlist/remove?user_id="
const login = "login"

 

export { link, getAlbums,getArtists,getSongs,login,getAlbumsById,getWishlist,addWishlist,removeWishlist}