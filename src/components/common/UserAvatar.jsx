import { Avatar } from "antd";
import { cn } from "./../../lib/utils";
import { UrlImage } from "./../../lib/api";

const UserAvatar = ({ image = "", name = "", className }) => {
  return (
    <Avatar
      className={cn(
        "min-w-8 min-h-8 rounded-full flex items-center justify-center text-xs font-medium border-none",
        "bg-main/10 text-main/90",
        "dark:bg-main dark:text-black",
        className
      )}
      src={image}
    >
      {name?.substring(0, 2).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
