import {
  deleteImageCloudinary,
  uploadImageToCloudinary,
} from "../helpers/cloudinary.action.js";
// import { deleteImg } from "../helpers/deleteImg.js";
import { response } from "../helpers/Response.js";
import { postModel } from "../models/post.model.js";

const postCtrl = {};

postCtrl.create = async (req, reply) => {
  try {
    const { title, description, imgurl } = req.body;
    const newPost = new postModel({
      title,
      description,
      imgurl,
    });

    if (req.file) {
      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      newPost.setImg({ secure_url, public_id });
    }

    await postModel.create(newPost);
    response(reply, 201, true, newPost, "Post creado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.listAll = async (req, reply) => {
  try {
    const posts = await postModel.find();
    response(reply, 200, true, posts, "Lista de posts");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.listById = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro no encontrado");
    }
    response(reply, 200, true, post, "Registro encontrado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.delete = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro no encontrado");
    }

    if (post.public_id) {
      await deleteImageCloudinary(post.public_id);
    }

    await post.deleteOne();
    response(reply, 200, true, post, "Registro eliminado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

postCtrl.update = async (req, reply) => {
  try {
    const { id } = req.params;
    const post = await postModel.findById(id);
    if (!post) {
      return response(reply, 404, false, "", "Registro no encontrado");
    }

    if (req.file) {
      if (post.public_id) {
        await deleteImageCloudinary(post.public_id);
      }

      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      post.setImg({ secure_url, public_id });

      await post.save();
    }

    await post.updateOne(req.body);
    response(reply, 200, true, post, "Registro actualizado");
  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
};

export default postCtrl;
