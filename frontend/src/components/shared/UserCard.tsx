import React from 'react';
import SvgComponent from '@/utils/SvgComponent';
import { IUser } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useUserContext } from '@/context/AuthProvider';
import { formatString, trimString } from '@/lib/utils';

interface UserCardProps {
  item: IUser;
  index: number;
}

const UserCard: React.FC<UserCardProps> = ({ item, index }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  return (
    <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg border border-1 p-3">
      <div className="flex w-full items-center justify-between space-x-6">
        <div className="flex-1 truncate">

          <div className="flex justify-end space-x-3">
            {item?.role !== 'super_admin' ? (
              <button onClick={() => { user?.id == item.id ? navigate('/profile/' + item.id) : navigate('/add-edit-user/' + item.id) }}><SvgComponent className="" svgName="edit_action" /></button>
            ):(
              <i className="pi pi-lock mr-2 mt-1"></i>
            )}

          </div>
          <div className="flex m-0 gap-[15px] h-full">
            <div className="img_container h-full">
              {item?.profile_pic == '' || item?.profile_pic == undefined ? (<Avatar char={item?.username.charAt(0).toUpperCase()} size='small' />) : <img src={`${item?.profile_pic}`} alt="" className="w-[53px] h-[53px] rounded-full" />}
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <div className="body-bold flex items-center">
                  <span className="flex gap-2 items-center">
                    <p className="font-inter font-semibold text-xl text-title-headings">{trimString(item?.username?.trim(), 14)}</p>
                    <span className={`inline-flex flex-shrink-0 items-center p-1.5 min-w-12 h-5 rounded-full ${item.role === 'admin' || item.role === 'super_admin' ? 'bg-success-role text-white' : 'bg-light-blue text-main-bg-900'} font-inter font-semibold justify-center text-[10px]`}>
                      {formatString(item?.role)}
                    </span>
                  </span>
                </div>
                <p className="font-inter text-xs font-medium text-secondary-label">{item.email}</p>

              </div>
              {item.role === 'user' && item.permissions !== null && Object.keys(item.permissions).length !== 0 && (
                <div className="flex flex-col mt-2">
                  {
                    item.permissions && Object.entries(item.permissions).map(([key], index) => {
                      // @ts-ignore
                      const permissonObject = item.permissions[key];
                      if (permissonObject !== null) {
                        return (
                          <div className="flex gap-1 items-center" key={index}>
                            <span className="logo">{permissonObject?.icon == '' ? <SvgComponent className='websvg' svgName='website_icon' /> : <img src={permissonObject?.icon} className='w-[14px] h-[14px]' />}</span>
                            <p className='gap-1'><span className='font-semibold text-sm'>{permissonObject?.name}</span> <span className='font-medium text-sm mr-1'>{permissonObject?.editor_permission && 'editor'}</span><span className='font-medium text-sm'>{permissonObject?.viewer_permission && 'viewer'}</span></p>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              )}


            </div>

          </div>

        </div>
      </div>
    </li>
  );
};

export default UserCard;
