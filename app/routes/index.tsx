import type { Route } from "./+types/home";
import { config } from "~/core/config";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {


    return config;
}


export default function Index({ loaderData }: Route.ComponentProps) {

    const config = loaderData;
    console.log("config", config);

    return <><div>Welcome Index</div></>;
}
