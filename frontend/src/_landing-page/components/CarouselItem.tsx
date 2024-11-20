import React from 'react';

interface CarouselItemProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  link: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ imageSrc, title, subtitle, link }) => (
  <div className="px-3 pb-5">
    <div className="card-slider group">
      <img className="rounded-xl" src={imageSrc} alt={title} />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="mt-5 text-xl font-semibold group-hover:text-blue-500">{title}</h1>
          <p className="mt-2 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div>
          <a
            href={link}
            className="tracking-wide hover-up-2 mr-2 inline-block px-4 py-3 text-xs text-blue-500 font-semibold leading-none border border-blue-200 hover:border-blue-500 hover:text-white hover:bg-blue-500 rounded"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default CarouselItem;