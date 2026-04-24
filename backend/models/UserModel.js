import {Schema,model} from 'mongoose'

const userSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already existed"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,"{Value} is an invalid role"]
    },
    profileImageUrl:{
        type:String,
        default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAACUCAMAAAAnDwKZAAAAQlBMVEX6+vqPj4////+Hh4fHx8eMjIyEhISTk5OXl5fi4uKBgYH19fWgoKDOzs7R0dHp6emwsLDb29u5ubmoqKjAwMDv7+864XQ2AAADRklEQVR4nO2bzZajIBBGsRAUUAF/3v9VB5PpjN0TDSRC2efU3fSiN/cUUAIfYYwgCIIgCIIgCIIgCOLXAg+wTZ4StIztZxeYB2vY5SyBqXriWnIR4FLzqVeXqiWAnyouqg2CN85fSFK18pvfX0vZWWyzO2AcfyJ4kxTjFeYkqHZHcIV3Ft0Rhr0SfhXSIzsGwyPBCzhC/8oQ2xHUa8PVccFzNEcrZePYoRmyMaaIq+OMVEawkYbBEan1QBM1zDfFCUURfHQRq0rilHGKLmIoo0NQBNXEG1ZVi7CjiOnaG/iAUMaUcQ6KY3lDlmRYiba4IFidpFhJU1zRy0RFVXoyQp20WoJi8f0OzImKvC+uGLuFeCjWpPi/YvJcLN67YUhd0eWXS3JfXAobhkNBYhVFcUPG4s4tD8OpvGFiYyzfFtcvYNo+ovj3L2C6lF03wjivnTFBEWVHG0hY0wLpkFpHO2IVMX424szElfhFjXcPGjnU5XcQW0cX0b/5iHtP+9oR5Xi6xUwvxlo7ZMPAKA4WjRDFN9tPAF/tDjZvsPOCO7DsZEOCj4i33N8B5ZqflmsIiB8L/QOYnRvNv2alEFK3tb1CuLYFwPaua290rl8ulKJuAABjlsWwq8b6BFEc+IQygtbXb+PzNyMwdaUlfxupm8FklQTVJd7ZPflwZ30u8eohRKxkvpsJUCcIro5NtjpCyhXJoWOu7Bf6xFvPfXSmne5pRcxXxiUp3T2mzRK3hTPKeTRZ4ulzFbP0HfAnDnQuxfMMf4Viluad+F7jlWIGQ8bs5ZsOY+1phqLL9HVJe1NyqJjpZVFyvrtPtlh1OW0bke25yfU3YxFve2MV8906LueUMWcMc1IZec6r21NmI8/6JBTs0d17HKLJ+0oiNSh/Ru7w/OMzVq6T1dbxo2+MECXyQBjen4+lfm8ASrxZSN6WijmAje/c7QgxF4w5wHeJj53COpnKhm0AQ5syJYXoyv+eDZifIuekkJXzKFEWMFtvUrW98nHd9gte1gZgatdV/KlnsBNN53qDnWUFS+Xn4Cm1lvJ2DR7+aM2rztVeofvduWcVxio/DH1d98Pg7WJu/8BW+0HxfIUgCIIgCIIgCIIgCCILfwDE/iYyinbkVAAAAABJRU5ErkJggg=="
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

// create model
export const userModel=model("user",userSchema)





