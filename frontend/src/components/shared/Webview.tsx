import React from 'react';

// Define a prop type for the WebView component
interface WebViewProps {
  src: string; // The URL of the content to be loaded in the iframe
}

const WebView: React.FC<WebViewProps> = ({ src }) => {
  return (
    <div style={{ width: '100%', height: '50vh' }}>
      <iframe
        src={src}
        title="API Documentation"
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </div>
  );
};

export default WebView;