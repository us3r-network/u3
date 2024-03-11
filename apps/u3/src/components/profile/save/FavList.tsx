import {
  FavListItemData,
  FavListLinkItem,
  FavListPostItem,
} from './FavListItem';

export type FavListProps = {
  data: FavListItemData[];
  onItemClick?: (item: FavListItemData) => void;
};

export default function FavList({ data, onItemClick }: FavListProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full text-center py-4 text-gray-400">
        Nothing to see here！ Explore and favorite what you like！
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col divide-y">
      {data.map((item) => {
        switch (item.type) {
          case 'link':
            return (
              <FavListLinkItem
                key={item.id}
                data={item}
                onClick={() => onItemClick && onItemClick(item)}
              />
            );
          case 'post':
            return (
              <FavListPostItem
                key={item.id}
                data={item}
                onClick={() => onItemClick && onItemClick(item)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
