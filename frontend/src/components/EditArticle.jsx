import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect,useState } from "react";
import axios from "axios";


import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  articlePageWrapper,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;
  const [thumbnail, setThumbnail] = useState(null);

  if (!article) {
  return <p>No article data found</p>;
}

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // prefill form
  useEffect(() => {
    if (!article) return;

     setValue("title", article.title);
     setValue("category", article.category);
     setValue("content", article.content);
  }, [article]);

  const updateArticle = async (modifiedArticle) => {
  try {
    const formData = new FormData();
    formData.append("title", modifiedArticle.title);
    formData.append("category", modifiedArticle.category);
    formData.append("content", modifiedArticle.content);
    formData.append("articleId", article._id);
    // append thumbnail if selected
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    let res = await axios.put(
      "https://blogapp-s4r1.onrender.com/author-api/articles",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.status === 200) {
      navigate(`/article/${article._id}`, {
        state: res.data.payload,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input className={inputClass} {...register("title", { required: "Title required" })} />

          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <input
            type="text"
            list="categories"
            className={inputClass}
            placeholder="Enter category"
            {...register("category", {
              required: "Category required",
            })}
          />

          <datalist id="categories">
            <option value="Technology" />
            <option value="Programming" />
            <option value="AI" />
            <option value="Cyber Security" />
            <option value="Food" />
            <option value="Travel" />
            <option value="Sports" />
            <option value="Lifestyle" />
          </datalist>

          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea rows="14" className={inputClass} {...register("content", { required: "Content required" })} />

          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn}>Update Article</button>
      </form>
    </div>
  );
}

export default EditArticle;
