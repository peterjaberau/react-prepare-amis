import { DemoListItem } from "./components";
import type { loader } from "./loader";
import { useLoaderData } from "react-router";

export function Route() {
  const _data = useLoaderData<typeof loader>();
  const listData = _data.data ?? [];
  return (
    <div className="flex flex-col pt-[140px] w-[40vw] h-[80vh]">
      <div>
        {listData?.map((n: any) => {
          return <DemoListItem data={n} key={n.id} />;
        })}
      </div>
      <div className="flex justify-center text-gray-500">
        {listData.length <= 0 ? <div>No data yet</div> : null}
      </div>
    </div>
  );
}
