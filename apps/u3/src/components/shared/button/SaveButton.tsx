/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-13 15:22:33
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 10:48:17
 * @FilePath: /u3/apps/u3/src/components/shared/button/SaveButton.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { FavorButton, FavorButtonProps } from '@us3r-network/link';
import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons';

export function SaveButton({ ...props }: FavorButtonProps) {
  if (props.link?.url) {
    props.link.url = props.link.url.replace('?', '%3F');
    // todo: 临时解决方案，后续需要在link model里面去掉这个长度限制
    if (props.link.url.length > 100) {
      props.link.url = props.link.url.slice(0, 100);
    }
  }
  return (
    <FavorButton className="text-[white] border-none" {...props}>
      {({ isFavoring, isFavored, favorsCount }) => {
        return (
          <div title={`This is saved ${favorsCount} times`}>
            {(() => {
              if (isFavoring) {
                // return <LoadingSpokes className={styles.Icon} />;
              }
              if (isFavored) {
                return <StarFilledIcon />;
              }
              return <StarIcon />;
            })()}
          </div>
        );
      }}
    </FavorButton>
  );
}
