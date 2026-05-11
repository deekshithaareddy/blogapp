import { useForm } from "react-hook-form";
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
} from "../styles/common";
import { NavLink } from "react-router";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // call forgot password API here
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Forgot Password</h2>

        <p className={`${mutedText} mb-4 text-center`}>
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={formGroup}>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <button type="submit" className={submitBtn}>
            Send Reset Link
          </button>
        </form>

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
