import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const swaggerJson = {
  "openapi": "3.0.0",
  "info": {
      "title": 'Content Locker - A Powerful HeadLess CMS Web Application',
      "version": '2.0.0',
      "description": 'developer - Sushil Kumar',
  },
  "paths": {
    "/api/get-post/{id}": {
      "get": {
        "summary": "Get post by ID",
        "description": "Fetches a post by ID from the database",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "The ID of the post",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched the post",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string"
                    },
                    "title": {
                      "type": "string"
                    },
                    "content": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const SwaggerDocs = () => (
  <SwaggerUI spec={swaggerJson} />
);

const WebView = () => {
  return (
    <div style={{ width: '100%', height: '50vh' }}>
      <SwaggerDocs />
    </div>
  );
};

export default WebView;
