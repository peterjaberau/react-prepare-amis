import * as rj from "@/shared/utils/server/response-json";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async (args: LoaderFunctionArgs) => {
  try {

    return {
      data: [
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
    };
  } catch (error) {
    return rj.rfj();
  }
};
