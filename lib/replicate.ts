"use client";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface ReplicateError {
  detail?: string;
  error?: string;
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries === 0 || (error instanceof Error && error.message.includes("Invalid API token"))) {
      throw error;
    }
    console.log(`Retrying operation, ${retries} attempts remaining...`);
    await delay(delayMs);
    return retryWithBackoff(operation, retries - 1, delayMs * 2);
  }
}

async function makeProxyRequest(endpoint: string, method: string = 'GET', payload?: any) {
  const token = localStorage.getItem("replicate_token") || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  
  if (!token) {
    throw new Error('Missing API token. Please configure your Replicate API token first.');
  }

  try {
    const response = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        method,
        payload,
        token,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export async function validateApiConnection(token: string): Promise<boolean> {
  try {
    const response = await fetch('/api/replicate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'models',
        method: 'GET',
        token,
      }),
    });
    
    const data = await response.json();
    return response.ok && data !== null;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

export async function generateImage(prompt: string) {
  const token = localStorage.getItem("replicate_token") || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN;
  
  if (!token) {
    throw new Error("Please configure your Replicate API token first");
  }

  try {
    console.log("Testing API connection...");
    const isConnected = await validateApiConnection(token);
    if (!isConnected) {
      throw new Error("Invalid API token. Please check your Replicate API token and try again.");
    }

    console.log("Initiating image generation...");
    
    const prediction = await retryWithBackoff(async () => {
      const result = await makeProxyRequest('predictions', 'POST', {
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt,
          negative_prompt: "blurry, distorted text, bad quality, watermark, signature, text, words, letters",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 768,
          height: 1024,
        },
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    });

    console.log("Generation initiated, prediction ID:", prediction.id);
    return getResult(prediction.id);
  } catch (error) {
    console.error("Error in generateImage:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred. Please try again.");
  }
}

async function getResult(id: string) {
  let attempts = 0;
  const maxAttempts = 60;
  const pollInterval = 1000;

  console.log("Waiting for generation result...");

  while (attempts < maxAttempts) {
    try {
      const response = await retryWithBackoff(async () => {
        return makeProxyRequest(`predictions/${id}`, 'GET');
      });

      console.log("Generation status:", response.status);

      if (response.status === "succeeded") {
        console.log("Generation completed successfully");
        return response.output;
      }

      if (response.status === "failed") {
        console.error("Generation failed:", response.error);
        throw new Error(response.error || "Image generation failed. Please try again.");
      }

      if (response.status === "canceled") {
        console.error("Generation canceled");
        throw new Error("Image generation was canceled. Please try again.");
      }

      attempts++;
      await delay(pollInterval);
    } catch (error) {
      console.error("Error in getResult:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred while checking generation status.");
    }
  }

  console.error("Generation timed out");
  throw new Error("Timeout: Image generation took too long. Please try again.");
}