import React from 'react';
import SvgComponent from '@/utils/SvgComponent';
import { IWebsite } from '@/lib/types';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthProvider';

interface WebsiteCardProps {
  item: IWebsite;
  index: number;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ item, index }) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  return (
    <li key={index} className="col-span-1 divide-y divide-gray-200 rounded-lg border border-1 min-h-[172px]  p-3">
      <div className="flex w-full items-center justify-between space-x-6">
        <div className="flex-1 truncate">

          <div className="flex justify-between space-x-3 mb-4">
            <div className="img_container w-8 h-8">
              {item?.icon == '' || item?.icon == undefined ? (<SvgComponent className='' svgName='website_icon' />) : <img src={`${item?.icon}`} alt="" className="w-8 h-8 rounded-full" />}
            </div>
            {(user.role === 'super_admin' || user?.role === 'admin') && <button onClick={() => { user?.id == item.id ? navigate('/profile/' + item.id) : navigate('/website/edit/' + item.id) }}><SvgComponent className="" svgName="edit_action" /></button>}
          </div>

          <div className="flex m-0 gap-[15px] items-center h-full">
            <div className="flex flex-col gap-2">
              <div className="body-bold flex items-center gap-1">
                <span className="flex flex-col">
                  <p className="font-inter font-semibold text-xl text-title-headings">{item.business_name}</p>
                  <NavLink className="flex gap-[2.5px] font-inter font-semibold text-xs text-main-bg-900" to={item.url}><SvgComponent className='' svgName='target_icon' />{item.url}</NavLink>
                </span>
              </div>
              <p className="font-inter text-xs font-medium text-secondary-label text-pretty ">{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default WebsiteCard;
