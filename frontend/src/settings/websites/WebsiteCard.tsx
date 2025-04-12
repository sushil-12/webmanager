import React from 'react';
import { IWebsite } from '@/lib/types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthProvider';
import { Edit2, Globe, ExternalLink } from 'lucide-react';

interface WebsiteCardProps {
  item: IWebsite;
  index: number;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-3 flex flex-col gap-2 group relative">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Website Icon */}
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
            {item?.icon ? (
              <img 
                src={item.icon} 
                alt={item.business_name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Globe className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {/* Website Details */}
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 text-base leading-tight truncate">
              {item.business_name}
            </h3>
            <NavLink 
              to={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-primary-500 flex items-center gap-1 w-fit group-hover:text-primary-600 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{item.url}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          </div>
        </div>

        {/* Edit Button */}
        {(user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'user') && (
          <button 
            onClick={() => navigate(user?.id === item.id ? `/profile/${item.id}` : `/website/edit/${item.id}`)}
            className="p-1.5 rounded-lg absolute top-2 right-2 transition-all flex-shrink-0"
          >
            <Edit2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
      
      {/* Description */}
      {item.description && (
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );
};

export default WebsiteCard;