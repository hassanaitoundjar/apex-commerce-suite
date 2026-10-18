import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getAuthUser, isSuperAdmin, hasPermission, checkDemoMode } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getAuthUser();
    if (!currentUser || (currentUser.role !== "super_admin" && !currentUser.permissions?.includes("admins"))) {
      return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
    }

    const admins = await User.find({
      role: { $in: ["admin", "super_admin"] },
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ admins });
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch admins" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const demoCheck = checkDemoMode();
    if (demoCheck) return NextResponse.json(demoCheck, { status: 403 });

    await dbConnect();
    const currentUser = await getAuthUser();
    if (!currentUser || (currentUser.role !== "super_admin" && !currentUser.permissions?.includes("admins"))) {
      return NextResponse.json({ error: "Access denied. Super Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { username, email, password, role = "admin", permissions = [], phone = "" } = body;

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // All newly created staff accounts are standard administrators with custom permissions
    // The Super Administrator is unique and created exclusively during store installation
    const targetRole = "admin";

    // Check duplicate
    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email or username already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: targetRole,
      permissions: Array.isArray(permissions) ? permissions : [],
      phone: phone.trim(),
      passwordSet: true,
      provider: "credentials",
    });

    const resUser = newAdmin.toObject ? newAdmin.toObject() : { ...newAdmin };
    delete resUser.password;

    return NextResponse.json({ message: "Admin created successfully", admin: resUser }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ error: error.message || "Failed to create admin" }, { status: 500 });
  }
}
