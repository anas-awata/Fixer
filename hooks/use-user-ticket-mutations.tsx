import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {
  ClientAcceptServicePrice,
  ClientRateService,
  ClientRejectServicePrice,
} from "../services/service";

const useUserTicketMutations = () => {
  const queryClient = useQueryClient();
  const [error, setError] = useState(null);

  // Reject Service Mutation
  const rejectServiceMutation = useMutation({
    mutationFn: ClientRejectServicePrice,
    onSuccess: (data) => {
      invalidateQueries();
      Toast.show({
        type: "success",
        text1: "Service Rejected successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      handleError();
    },
  });

  // Accept Service Mutation
  const acceptServiceMutation = useMutation({
    mutationFn: ClientAcceptServicePrice,
    onSuccess: (data) => {
      invalidateQueries();
      Toast.show({
        type: "success",
        text1: "Service Accepted successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      handleError();
    },
  });

  // Rate Service Mutation
  const rateServiceMutation = useMutation({
    mutationFn: ClientRateService,
    onSuccess: (data) => {
      invalidateQueries();
      Toast.show({
        type: "success",
        text1: "Service Rated successfully",
      });
    },
    onError: (error) => {
      console.log("error", error);
      handleError();
    },
  });

  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["get-user-services-in-progress"],
    });
    queryClient.invalidateQueries({ queryKey: ["get-user-services"] });
    queryClient.invalidateQueries({ queryKey: ["get-user-service-by-id"] });
  };

  const handleError = () => {
    Toast.show({
      type: "error",
      text1: "Something went wrong please try again later",
    });
  };

  return {
    rejectService: rejectServiceMutation.mutate,
    isRejectServicePending: rejectServiceMutation.isPending,
    rejectServiceError: error,
    acceptService: acceptServiceMutation.mutate,
    isAcceptServicePending: acceptServiceMutation.isPending,
    acceptServiceError: error,
    rateService: rateServiceMutation.mutate,
    isRateServicePending: rateServiceMutation.isPending,
    rateServiceError: error,
  };
};

export default useUserTicketMutations;
