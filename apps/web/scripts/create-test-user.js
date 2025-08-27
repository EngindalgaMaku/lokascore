const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log("🔄 Test kullanıcıları oluşturuluyor...");

    // Admin kullanıcısı
    const hashedAdminPassword = await bcrypt.hash("admin123", 12);
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@lokascore.com" },
      update: {},
      create: {
        email: "admin@lokascore.com",
        name: "Admin User",
        firstName: "Admin",
        lastName: "User",
        password: hashedAdminPassword,
        role: "ADMIN",
        isActive: true,
      },
    });

    // Normal kullanıcı
    const hashedUserPassword = await bcrypt.hash("user123", 12);
    const normalUser = await prisma.user.upsert({
      where: { email: "user@lokascore.com" },
      update: {},
      create: {
        email: "user@lokascore.com",
        name: "Test User",
        firstName: "Test",
        lastName: "User",
        password: hashedUserPassword,
        role: "USER",
        isActive: true,
      },
    });

    // Super Admin kullanıcısı
    const hashedSuperAdminPassword = await bcrypt.hash("superadmin123", 12);
    const superAdminUser = await prisma.user.upsert({
      where: { email: "superadmin@lokascore.com" },
      update: {},
      create: {
        email: "superadmin@lokascore.com",
        name: "Super Admin",
        firstName: "Super",
        lastName: "Admin",
        password: hashedSuperAdminPassword,
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Test kullanıcıları başarıyla oluşturuldu:");
    console.log("📧 Admin: admin@lokascore.com | Şifre: admin123");
    console.log("📧 User: user@lokascore.com | Şifre: user123");
    console.log(
      "📧 Super Admin: superadmin@lokascore.com | Şifre: superadmin123"
    );

    console.log("\n🎯 Kullanıcı ID'leri:");
    console.log(`Admin ID: ${adminUser.id}`);
    console.log(`User ID: ${normalUser.id}`);
    console.log(`Super Admin ID: ${superAdminUser.id}`);
  } catch (error) {
    console.error("❌ Test kullanıcıları oluşturulurken hata:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
