import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadBase64ToR2(
  base64DataUrl: string,
  petId: string
): Promise<string | null> {
  try {
    const match = base64DataUrl.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) return null

    const contentType = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    const ext = contentType.split('/')[1] || 'jpg'
    const key = `moments/${petId}/${Date.now()}.${ext}`

    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))

    return `${process.env.R2_PUBLIC_URL}/${key}`
  } catch (err) {
    console.error('[R2] 上传失败:', err instanceof Error ? err.message : err)
    return null
  }
}
