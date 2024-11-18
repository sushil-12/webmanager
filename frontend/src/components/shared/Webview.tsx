import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useState, useEffect } from 'react';

interface SwaggerDocsProps {
  apiKey: string;
  postId: string;
}

interface SwaggerSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
  }>;
  paths: {
    [key: string]: {
      get: {
        summary: string;
        description: string;
        parameters: Array<{
          name: string;
          in: string;
          required: boolean;
          description: string;
          schema: {
            type: string;
            default?: string;
          };
        }>;
        responses: {
          '200': {
            description: string;
            content: {
              'application/json': {
                schema: {
                  type: string;
                  properties: {
                    id: { type: string };
                    title: { type: string };
                    content: { type: string };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}

const SwaggerDocs = ({ apiKey, postId }: SwaggerDocsProps) => {
  const [swaggerSpec, setSwaggerSpec] = useState<SwaggerSpec | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;  // base URL (e.g., http://localhost:3000)
    const path = '/subscription-api/get-post/{id}'; // API path

    // Ensure the URL is properly constructed: remove trailing slash from apiUrl, and add path correctly
    const fullUrl = `${path}`;

    // Define the Swagger spec with a server base URL
    const dynamicSwaggerJson: SwaggerSpec = {
      openapi: "3.0.0",
      info: {
        title: 'Content Locker - A Powerful Headless CMS Web Application',
        version: '2.0.0',
        description: 'Developer - Sushil Kumar',
      },
      servers: [
        {
          url: apiUrl // Base URL for the API (http://localhost:3000)
        }
      ],
      paths: {
        [fullUrl]: {
          get: {
            summary: "Get post by ID",
            description: "Fetches a post by ID from the database",
            parameters: [
              {
                name: "id",
                in: "path",
                required: true,
                description: "The ID of the post",
                schema: {
                  type: "string",
                  default: postId || "defaultPostId", // Dynamic post_id
                },
              },
              {
                name: "api_key",
                in: "query",
                required: true,
                description: "API Key for authentication",
                schema: {
                  type: "string",
                  default: apiKey || "defaultApiKey", // Dynamic api_key
                },
              },
            ],
            responses: {
              "200": {
                description: "Successfully fetched the post",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        content: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    setSwaggerSpec(dynamicSwaggerJson);
  }, [apiKey, postId]);

  return swaggerSpec ? <SwaggerUI spec={swaggerSpec} /> : <div>Loading Swagger UI...</div>;
};

// The WebView component should accept props as an object, not individual arguments
interface WebViewProps {
  apiKey: string;
  postId: string;
}

const WebView = ({ apiKey, postId }: WebViewProps) => {
  return (
    <div style={{ width: '100%', height: '50vh' }}>
      <SwaggerDocs apiKey={apiKey} postId={postId} />
    </div>
  );
};

export default WebView;