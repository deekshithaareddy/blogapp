import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  loadingClass,
} from "../styles/common";
import {useAuth} from "../stores/AuthStore"

function WriteArticles() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const currentUser = useAuth((state) => state.currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  //save article
  const submitArticle = async (articleObj) => {
  try {
    setLoading(true);
    // create formdata
    const formData = new FormData();
    formData.append("title", articleObj.title);
    formData.append("category", articleObj.category);
    formData.append("content", articleObj.content);
    formData.append("author", currentUser._id);
    // append thumbnail
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    // api call
    let res = await axios.post(
      "https://blogapp-s4r1.onrender.com/author-api/article",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.status === 201) {
      reset();
      setThumbnail(null);
      toast.success("Article published successfully");
      navigate("../articles");
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Failed to publish article"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={formCard}>
      <h2 className={formTitle}>Write New Article</h2>

      <form onSubmit={handleSubmit(submitArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input
            type="text"
            className={inputClass}
            placeholder="Enter article title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea
            rows="8"
            className={inputClass}
            placeholder="Write your article content..."
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>
        {/* Thumbnail */}
        <div className={formGroup}>
          <label className={labelClass}>
            Upload Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            className={inputClass}
            onChange={(e) => setThumbnail(e.target.files[0])}
          />

        </div>

        {/* Submit */}
        <button className={submitBtn} type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Article"}
        </button>

        {loading && <p className={loadingClass}>Publishing article...</p>}
      </form>
    </div>
  );
}

export default WriteArticles;
