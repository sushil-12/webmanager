import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight, Sliders, Code, Image, Text, GripVertical, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface DynamicElement {
  id: string;
  type: 'slider' | 'html' | 'image' | 'text';
  content: any;
}

interface DynamicBuilderProps {
  elements: DynamicElement[];
  onChange: (elements: DynamicElement[]) => void;
  onSave?: (content: string) => void;
}

const ElementItem: React.FC<{ type: string; icon: React.ReactNode; label: string }> = ({ type, icon, label }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex items-center gap-2 p-2 rounded cursor-move hover:bg-gray-100 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

const DropZone: React.FC<{
  onDrop: (item: any) => void;
  children: React.ReactNode;
}> = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[200px] p-4 border-2 rounded-lg ${
        isOver ? 'border-primary-500 bg-primary-50' : 'border-dashed border-gray-300'
      }`}
    >
      {children}
    </div>
  );
};

const DynamicBuilder: React.FC<DynamicBuilderProps> = ({ elements, onChange, onSave }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  const handleDrop = (item: { type: string }) => {
    const newElement: DynamicElement = {
      id: Date.now().toString(),
      type: item.type as DynamicElement['type'],
      content: getDefaultContent(item.type),
    };
    onChange([...elements, newElement]);
  };

  const moveElement = (dragIndex: number, hoverIndex: number) => {
    const newElements = [...elements];
    const [movedElement] = newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, movedElement);
    onChange(newElements);
  };

  const removeElement = (id: string) => {
    onChange(elements.filter((el) => el.id !== id));
  };

  const updateElement = (id: string, content: any) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, content } : el
    );
    onChange(newElements);
  };

  const handleSave = () => {
    if (onSave) {
      const htmlContent = elements.map(element => {
        switch (element.type) {
          case 'slider':
            return `<div class="slider">${element.content.slides.map((slide: any) => `
              <div class="slide">
                <img src="${slide.image}" alt="${slide.alt || ''}" />
                <h3>${slide.title || ''}</h3>
                <p>${slide.description || ''}</p>
              </div>
            `).join('')}</div>`;
          case 'html':
            return element.content.code;
          case 'image':
            return `<figure><img src="${element.content.url}" alt="${element.content.alt}" /></figure>`;
          case 'text':
            return `<div class="text-content">${element.content.content}</div>`;
          default:
            return '';
        }
      }).join('');
      
      onSave(htmlContent);
      toast({
        title: "Saved",
        description: "Your layout has been saved successfully",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-full">
        {/* Collapsible Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 border-r bg-gray-50`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Elements</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-2">
              <ElementItem type="slider" icon={<Sliders className="h-4 w-4" />} label="Slider" />
              <ElementItem type="html" icon={<Code className="h-4 w-4" />} label="Custom HTML" />
              <ElementItem type="image" icon={<Image className="h-4 w-4" />} label="Image" />
              <ElementItem type="text" icon={<Text className="h-4 w-4" />} label="Text" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4">
          <div className="flex justify-end mb-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Layout
            </Button>
          </div>
          <DropZone onDrop={handleDrop}>
            {elements.length === 0 ? (
              <div className="text-center text-gray-500">
                Drag and drop elements here
              </div>
            ) : (
              <div className="space-y-4">
                {elements.map((element, index) => (
                  <div
                    key={element.id}
                    className="group relative p-4 border rounded-lg bg-white"
                  >
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeElement(element.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <GripVertical className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded">
                      {renderElementContent(element, updateElement)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DropZone>
        </div>
      </div>
    </DndProvider>
  );
};

const renderElementContent = (element: DynamicElement, updateElement: (id: string, content: any) => void) => {
  switch (element.type) {
    case 'slider':
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Slider Settings</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newSlides = [...element.content.slides, { image: '', title: '', description: '' }];
                updateElement(element.id, { ...element.content, slides: newSlides });
              }}
            >
              Add Slide
            </Button>
          </div>
          {element.content.slides.map((slide: any, index: number) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <Input
                placeholder="Image URL"
                value={slide.image}
                onChange={(e) => {
                  const newSlides = [...element.content.slides];
                  newSlides[index] = { ...slide, image: e.target.value };
                  updateElement(element.id, { ...element.content, slides: newSlides });
                }}
              />
              <Input
                placeholder="Title"
                value={slide.title}
                onChange={(e) => {
                  const newSlides = [...element.content.slides];
                  newSlides[index] = { ...slide, title: e.target.value };
                  updateElement(element.id, { ...element.content, slides: newSlides });
                }}
              />
              <Textarea
                placeholder="Description"
                value={slide.description}
                onChange={(e) => {
                  const newSlides = [...element.content.slides];
                  newSlides[index] = { ...slide, description: e.target.value };
                  updateElement(element.id, { ...element.content, slides: newSlides });
                }}
              />
            </div>
          ))}
        </div>
      );
    case 'html':
      return (
        <Textarea
          value={element.content.code}
          onChange={(e) => updateElement(element.id, { ...element.content, code: e.target.value })}
          placeholder="Enter HTML/CSS code..."
          className="min-h-[200px] font-mono"
        />
      );
    case 'image':
      return (
        <div className="space-y-2">
          <Input
            placeholder="Image URL"
            value={element.content.url}
            onChange={(e) => updateElement(element.id, { ...element.content, url: e.target.value })}
          />
          <Input
            placeholder="Alt text"
            value={element.content.alt}
            onChange={(e) => updateElement(element.id, { ...element.content, alt: e.target.value })}
          />
        </div>
      );
    case 'text':
      return (
        <Textarea
          value={element.content.content}
          onChange={(e) => updateElement(element.id, { ...element.content, content: e.target.value })}
          placeholder="Enter text content..."
          className="min-h-[100px]"
        />
      );
    default:
      return null;
  }
};

const getDefaultContent = (type: string) => {
  switch (type) {
    case 'slider':
      return { slides: [] };
    case 'html':
      return { code: '' };
    case 'image':
      return { url: '', alt: '' };
    case 'text':
      return { content: '' };
    default:
      return {};
  }
};

export default DynamicBuilder; 