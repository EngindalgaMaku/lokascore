import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: "Tüm alanları doldurun" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi ile zaten bir hesap mevcut" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "USER",
        isActive: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Hesap başarıyla oluşturuldu",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle database connection errors
    if (
      error instanceof Error &&
      error.message.includes("Can't reach database server")
    ) {
      return NextResponse.json(
        {
          message:
            "Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Kayıt olurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
