import { DemoListItemContent, DemoListItemHeader } from "./components";

import { useLoaderData, useParams } from "react-router";

export function Route() {
  const params = useParams();
  const _data = useLoaderData();

  return (
    <div className="flex flex-col pt-[140px] w-[40vw] h-[80vh]">
      <DemoListItemHeader listData={_data} />
      <DemoListItemContent content={_data.description} />
    </div>
  );
}
