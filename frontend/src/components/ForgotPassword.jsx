import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";

import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
  loadingClass,
} from "../styles/common";

function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (userPassObj) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/common-api/password`,
        userPassObj,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Password updated successfully", {
        duration: 2000,
      });

      reset();

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to update password"
      );
    }
  };

  return (
    <div
      className={`${pageBackground} flex items-center justify-center py-16 px-4`}
    >
      <div className={formCard}>
        <h2 className={formTitle}>Change Password</h2>

        <p className={`${mutedText} text-center mb-5`}>
          Enter your current password and choose a new one
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current Password */}
          <div className={formGroup}>
            <label className={labelClass}>Current Password</label>

            <input
              type="password"
              placeholder="Current password"
              className={inputClass}
              {...register("currentPassword", {
                required: "Current password is required",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Current password cannot be empty",
              })}
            />

            {errors.currentPassword && (
              <p className={errorClass}>
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className={formGroup}>
            <label className={labelClass}>New Password</label>

            <input
              type="password"
              placeholder="New password"
              className={inputClass}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                validate: (value) =>
                  value.trim().length > 0 ||
                  "New password cannot be empty",
              })}
            />

            {errors.newPassword && (
              <p className={errorClass}>{errors.newPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        {isSubmitting && (
          <p className={`${loadingClass} mt-3`}>Please wait...</p>
        )}

        <p className={`${mutedText} text-center mt-5`}>
          Back to{" "}
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
