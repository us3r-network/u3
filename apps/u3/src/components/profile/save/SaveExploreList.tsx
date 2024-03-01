import SaveExploreListItem from './SaveExploreListItem';

export type SaveExploreListItemData = {
  id: string;
  url?: string;
  title?: string;
  logo?: string;
  createAt?: string;
};

export type SaveExploreListProps = {
  data: SaveExploreListItemData[];
  onItemClick?: (item: SaveExploreListItemData) => void;
};

export default function SaveExploreList({
  data,
  onItemClick,
}: SaveExploreListProps) {
  return (
    <div className="w-full flex flex-col divide-y">
      {data.map((item) => {
        return (
          <SaveExploreListItem
            key={item.id}
            data={item}
            onClick={() => onItemClick && onItemClick(item)}
          />
        );
      })}
    </div>
  );
}
