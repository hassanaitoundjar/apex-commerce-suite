import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const BlogPost = createPrismaModelAdapter("blogPost", {
  thumbnail: "",
  author: "Admin",
  published: false,
});

export default BlogPost;
