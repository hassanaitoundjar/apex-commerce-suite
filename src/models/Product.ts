import { createPrismaModelAdapter } from "@/lib/prismaModelAdapter";

const Product = createPrismaModelAdapter("product", {
  brand: "SnapShop",
  sizes: [],
  colors: [],
  images: [],
  stock: 0,
  ratings: 5,
  reviewsCount: 0,
  isFeatured: false,
  isOnSale: false,
  isAvailable: true,
  reviews: [],
});

export default Product;
