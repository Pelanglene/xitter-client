import { ComponentType, SVGAttributes } from 'react';

declare module 'react-icons/fa' {
  export interface IconBaseProps extends SVGAttributes<SVGElement> {
    size?: string | number;
    color?: string;
    title?: string;
  }

  export type IconType = ComponentType<IconBaseProps>;
  
  export const FaHome: IconType;
  export const FaSearch: IconType;
  export const FaBell: IconType;
  export const FaEnvelope: IconType;
  export const FaBookmark: IconType;
  export const FaUser: IconType;
  export const FaHashtag: IconType;
  export const FaImage: IconType;
  export const FaTimes: IconType;
  export const FaReply: IconType;
  export const FaRetweet: IconType;
  export const FaEllipsisH: IconType;
  export const FaCamera: IconType;
  export const FaEdit: IconType;
  export const FaExternalLinkAlt: IconType;
  export const FaUsers: IconType;
  export const FaPlus: IconType;
  export const FaCog: IconType;
  export const FaHeart: IconType;
  export const FaShare: IconType;
} 