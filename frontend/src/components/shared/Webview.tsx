import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useState, useEffect } from "react";

interface SwaggerDocsProps {
  apiKey: string;
  postId?: string;
  website_name?: string;
  post_type?: string;
  singlePost?: boolean;
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
        tags?: any;
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
          "200": {
            description: string;
            content: {
              "application/json": {
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

const SwaggerDocs = ({
  apiKey,
  postId='',
  singlePost = false,
  website_name = "",
  post_type = "",
}: SwaggerDocsProps) => {
  const [swaggerSpec, setSwaggerSpec] = useState<SwaggerSpec | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL; // Base URL (e.g., http://localhost:3000)

    // Dynamically choose the API path based on `singlePost`
    const fullUrl = singlePost
      ? `/subscription-api/get-post/{id}`
      : `/subscription-api/get-all-post/{website_name}/{post_type}`;

    let dynamicSwaggerJson: SwaggerSpec;

    if (singlePost) {
      dynamicSwaggerJson = {
        openapi: "3.0.0",
        info: {
          title: "Content Locker - A Powerful Headless CMS Web Application",
          version: "2.0.0",
          description: "For particular posts and pages by their respective IDs",
        },
        servers: [
          {
            url: apiUrl, // Base URL for the API (e.g., http://localhost:3000)
          },
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
    } else {
      dynamicSwaggerJson = {
        openapi: "3.0.0",
        info: {
          title: "Subscription API",
          description: "API for fetching posts by website and post type",
          version: "1.0.0",
        },
        servers: [
          {
            url: apiUrl, // Base URL for the API (e.g., http://localhost:3000)
          },
        ],
        paths: {
          [fullUrl]: {
            get: {
              summary: "Get all posts of a specific website and post type",
              description:
                "Fetches all posts based on the provided website name and post type.",
              tags: ["PostOperations"],
              parameters: [
                {
                  in: "path",
                  name: "website_name",
                  required: true,
                  description: "The website name to fetch posts from",
                  schema: {
                    type: "string",
                    default: website_name || "defaultApiKey", // Dynamic api_key
                  },
                },
                {
                  in: "path",
                  name: "post_type",
                  required: true,
                  description: "The type of post (e.g., blog, news, etc.)",
                  schema: {
                    type: "string",
                    default: post_type || "defaultApiKey", // Dynamic api_key
                  },
                },
                {
                  in: "query",
                  name: "api_key",
                  required: true,
                  description: "The API key used for authentication",
                  schema: {
                    type: "string",
                    default: apiKey || "defaultApiKey", // Dynamic api_key
                  },
                },
              ],
              responses: {
                "200": {
                  description: "Successfully retrieved the posts",
                  content: {
                    "application/json": {
                      schema: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            post_id: {
                              type: "string",
                              description: "The unique ID of the post",
                              example: "672878d9637cdd901d2f25d8",
                            },
                            title: {
                              type: "string",
                              description: "The title of the post",
                              example: "Homepage",
                            },
                            content: {
                              type: "string",
                              description: "The content of the post",
                              example: "<p>Lorem ipsum dolor sit amet...</p>",
                            },
                          },
                        },
                      },
                    },
                  },
                },// @ts-ignore
                "400": {
                  description: "Invalid website name or post type",
                },
                "401": {
                  description: "Invalid or missing API key",
                },
                "404": {
                  description:
                    "No posts found for the given website and post type",
                },
                "500": {
                  description: "Internal server error",
                },
              },
            },
          },
        },
      };
    }

    setSwaggerSpec(dynamicSwaggerJson);
  }, [apiKey, postId, singlePost]);

  return swaggerSpec ? (
    <SwaggerUI spec={swaggerSpec} />
  ) : (
    <div>Loading Swagger UI...</div>
  );
};

// The WebView component should accept props as an object, not individual arguments
interface WebViewProps {
  apiKey: string;
  postId?: string;
  singlePost?: boolean;
  website_name?: string;
  post_type?: string;
}

const WebView = ({
  apiKey,
  postId,
  singlePost = true,
  website_name = "",
  post_type = "",
}: WebViewProps) => {
  return (
    <div style={{ width: "100%", height: "50vh" }}>
      <SwaggerDocs apiKey={apiKey} postId={postId} singlePost={singlePost}  website_name ={website_name} post_type = {post_type}/>
    </div>
  );
};

export default WebView;
