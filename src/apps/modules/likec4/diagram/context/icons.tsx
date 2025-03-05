import {
  type Icon,
  type IconProps,
  IconBrowser,
  IconCylinder,
  IconDeviceMobile,
  IconRectangularPrism,
  IconReorder,
  IconUser,
} from "@tabler/icons-react";
import clsx from "clsx";
import {
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
  createContext,
  useContext,
} from "react";

const IconRendererContext = createContext<any | null>(null);

export const IconRendererProvider = IconRendererContext.Provider;

export function IconRenderer({
  element,
  className,
}: {
  element?: {
    id: string;
    title: string;
    icon?: string | null | undefined;
  };
  className: string;
}) {
  const RenderIcon = useContext(IconRendererContext);
  if (!element || !element.icon || element.icon === "none") {
    return null;
  }
  let icon: ReactNode;
  if (
    element.icon.startsWith("http://") ||
    element.icon.startsWith("https://")
  ) {
    icon = <img src={element.icon} alt={element.title} />;
  } else if (RenderIcon) {
    icon = <RenderIcon node={element} />;
  }

  if (!icon) {
    return null;
  }
  return (
    <div
      className={clsx(className, "likec4-element-icon")}
      data-likec4-icon={element.icon}
    >
      {icon}
    </div>
  );
}

const ShapeIcons = {
  browser: IconBrowser,
  cylinder: IconCylinder,
  mobile: IconDeviceMobile,
  person: IconUser,
  queue: IconReorder,
  rectangle: IconRectangularPrism,
  storage: IconCylinder,
} satisfies any;

export function IconOrShapeRenderer({
  element,
  className,
}: {
  element: {
    id: string;
    title: string;
    shape: any;
    icon?: string | null | undefined;
  };
  className: string;
}) {
  const icon = IconRenderer({
    element,
    className,
  });
  if (icon) {
    return icon;
  }
  const ShapeIcon: any = (ShapeIcons as any)[element.shape];
  return (
    <div className={clsx(className, "likec4-shape-icon")}>
      <ShapeIcon />
    </div>
  );
}
