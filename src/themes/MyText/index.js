import React from "react";
import {Text} from "react-native";
import theme from "../index"

export default  props => <Text {...props} style={[{fontFamily:theme.fonts.fontNormal,color:theme.color.mainTextColor}, props.style]}>{props.children}</Text>