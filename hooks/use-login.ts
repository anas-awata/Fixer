// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useMutation, UseMutationOptions } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import { fetchApi } from "../api/api";
// import { logIn } from "../models/auth";
// import { login } from "../services/auth";

// const useLogin = () => {
//   const { mutate, isPending, isError } = useMutation(

//     (data: logIn) => login(data), // Pass a function that returns a promise
//     {
//       onSuccess: (data: any) => {
//         if (data.token) {
//           AsyncStorage.setItem("token", data.token);
//         }
//       },
//       onError: (error: any) => {
//         if (error?.response?.status === 422) {
//           const errorMessage = error?.response.data.message;
//           Toast.show({
//             type: "error",
//             text1: errorMessage,
//           });
//         } else {
//           Toast.show({
//             type: "error",
//             text1: "Something went wrong, please try again later.",
//           });
//         }
//       },
//     } as UseMutationOptions<any, Error, logIn, unknown>
//   );

//   return {
//     isPending: isPending,
//     isError: isError,
//     login: mutate,
//   };
// };

// export default useLogin;
