import { existsSync } from "fs"
import sharp from "sharp"

export async function validateLocalImagePath(value: string) {
  try {
    if (
      !value.endsWith(".jpg") &&
      !value.endsWith(".png") &&
      !value.endsWith(".jpeg") &&
      !value.endsWith(".webp")
    ) {
      return "Unsupported extension. Expected one of: .jpg, .png, .jpeg, .webp"
    }

    const fileExists = existsSync(value)

    if (!fileExists) {
      return "File does not exist"
    }

    const image = sharp(value)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      return "Image dimensions are not available"
    }

    if (metadata.width < 878 || metadata.height < 497) {
      return "Image dimensions must be at least 878x497"
    }

    if (metadata.height > metadata.width) {
      return "Image height must be less than or equal to image width"
    }

    return true
  } catch (error) {
    return (error as Error).message
  }
}

export async function generateImageBuffer(path: string) {
  return await sharp(path).resize(800, null).jpeg({ mozjpeg: true }).toBuffer()
}
