import * as rj from "@/shared/utils/server/response-json";
import type { LoaderFunctionArgs } from "react-router";

const data = [
  {
    id: 1,
    title: "item 1",
    description: "description 1",
  },
  {
    id: 2,
    title: "item 2",
    description: "description 2",
  },
  {
    id: 3,
    title: "item 3",
    description: "description 3",
  },
  {
    id: 4,
    title: "item 4",
    description: "description 4",
  },
  {
    id: 5,
    title: "item 5",
    description: "description 5",
  },
]

export const loader = async (args: LoaderFunctionArgs) => {
  try {

    const { id } = args.params;

    return data.find((item) => item.id === Number(id));

  } catch (error) {
    return rj.rfj();
  }
};
