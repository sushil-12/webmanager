import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "../ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
            example?: string;
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
  postId = '',
  singlePost = false,
  website_name = "",
  post_type = "",
}: SwaggerDocsProps) => {
  const [swaggerSpec, setSwaggerSpec] = useState<SwaggerSpec | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      variant: "default",
      title: "Copied to clipboard!"
    });
  };

  const downloadSpec = () => {
    if (!swaggerSpec) return;
    const blob = new Blob([JSON.stringify(swaggerSpec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-spec.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const generateSwaggerSpec = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const fullUrl = singlePost
          ? `/subscription-api/get-post/{id}`
          : `/subscription-api/get-all-post/{website_name}/{post_type}`;

        let dynamicSwaggerJson: SwaggerSpec;

        if (singlePost) {
          dynamicSwaggerJson = {
            openapi: "3.0.0",
            info: {
              title: "Content Locker API",
              version: "2.0.0",
              description: "API endpoint for fetching individual posts by ID",
            },
            servers: [{ url: apiUrl }],
            paths: {
              [fullUrl]: {
                get: {
                  summary: "Get post by ID",
                  description: "Fetches a specific post by its unique identifier",
                  parameters: [
                    {
                      name: "id",
                      in: "path",
                      required: true,
                      description: "Unique identifier of the post",
                      schema: {
                        type: "string",
                        default: postId || "defaultPostId",
                      },
                    },
                    {
                      name: "api_key",
                      in: "query",
                      required: true,
                      description: "API Key for authentication",
                      schema: {
                        type: "string",
                        default: apiKey || "defaultApiKey",
                      },
                    },
                  ],
                  responses: {
                    "200": {
                      description: "Successfully retrieved the post",
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
              title: "Content Locker API",
              description: "API for fetching posts by website and post type",
              version: "1.0.0",
            },
            servers: [{ url: apiUrl }], // @ts-ignore
            paths: {
              [fullUrl]: {
                get: {
                  summary: "Get posts by website and type",
                  description: "Fetches posts based on website name and post type with pagination and filtering options",
                  tags: ["PostOperations"],
                  parameters: [
                    {
                      in: "path",
                      name: "website_name",
                      required: true,
                      description: "Name of the website to fetch posts from",
                      schema: {
                        type: "string",
                        default: website_name || "defaultWebsiteName",
                      },
                    },
                    {
                      in: "path",
                      name: "post_type",
                      required: true,
                      description: "Type of posts to fetch",
                      schema: {
                        type: "string",
                        default: post_type || "defaultPostType",
                      },
                    },
                    {
                      in: "query",
                      name: "api_key",
                      required: true,
                      description: "API Key for authentication",
                      schema: {
                        type: "string",
                        default: apiKey || "defaultApiKey",
                      },
                    },
                    {
                      in: "query",
                      name: "page",
                      required: false,
                      description: "Page number for pagination",
                      schema: {
                        type: "integer",
                        default: 1,
                        example: 2,
                      },
                    },
                    {
                      in: "query",
                      name: "limit",
                      required: false,
                      description: "Number of posts per page",
                      schema: {
                        type: "integer",
                        default: 10,
                        example: 20,
                      },
                    },
                    {
                      in: "query",
                      name: "search",
                      required: false,
                      description: "Search term for filtering posts",
                      schema: {
                        type: "string",
                        example: "search-term",
                      },
                    },
                    {
                      in: "query",
                      name: "filter",
                      required: false,
                      description: "Filter posts by status",
                      schema: {
                        type: "string",
                        enum: ["draft", "published", "trash", "all"],
                        default: "all",
                        example: "published",
                      },
                    },
                    {
                      in: "query",
                      name: "fields",
                      required: false,
                      description: "Fields to include in response",
                      schema: {
                        type: "string",
                        example: "title,content,featuredImage",
                      },
                    },
                  ],
                  responses: {
                    "200": {
                      description: "Successfully retrieved posts",
                      content: {
                        "application/json": {
                          schema: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                post_id: {
                                  type: "string",
                                  description: "Unique post identifier",
                                  example: "672878d9637cdd901d2f25d8",
                                },
                                title: {
                                  type: "string",
                                  description: "Post title",
                                  example: "Sample Post",
                                },
                                content: {
                                  type: "string",
                                  description: "Post content",
                                  example: "<p>Post content...</p>",
                                },
                                featuredImage: {
                                  type: "object",
                                  description: "Featured image details",
                                  properties: {
                                    url: {
                                      type: "string",
                                      description: "Image URL",
                                      example: "https://example.com/image.jpg",
                                    },
                                    alt_text: {
                                      type: "string",
                                      description: "Image alt text",
                                      example: "Sample image",
                                    },
                                  },
                                },
                                categories: {
                                  type: "array",
                                  description: "Post categories",
                                  items: {
                                    type: "string",
                                    example: "Technology",
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    "400": {
                      description: "Invalid request parameters",
                    },
                    "401": {
                      description: "Unauthorized - Invalid API key",
                    },
                    "404": {
                      description: "No posts found",
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
      } catch (error) {
        console.error('Error generating Swagger spec:', error);
        toast({
          variant: "destructive",
          title: "Failed to generate API documentation"
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateSwaggerSpec();
  }, [apiKey, postId, singlePost, website_name, post_type]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="swagger-container h-full flex flex-col overflow-hidden">
      <div className="swagger-header p-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">API Documentation</h2>
          <span className="text-xs text-gray-500">
            {singlePost ? 'Single Post Endpoint' : 'Posts Collection Endpoint'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(swaggerSpec, null, 2))}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Spec
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSpec}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="swagger-content flex-1 overflow-auto">
        {/* @ts-ignore */}
        <SwaggerUI spec={swaggerSpec} />
      </div>
    </div>
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
    <Card className="w-full p-0">
      <div className="h-full">
        <SwaggerDocs
          apiKey={apiKey}
          postId={postId}
          singlePost={singlePost}
          website_name={website_name}
          post_type={post_type}
        />
      </div>
    </Card>
  );
};

export default WebView;
