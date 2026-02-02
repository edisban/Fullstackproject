import axiosInstance from "./axiosInstance";

export const deleteCurrentUser = async () => {
  await axiosInstance.delete("/users/me");
};
