import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { Cross2Icon } from '@radix-ui/react-icons';

import { FarCast } from '@/services/social/types';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { cn } from '@/lib/utils';
import { getCastTipsDetail } from '@/services/social/api/farcaster';
import Loading from '@/components/common/loading/Loading';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function FCastTipDetail({ cast }: { cast: FarCast }) {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipDetails, setTipDetails] = useState<
    {
      fromFid: number;
      amount: number;
      createdAt: number;
      txHash: string;
      type: string;
      userDatas: { type: number; value: string }[];
    }[]
  >([]);

  const loadTipsDetails = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getCastTipsDetail(
        Buffer.from(cast.hash.data).toString('hex')
      );
      if (resp.data.code !== 0) {
        toast.error(resp.data.msg);
      } else {
        setTipDetails(resp.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cast]);

  if (!cast.tipsTotalAmount) {
    return null;
  }
  return (
    <>
      <div
        className="flex items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setOpenModal(true);
          loadTipsDetails();
        }}
      >
        {/* <span className="text-[#718096] text-sm"> received</span> */}
        <span className="text-[#FFBB02]"> {cast.tipsTotalAmount} $DEGEN</span>
      </div>
      {openModal && (
        <TipDetailsModal
          open={openModal}
          setOpen={setOpenModal}
          loading={loading}
          details={tipDetails}
          tipsTotalAmount={tipDetails.reduce((acc, cur) => acc + cur.amount, 0)}
        />
      )}
    </>
  );
}

function TipDetailsModal({
  open,
  setOpen,
  details,
  loading,
  tipsTotalAmount,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  details: {
    fromFid: number;
    amount: number;
    txHash: string;
    createdAt: number;
    type: string;
    userDatas: { type: number; value: string }[];
  }[];
  loading: boolean;
  tipsTotalAmount: number;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={() => {
        setOpen(false);
      }}
      contentTop="50%"
      className="w-full md:w-[600px] max-h-full overflow-y-auto"
    >
      {(loading && (
        <div className="flex justify-center items-center min-h-36">
          <Loading />
        </div>
      )) || (
        <div
          className={cn(
            'flex flex-col gap-5 p-5 bg-[#1B1E23] text-white border-[#39424C]',
            'rounded-xl md:rounded-[20px] md:max-w-none md:w-[600px]'
          )}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-2">
              <div className="text-base">
                <span className="text-[#718096]">Tips</span>
              </div>
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Cross2Icon className="h-5 w-5 text-[#718096]" />
              </div>
            </div>
          </div>
          <Table>
            <TableHeader className="border-none">
              <TableRow className="hover:bg-none border-none">
                <TableHead className="w-[300px]">From</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border-none mb-5">
              {details.map((detail, index) => {
                const avatar = (detail.userDatas &&
                  detail.userDatas.find((item) => item.type === 1)) || {
                  value: '',
                };
                const name = (detail.userDatas &&
                  detail.userDatas.find((item) => item.type === 2)) || {
                  value: detail.fromFid,
                };
                const handle = (detail.userDatas &&
                  detail.userDatas.find((item) => item.type === 6)) || {
                  value: detail.fromFid,
                };
                return (
                  <TableRow key={detail.createdAt} className="border-none">
                    <TableCell className="font-medium flex gap-3">
                      <img
                        src={avatar?.value}
                        alt=""
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      <div>
                        <div className="text-lg">{name?.value}</div>
                        <div className="text-sm text-[#718096]">
                          @{handle?.value}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{detail.type || 'Token'}</TableCell>
                    <TableCell>{detail.amount}</TableCell>
                    <TableCell className="text-right">
                      {dayjs(detail.createdAt).fromNow()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <br />
            <TableFooter className="bg-muted/0 border-[#718096]">
              <TableRow className="">
                <TableCell colSpan={2}>Tipped {details.length} times</TableCell>
                <TableCell className="text-right" colSpan={2}>
                  Amount: {tipsTotalAmount} $DEGEN
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </ModalContainer>
  );
}
