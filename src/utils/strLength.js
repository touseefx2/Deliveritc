

const assignL = (type)=>{


if(type=="name"){  
    return 27
}
else if(type=="docname" || type=="videoname"){  
    return 8
}
else if(type=="submitscreentasktitle"){  
    return 30
}
else if(type=="title"){  
    return 40
}
else if(type=="welcomeName"){  
    return 18
}
else if(type=="headertitle"){  
    return 15
}
else if(type=="skillhours"){  
    return 25
}
else if(type=="chatTitle"){  
    return 22
}
else if(type=="ChatLM"){  
    return 30
}
else if(type=="companyname"){  
    return 35
}
else if(type=="skillname"){  
    return 15
}
else if(type=="studentnameh"){  
    return 12
}
else if(type=="skillnameS"){  
    return 18
}
else if(type=="skillnameSub"){  
    return 36
}
else if(type=="tasknameSub"){  
    return 36
}
else if(type=="taskname"){  
    return 18
}
else if(type=="nameTitleStack"){  
    return 30
}
else if(type=="tasknameS"){  
    return 70
}
else if(type=="skilldeadline"){  
    return 30
}
else if(type=="skilldesc"){  
    return 116
}
else if(type=="skilldescShort"){  
    return 72
}
else if(type=="phone"){   
    return 20
}
else if(type=="city"){
    return 22
}
else if(type=="category"){
    return 35
}
else if(type=="product_name"){
    return 35
}
else if(type=="starting_amount"){
    return 35
}
else if(type=="chattext"){
    return 200
}
}

export const  strLength =  (str,type)=>{
 let length= assignL(type)
 
 let strng= str;
 if (str.length > length){
  strng =  str.substring(0, length)+".."
  if(type=="skilldesc" ||  type=="skilldescShort"){strng=strng+".."}
 } 
     return strng
}