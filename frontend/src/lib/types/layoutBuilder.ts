export enum BlockType {
  SLIDER = 'slider',
  CUSTOM_HTML = 'custom_html',
  IMAGE = 'image',
  TEXT = 'text',
  HEADING = 'heading',
  BUTTON = 'button',
  COLUMNS = 'columns',
  SPACER = 'spacer',
  DIVIDER = 'divider',
  QUOTE = 'quote',
  GALLERY = 'gallery',
  EMBED = 'embed',
}

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  attributes?: Record<string, any>;
}

export interface ColumnBlock extends Block {
  type: BlockType.COLUMNS;
  content: {
    columns: number;
    blocks: Block[];
  };
}

export interface TextBlock extends Block {
  type: BlockType.TEXT;
  content: {
    text: string;
  };
}

export interface ImageBlock extends Block {
  type: BlockType.IMAGE;
  content: {
    url: string;
    alt: string;
    caption?: string;
  };
}

export interface HeadingBlock extends Block {
  type: BlockType.HEADING;
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ButtonBlock extends Block {
  type: BlockType.BUTTON;
  content: {
    text: string;
    url: string;
    style?: 'primary' | 'secondary' | 'outline';
  };
}

export interface SliderBlock extends Block {
  type: BlockType.SLIDER;
  content: {
    slides: Array<{
      image: string;
      title?: string;
      description?: string;
      link?: string;
    }>;
  };
}

export interface CustomHtmlBlock extends Block {
  type: BlockType.CUSTOM_HTML;
  content: {
    html: string;
    css?: string;
  };
}

export interface LayoutBuilderState {
  blocks: Block[];
  selectedBlockId: string | null;
} 