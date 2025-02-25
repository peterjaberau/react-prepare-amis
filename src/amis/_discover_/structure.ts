export default {
  Editor: {
    components: [
      "LeftPanels",
      "Preview",
      "Breadcrumb",
      "MobileDevTool",
      "RightPanels",
      "ContextMenuPanel",
      "SubEditor",
      "ScaffoldModal",
      "PopOverForm",
    ],
  },
  LeftPanels: {
    components: ["Tabs", "Panel Items", "DrawerPanel", "DrawerRendererPanel"],
    methods: ["handleHidden", "handleFixed", "handleSelect", "getPopOverContainer"],
    state: {
      isFixedStatus: false,
    },
  },
  RightPanels: {
    components: ["Tabs", "Panel Items", "renderPanel"],
    methods: ["handleHidden", "handleFixed", "handleSelect", "getPopOverContainer", "handlePanelChangeValue"],
    state: {
      isOpenStatus: true,
      isFixedStatus: false,
    },
  },
}

export const BaseControl = {
    "methods": {
        "BaseLabelMark": {
            "type": "(schema: Record<string, any> | string) => Record<string, any> | string | undefined",
            "params": {
                "schema": "Record<string, any> | string"
            },
            "desc": "Generates a base label mark."
        },
        "normalizCollapsedGroup": {
            "type": "(publicProps: Record<string, any>, body: any) => Array<Record<string, any>>",
            "params": {
                "publicProps": "Record<string, any>",
                "body": "any"
            },
            "desc": "Normalizes a collapsed group."
        },
        "normalizeBodySchema": {
            "type": "(defaultBody: Array<Record<string, any>>, body: Array<Record<string, any>> | Record<string, any>, replace?: boolean, reverse?: boolean, order?: Record<string, number>) => Array<Record<string, any>>",
            "params": {
                "defaultBody": "Array<Record<string, any>>",
                "body": "Array<Record<string, any>> | Record<string, any>",
                "replace": "boolean",
                "reverse": "boolean",
                "order": "Record<string, number>"
            },
            "desc": "Normalizes the body schema."
        },
        "formItemControl": {
            "type": "(panels: Partial<Record<FormItemControlPanel, { title?: string; body?: any; replace?: boolean; reverse?: boolean; hidden?: boolean; order?: Record<string, number>; validationType?: ValidationOptions }>>, context?: BaseEventContext) => Array<any>",
            "params": {
                "panels": "Partial<Record<FormItemControlPanel, { title?: string; body?: any; replace?: boolean; reverse?: boolean; hidden?: boolean; order?: Record<string, number>; validationType?: ValidationOptions }>>",
                "context": "BaseEventContext"
            },
            "desc": "Generates form item control."
        },
        "remarkTpl": {
            "type": "(config: { name: 'remark' | 'labelRemark'; label: string; labelRemark?: string; i18nEnabled?: boolean }) => Record<string, any>",
            "params": {
                "config": "{ name: 'remark' | 'labelRemark'; label: string; labelRemark?: string; i18nEnabled?: boolean }"
            },
            "desc": "Generates a remark template."
        }
    },
    "constants": {
        "BUTTON_DEFAULT_ACTION": {
            "type": "Record<string, any>",
            "desc": "Default action for a button."
        },
        "BaseLabelMark": {
            "type": "(schema: Record<string, any> | string) => Record<string, any> | string | undefined",
            "desc": "Generates a base label mark."
        }
    },
    "types": {
        "PrimitiveType": {
            "type": "string | number | boolean",
            "desc": "Represents a primitive type."
        },
        "ValidationOptions": {
            "type": "Array<{ option: string; isShow?: Record<string, PrimitiveType | Array<PrimitiveType>>; isHidden?: Record<string, PrimitiveType | Array<PrimitiveType>> }>",
            "desc": "Options for validation."
        },
        "FormItemControlPanel": {
            "type": "'property' | 'common' | 'option' | 'status' | 'validation' | 'style' | 'event'",
            "desc": "Represents a form item control panel."
        }
    },
    "imports": {
        "flatten": {
            "from": "lodash/flatten"
        },
        "getEventControlConfig, SUPPORT_STATIC_FORMITEM_CMPTS": {
            "from": "../renderer/event-control/helper"
        },
        "getSchemaTpl, isObject, tipedLabel": {
            "from": "amis-editor-core"
        },
        "BaseEventContext": {
            "from": "amis-editor-core"
        }
    }
}




