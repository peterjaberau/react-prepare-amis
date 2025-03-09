import { isEqual } from "lodash";

import {
  VizPanel,
  SceneObjectBase,
  SceneGridLayout,
  SceneVariableSet,
  SceneGridItemStateLike,
  SceneGridItemLike,
  sceneGraph,
  MultiValueVariable,
  LocalValueVariable,
  CustomVariable,
  VizPanelState,
  VariableValueSingle,
} from "@/apps/grafana/packages/scenes/scenes";
import { GRID_COLUMN_COUNT } from "@/apps/grafana/app/core/constants";
import { OptionsPaneCategoryDescriptor } from "@/apps/grafana/app/features/dashboard/components/PanelEditor/OptionsPaneCategoryDescriptor";

import { getCloneKey } from "../../utils/clone";
import { getMultiVariableValues } from "../../utils/utils";
import { DashboardLayoutItem } from "../types/DashboardLayoutItem";
import { DashboardRepeatsProcessedEvent } from "../types/DashboardRepeatsProcessedEvent";

import { getDashboardGridItemOptions } from "./DashboardGridItemEditor";
import { DashboardGridItemRenderer } from "./DashboardGridItemRenderer";
import { DashboardGridItemVariableDependencyHandler } from "./DashboardGridItemVariableDependencyHandler";
import { useEffect, useRef, useState } from "react";

export interface DashboardGridItemState extends SceneGridItemStateLike {
  body: VizPanel;
  repeatedPanels?: VizPanel[];
  variableName?: string;
  itemHeight?: number;
  repeatDirection?: RepeatDirection;
  maxPerRow?: number;
}

export type RepeatDirection = "v" | "h";

const DashboardGridItem = (props: DashboardGridItemState) => {
  const [state, setState] = useState<DashboardGridItemState>(props);
  const [prevRepeatValues, setPrevRepeatValues] = useState<
    VariableValueSingle[] | undefined
  >(undefined);
  const variableDependency = useRef(
    new DashboardGridItemVariableDependencyHandler({ state }),
  );

  useEffect(() => {
    if (state.variableName) {
      const subscription = subscribeToState((newState: any, prevState: any) =>
        handleGridResize(newState, prevState),
      );
      performRepeat();
      return () => subscription.unsubscribe();
    }
  }, [state.variableName]);

  const handleGridResize = (
    newState: DashboardGridItemState,
    prevState: DashboardGridItemState,
  ) => {
    const itemCount = state.repeatedPanels?.length ?? 1;
    const stateChange: Partial<DashboardGridItemState> = {};

    if (newState.height === prevState.height) {
      return;
    }

    if (getRepeatDirection() === "v") {
      stateChange.itemHeight = Math.ceil(newState.height! / itemCount);
    } else {
      const rowCount = Math.ceil(itemCount / getMaxPerRow());
      stateChange.itemHeight = Math.ceil(newState.height! / rowCount);
    }

    if (stateChange.itemHeight !== state.itemHeight) {
      setState((prevState) => ({ ...prevState, ...stateChange }));
    }
  };

  const getClassName = (): string => {
    return state.variableName ? "panel-repeater-grid-item" : "";
  };

  const getOptions = (): OptionsPaneCategoryDescriptor => {
    return getDashboardGridItemOptions({ state });
  };

  const editingStarted = () => {
    if (!state.variableName) {
      return;
    }

    if (state.repeatedPanels?.length ?? 0 > 1) {
      state.body.setState({
        $variables: state.repeatedPanels![0].state.$variables?.clone(),
        $data: state.repeatedPanels![0].state.$data?.clone(),
      });
    }
  };

  const editingCompleted = (withChanges: boolean) => {
    if (withChanges) {
      setPrevRepeatValues(undefined);
    }

    if (
      state.variableName &&
      state.repeatDirection === "h" &&
      state.width !== GRID_COLUMN_COUNT
    ) {
      setState((prevState) => ({ ...prevState, width: GRID_COLUMN_COUNT }));
    }
  };

  const performRepeat = () => {
    if (
      !state.variableName ||
      sceneGraph.hasVariableDependencyInLoadingState({ state })
    ) {
      return;
    }

    const variable =
      sceneGraph.lookupVariable(state.variableName, { state }) ??
      new CustomVariable({
        name: "_____default_sys_repeat_var_____",
        options: [],
        value: "",
        text: "",
        query: "A",
      });

    if (!(variable instanceof MultiValueVariable)) {
      console.error("DashboardGridItem: Variable is not a MultiValueVariable");
      return;
    }

    const { values, texts } = getMultiVariableValues(variable);

    if (isEqual(prevRepeatValues, values)) {
      return;
    }

    const panelToRepeat = state.body;
    const repeatedPanels: VizPanel[] = [];

    const emptyVariablePlaceholderOption = {
      values: [""],
      texts: variable.hasAllValue() ? ["All"] : ["None"],
    };

    const variableValues = values.length
      ? values
      : emptyVariablePlaceholderOption.values;
    const variableTexts = texts.length
      ? texts
      : emptyVariablePlaceholderOption.texts;

    for (let index = 0; index < variableValues.length; index++) {
      const cloneState: Partial<VizPanelState> = {
        $variables: new SceneVariableSet({
          variables: [
            new LocalValueVariable({
              name: variable.state.name,
              value: variableValues[index],
              text: String(variableTexts[index]),
            }),
          ],
        }),
        key: getCloneKey(panelToRepeat.state.key!, index),
      };
      const clone = panelToRepeat.clone(cloneState);
      repeatedPanels.push(clone);
    }

    const direction = getRepeatDirection();
    const stateChange: Partial<DashboardGridItemState> = {
      repeatedPanels: repeatedPanels,
    };
    const itemHeight = state.itemHeight ?? 10;
    const prevHeight = state.height;
    const maxPerRow = getMaxPerRow();

    if (direction === "h") {
      const rowCount = Math.ceil(repeatedPanels.length / maxPerRow);
      stateChange.height = rowCount * itemHeight;
    } else {
      stateChange.height = repeatedPanels.length * itemHeight;
    }

    setState((prevState) => ({ ...prevState, ...stateChange }));

    if (prevHeight !== state.height) {
      const layout = sceneGraph.getLayout({ state });
      if (layout instanceof SceneGridLayout) {
        layout.forceRender();
      }
    }

    setPrevRepeatValues(values);

    publishEvent(
      new DashboardRepeatsProcessedEvent({ source: { state } }),
      true,
    );
  };

  const setRepeatByVariable = (variableName: string | undefined) => {
    const stateUpdate: Partial<DashboardGridItemState> = { variableName };

    if (variableName && !state.repeatDirection) {
      stateUpdate.repeatDirection = "h";
    }

    if (state.body.state.$variables) {
      state.body.setState({ $variables: undefined });
    }

    setState((prevState) => ({ ...prevState, ...stateUpdate }));
  };

  const getMaxPerRow = (): number => {
    return state.maxPerRow ?? 4;
  };

  const setMaxPerRow = (maxPerRow: number | undefined) => {
    setState((prevState) => ({ ...prevState, maxPerRow }));
  };

  const getRepeatDirection = (): RepeatDirection => {
    return state.repeatDirection === "v" ? "v" : "h";
  };

  const setRepeatDirection = (repeatDirection: RepeatDirection) => {
    setState((prevState) => ({ ...prevState, repeatDirection }));
  };

  const isRepeated = (): boolean => {
    return state.variableName !== undefined;
  };

  return <DashboardGridItemRenderer state={state} />;
};
