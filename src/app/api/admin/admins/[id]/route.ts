import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getAuthUser, checkDemoMode } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const demoCheck = checkDemoMode();
    if (demoCheck) return NextResponse.json(demoCheck, { status: 403 });

    await dbConnect();
    const currentUser = await getAuthUser();
    if (!currentUser || (currentUser.role !== "super_admin" && !currentUser.permissions?.includes("admins"))) {
      return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
    }

    const { id } = await params;
    const targetAdmin = await User.findById(id);
    if (!targetAdmin) {
      return NextResponse.json({ error: "Administrator not found" }, { status: 404 });
    }

    // The primary super_admin installation account cannot be edited
    if (targetAdmin.role === "super_admin") {
      return NextResponse.json({ error: "The primary Super Administrator account cannot be modified." }, { status: 400 });
    }

    const body = await req.json();
    const { username, email, password, role, permissions, phone } = body;

    const updateData: any = {};

    if (username && username.trim()) {
      const cleanUsername = username.trim().toLowerCase();
      // Check if username taken by another user
      const existing = await User.findOne({ username: cleanUsername, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
      updateData.username = cleanUsername;
    }

    if (email && email.trim()) {
      const cleanEmail = email.trim().toLowerCase();
      // Check if email taken by another user
      const existing = await User.findOne({ email: cleanEmail, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json({ error: "Email is already taken." }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }

    // Role assignment
    if (role) {
      if (role === "super_admin" && targetAdmin.role !== "super_admin") {
        return NextResponse.json({ error: "Cannot create additional Super Admins. Only the installation account is Super Admin." }, { status: 400 });
      } else if (role === "admin") {
        // Prevent demoting the last super admin
        if (targetAdmin.role === "super_admin") {
          const superAdminCount = await User.countDocuments({ role: "super_admin" });
          if (superAdminCount <= 1) {
            return NextResponse.json({ error: "Cannot demote the only remaining Super Admin." }, { status: 400 });
          }
        }
        updateData.role = "admin";
        if (Array.isArray(permissions)) {
          updateData.permissions = permissions;
        }
      }
    } else if (Array.isArray(permissions)) {
      if (targetAdmin.role === "admin") {
        updateData.permissions = permissions;
      }
    }

    if (password && password.trim()) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select("-password");

    return NextResponse.json({ message: "Admin updated successfully", admin: updated });
  } catch (error: any) {
    console.error("Error updating admin:", error);
    return NextResponse.json({ error: error.message || "Failed to update admin" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const demoCheck = checkDemoMode();
    if (demoCheck) return NextResponse.json(demoCheck, { status: 403 });

    await dbConnect();
    const currentUser = await getAuthUser();
    if (!currentUser || currentUser.role !== "super_admin") {
      return NextResponse.json({ error: "Access denied. Only Super Admins can delete administrator accounts." }, { status: 403 });
    }

    const { id } = await params;

    // Prevent deleting self
    const currentUserId = (currentUser.id || currentUser._id)?.toString();
    if (currentUserId === id) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    const targetAdmin = await User.findById(id);
    if (!targetAdmin) {
      return NextResponse.json({ error: "Administrator not found" }, { status: 404 });
    }

    // If target is super_admin, make sure there is at least one other super_admin remaining
    if (targetAdmin.role === "super_admin") {
      const superAdminCount = await User.countDocuments({ role: "super_admin" });
      if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot delete the only remaining Super Admin account." }, { status: 400 });
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "Administrator deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return NextResponse.json({ error: error.message || "Failed to delete admin" }, { status: 500 });
  }
}
