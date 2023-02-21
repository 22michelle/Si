import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El campo title es ocligatorio"],
    },
  },
  {
    description: {
      type: String,
      required: [true, "El campo description es ocligatorio"],
    },
  },
  {
    imgUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

postSchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};
export const postModel = model("post", postSchema);
