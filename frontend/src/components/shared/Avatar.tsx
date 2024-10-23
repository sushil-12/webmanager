import React from 'react';

interface AvatarProps {
  char: string;
  size?: string;
}

const Avatar: React.FC<AvatarProps> = ({ char, size }) => {
  return (
    <div className={`rounded-full ${size && size == 'small' ? 'avatar-small' : size == 'extra-small' ? 'avatar-extra-small' : 'avatar'} flex items-center justify-center`}>
      <p className="text-white flex items-center justify-center h-full">{char}</p>
    </div>
  );
}

export default Avatar;