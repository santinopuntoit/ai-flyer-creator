import { NextResponse } from 'next/server';

const REPLICATE_API_URL = "https://api.replicate.com/v1";

// Validate the endpoint to prevent unauthorized access to other API endpoints
function validateEndpoint(endpoint: string): boolean {
  const allowedEndpoints = [
    'predictions',
    'predictions/',
    'collections',
    'deployments',
    'models',
    'trainings',
  ];
  
  return allowedEndpoints.some(allowed => 
    endpoint.startsWith(allowed) && !endpoint.includes('..')
  );
}

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, method = 'POST', payload, token } = body;
    
    // Validate required parameters
    if (!endpoint || !token) {
      return NextResponse.json({
        error: 'Missing required parameters',
        details: {
          endpoint: !endpoint ? 'Endpoint is required' : null,
          token: !token ? 'API token is required' : null,
        }
      }, { status: 400 });
    }

    // Validate endpoint for security
    if (!validateEndpoint(endpoint)) {
      return NextResponse.json({
        error: 'Invalid endpoint requested',
      }, { status: 403 });
    }

    // Validate HTTP method
    const allowedMethods = ['GET', 'POST', 'HEAD', 'DELETE'];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return NextResponse.json({
        error: 'Invalid HTTP method',
      }, { status: 400 });
    }

    // Construct the full URL
    const url = `${REPLICATE_API_URL}/${endpoint.replace(/^\/+/, '')}`;

    // Prepare request options
    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && payload) {
      requestOptions.body = JSON.stringify(payload);
    }

    // Make the request to Replicate
    const response = await fetch(url, requestOptions);
    
    // Handle non-JSON responses (like HEAD requests)
    if (method.toUpperCase() === 'HEAD') {
      return NextResponse.json({
        status: response.status,
        ok: response.ok,
      });
    }

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    // Return response with original status code
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Replicate-Status': response.status.toString(),
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Determine if it's a known error type
    if (error instanceof Error) {
      return NextResponse.json({
        error: 'Proxy error',
        message: error.message,
        type: error.name,
      }, { status: 500 });
    }

    // Generic error response
    return NextResponse.json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    }, { status: 500 });
  }
}