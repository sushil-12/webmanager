import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Block, BlockType } from '@/lib/types/layoutBuilder';
import { v4 as uuidv4 } from 'uuid';
import { Plus, GripVertical, Trash, MoveUp, MoveDown, Sliders, Code, Image, Text, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LayoutBuilderProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ value, onChange }) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: BlockType, e: React.MouseEvent) => {
    e.preventDefault();
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: getDefaultContent(type),
    };
    onChange([...value, newBlock]);
  }, [value, onChange]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    const updatedBlocks = value.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    );
    onChange(updatedBlocks);
  }, [value, onChange]);

  const deleteBlock = useCallback((blockId: string, e: React.MouseEvent) => {
    e.preventDefault();
    const updatedBlocks = value.filter(block => block.id !== blockId);
    onChange(updatedBlocks);
  }, [value, onChange]);

  const moveBlock = useCallback((fromIndex: number, toIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const blocks = [...value];
    const [movedBlock] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, movedBlock);
    onChange(blocks);
  }, [value, onChange]);

  const renderBlock = (block: Block, index: number) => {
    const isSelected = block.id === selectedBlockId;

    return (
      <div
        key={block.id}
        className={`relative group p-4 border rounded-lg mb-4 ${
          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
        }`}
        onClick={() => setSelectedBlockId(block.id)}
      >
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => moveBlock(index, index - 1, e)}
            disabled={index === 0}
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => moveBlock(index, index + 1, e)}
            disabled={index === value.length - 1}
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => deleteBlock(block.id, e)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </span>
        </div>

        {renderBlockContent(block)}
      </div>
    );
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case BlockType.SLIDER:
        return (
          <div className="space-y-2">
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Slider Content</span>
            </div>
          </div>
        );
      case BlockType.CUSTOM_HTML:
        return (
          <div className="space-y-2">
            <textarea
              className="w-full h-32 p-2 border rounded"
              placeholder="Enter HTML/CSS code..."
              value={block.content.html || ''}
              onChange={(e) => updateBlock(block.id, {
                content: { ...block.content, html: e.target.value }
              })}
            />
          </div>
        );
      case BlockType.IMAGE:
        return (
          <div className="space-y-2">
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image Content</span>
            </div>
          </div>
        );
      case BlockType.TEXT:
        return (
          <div className="space-y-2">
            <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Text Content</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 border-r p-4">
          <h3 className="font-semibold mb-4">Add Components</h3>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={(e) => addBlock(BlockType.SLIDER, e)}
              >
                <Sliders className="h-4 w-4 mr-2" />
                Slider
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={(e) => addBlock(BlockType.CUSTOM_HTML, e)}
              >
                <Code className="h-4 w-4 mr-2" />
                Custom HTML/CSS
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={(e) => addBlock(BlockType.IMAGE, e)}
              >
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={(e) => addBlock(BlockType.TEXT, e)}
              >
                <Text className="h-4 w-4 mr-2" />
                Text
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="space-y-4">
              {value.map((block, index) => renderBlock(block, index))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </DndProvider>
  );
};

const getDefaultContent = (type: BlockType): any => {
  switch (type) {
    case BlockType.SLIDER:
      return { slides: [] };
    case BlockType.CUSTOM_HTML:
      return { html: '', css: '' };
    case BlockType.IMAGE:
      return { url: '', alt: '' };
    case BlockType.TEXT:
      return { text: '' };
    default:
      return {};
  }
};

export default LayoutBuilder; 