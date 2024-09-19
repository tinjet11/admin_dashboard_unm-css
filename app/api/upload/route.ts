import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const img = formData.get("file"); // Make sure the key matches the frontend

    if (!img) {
      return NextResponse.json({ success: false, message: "no image found" });
    }

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadedImageData = await uploadResponse.json();
    return NextResponse.json({
      uploadedImageData,
      message: "Success",
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", status: 500 });
  }
};
