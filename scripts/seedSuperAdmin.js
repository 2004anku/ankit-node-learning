require("dotenv").config();

const bcrypt = require("bcrypt");

const connectDB = require("../config/db"); // <-- Update this path if your DB file is elsewhere

const SuperAdmin = require("../features/super-admin/auth/auth.model");

const seedSuperAdmin = async () => {
  try {
    // CONNECT DATABASE
    await connectDB();

    // CHECK IF SUPER ADMIN EXISTS
    const existingSuperAdmin = await SuperAdmin.findOne({
      email: process.env.SUPER_ADMIN_EMAIL,
    });

    if (existingSuperAdmin) {
      console.log("✅ Super Admin already exists.");
      process.exit();
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10,
    );

    // CREATE SUPER ADMIN
    await SuperAdmin.create({
      fullName: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
    });

    console.log("🎉 Super Admin created successfully.");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedSuperAdmin();
