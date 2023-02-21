import postCtrl from "../controllers/post.controller.js";

export const postRoutes = (fastify, opts, done) => {
  fastify.get("/", postCtrl.listAll);
  fastify.get("/:id", postCtrl.listById);
  fastify.delete("/:id", postCtrl.delete);
  fastify.put("/:id", postCtrl.update);
  fastify.post("/", postCtrl.create);
  done();
};
