import React from 'react';
import SvgComponent from '@/utils/SvgComponent';
import { IUser } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useUserContext } from '@/context/AuthProvider';
import { formatString, trimString } from '@/lib/utils';
import { Edit2, Lock } from 'lucide-react';

interface UserCardProps {
  item: IUser;
  index: number;
}

const UserCard: React.FC<UserCardProps> = ({ item, index }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  return (
    <li className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 px-3 py-4" key={index}>
      <div className="flex flex-col gap-3 relative">
        {/* Header with Edit Button */}
        <div className="flex justify-end absolute top-2 right-2">
          {item?.role !== 'super_admin' ? (
            <button 
              onClick={() => { user?.id == item.id ? navigate('/profile/' + item.id) : navigate('/add-edit-user/' + item.id) }}
              className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
            </button>
          ) : (
            <div className="p-1 rounded-lg bg-gray-50">
              <Lock className="w-3.5 h-3.5 text-gray-400" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {item?.profile_pic ? (
              <img 
                src={item.profile_pic} 
                alt={item.username} 
                className="w-10 h-10 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <Avatar char={item?.username.charAt(0).toUpperCase()} size='small' />
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 ">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {trimString(item?.username?.trim(), 14)}
              </h3>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                item.role === 'admin' || item.role === 'super_admin' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-blue-50 text-blue-700'
              }`}>
                {formatString(item?.role)}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">{item.email}</p>

            {/* Permissions */}
            {item.role === 'user' && item.permissions !== null && Object.keys(item.permissions).length !== 0 && (
              <div className="mt-2 space-y-1.5">
                {item.permissions && Object.entries(item.permissions).map(([key], index) => {
                  // @ts-ignore
                  const permissonObject = item.permissions[key];
                  if (permissonObject !== null) {
                    return (
                      <div className="flex items-center gap-1.5" key={index}>
                        <div className="w-3.5 h-3.5 flex-shrink-0">
                          {permissonObject?.icon ? (
                            <img 
                              src={permissonObject.icon} 
                              alt={permissonObject.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <SvgComponent className="w-full h-full" svgName='website_icon' />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-medium text-gray-700">{permissonObject?.name}</span>
                          {permissonObject?.editor_permission && (
                            <span className="px-1 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px]">editor</span>
                          )}
                          {permissonObject?.viewer_permission && (
                            <span className="px-1 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px]">viewer</span>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default UserCard;
