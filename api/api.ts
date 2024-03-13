import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";

export const fetchApi = async (
  url: string,
  method?: string,
  data?: any,
  formData?: boolean
) => {
  const token = await AsyncStorage.getItem("token"); // Retrieve token from AsyncStorage

  try {
    const headers = {
      Authorization: token ? `Token ${token}` : null,
      "Accept-Language": "ar",
      "Content-Type": "",
    };

    if (formData) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    const response = await axios({
      url: "https://fixit-fuav.onrender.com" + url,
      method: method || "GET",
      data,
      headers,
    });

    return response;
  } catch (error: any) {
    handleApiError(error, token!);
    throw error;
  }
};

const handleApiError = async (error: AxiosError, token: string | null) => {
  //   const navigation = useNavigation<NavigationProp<ParamListBase>>();

  if (error.response) {
    const { data, status } = error.response;
    console.log("Response Error:", data);
    console.log("Response Status:", status);
    console.log("Response Headers:", error.response.headers);

    if (status === 401) {
      console.log("UnAuthenticated Error");
      if (token) {
        // console.log("clear");
        // await AsyncStorage.clear();
        // navigation.navigate("log-in");
      }
    } else if (status === 403) {
      console.log("UnauthorizedError");
      return error.response;
    } else if (status === 404) {
      console.log("Not Found Error");
      throw new Error("NotFoundError");
    } else if (status === 422 || status === 400) {
      console.log("Status Code 422 Error");
      return error.response;
    } else {
      console.log("Other Error");
      throw new Error("OtherError");
    }
  } else if (error.request) {
    console.log("Request Error:", error.request);
    throw new Error("NetworkError");
  } else {
    console.log("Error:", error.message);
  }
};
