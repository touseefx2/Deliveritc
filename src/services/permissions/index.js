  import { PermissionsAndroid } from "react-native";

let appname="Apprenticeship"

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: appname+"App Camera Permission",
        message:
        appname+"App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

export const requestWriteInternalStorage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: appname+"App Write Storage Permission",
          message:
          appname+"App needs access to your Storage " +
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use Write Storage");
      } else {
        console.log("Write Storage permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  

 export const requestReadExternalStorage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: appname+"App read Storage Permission",
          message:
          appname+"App needs access to your Storage " +
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the read Storage");
      } else {
        console.log("read Storage Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  export const requestLocationOn = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: appname+"App Get Location Permission",
          message:
          appname+"App needs access to your Current Location  " +
            "",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );

      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Location");
        return true;
      } else {
        console.log("Location Storage Permission denied");
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  


  export default{
      requestCameraPermission,
      requestReadExternalStorage,
      requestWriteInternalStorage,
      requestLocationOn
  }