export const BaseControl1 = {

    "BUTTON_DEFAULT_ACTION": "",
    "BaseLabelMark": "Function(schema)",
    "normalizCollapsedGroup": "Function(publicProps, body)",
    "normalizeBodySchema": "Function(defaultBody, body, replace, reverse, order)",
    "formItemControl": "Function(panels, context)",
    "remarkTpl": "Function(config)",
    "PrimitiveType": "",
    "ValidationOptions": [
        {
            "option": "",
            "isShow": "",
            "isHidden": ""
        }
    ],
    "FormItemControlPanel": ""



}

export const a = {
    "file": "packages/amis-editor/src/util.ts",
    "functions": [
        {
            "name": "isAuto",
            "description": "Checks if a value is an 'auto' layout option.",
            "calls": []
        },
        {
            "name": "resolveArrayDatasource",
            "description": "Resolves data sources for list display components.",
            "calls": [
                {
                    "function": "resolveVariableAndFilter",
                    "description": "Resolves variables and applies filters to data."
                }
            ]
        },
        {
            "name": "schemaToArray",
            "description": "Converts schema values to arrays.",
            "calls": []
        },
        {
            "name": "schemaArrayFormat",
            "description": "Formats schema arrays.",
            "calls": []
        },
        {
            "name": "resolveOptionType",
            "description": "Determines the type of options in a schema.",
            "calls": [
                {
                    "function": "findTree",
                    "description": "Finds a tree node based on a condition."
                }
            ]
        },
        {
            "name": "resolveOptionEventDataSchame",
            "description": "Builds event data schemas for option selectors.",
            "calls": [
                {
                    "function": "resolveOptionType",
                    "description": "Determines the type of options in a schema."
                }
            ]
        },
        {
            "name": "resolveInputTableEventDataSchame",
            "description": "Builds event data schemas for input tables.",
            "calls": []
        },
        {
            "name": "OPTION_EDIT_EVENTS",
            "description": "Defines event schemas for add, edit, and delete option events.",
            "calls": [
                {
                    "function": "resolveOptionEventDataSchame",
                    "description": "Builds event data schemas for option selectors."
                }
            ]
        },
        {
            "name": "OPTION_EDIT_EVENTS_OLD",
            "description": "Defines old event schemas for add, edit, and delete option events.",
            "calls": []
        },
        {
            "name": "TREE_BASE_EVENTS",
            "description": "Defines base events for tree components.",
            "calls": [
                {
                    "function": "resolveOptionEventDataSchame",
                    "description": "Builds event data schemas for option selectors."
                },
                {
                    "function": "OPTION_EDIT_EVENTS",
                    "description": "Defines event schemas for add, edit, and delete option events."
                },
                {
                    "function": "OPTION_EDIT_EVENTS_OLD",
                    "description": "Defines old event schemas for add, edit, and delete option events."
                }
            ]
        },
        {
            "name": "escapeFormula",
            "description": "Escapes formula syntax in component configurations.",
            "calls": [
                {
                    "function": "JSONValueMap",
                    "description": "Maps JSON values based on a callback function."
                }
            ]
        },
        {
            "name": "_isModelComp",
            "description": "Checks if a given schema is a model component.",
            "calls": []
        },
        {
            "name": "getOwnValue",
            "description": "Retrieves a value from an object by key.",
            "calls": []
        }
    ]
}
