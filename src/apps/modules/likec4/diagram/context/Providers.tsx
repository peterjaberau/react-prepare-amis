import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
  createRef,
  useRef,
} from "react";
import { depsShallowEqual } from "../hooks/useUpdateEffect";
import { isFunction, mapToObj, map, pick } from "remeda";
import { useSyncedRef, useCustomCompareEffect } from "@react-hookz/web";
import { DiagramHandlerNames, DiagramFeatureNames } from "../contants.ts";
import { domMax, LazyMotion, MotionConfig } from 'framer-motion'

// LikeC4ModelProvider
export const LikeC4ModelContext = createContext<any | null>(null);
export type LikeC4ModelProviderProps = PropsWithChildren<{
  children: any;
  likec4model: any;
  [key: string]: any;
}>;
export function LikeC4ModelProvider(props: LikeC4ModelProviderProps) {
  const { children, likec4model } = props;
  return (
    <LikeC4ModelContext.Provider value={likec4model}>
      {children}
    </LikeC4ModelContext.Provider>
  );
}

//DiagramEventHandlersProvider
const DiagramEventHandlersContext = createContext<any | null>({
  ...mapToObj(DiagramHandlerNames, (name) => [name, null]),
  handlersRef: {
    current: {},
  },
});
export function DiagramEventHandlersProvider({ handlers, children }: any) {
  const handlersRef = useSyncedRef(handlers);

  const deps = DiagramHandlerNames.map((name) => isFunction(handlers[name]));

  const value = useMemo(
    (): any => ({
      ...mapToObj(DiagramHandlerNames, (name) => {
        if (handlersRef.current[name]) {
          return [
            name,
            (...args: any[]) => handlersRef.current[name]?.(...args),
          ];
        }
        return [name, null];
      }),
      handlersRef,
    }),
    [handlersRef, ...deps],
  );

  return (
    <DiagramEventHandlersContext.Provider value={value}>
      {children}
    </DiagramEventHandlersContext.Provider>
  );
}
export function useDiagramEventHandlers() {
  return useContext(DiagramEventHandlersContext);
}
export function useDiagramEventHandlersRef() {
  return useContext(DiagramEventHandlersContext).handlersRef;
}

//DiagramFeaturesProvider
export const AllDisabledDiagramFeatures: any = mapToObj(
  DiagramHandlerNames,
  (name) => [`enable${name}`, false] as const,
);
export const DiagramFeaturesContext = createContext<any | null>(
  AllDisabledDiagramFeatures,
);
export const validateDiagramFeatures = (features: any) => {
  let {
    enableReadOnly,
    enableLikeC4Model,
    enableElementDetails,
    enableRelationshipDetails,
    enableRelationshipBrowser,
    enableSearch,
    enableEdgeEditing,
    ...rest
  } = features;
  if (!enableLikeC4Model) {
    enableElementDetails = false;
    enableRelationshipDetails = false;
    enableRelationshipBrowser = false;
    enableSearch = false;
  }

  if (enableReadOnly) {
    enableEdgeEditing = false;
  }

  return {
    enableReadOnly,
    enableLikeC4Model,
    enableElementDetails,
    enableRelationshipDetails,
    enableRelationshipBrowser,
    enableSearch,
    enableEdgeEditing,
    ...rest,
  };
};
export function DiagramFeaturesProvider({
  children,
  features,
  overrides,
}: any) {
  const scope = useContext(DiagramFeaturesContext);
  const [enabled, setFeatures] = useState(scope);

  useCustomCompareEffect(
    () => {
      setFeatures(
        validateDiagramFeatures({
          ...scope,
          ...features,
          ...overrides,
        }),
      );
    },
    [scope, features, overrides],
    depsShallowEqual,
  );

  return (
    <DiagramFeaturesContext.Provider value={enabled}>
      {children}
    </DiagramFeaturesContext.Provider>
  );
}
DiagramFeaturesProvider.Overlays = ({ children }: PropsWithChildren) => {
  return (
    <DiagramFeaturesProvider
      overrides={{
        enableControls: false,
        enableReadOnly: true,
        enableEdgeEditing: false,
      }}
    >
      {children}
    </DiagramFeaturesProvider>
  );
};
export function useDiagramEnabledFeature(...names: any): any {
  return pick(
    useContext(DiagramFeaturesContext),
    map(names, (name) => `enable${name}` as const),
  );
}
export function IfDiagramFeatureEnabled({
  feature,
  children,
  and = true,
}: any) {
  const enabled =
    useDiagramEnabledFeature(feature)[`enable${feature}`] === true;
  return enabled && and ? <>{children}</> : null;
}
export function IfDiagramFeatureNotEnabled({ feature, children }: any) {
  const notEnabled =
    useDiagramEnabledFeature(feature)[`enable${feature}`] !== true;
  return notEnabled ? <>{children}</> : null;
}


//FramerMotionConfigContext
export const FramerMotionConfigContext = ({ reducedMotion = 'user', children, }: any) => {
  //reducedMotion = 'user' | 'always' | 'never'
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion={reducedMotion}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}

//RootContainerProvider
const RootContainerContext = createContext(createRef<HTMLDivElement>())
export function RootContainerProvider({
                                className,
                                children,
                              }: PropsWithChildren<{ className?: string | undefined }>) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceGraphics = useIsReducedGraphics()
  return (
    <div
      ref={ref}
      {...reduceGraphics && {
        ['data-likec4-reduced-graphics']: true,
      }}>
      <RootContainerContext.Provider value={ref}>
        {children}
      </RootContainerContext.Provider>
    </div>
  )
}
