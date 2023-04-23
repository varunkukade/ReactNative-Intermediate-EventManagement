import { Dimensions } from "react-native"

const commonColors = {
    whiteColor: "#FFFFFF",
    blackColor: "#000000",
    commonPrimaryColor: "#4B0082"
}

export const colors = {
    "light": {
        primaryColor: commonColors.commonPrimaryColor,
        cardColor: commonColors.whiteColor,
        textColor: commonColors.commonPrimaryColor,
        buttonColor: commonColors.commonPrimaryColor,
        disabledButtonColor: "rgba(75, 0, 130, 0.5)",
        greyColor: "#909090",
        lavenderColor: "#E6E6FA",
        errorColor:"#ff3333",
        iconLightPinkColor:"#FC8EAC",
        lightLavenderColor: "rgb(245, 245, 255)",
        ...commonColors
    },
    "dark": {
        primaryColor: "#121212",
        cardColor: "#28282B",
        textColor: commonColors.whiteColor,
        buttonColor: commonColors.commonPrimaryColor, 
        disabledButtonColor: "rgba(75, 0, 130, 0.5)",
        greyColor: "#909090",
        lavenderColor: "#28282B",
        errorColor:"#ff3333",
        iconLightPinkColor:"#FC8EAC",
        lightLavenderColor: "#121212",
        ...commonColors
    },
}


export const measureMents = {
    leftPadding: 20,
    rightPadding: 20,
    windowWidth : Dimensions.get("window").width,
    windowHeight : Dimensions.get("window").height
}

export const fontStyles = {
    regular: "Nunito-Regular",
    semibold: "Nunito-SemiBold",
    bold: "Nunito-Bold",
    extraBold: "Nunito-ExtraBold"
}