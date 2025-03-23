import { NavLink, useParams } from "react-router";

export function DemoListItem(props: any) {
  const { data } = props;
  const { lang } = useParams();

  console.log('---data----', data);
  return (
    <div>
      <NavLink
        className="text-gray-900  hover:text-yellow-500"
        to={`/${lang}/demo-list/${props.data.id}`}
      >
        <h1 className="flex text-[16px] my-[10px]  before:block before:content-['·'] before:text-yellow-700 before:mr-[4px]">
          {data.title}
        </h1>
      </NavLink>
    </div>
  );
}
