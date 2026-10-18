import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const { name, rating, comment } = await req.json();

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: "Name, rating, and comment are required." }, { status: 400 });
    }

    if (name.trim().length > 100) {
      return NextResponse.json({ error: "Name cannot exceed 100 characters." }, { status: 400 });
    }

    if (comment.trim().length > 1000) {
      return NextResponse.json({ error: "Review comment cannot exceed 1000 characters." }, { status: 400 });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: "Rating must be a number between 1 and 5." }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Initialize reviews array if it doesn't exist
    if (!product.reviews) {
      product.reviews = [];
    }

    // Limit maximum reviews per product document to prevent MongoDB BSON size overflow
    if (product.reviews.length >= 500) {
      return NextResponse.json({ error: "This product has reached the maximum review limit." }, { status: 400 });
    }

    // Add review
    const newReview = {
      name: name.trim(),
      rating: ratingVal,
      comment: comment.trim(),
      createdAt: new Date(),
    };

    product.reviews.push(newReview);
    
    // Recalculate ratings average and count
    product.reviewsCount = product.reviews.length;
    const ratingSum = product.reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0);
    product.ratings = Number((ratingSum / product.reviewsCount).toFixed(1));

    await product.save();

    // Find the newly inserted review to return
    const savedReview = product.reviews[product.reviews.length - 1];

    return NextResponse.json({
      success: true,
      review: savedReview,
      ratings: product.ratings,
      reviewsCount: product.reviewsCount
    }, { status: 201 });

  } catch (error: any) {
    console.error("Reviews API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit review" }, { status: 500 });
  }
}
