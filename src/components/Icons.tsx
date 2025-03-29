import React from 'react';
import {
    FaHome, FaSearch, FaBell, FaEnvelope, FaBookmark, FaUser, FaHashtag,
    FaImage, FaTimes, FaReply, FaRetweet, FaEllipsisH, FaCamera, FaEdit,
    FaExternalLinkAlt, FaUsers, FaPlus, FaCog, FaHeart, FaShare
} from 'react-icons/fa';

interface IconProps {
    size?: string | number;
    color?: string;
    className?: string;
}

export const HomeIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaHome {...props} />
    </span>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaSearch {...props} />
    </span>
);

export const BellIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaBell {...props} />
    </span>
);

export const EnvelopeIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaEnvelope {...props} />
    </span>
);

export const BookmarkIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaBookmark {...props} />
    </span>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaUser {...props} />
    </span>
);

export const HashtagIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaHashtag {...props} />
    </span>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaImage {...props} />
    </span>
);

export const TimesIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaTimes {...props} />
    </span>
);

export const ReplyIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaReply {...props} />
    </span>
);

export const RetweetIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaRetweet {...props} />
    </span>
);

export const EllipsisHIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaEllipsisH {...props} />
    </span>
);

export const CameraIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaCamera {...props} />
    </span>
);

export const EditIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaEdit {...props} />
    </span>
);

export const ExternalLinkIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaExternalLinkAlt {...props} />
    </span>
);

export const UsersIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaUsers {...props} />
    </span>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaPlus {...props} />
    </span>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaCog {...props} />
    </span>
);

export const LikeIcon: React.FC<IconProps & { isLiked?: boolean }> = ({ isLiked, ...props }) => (
    <span className="icon-wrapper">
        <FaHeart {...props} color={isLiked ? "#e0245e" : props.color} />
    </span>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
    <span className="icon-wrapper">
        <FaShare {...props} />
    </span>
); 