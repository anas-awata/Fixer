import { useState } from "react";
import Toast from "react-native-toast-message";
import {
  AssignTicket,
  StaffMarkAsDone,
  StaffRejectTicket,
} from "../services/service";
import useFormErrorHandling from "./use-form-error-handling";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

const useStaffTicketMutations = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const queryClient = useQueryClient();

  const [error, setError] = useState(null);

  // Assign Ticket Mutation
  const assignTicketMutation = useMutation({
    mutationFn: AssignTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-staff-available-services"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-staff-assigned-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Assigned successfully",
      });
      navigation.navigate("myTickets");
    },
    onError: (error: any) => {
      console.log("staff", error);
      if (error.response && error.response.status === 400) {
        useFormErrorHandling(error, setError);
      } else {
        Toast.show({
          type: "error",
          text1: "Something went wrong please try again later",
        });
      }
    },
  });

  // Reject Ticket Mutation
  const rejectTicketMutation = useMutation({
    mutationFn: StaffRejectTicket,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-staff-available-services"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-staff-assigned-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Rejected successfully",
      });
      navigation.navigate("myTickets");
    },
    onError: (error) => {
      console.log("staff", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  // Mark Ticket as Done Mutation
  const markAsDoneMutation = useMutation({
    mutationFn: StaffMarkAsDone,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-staff-available-services"],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-staff-assigned-services"],
      });
      Toast.show({
        type: "success",
        text1: "Service Marked As Done successfully",
      });
      navigation.navigate("myTickets");
    },
    onError: (error) => {
      console.log("staff", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong please try again later",
      });
    },
  });

  return {
    assignTicket: assignTicketMutation.mutate,
    isAssignTicketPending: assignTicketMutation.isPending,
    assignTicketError: error,
    rejectTicket: rejectTicketMutation.mutate,
    isRejectTicketPending: rejectTicketMutation.isPending,
    rejectTicketError: rejectTicketMutation.error,
    markAsDone: markAsDoneMutation.mutate,
    isMarkAsDonePending: markAsDoneMutation.isPending,
    markAsDoneError: markAsDoneMutation.error,
  };
};

export default useStaffTicketMutations;
