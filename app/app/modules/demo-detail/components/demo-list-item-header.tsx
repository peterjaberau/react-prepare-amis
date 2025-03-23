import dayjs from "dayjs";

export function DemoListItemHeader({
  listData,
}: {
  listData: {
    id: string;
    title: string;
    description: string;
  };
}) {
  return (
    <div className="">
      <div className="text-[30px]">{listData.title}</div>
      <div className="flex text-gray-500 text-[14px] mt-[10px]">
        <div className="mr-[10px]">Description：{listData.description}</div>
      </div>
    </div>
  );
}
