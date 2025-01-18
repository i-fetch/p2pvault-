import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif'],
          tokenPayload: JSON.stringify({
            // Optional, sent to your server on upload completion
            // For example, you could pass a user ID or other metadata
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Notify when the file upload is completed
        console.log('blob upload completed', blob, tokenPayload);

        try {
          // Handle any logic after the file upload, e.g., saving blob URL to DB
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ frontUrl: blob.url, backUrl: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error).message },
      { status: 400 },
    );
  }
}
