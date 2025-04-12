import React from 'react';
import { Block, BlockType } from '@/lib/types/layoutBuilder';
import { Button } from '@/components/ui/button';

interface BlockRendererProps {
  blocks: Block[];
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case BlockType.TEXT:
        return (
          <div className="prose dark:prose-invert max-w-none">
            <p>{block.content.text}</p>
          </div>
        );
      case BlockType.HEADING:
        const HeadingTag = `h${block.content.level}` as keyof JSX.IntrinsicElements;
        return <HeadingTag className="font-bold">{block.content.text}</HeadingTag>;
      case BlockType.IMAGE:
        return (
          <figure className="my-4">
            <img
              src={block.content.url}
              alt={block.content.alt}
              className="rounded-lg w-full"
            />
            {block.content.caption && (
              <figcaption className="text-sm text-gray-500 mt-2">
                {block.content.caption}
              </figcaption>
            )}
          </figure>
        );
      case BlockType.BUTTON:
        return (
          <Button
            variant={block.content.style || 'primary'}
            className="mt-4"
            onClick={() => window.open(block.content.url, '_blank')}
          >
            {block.content.text}
          </Button>
        );
      case BlockType.COLUMNS:
        return (
          <div className={`grid grid-cols-${block.content.columns} gap-4`}>
            {/* @ts-ignore */}
            {block.content.blocks.map((columnBlock, index) => (
              <div key={index} className="space-y-4">
                {renderBlock(columnBlock)}
              </div>
            ))}
          </div>
        );
      case BlockType.SPACER:
        return <div className="h-8" />;
      case BlockType.DIVIDER:
        return <hr className="my-8 border-gray-200 dark:border-gray-700" />;
      case BlockType.QUOTE:
        return (
          <blockquote className="border-l-4 border-primary-500 pl-4 italic">
            {block.content.text}
          </blockquote>
        );
      case BlockType.GALLERY:
        return (
          <div className="grid grid-cols-3 gap-4">
            {block.content.images.map((image: any, index: number) => (
              <img
                key={index}
                src={image.url}
                alt={image.alt}
                className="rounded-lg w-full h-48 object-cover"
              />
            ))}
          </div>
        );
      case BlockType.EMBED:
        return (
          <div className="aspect-video">
            <iframe
              src={block.content.url}
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => (
        <div key={block.id || index}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default BlockRenderer; 