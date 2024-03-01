import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProfileFeedsGroups } from '@/services/social/api/feeds';

export default function FeedsFilter({
  defaultValue,
  onChange,
}: {
  defaultValue: ProfileFeedsGroups;
  onChange: (type: ProfileFeedsGroups) => void;
}) {
  return (
    <Select
      onValueChange={(type) => {
        onChange(type as ProfileFeedsGroups);
      }}
      defaultValue={defaultValue}
    >
      <SelectTrigger className="w-[180px] border-none rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium outline-none focus:outline-none focus:border-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5.625 1.875C4.63044 1.875 3.67661 2.27009 2.97335 2.97335C2.27009 3.67661 1.875 4.63044 1.875 5.625C1.875 6.61956 2.27009 7.57339 2.97335 8.27665C3.67661 8.97991 4.63044 9.375 5.625 9.375H8.75C8.91576 9.375 9.07473 9.30915 9.19194 9.19194C9.30915 9.07473 9.375 8.91576 9.375 8.75V5.625C9.375 4.63044 8.97991 3.67661 8.27665 2.97335C7.57339 2.27009 6.61956 1.875 5.625 1.875ZM8.75 10.625H5.625C4.88332 10.625 4.1583 10.8449 3.54161 11.257C2.92493 11.669 2.44428 12.2547 2.16045 12.9399C1.87662 13.6252 1.80236 14.3792 1.94706 15.1066C2.09175 15.834 2.4489 16.5022 2.97335 17.0267C3.4978 17.5511 4.16598 17.9083 4.89341 18.0529C5.62084 18.1976 6.37484 18.1234 7.06006 17.8396C7.74529 17.5557 8.33096 17.0751 8.74301 16.4584C9.15507 15.8417 9.375 15.1167 9.375 14.375V11.25C9.375 11.0842 9.30915 10.9253 9.19194 10.8081C9.07473 10.6908 8.91576 10.625 8.75 10.625ZM14.375 1.875C13.3804 1.875 12.4266 2.27009 11.7234 2.97335C11.0201 3.67661 10.625 4.63044 10.625 5.625V8.75C10.625 8.91576 10.6908 9.07473 10.8081 9.19194C10.9253 9.30915 11.0842 9.375 11.25 9.375H14.375C15.3696 9.375 16.3234 8.97991 17.0267 8.27665C17.7299 7.57339 18.125 6.61956 18.125 5.625C18.125 4.63044 17.7299 3.67661 17.0267 2.97335C16.3234 2.27009 15.3696 1.875 14.375 1.875Z"
            fill="#EEEFF7"
          />
          <path
            opacity="0.3"
            d="M14.3751 10.6249H11.2501C11.0843 10.6249 10.9253 10.6907 10.8081 10.8079C10.6909 10.9251 10.6251 11.0841 10.6251 11.2499V14.3749C10.6251 15.1166 10.845 15.8416 11.2571 16.4583C11.6691 17.075 12.2548 17.5556 12.94 17.8394C13.6252 18.1233 14.3792 18.1975 15.1067 18.0528C15.8341 17.9081 16.5023 17.551 17.0267 17.0265C17.5512 16.5021 17.9083 15.8339 18.053 15.1065C18.1977 14.379 18.1235 13.625 17.8396 12.9398C17.5558 12.2546 17.0751 11.6689 16.4585 11.2569C15.8418 10.8448 15.1168 10.6249 14.3751 10.6249Z"
            fill="#EEEFF7"
          />
        </svg>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium border-none">
        {/* <SelectItem value={SocialPlatform.All} className="hover:bg-[#20262F]">
          All Platform
        </SelectItem> */}
        <SelectItem
          value={ProfileFeedsGroups.POSTS}
          className="hover:bg-[#20262F]"
        >
          Posts
        </SelectItem>
        <SelectItem
          value={ProfileFeedsGroups.REPLIES}
          className="hover:bg-[#20262F]"
        >
          Reply
        </SelectItem>
        <SelectItem
          value={ProfileFeedsGroups.REPOSTS}
          className="hover:bg-[#20262F]"
        >
          Repost
        </SelectItem>
        <SelectItem
          value={ProfileFeedsGroups.LIKES}
          className="hover:bg-[#20262F]"
        >
          Like
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
