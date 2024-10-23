import { cn } from '@/lib/utils';

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  text: string;
  colorScheme?: 'yellow' | 'green' | 'red';
}

function Message({
  className,
  icon,
  text,
  colorScheme = 'green', // Default color scheme is yellow
  ...props
}: MessageProps) {
  // Define the border color based on the selected color scheme
  const borderColor =
    colorScheme === 'yellow'
      ? 'border-yellow-400'
      : colorScheme === 'green'
      ? 'border-green-400'
      : 'border-red-400';

  // Define the background color based on the selected color scheme
  const bgColor =
    colorScheme === 'yellow'
      ? 'bg-yellow-50'
      : colorScheme === 'green'
      ? 'bg-green-50'
      : 'bg-red-50';

  return (
    <div className={cn(borderColor, bgColor, 'p-4', className)} {...props}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <p className={`text-sm text-${colorScheme}-700`}>{text}</p>
        </div>
      </div>
    </div>
  );
}

export { Message };
