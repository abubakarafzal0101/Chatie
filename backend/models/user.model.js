import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://imgs.search.brave.com/K8DlNvgZVTmJJTQhS1RvTKf_PIVqzHdtxRvoZgvxGII/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzE2LzQxLzgyLzQz/LzM2MF9GXzE2NDE4/MjQzMTRfSHZaaEFK/R2FDOFg0WjhGZ0xH/QnQ3WnpxTk5DbUY3/bmkuanBn",
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
