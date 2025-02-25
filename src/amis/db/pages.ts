export const datasets = {
  "1": {
    type: "page",
    toolbar: [
      {
        type: "form",
        panelClassName: "mb-0",
        title: "",
        body: [
          {
            type: "select",
            label: "area",
            name: "businessLineId",
            selectFirst: true,
            mode: "inline",
            options: ["Beijing", "Shanghai"],
            checkAll: false,
          },
          {
            label: "time range",
            type: "input-date-range",
            name: "dateRange",
            inline: true,
            value: "-1month,+0month",
            inputFormat: "YYYY-MM-DD",
            format: "YYYY-MM-DD",
            closeOnSelect: true,
            clearable: false,
          },
        ],
        actions: [],
        mode: "inline",
        target: "mainPage",
        submitOnChange: true,
        submitOnInit: true,
      },
    ],
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "grid",
        columns: [
          {
            type: "panel",
            className: "h-full",
            body: {
              type: "tabs",
              tabs: [
                {
                  title: "Trends",
                  tab: [
                    {
                      type: "chart",
                      config: {
                        title: {
                          text: "Trends",
                        },
                        tooltip: {},
                        xAxis: {
                          type: "category",
                          boundaryGap: false,
                          data: ["January", "February", "March", "April", "May", "June"],
                        },
                        yAxis: {},
                        series: [
                          {
                            name: "Sales volume",
                            type: "line",
                            areaStyle: {
                              color: {
                                type: "linear",
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                  {
                                    offset: 0,
                                    color: "rgba(84, 112, 197, 1)",
                                  },
                                  {
                                    offset: 1,
                                    color: "rgba(84, 112, 197, 0)",
                                  },
                                ],
                                global: false,
                              },
                            },
                            data: [5, 20, 36, 10, 10, 20],
                          },
                        ],
                      },
                    },
                  ],
                },
                {
                  title: "Account balance",
                  tab: "0",
                },
              ],
            },
          },
          {
            type: "panel",
            className: "h-full",
            body: [
              {
                type: "chart",
                config: {
                  title: {
                    text: "Usages",
                  },
                  series: [
                    {
                      type: "pie",
                      data: [
                        {
                          name: "BOS",
                          value: 70,
                        },
                        {
                          name: "CDN",
                          value: 68,
                        },
                        {
                          name: "BCC",
                          value: 48,
                        },
                        {
                          name: "DCC",
                          value: 40,
                        },
                        {
                          name: "RDS",
                          value: 32,
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        type: "crud",
        className: "m-t-sm",
        api: "/api/mock2/sample",
        columns: [
          {
            name: "id",
            label: "ID",
          },
          {
            name: "engine",
            label: "Rendering engine",
          },
          {
            name: "browser",
            label: "Browser",
          },
          {
            name: "platform",
            label: "Platform(s)",
          },
          {
            name: "version",
            label: "Engine version",
          },
          {
            name: "grade",
            label: "CSS grade",
          },
        ],
      },
    ],
  },
  "2": {
    type: "page",
    title: "title",
    remark: {
      title: "标题",
      body: "这是一段描述问题，注意到了没，还可以设置标题。而且只有点击了才弹出来。",
      icon: "question-mark",
      placement: "right",
      trigger: "click",
      rootClose: true,
    },
    body: "内容部分. 可以使用 \\${var} 获取变量。如: `\\$date`: ${date}",
    aside: "sidebar part",
    toolbar: "toolbar",
    initApi: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
  },
  "3": {
    type: "page",
    title: "标题",
    remark: "提示 Tip",
    body: [
      "\n            <p>`initApi` 拉取失败时，页面内容区会显示对应的错误信息。</p>\n\n            <p>其他提示示例</p>\n        ",
      {
        type: "alert",
        level: "success",
        body: "温馨提示：对页面功能的提示说明，绿色为正向类的消息提示",
      },
      {
        type: "alert",
        level: "warning",
        body: "您的私有网络已达到配额，如需更多私有网络，可以通过<a>工单</a>申请",
      },
    ],
    aside: "边栏",
    toolbar: "工具栏",
    initApi: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initDataError",
  },
  "4": {
    type: "page",
    title: "表单页面",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "form",
        mode: "horizontal",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
        body: [
          {
            label: "Name",
            type: "input-text",
            name: "name",
          },
          {
            label: "Email",
            type: "input-email",
            placeholder: "请输入邮箱地址",
            name: "email",
          },
        ],
      },
    ],
  },
  "5": {
    title: "Summary of various display modes of forms",
    remark: "Form showing various modes",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "grid",
        columns: [
          {
            type: "form",
            api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            title: "Normal mode",
            mode: "normal",
            body: [
              {
                type: "input-email",
                name: "email",
                required: true,
                placeholder: "Please enter your email address",
                label: "Email address",
                size: "full",
              },
              {
                type: "input-password",
                name: "password",
                label: "Password",
                required: true,
                placeholder: "Please enter your password",
                size: "full",
              },
              {
                type: "checkbox",
                name: "rememberMe",
                label: "Remember login",
              },
              {
                type: "submit",
                label: "Login",
              },
            ],
          },
          {
            type: "form",
            api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            title: "Normal mode input md size",
            mode: "normal",
            body: [
              {
                type: "input-email",
                name: "email",
                required: true,
                placeholder: "Please enter your email address",
                label: "Email address",
                size: "md",
                remark: "xxxx",
                hint: "bla bla bla",
              },
              {
                type: "input-password",
                name: "password",
                label: "Password",
                required: true,
                placeholder: "Please enter your password",
                size: "md",
              },
              {
                type: "checkbox",
                name: "rememberMe",
                label: "Remember login",
              },
              {
                type: "submit",
                label: "Login",
              },
            ],
          },
        ],
      },
      {
        type: "grid",
        columns: [
          {
            type: "form",
            api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            title: "Horizontal mode, left and right placement, left and right ratio distribution",
            mode: "horizontal",
            autoFocus: false,
            horizontal: {
              left: "col-sm-2",
              right: "col-sm-10",
              offset: "col-sm-offset-2",
            },
            body: [
              {
                type: "input-email",
                name: "email",
                placeholder: "Please enter your email address",
                label: "Email",
                required: true,
                desc: "Form description text",
              },
              {
                type: "input-password",
                name: "password",
                label: "Password",
                placeholder: "Enter password",
              },
              {
                type: "checkbox",
                name: "rememberMe",
                label: "Remember login",
              },
              {
                type: "control",
                body: {
                  type: "submit",
                  label: "Submit",
                },
              },
            ],
          },
          {
            type: "form",
            api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
            title: "Horizontal mode, left and right placement, fixed width input md size on the left",
            mode: "horizontal",
            autoFocus: false,
            horizontal: {
              leftFixed: "xs",
            },
            body: [
              {
                type: "input-email",
                name: "email",
                placeholder: "Please enter your email address",
                label: "email",
                required: true,
                desc: "Form description text",
                size: "md",
                remark: "xxxx",
                hint: "bla bla bla",
              },
              {
                type: "input-password",
                name: "password",
                label: "password",
                placeholder: "Enter password",
                size: "md",
              },
              {
                type: "checkbox",
                name: "rememberMe",
                label: "Remember login",
              },
              {
                type: "control",
                body: {
                  type: "submit",
                  label: "Submit",
                },
              },
            ],
          },
        ],
      },
      {
        type: "form",
        className: "m-b",
        body: [
          {
            type: "property",
            title: "Machine Configuration",
            items: [
              {
                label: "cpu",
                content: {
                  type: "select",
                  name: "cpu",
                  value: "1",
                  options: [
                    { label: "1 core", value: "1" },
                    { label: "4 core", value: "4" },
                    { label: "8 core", value: "8" },
                  ],
                },
              },
              { label: "memory", content: "4G" },
              { label: "disk", content: "80G" },
              { label: "network", content: "4M", span: 2 },
              { label: "IDC", content: "beijing" },
              {
                label: "Note",
                content: { type: "textarea", required: true, name: "note", placeholder: "Enter..." },
                span: 3,
              },
            ],
          },
        ],
        actions: [{ type: "submit", label: "Submit" }],
      },
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        title: "Inline Mode",
        mode: "inline",
        autoFocus: false,
        body: [
          { type: "input-email", name: "email", placeholder: "Enter Email", label: "email" },
          { type: "input-password", name: "password", placeholder: "password", remark: "Bla bla bla" },
          { type: "checkbox", name: "rememberMe", label: "Remember login" },
          { type: "submit", label: "Login" },
          { type: "button", label: "Export", url: "http://www.baidu.com/", level: "success" },
        ],
      },
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com /api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        title: "In normal mode, you can wrap it in an array and control multiple lines to display",
        mode: "normal",
        autoFocus: false,
        body: [
          {
            type: "input-text",
            name: "name",
            placeholder: "Please enter...",
            label: "name",
            size: "full",
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email",
                placeholder: "Enter email",
                label: "email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password",
                label: "password",
                placeholder: "Please enter your password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email2",
                mode: "inline",
                placeholder: "Please enter your email address",
                label: "Email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password2",
                label: "password",
                mode: "inline",
                placeholder: "Please enter your password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email3",
                mode: "inline",
                placeholder: "Please enter your email address",
                label: "Email",
                size: "full",
                columnClassName: "v-bottom",
              },
              {
                type: "input-password",
                name: "password3",
                label: "password",
                placeholder: "Please enter password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input -email",
                name: "email4",
                placeholder: "Please enter your email address",
                label: "Email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password4",
                label: "Password",
                placeholder: "Please enter password",
                mode: "inline",
                size: "full",
                columnClassName: "v-bottom",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "checkbox",
            name: "rememberMe",
            label: "Remember Me",
          },
          {
            type: "submit",
            label: "Submit",
          },
        ],
      },
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        title: "Horizontal mode can also control the display of multiple lines by wrapping it with an array",
        mode: "horizontal",
        autoFocus: false,
        body: [
          {
            type: "input-email",
            name: "email",
            placeholder: "Please enter your email address",
            label: "Email",
            size: "full",
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email2",
                placeholder: "Please enter your email address",
                label: "Email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password2",
                label: "Password",
                placeholder: "Please enter your password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email3",
                placeholder: "Please enter your email address",
                label: "Email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password3",
                label: "password",
                placeholder: "Please enter your password",
                size: "full",
              },
              {
                type: "input-password",
                name: "password3",
                label: "password",
                placeholder: "Please enter your password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email4",
                placeholder: "Please enter your email address",
                label: "email",
                size: "full",
                columnClassName: "col-sm-6",
                horizontal: {
                  left: "col-sm-4",
                  right: "col-sm-8",
                },
              },
              {
                type: "input-password",
                name: "password4",
                label: "password",
                placeholder: "Please enter your password",
                mode: "inline",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            label: "email",
            gap: "xs",
            body: [
              {
                label: false,
                type: "input-email",
                name: "email5",
                placeholder: "Please enter your email address",
                size: "full",
              },
              {
                type: "input-password",
                name: "password5",
                label: "password",
                placeholder: "Please enter your password",
                mode: "inline",
                size: "full",
              },
            ],
          },
          { type: "divider" },
          {
            type: "group",
            label: "email",
            description: "bla bla",
            gap: "xs",
            body: [
              { type: "input-email", name: "email6", placeholder: "Please enter your email address", mode: "inline" },
              {
                type: "input-password",
                name: "password6",
                placeholder: "Please enter password",
                labelClassName: "w-auto p-r-none",
                mode: "inline",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            label: "email",
            description: "bla bla",
            direction: "vertical",
            body: [
              {
                type: "input-email",
                name: "email9",
                mode: "normal",
                placeholder: "Please enter your email address address",
                inline: true,
                description: "Bla blamfejkf fdjk",
              },
              {
                type: "input-password",
                name: "password9",
                mode: "normal",
                placeholder: "Please enter password",
                labelClassName: "w -auto p-r-none",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "checkbox",
            name: "rememberMe",
            label: "Remember Me",
          },
          {
            type: "submit",
            label: "Submit",
          },
        ],
      },
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        title: "Inline form can be wrapped in an array and can also control multiple lines to display",
        mode: "inline",
        submitText: null,
        autoFocus: false,
        body: [
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email",
                placeholder: "Enter Email",
                label: "Email",
                size: "full",
              },
              {
                type: "input-password",
                name: "password",
                placeholder: "Password",
                size: "full",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            body: [
              {
                type: "input-email",
                name: "email",
                placeholder: "Enter Email",
                label: "email",
                size: "full",
              },
              { type: "checkbox", name: "rememberMe", label: "remember me", size: "full" },
              {
                type: "button-toolbar",
                buttons: [
                  { type: "submit", label: "Login" },
                  { type: "button", label: "export", url: "http://www.baidu.com/", level: "success" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "6": {
    title: "List of all Form elements",
    data: {
      id: 1,
    },
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    definitions: {},
    body: [
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/saveForm?waitSeconds=2",
        title: "form item",
        mode: "horizontal",
        autoFocus: true,
        body: [
          {
            type: "html",
            html: "<p>html snippet, can be used to add descriptive text</p>",
          },
          {
            type: "divider",
          },
          {
            type: "input-text",
            name: "var1",
            label: "text",
          },
          {
            type: "divider",
          },
          {
            type: "input-text",
            name: "withHelp",
            label: "with help information",
            desc: "This is a description text",
          },
          {
            type: "divider",
          },
          {
            type: "input-password",
            name: "password",
            label: "password",
            inline: true,
          },
          {
            type: "divider",
          },
          {
            type: "input-number",
            name: "number",
            label: "number",
            placeholder: "",
            inline: true,
            value: 5,
            min: 1,
            max: 10,
          },
          {
            type: "divider",
          },
          {
            type: "input-number",
            name: "number",
            label: "number disabled",
            placeholder: "",
            disabled: true,
            inline: true,
            value: 5,
            min: 1,
            max: 10,
          },
          {
            type: "divider",
          },
          {
            type: "input-tag",
            name: "tag",
            label: "tag",
            placeholder: "",
            clearable: true,
            options: [
              {
                label: "Zhuge Liang",
                value: "zhugeliang",
              },
              {
                label: "Cao Cao",
                value: "caocao",
              },
              {
                label: "Zhong Wuyan",
                value: "zhongwuyan",
              },
              {
                label: "Ye He",
                children: [
                  {
                    label: "Li Bai",
                    value: "libai",
                  },
                  {
                    label: "Han Xin",
                    value: "hanxin",
                  },
                  {
                    label: "云中君",
                    value: "yunzhongjun",
                  },
                ],
              },
            ],
          },
          { type: "divider" },
          { type: "input-text", name: "placeholder", label: "Placeholder", placeholder: "Placeholder" },
          { type: "divider" },
          {
            type: "input-text",
            disabled: true,
            name: "disabled",
            label: "disabled state",
            placeholder: "No input is allowed here",
          },
          { type: "divider" },
          {
            type: "input-text",
            name: "text-sug",
            label: "text prompt",
            options: ["lixiaolong", "zhouxingxing", "yipingpei", "liyuanfang"],
            addOn: { type: "text", label: "$" },
          },
          { type: "divider" },
          {
            type: "input-text",
            name: "text-sug-multiple",
            label: "Text prompt multiple selection",
            multiple: true,
            options: ["lixiaolong", "zhouxingxing", "yipingpei", "liyuanfang"],
          },
          {
            type: "divider",
          },
          {
            type: "static",
            name: "static",
            labelClassName: "text-muted",
            label: "Static display",
            value: "This is the value of static display",
          },
          {
            type: "divider",
          },
          {
            type: "static",
            name: "static2",
            label: "Static display",
            value: "This is the value of static display",
            copyable: {
              content: "blabla",
            },
          },
          {
            type: "divider",
          },
          {
            type: "checkboxes ",
            name: "checkboxes",
            label: "multiple checkboxes",
            value: 3,
            options: [
              {
                label: "option 1",
                value: 1,
              },
              {
                label: "option 2",
                value: 2,
              },
              {
                label: "Option 3",
                disabled: true,
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "checkboxes",
            name: "checkboxesInline",
            label: "Multiple selections, non-linked",
            inline: false,
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "radios",
            name: "radios",
            label: "Single Choice",
            value: 3,
            options: [
              {
                label: "Option 1",
                value: 1,
              },
              {
                label: "Option 2",
                value: 2,
              },
              {
                label: "Option 3",
                disabled: true,
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "radios",
            name: "radios",
            label: "Single Choice Disable",
            value: 3,
            disabled: true,
            options: [
              {
                label: "Option 1",
                value: 1,
              },
              {
                label: "Option 2",
                value: 2,
              },
              {
                label: "Option 3",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "radios",
            name: "radiosInline",
            label: "Radio selection non-inline",
            inline: false,
            options: [
              {
                label: "Option 1",
                value: 1,
              },
              {
                label: "Option 2",
                value: 2,
              },
              {
                label: "Option 3",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-toolbar",
            label: "Various buttons",
            buttons: [
              {
                type: "action",
                label: "Default",
              },
              {
                type: "action",
                label: "Primary",
                level: "primary",
              },
              {
                type: "action",
                label: "Secondary",
                level: "secondary",
              },
              {
                type: "action",
                label: "Success",
                level: "success",
              },
              {
                type: "action",
                label: "Warning",
                level: "warning",
              },
              {
                type: "action",
                label: "danger",
                level: "danger",
              },
              {
                type: "action",
                label: "light",
                level: "light",
              },
              {
                type: "action",
                label: "dark",
                level: "dark",
              },
              {
                type: "action",
                label: "link",
                level: "link",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-group-select",
            name: "btn-group",
            label: "Button group",
            description: "Similar to radio selection effect",
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-group-select",
            name: "btn-group2",
            label: "Button group",
            clearable: true,
            description: "Clearable",
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-group-select",
            name: "btn-group3",
            label: "Button Group",
            multiple: true,
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
            desc: "Multiple selections",
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "List",
            label: "List",
            desc: "Also similar, but with a different display method",
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list2",
            label: "List",
            desc: "Multiple options",
            multiple: true,
            options: [
              {
                label: "Option A",
                value: 1,
              },
              {
                label: "Option B",
                value: 2,
              },
              {
                label: "Option C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list4",
            label: "List",
            imageClassName: "thumb-lg",
            desc: "Supports putting a picture",
            options: [
              {
                image: "/amis/static/photo/3893101144_bff2dc9.jpg",
                value: 1,
                label: "Picture 1",
              },
              {
                image: "/amis/static/photo/3893101144_bff2dc9.jpg",
                value: 2,
                label: "Picture 2",
              },
              {
                image: "/amis/static/photo/3893101144_bff2dc9.jpg",
                value: 3,
                label: "Picture 3",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list5",
            label: "List",
            desc: "Support text typesetting",
            options: [
              {
                value: 1,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C01</div>\n <div class="text-sm">CPU: 22 cores</div>\n <div class="text-sm">Memory: 10GB</div>\n <div class="text-sm">SSD disk: 1024GB</div>\n </div>',
              },
              {
                value: 2,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C02</div>\n <div class="text-sm">CPU: 23 cores</div>\n <div class="text-sm">Memory: 11GB</div>\n <div class="text-sm">SSD disk: 1025GB</div>\n </div>',
              },
              {
                value: 3,
                disabled: true,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C03</div>\n <div class="text-sm">CPU: 24 cores</div>\n <div class="text-sm">Memory: 12GB</div>\n <div class="text-sm">SSD disk: 1026GB</div>\n </div>',
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-rating",
            count: 5,
            value: 3,
            label: "rating",
            name: "rating",
            readOnly: false,
            half: false,
          },
          {
            type: "divider",
          },
          {
            type: "switch",
            name: "switch",
            label: "switch",
          },
          {
            type: "switch",
            name: "switch2",
            value: true,
            label: "switch on",
          },
          {
            type: "switch",
            name: "switch3",
            value: true,
            disabled: true,
            label: "switch disabled",
          },
          {
            type: "switch",
            name: "switch4",
            value: true,
            onText: "on",
            offText: "off",
            label: "switch text",
          },
          {
            type: "switch",
            name: "switch5",
            value: true,
            onText: { type: "icon", icon: "fa fa-check-circle" },
            offText: { type: "icon", icon: "fa fa-times-circle" },
            label: "switch icon",
          },
          { type: "divider" },
          {
            type: "checkbox",
            name: "checkbox",
            label: "checkbox",
            option: "",
          },
          {
            type: "divider",
          },
          {
            type: "select",
            name: "type",
            label: "drop-down radio",
            inline: true,
            options: [
              {
                label: "option 1",
                value: 1,
              },
              {
                label: "option 2",
                value: 2,
              },
              {
                label: "option with very long content, option with very long content",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "select",
            name: "type",
            label: "disable drop-down radio",
            disabled: true,
            inline: true,
            options: [
              {
                label: "option 1",
                value: 1,
              },
              {
                label: "option 2",
                value: 2,
              },
            ],
          },
          { type: "divider" },
          {
            type: "select",
            name: "type2",
            label: "Multiple selection",
            multiple: true,
            inline: true,
            options: [
              { label: "Option 1", value: 1 },
              { label: "Option 2", value: 2 },
            ],
          },
          { type: "divider" },
          { type: "input-color", name: "color", inline: true, label: "Color" },
          { type: "divider" },
          { type: "input-date", name: "date", inline: true, label: "date" },
          { type: "divider" },
          { type: "input-datetime", name: "datetime", inline: true, label: "Date+Time" },
          { type: "divider" },
          { type: "input-time", name: "time", inline: true, label: "time" },
          { type: "divider" },
          {
            type: "input-month",
            name: "year-month",
            inline: true,
            label: "year and month",
            value: "-1month",
            inputFormat: "YYYY-MM",
          },
          { type: "divider" },
          { type: "input-month", name: "month", inline: true, label: "month", value: "-1month", inputFormat: "MM" },
          { type: "divider" },
          { type: "input-date-range", name: "daterangee", inline: true, label: "time range" },
          { type: "divider" },
          {
            type: "group",
            body: [
              { type: "input-datetime", name: "starttime", label: "start time", maxDate: "${endtime}" },
              {
                type: "input-datetime",
                name: "endtime",
                label: "end time ",
                minDate: "${starttime}",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "group",
            label: "time range",
            required: "",
            gap: "xs",
            description: "After selecting Custom, you can select the date range",
            body: [
              {
                type: "button-group-select",
                name: "range1",
                value: "today",
                btnActiveLevel: "primary",
                mode: " inline",
                options: [
                  {
                    label: "Today",
                    value: "today",
                  },
                  {
                    label: "Yesterday",
                    value: "yesterday",
                  },
                  {
                    label: "In the past three days",
                    value: "3days",
                  },
                  { label: "Nearly a week", value: "week" },
                  { label: "custom", value: "custom" },
                ],
              },
              {
                type: "input-date",
                name: "starttime1",
                maxDate: "${endtime1}",
                visibleOn: "data.range1 == 'custom'",
                mode: "inline",
              },
              {
                type: "input-date",
                name: "endtime1",
                minDate: "${starttime1}",
                visibleOn: "data.range1 == 'custom'",
                mode: "inline",
              },
            ],
          },
          { type: "divider" },
          {
            type: "input-group",
            size: "sm",
            inline: true,
            label: "Icon combination",
            body: [
              { type: "icon", addOnclassName: "no-bg", className: "text-sm", icon: "search" },
              {
                type: "input-text",
                placeholder: "Search job ID/name",
                inputClassName: "b-l-none p-l-none ",
                name: "jobName",
              },
            ],
          },

          { type: "divider" },
          {
            type: "input-group",
            label: "Various combinations",
            inline: true,
            body: [
              {
                type: "select",
                name: "memoryUnits",
                options: [
                  { label: "Gi", value: "Gi" },
                  { label: "Mi", value: "Mi" },
                  { label: "Ki", value: "Ki" },
                ],
                value: "Gi",
              },
              { type: "input-text", name: "memory" },
              {
                type: "select",
                name: "memoryUnits2",
                options: [
                  { label: "Gi", value: "Gi" },
                  { label: "Mi", value: "Mi" },
                  { label: "Ki", value: "Ki" },
                ],
                value: "Gi",
              },
              {
                type: "button",
                label: "Go",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-excel",
            label: "Excel Analysis",
            name: "excel",
          },
          {
            type: "divider",
          },
          {
            type: "input-kv",
            label: "kv input",
            name: "kv",
          },
          {
            type: "input-kvs",
            name: "kvs",
            label: "kvs",
            keyItem: {
              label: "field name",
            },
            valueItems: [
              {
                type: "switch",
                name: "primary",
                label: "Is it the primary key",
              },
              {
                type: "select",
                name: "type",
                label: "field type",
                options: ["text", "int", "number"],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-image",
            name: "image",
            label: "picture",
          },
          {
            type: "divider",
          },
          {
            type: "input -image",
            name: "image",
            label: "The image has a default placeholder",
            frameImage: "/amis/static/photo/3893101144_bff2dc9.jpg",
            fixedSize: true,
            fixedSizeClassName: "h-32",
          },
          { type: "divider" },
          {
            type: "input-image",
            name: "imageCrop",
            label: "Picture with crop",
            crop: { aspectRatio: 1.7777777777777777 },
          },
          { type: "divider" },
          {
            type: "input-image",
            name: "imageLimit",
            label: "Pictures with restrictions",
            limit: { width: 200, height: 200 },
          },
          { type: "divider" },
          {
            type: "textarea",
            name: "textarea",
            label: "Multi-line text",
          },
          {
            type: "divider",
          },
          {
            type: "textarea",
            name: "textarea",
            disabled: true,
            label: "Multi-line text disabled",
          },
          {
            type: "divider",
          },
          {
            label: "Shuttle",
            name: "a",
            type: "transfer",
            source:
              "https://3xsw4ap8wah59.cfc- execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            searchable: true,
            searchApi:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/ amis-mock/mock2/options/autoComplete2?term=$term",
            selectMode: "list",
            sortable: true,
            inline: true,
          },
          { type: "divider" },
          {
            type: "json-editor",
            name: "json",
            value: '{\n "a": 1,\n "b": [\n 1,\n 2,\n 3\n ]\n}',
            label: "Json Editor",
          },
          { type: "divider" },
          { type: "input-rich-text", name: "html", label: "Rich Text", value: "<p>Just do <code>IT</code>!</p>" },
          { type: "divider" },
          {
            label: "time frequency",
            type: "group",
            body: [
              { name: "repeatCount", type: "input-range", label: false, visibleOn: 'data.repeatUnit == "year"' },
              {
                name: "repeatCount",
                type: "input-range",
                label: false,
                max: 11,
                min: 1,
                visibleOn: 'data.repeatUnit == "month"',
              },
              {
                name: "repeatCount",
                type: "input-range",
                label: false,
                max: 29,
                min: 1,
                visibleOn: 'data.repeatUnit == "day"',
              },
              {
                type: "select",
                name: "repeatUnit",
                label: false,
                value: "none",
                columnClassName: "v-middle w-ssm no-grow",
                options: [
                  { label: "Do not repeat", value: "none" },
                  { label: "year", value: "year" },
                  { label: "month", value: "month" },
                  { label: "day", value: "day" },
                ],
              },
            ],
          },
          { type: "divider" },
          {
            type: "input-tree",
            name: "tree",
            label: "tree",
            iconField: "icon",
            options: [
              {
                label: "Folder A",
                value: 1,
                icon: "fa fa-bookmark",
                children: [
                  { label: "file A", value: 2, icon: "fa fa-star" },
                  { label: "file B", value: 3 },
                ],
              },
              { label: "file C", value: 4 },
              { label: "file D", value: 5 },
            ],
          },
          { type: "divider" },
          {
            type: "input-tree",
            name: "trees",
            label: "Tree Multiple Selection",
            multiple: true,
            options: [
              {
                label: "Folder A",
                value: 1,
                children: [
                  { label: "file A", value: 2 },
                  { label: "file B", value: 3 },
                ],
              },
              { label: "file C", value: 4 },
              { label: "file D", value: 5 },
            ],
          },
          { type: "divider" },
          {
            label: "time frequency",
            type: "group",
            body: [
              { name: "repeatCount", type: "input-range", label: false, visibleOn: 'data.repeatUnit == "year"' },
              {
                name: "repeatCount",
                type: "input-range",
                label: false,
                max: 11,
                min: 1,
                visibleOn: 'data.repeatUnit == "month"',
              },
              {
                name: "repeatCount",
                type: "input-range",
                label: false,
                max: 29,
                min: 1,
                visibleOn: 'data.repeatUnit == "day"',
              },
              {
                type: "select",
                name: "repeatUnit",
                label: false,
                value: "none",
                columnClassName: "v-middle w-ssm no-grow",
                options: [
                  { label: "Do not repeat", value: "none" },
                  { label: "year", value: "year" },
                  { label: "month", value: "month" },
                  { label: "day", value: "day" },
                ],
              },
            ],
          },
          { type: "divider" },
          {
            type: "input-tree",
            name: "tree",
            label: "tree",
            iconField: "icon",
            options: [
              {
                label: "Folder A",
                value: 1,
                icon: "fa fa-bookmark",
                children: [
                  { label: "file A", value: 2, icon: "fa fa-star" },
                  { label: "file B", value: 3 },
                ],
              },
              { label: "file C", value: 4 },
              { label: "file D", value: 5 },
            ],
          },
          { type: "divider" },
          {
            type: "input-tree",
            name: "trees",
            label: "Tree Multiple Selection",
            multiple: true,
            options: [
              {
                label: "Folder A",
                value: 1,
                children: [
                  { label: "file A", value: 2 },
                  { label: "file B", value: 3 },
                ],
              },
              { label: "file C", value: 4 },
              { label: "file D", value: 5 },
            ],
          },
          { type: "divider" },
          {
            type: "nested-select",
            name: "nestedSelectMul",
            label: "Cascading multiple",
            multiple: true,
            checkAll: false,
            options: [
              {
                label: "concept",
                value: "concepts",
                children: [
                  {
                    label: "Configuration and components",
                    value: "schema",
                  },
                  {
                    label: "Data domain and data chain",
                    value: "scope",
                  },
                  {
                    label: "Template",
                    value: "template",
                  },
                  {
                    label: "Data mapping",
                    value: "data-mapping",
                  },
                  {
                    label: "Expression",
                    value: "expression",
                  },
                  {
                    label: "Linkage",
                    value: "linkage",
                  },
                  {
                    label: "Behavior",
                    value: "action",
                  },
                  {
                    label: "Style",
                    value: "style",
                  },
                ],
              },
              {
                label: "Type",
                value: "types",
                children: [
                  {
                    label: "SchemaNode",
                    value: "schemanode",
                  },
                  {
                    label: "API",
                    value: "api",
                  },
                  {
                    label: "Definitions",
                    value: "definitions",
                  },
                ],
              },
              {
                label: "Component",
                value: "zujian",
                children: [
                  {
                    label: "Layout",
                    value: "buju",
                    children: [
                      {
                        label: "Page",
                        value: "page",
                      },
                      {
                        label: "Container",
                        value: "container",
                      },
                      {
                        label: "Collapse",
                        value: "Collapse",
                      },
                    ],
                  },
                  {
                    label: "Function",
                    value: "gongneng",
                    children: [
                      {
                        label: "Action Behavior Button",
                        value: "action-type",
                      },
                      {
                        label: "App multi-page application",
                        value: "app",
                      },
                      {
                        label: "Button button",
                        value: "button",
                      },
                    ],
                  },
                  {
                    label: "Data input",
                    value: "shujushuru",
                    children: [
                      {
                        label: "Form form",
                        value: "form",
                      },
                      {
                        label: "FormItem form item",
                        value: "formitem",
                      },
                      {
                        label: "Options selector form item",
                        value: "options",
                      },
                    ],
                  },
                  {
                    label: "Data display",
                    value: "shujuzhanshi",
                    children: [
                      {
                        label: "CRUD add, delete, modify and query",
                        value: "crud",
                      },
                      {
                        label: "Table table",
                        value: "table",
                      },
                      {
                        label: "Card card",
                        value: "card",
                      },
                    ],
                  },
                  {
                    label: "Feedback",
                    value: "fankui",
                  },
                ],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-city",
            name: "city",
            label: "city selector",
          },
          {
            type: "divider",
          },
          {
            type: "matrix-checkboxes",
            name: "matrix",
            label: "matrix switch",
            rowLabel: "row title description",
            columns: [
              {
                label: "column 1",
              },
              {
                label: "column 2",
              },
            ],
            rows: [
              {
                label: "row 1",
              },
              {
                label: "row 2",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "combo",
            name: "combo",
            label: "combined single item",
            items: [
              {
                name: "a",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "b",
                type: "select",
                options: ["a", "b", "c"],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "combo",
            name: "combo2",
            label: "Combination of multiple items",
            multiple: true,
            value: [{}],
            items: [
              {
                name: "a",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "b",
                type: "select",
                options: ["a", "b", "c"],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-sub-form",
            label: "Subform",
            name: "subForm",
            btnLabel: "Click to set ${a}",
            form: {
              title: "Subform",
              body: [
                {
                  name: "a",
                  type: "input-text",
                  label: "Foo",
                },
                {
                  name: "b",
                  type: "switch",
                  label: "Boo",
                },
              ],
            },
          },
          {
            type: "divider",
          },
          {
            type: "input-sub-form",
            label: "Multiple subforms",
            name: "subForm2",
            btnLabel: "Click to set",
            labelField: "a",
            multiple: true,
            form: {
              title: "Subform",
              body: [
                {
                  name: "a",
                  type: "input-text",
                  label: "Foo",
                },
                {
                  name: "b",
                  type: "switch",
                  label: "Boo",
                },
              ],
            },
          },
          { type: "divider" },
          { type: "input-file", name: "file", label: "File upload", joinValues: false },
          { type: "divider" },
          {
            type: "input-range",
            name: "range",
            label: "range",
          },
          {
            type: "divider",
          },
          {
            type: "button-toolbar",
            buttons: [
              {
                type: "submit",
                label: "submit",
              },
              {
                type: "reset",
                label: "reset",
              },
              {
                type: "button",
                label: "button",
                href: "http://www.baidu.com",
                level: "success",
              },
            ],
          },
        ],
        actions: [
          {
            type: "submit",
            label: "submit",
          },
          {
            type: "reset",
            label: "reset",
          },
          {
            type: "button",
            label: "button",
            href: "http://www.baidu.com",
            level: "success",
          },
        ],
      },
    ],
  },
  "7": {
    title: "Forms and form items switch to input state and display state",
    data: {
      id: 1,
    },
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    definitions: {},
    body: [
      {
        type: "form",
        title: "整个表单状态切换",
        mode: "horizontal",
        labelWidth: 150,
        id: "allFormSwitch",
        data: {
          isStatic: false,
        },
        body: [
          {
            type: "input-text",
            name: "var1",
            label: "输入框",
            value: "text",
          },
          {
            type: "input-color",
            name: "var2",
            label: "颜色选择",
            value: "#F0F",
          },
          {
            type: "switch",
            name: "switch",
            label: "开关",
            option: "开关说明",
            value: true,
          },
          {
            type: "checkboxes",
            name: "checkboxes",
            label: "多选框",
            value: "0,1,2,3,4,5,6,7,8,9,10,11",
            multiple: true,
            options: [
              {
                label: "选项0",
                value: 0,
              },
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
              {
                label: "选项3",
                value: 3,
              },
              {
                label: "选项4",
                value: 4,
              },
              {
                label: "选项5",
                value: 5,
              },
              {
                label: "选项6",
                value: 6,
              },
              {
                label: "选项7",
                value: 7,
              },
              {
                label: "选项8",
                value: 8,
              },
              {
                label: "选项9",
                value: 9,
              },
              {
                label: "选项10",
                value: 10,
              },
              {
                label: "选项11",
                value: 11,
              },
            ],
          },
          {
            type: "input-tag",
            name: "select11",
            label: "标签选择",
            inline: true,
            value: "0,1,2,3,4,5,6,7,8,9,10,11",
            options: [
              {
                label: "选项0",
                value: 0,
              },
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
              {
                label: "选项3",
                value: 3,
              },
              {
                label: "选项4",
                value: 4,
              },
              {
                label: "选项5",
                value: 5,
              },
              {
                label: "选项6",
                value: 6,
              },
              {
                label: "选项7",
                value: 7,
              },
              {
                label: "选项8",
                value: 8,
              },
              {
                label: "选项9",
                value: 9,
              },
              {
                label: "选项10",
                value: 10,
              },
              {
                label: "选项11",
                value: 11,
              },
            ],
          },
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "提交",
                level: "primary",
                visibleOn: "${!isStatic}",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "setValue",
                        componentId: "allFormSwitch",
                        args: {
                          value: {
                            isStatic: true,
                          },
                        },
                      },
                      {
                        actionType: "static",
                        componentId: "allFormSwitch",
                      },
                    ],
                  },
                },
              },
              {
                type: "button",
                label: "编辑",
                level: "primary",
                visibleOn: "${isStatic}",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "setValue",
                        componentId: "allFormSwitch",
                        args: {
                          value: {
                            isStatic: false,
                          },
                        },
                      },
                      {
                        actionType: "nonstatic",
                        componentId: "allFormSwitch",
                      },
                    ],
                  },
                },
              },
            ],
            className: "show",
          },
        ],
        actions: [],
      },
      {
        type: "form",
        title: "单个表单项状态切换",
        mode: "horizontal",
        labelWidth: 150,
        body: [
          {
            type: "input-text",
            id: "formItemSwitch",
            name: "var1",
            label: "使用事件动作状态切换",
            value: "text",
          },
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "输入态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "nonstatic",
                        componentId: "formItemSwitch",
                      },
                    ],
                  },
                },
              },
              {
                type: "button",
                label: "展示态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "static",
                        componentId: "formItemSwitch",
                      },
                    ],
                  },
                },
              },
            ],
            className: "show",
          },
        ],
        actions: [],
      },
      {
        type: "form",
        title: "表单项展示态属性",
        mode: "horizontal",
        labelWidth: 150,
        body: [
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var1",
            label: "输入态<br />不设置<br />或static: false",
            value: "text",
            static: false,
            desc: "使用staticOn 支持表达式控制，用法类似",
          },
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var1",
            label: "展示态<br />static: true",
            value: "text",
            static: true,
          },
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var2",
            label: "空值时的占位 staticPlaceholder",
            staticPlaceholder: "空值占位符，默认为 -",
            static: true,
          },
          {
            type: "input-text",
            name: "var3",
            label: "自定义展示态schema",
            value: "表单项value",
            static: true,
            staticSchema: [
              "自定义前缀 | ",
              {
                type: "tpl",
                tpl: "${var3}",
              },
              " | 自定义后缀",
            ],
          },
        ],
        actions: [],
      },
      {
        type: "form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/saveForm?waitSeconds=2",
        id: "myform",
        mode: "horizontal",
        autoFocus: true,
        panel: false,
        debug: false,
        title: "目前支持输入态展示态切换的表单项",
        labelWidth: 150,
        staticClassName: "now-is-static",
        body: [
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "切换为输入态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "nonstatic",
                        componentId: "myform",
                      },
                    ],
                  },
                },
              },
              {
                type: "button",
                label: "切换为展示态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "static",
                        componentId: "myform",
                      },
                    ],
                  },
                },
              },
            ],
            className: "show",
          },
          {
            type: "input-text",
            name: "var1",
            label: "文本",
            value: "text",
            desc: "这是一段描述文字",
            id: "my-input-text",
          },
          {
            type: "input-password",
            name: "password",
            label: "密码",
            inline: true,
            value: "123456",
          },
          {
            type: "input-email",
            validations: "isEmail",
            label: "邮箱",
            name: "email",
            value: "hello@baidu.com",
          },
          {
            type: "input-url",
            validations: "isUrl",
            label: "url",
            name: "url",
            value: "https://www.baidu.com",
          },
          {
            type: "input-number",
            name: "number",
            label: "数字",
            placeholder: "",
            inline: true,
            value: 99999,
            min: 1,
            max: 1000000,
            kilobitSeparator: true,
            prefix: "前缀",
            suffix: "后缀",
          },
          {
            type: "divider",
          },
          {
            type: "native-date",
            name: "native-date",
            label: "native日期选择",
            value: "2022-08-18",
          },
          {
            type: "native-time",
            name: "native-time",
            label: "native时间选择",
            value: "16:10",
          },
          {
            type: "native-number",
            name: "native-number",
            label: "native数字输入",
            value: "6",
          },
          {
            type: "divider",
          },
          {
            type: "input-tag",
            name: "tag",
            label: "标签",
            placeholder: "",
            clearable: true,
            value: "zhugeliang,caocao",
            options: [
              {
                label: "诸葛亮",
                value: "zhugeliang",
              },
              {
                label: "曹操",
                value: "caocao",
              },
              {
                label: "钟无艳",
                value: "zhongwuyan",
              },
              {
                label: "野核",
                children: [
                  {
                    label: "李白",
                    value: "libai",
                  },
                  {
                    label: "韩信",
                    value: "hanxin",
                  },
                  {
                    label: "云中君",
                    value: "yunzhongjun",
                  },
                ],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "checkboxes",
            name: "checkboxes",
            label: "多选框",
            value: "1,2",
            options: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
              {
                label: "选项3",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "radios",
            name: "radios",
            label: "单选",
            value: 3,
            options: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
              {
                label: "选项3",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-group-select",
            name: "btn-group",
            label: "按钮组",
            description: "类似于单选效果",
            value: 1,
            options: [
              {
                label: "选项 A",
                value: 1,
              },
              {
                label: "选项 B",
                value: 2,
              },
              {
                label: "选项 C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "List",
            label: "List",
            desc: "也差不多，只是展示方式不一样",
            value: 3,
            options: [
              {
                label: "选项 A",
                value: 1,
              },
              {
                label: "选项 B",
                value: 2,
              },
              {
                label: "选项 C",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list2",
            label: "List",
            desc: "可多选",
            multiple: true,
            value: "0,1",
            options: [
              {
                label: "选项0",
                value: 0,
              },
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list4",
            label: "List",
            imageClassName: "thumb-lg",
            desc: "支持放张图片",
            value: "0,1",
            options: [
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 0,
                label: "图片0",
              },
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 1,
                label: "图片1",
              },
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 2,
                label: "图片2",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "list-select",
            name: "list5",
            label: "List",
            desc: "支持文字排版",
            multiple: true,
            value: 1,
            options: [
              {
                value: 0,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n                                  <div class="text-md p-b-xs b-inherit b-b m-b-xs">套餐：C01</div>\n                                  <div class="text-sm">CPU：22核</div>\n                                  <div class="text-sm">内存：10GB</div>\n                                  <div class="text-sm">SSD盘：1024GB</div>\n                              </div>',
              },
              {
                value: 1,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n                                  <div class="text-md p-b-xs b-inherit b-b m-b-xs">套餐：C01</div>\n                                  <div class="text-sm">CPU：22核</div>\n                                  <div class="text-sm">内存：10GB</div>\n                                  <div class="text-sm">SSD盘：1024GB</div>\n                              </div>',
              },
              {
                value: 2,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n                                  <div class="text-md p-b-xs b-inherit b-b m-b-xs">套餐：C01</div>\n                                  <div class="text-sm">CPU：22核</div>\n                                  <div class="text-sm">内存：10GB</div>\n                                  <div class="text-sm">SSD盘：1024GB</div>\n                              </div>',
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-rating",
            count: 5,
            value: 4,
            label: "评分",
            name: "rating",
            half: false,
          },
          {
            type: "divider",
          },
          {
            type: "switch",
            name: "switch",
            label: "开关",
            value: true,
          },
          {
            type: "switch",
            name: "switch4",
            value: true,
            onText: "开启",
            offText: "关闭",
            label: "开关文字",
          },
          {
            type: "switch",
            name: "switch5",
            value: true,
            onText: {
              type: "icon",
              icon: "fa fa-check-circle",
            },
            offText: {
              type: "icon",
              icon: "fa fa-times-circle",
            },
            label: "开关icon",
          },
          {
            type: "divider",
          },
          {
            type: "checkbox",
            name: "checkbox",
            label: "勾选框",
            option: "同意协议",
            value: true,
          },
          {
            type: "divider",
          },
          {
            type: "select",
            name: "type",
            label: "下拉单选",
            inline: true,
            value: 1,
            options: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
              {
                label: "内容很长很长的选项，内容很长很长的选项",
                value: 3,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "select",
            name: "type2",
            label: "多选",
            multiple: true,
            inline: true,
            value: "1,2",
            options: [
              {
                label: "选项1",
                value: 1,
              },
              {
                label: "选项2",
                value: 2,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "input-color",
            name: "color",
            label: "Color",
            value: "#dc1717",
          },
          {
            type: "divider",
          },
          {
            type: "input-date",
            name: "date",
            label: "日期",
            value: "1591326307",
          },
          {
            type: "input-datetime",
            name: "datetime",
            label: "日期+时间",
            value: "1591326307",
          },
          {
            type: "input-time",
            name: "time",
            label: "时间",
            value: "1591326307",
          },
          {
            type: "input-month",
            name: "year-month",
            label: "年月",
            value: "1591326307",
          },
          {
            type: "input-month",
            name: "month",
            label: "月份",
            value: "1591326307",
          },
          {
            type: "input-year",
            name: "year",
            label: "年份",
            value: "1591326307",
          },
          {
            type: "input-quarter",
            name: "quarter",
            label: "季度",
            value: "1591326307",
          },
          {
            type: "divider",
          },
          {
            type: "input-date-range",
            name: "input-date-range",
            label: "日期范围",
            value: "1661961600,1664553599",
          },
          {
            type: "input-datetime-range",
            name: "input-datetime-range",
            label: "日期时间范围",
            value: "1659283200,1661961599",
          },
          {
            type: "input-time-range",
            name: "input-time-range",
            label: "时间范围",
            value: "15:00,23:27",
          },
          {
            type: "input-month-range",
            name: "input-month-range",
            label: "月份范围",
            value: "1643644800,1651420799",
          },
          {
            type: "input-year-range",
            name: "input-year-range",
            label: "年份范围",
            value: "1693497600,1790870399",
          },
          {
            type: "input-quarter-range",
            name: "input-quarter-range",
            label: "季度范围",
            value: "1640966400,1664639999",
          },
          {
            type: "divider",
          },
          {
            type: "input-group",
            size: "sm",
            inline: true,
            label: "组合",
            body: [
              {
                type: "input-text",
                placeholder: "搜索作业ID/名称",
                inputClassName: "b-l-none p-l-none",
                name: "jobName",
                value: "作业",
              },
              {
                type: "input-text",
                placeholder: "搜索作业ID/名称",
                inputClassName: "b-l-none p-l-none",
                name: "jobName",
                value: "家庭作业",
              },
            ],
          },
          {
            type: "input-group",
            label: "各种组合",
            inline: true,
            body: [
              {
                type: "select",
                name: "memoryUnits",
                options: [
                  {
                    label: "Gi",
                    value: "Gi",
                  },
                  {
                    label: "Mi",
                    value: "Mi",
                  },
                  {
                    label: "Ki",
                    value: "Ki",
                  },
                ],
                value: "Gi",
              },
              {
                type: "input-text",
                name: "memory",
                value: "memory",
              },
              {
                type: "select",
                name: "memoryUnits2",
                options: [
                  {
                    label: "Gi",
                    value: "Gi",
                  },
                  {
                    label: "Mi",
                    value: "Mi",
                  },
                  {
                    label: "Ki",
                    value: "Ki",
                  },
                ],
                value: "Gi",
              },
              {
                type: "button",
                label: "Go",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "textarea",
            name: "textarea",
            label: "多行文本",
            value: "这是一段多行文本文字\n第二行内容\n2222\n333",
            staticSchema: {
              limit: 3,
            },
          },
          {
            type: "divider",
          },
          {
            label: "穿梭器",
            name: "a",
            type: "transfer",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            searchable: true,
            searchApi:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/autoComplete2?term=$term",
            selectMode: "list",
            sortable: true,
            inline: true,
            value: "A,B,C",
          },
          {
            label: "组合穿梭器",
            type: "tabs-transfer",
            name: "tabs-transfer",
            sortable: true,
            selectMode: "tree",
            id: "tab-transfer-receiver",
            resetValue: "zhugeliang",
            value: "zhugeliang,caocao",
            enableNodePath: true,
            options: [
              {
                label: "成员",
                selectMode: "tree",
                searchable: true,
                children: [
                  {
                    label: "法师",
                    children: [
                      {
                        label: "诸葛亮",
                        value: "zhugeliang",
                      },
                    ],
                  },
                  {
                    label: "战士",
                    children: [
                      {
                        label: "曹操",
                        value: "caocao",
                      },
                      {
                        label: "钟无艳",
                        value: "zhongwuyan",
                      },
                    ],
                  },
                  {
                    label: "打野",
                    children: [
                      {
                        label: "李白",
                        value: "libai",
                      },
                      {
                        label: "韩信",
                        value: "hanxin",
                      },
                      {
                        label: "云中君",
                        value: "yunzhongjun",
                      },
                    ],
                  },
                ],
              },
              {
                label: "用户",
                selectMode: "chained",
                children: [
                  {
                    label: "法师",
                    children: [
                      {
                        label: "诸葛亮",
                        value: "zhugeliang2",
                      },
                    ],
                  },
                  {
                    label: "战士",
                    children: [
                      {
                        label: "曹操",
                        value: "caocao2",
                      },
                      {
                        label: "钟无艳",
                        value: "zhongwuyan2",
                      },
                    ],
                  },
                  {
                    label: "打野",
                    children: [
                      {
                        label: "李白",
                        value: "libai2",
                      },
                      {
                        label: "韩信",
                        value: "hanxin2",
                      },
                      {
                        label: "云中君",
                        value: "yunzhongjun2",
                      },
                    ],
                  },
                ],
              },
            ],
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: "info",
                      msg: "${event.data.value|json}",
                    },
                  },
                ],
              },
            },
          },
          {
            label: "穿梭器picker",
            type: "transfer-picker",
            name: "transfer-picker",
            id: "transfer-picker-receiver",
            resetValue: "zhugeliang",
            sortable: true,
            selectMode: "tree",
            searchable: true,
            value: "zhugeliang,zhongwuyan",
            enableNodePath: true,
            options: [
              {
                label: "法师",
                children: [
                  {
                    label: "诸葛亮",
                    value: "zhugeliang",
                  },
                ],
              },
              {
                label: "战士",
                children: [
                  {
                    label: "曹操",
                    value: "caocao",
                  },
                  {
                    label: "钟无艳",
                    value: "zhongwuyan",
                  },
                ],
              },
              {
                label: "打野",
                children: [
                  {
                    label: "李白",
                    value: "libai",
                  },
                  {
                    label: "韩信",
                    value: "hanxin",
                  },
                  {
                    label: "云中君",
                    value: "yunzhongjun",
                  },
                ],
              },
            ],
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: "info",
                      msg: "${event.data.value|json}",
                    },
                  },
                ],
              },
            },
          },
          {
            label: "组合穿梭器picker",
            type: "tabs-transfer-picker",
            name: "tabs-transfer-picker",
            id: "tabs-transfer-picker-receiver",
            resetValue: "zhugeliang",
            value: "caocao,zhongwuyan",
            sortable: true,
            selectMode: "tree",
            pickerSize: "md",
            menuTpl:
              "<div class='flex justify-between'><span>${label}</span>${email ? `<div class='text-muted m-r-xs text-sm text-right'>${email}<br />${phone}</div>`: ''}</div>",
            valueTpl: "${label}(${value})",
            options: [
              {
                label: "成员",
                selectMode: "tree",
                searchable: true,
                children: [
                  {
                    label: "法师",
                    children: [
                      {
                        label: "诸葛亮",
                        value: "zhugeliang",
                        email: "zhugeliang@timi.com",
                        phone: 13111111111,
                      },
                    ],
                  },
                  {
                    label: "战士",
                    children: [
                      {
                        label: "曹操",
                        value: "caocao",
                        email: "caocao@timi.com",
                        phone: 13111111111,
                      },
                      {
                        label: "钟无艳",
                        value: "zhongwuyan",
                        email: "zhongwuyan@timi.com",
                        phone: 13111111111,
                      },
                    ],
                  },
                  {
                    label: "打野",
                    children: [
                      {
                        label: "李白",
                        value: "libai",
                        email: "libai@timi.com",
                        phone: 13111111111,
                      },
                      {
                        label: "韩信",
                        value: "hanxin",
                        email: "hanxin@timi.com",
                        phone: 13111111111,
                      },
                      {
                        label: "云中君",
                        value: "yunzhongjun",
                        email: "yunzhongjun@timi.com",
                        phone: 13111111111,
                      },
                    ],
                  },
                ],
              },
              {
                label: "角色",
                selectMode: "list",
                children: [
                  {
                    label: "角色 1",
                    value: "role1",
                  },
                  {
                    label: "角色 2",
                    value: "role2",
                  },
                  {
                    label: "角色 3",
                    value: "role3",
                  },
                  {
                    label: "角色 4",
                    value: "role4",
                  },
                ],
              },
              {
                label: "部门",
                selectMode: "tree",
                children: [
                  {
                    label: "总部",
                    value: "dep0",
                    children: [
                      {
                        label: "部门 1",
                        value: "dep1",
                        children: [
                          {
                            label: "部门 4",
                            value: "dep4",
                          },
                          {
                            label: "部门 5",
                            value: "dep5",
                          },
                        ],
                      },
                      {
                        label: "部门 2",
                        value: "dep2",
                      },
                      {
                        label: "部门 3",
                        value: "dep3",
                      },
                    ],
                  },
                ],
              },
            ],
            onEvent: {
              change: {
                actions: [
                  {
                    actionType: "toast",
                    args: {
                      msgType: "info",
                      msg: "${event.data.value|json}",
                    },
                  },
                ],
              },
            },
          },
          {
            type: "divider",
          },
          {
            type: "input-tree",
            name: "tree",
            label: "树",
            iconField: "icon",
            value: "2",
            options: [
              {
                label: "Folder A",
                value: 1,
                icon: "fa fa-bookmark",
                children: [
                  {
                    label: "file A",
                    value: 2,
                    icon: "fa fa-star",
                  },
                  {
                    label: "file B",
                    value: 3,
                  },
                ],
              },
              {
                label: "file C",
                value: 4,
              },
              {
                label: "file D",
                value: 5,
              },
            ],
          },
          {
            type: "input-tree",
            name: "trees",
            label: "树多选",
            multiple: true,
            value: "1-2,5",
            options: [
              {
                label: "Folder A",
                value: 1,
                children: [
                  {
                    label: "file A",
                    value: 2,
                  },
                  {
                    label: "file B",
                    value: 3,
                  },
                ],
              },
              {
                label: "file C",
                value: 4,
              },
              {
                label: "file D",
                value: 5,
              },
            ],
          },
          {
            type: "tree-select",
            name: "selecttree",
            label: "树选择器",
            value: "5",
            options: [
              {
                label: "Folder A",
                value: 1,
                children: [
                  {
                    label: "file A",
                    value: 2,
                  },
                  {
                    label: "file B",
                    value: 3,
                  },
                ],
              },
              {
                label: "file C",
                value: 4,
              },
              {
                label: "file D",
                value: 5,
              },
            ],
          },
          {
            type: "tree-select",
            name: "selecttrees",
            label: "树多选选择器",
            enableNodePath: true,
            multiple: true,
            value: "1-2,5",
            options: [
              {
                label: "Folder A",
                value: 1,
                children: [
                  {
                    label: "file A",
                    value: 2,
                  },
                  {
                    label: "file B",
                    value: 3,
                  },
                ],
              },
              {
                label: "file C",
                value: 4,
              },
              {
                label: "file D",
                value: 5,
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "nested-select",
            name: "nestedSelect",
            label: "级联选择器",
            value: "definitions",
            options: [
              {
                label: "概念",
                value: "concepts",
                children: [
                  {
                    label: "配置与组件",
                    value: "schema",
                  },
                  {
                    label: "数据域与数据链",
                    value: "scope",
                  },
                  {
                    label: "模板",
                    value: "template",
                  },
                  {
                    label: "数据映射",
                    value: "data-mapping",
                  },
                  {
                    label: "表达式",
                    value: "expression",
                  },
                  {
                    label: "联动",
                    value: "linkage",
                  },
                  {
                    label: "行为",
                    value: "action",
                  },
                  {
                    label: "样式",
                    value: "style",
                  },
                ],
              },
              {
                label: "类型",
                value: "types",
                children: [
                  {
                    label: "SchemaNode",
                    value: "schemanode",
                  },
                  {
                    label: "API",
                    value: "api",
                  },
                  {
                    label: "Definitions",
                    value: "definitions",
                  },
                ],
              },
              {
                label: "组件",
                value: "zujian",
                children: [
                  {
                    label: "布局",
                    value: "buju",
                    children: [
                      {
                        label: "Page 页面",
                        value: "page",
                      },
                      {
                        label: "Container 容器",
                        value: "container",
                      },
                      {
                        label: "Collapse 折叠器",
                        value: "Collapse",
                      },
                    ],
                  },
                  {
                    label: "功能",
                    value: "gongneng",
                    children: [
                      {
                        label: "Action 行为按钮",
                        value: "action-type",
                      },
                      {
                        label: "App 多页应用",
                        value: "app",
                      },
                      {
                        label: "Button 按钮",
                        value: "button",
                      },
                    ],
                  },
                  {
                    label: "数据输入",
                    value: "shujushuru",
                    children: [
                      {
                        label: "Form 表单",
                        value: "form",
                      },
                      {
                        label: "FormItem 表单项",
                        value: "formitem",
                      },
                      {
                        label: "Options 选择器表单项",
                        value: "options",
                      },
                    ],
                  },
                  {
                    label: "数据展示",
                    value: "shujuzhanshi",
                    children: [
                      {
                        label: "CRUD 增删改查",
                        value: "crud",
                      },
                      {
                        label: "Table 表格",
                        value: "table",
                      },
                      {
                        label: "Card 卡片",
                        value: "card",
                      },
                    ],
                  },
                  {
                    label: "反馈",
                    value: "fankui",
                  },
                ],
              },
            ],
          },
          {
            type: "nested-select",
            name: "nestedSelectMul",
            label: "级联选择器多选",
            multiple: true,
            checkAll: false,
            value: "definitions",
            options: [
              {
                label: "概念",
                value: "concepts",
                children: [
                  {
                    label: "配置与组件",
                    value: "schema",
                  },
                  {
                    label: "数据域与数据链",
                    value: "scope",
                  },
                  {
                    label: "模板",
                    value: "template",
                  },
                  {
                    label: "数据映射",
                    value: "data-mapping",
                  },
                  {
                    label: "表达式",
                    value: "expression",
                  },
                  {
                    label: "联动",
                    value: "linkage",
                  },
                  {
                    label: "行为",
                    value: "action",
                  },
                  {
                    label: "样式",
                    value: "style",
                  },
                ],
              },
              {
                label: "类型",
                value: "types",
                children: [
                  {
                    label: "SchemaNode",
                    value: "schemanode",
                  },
                  {
                    label: "API",
                    value: "api",
                  },
                  {
                    label: "Definitions",
                    value: "definitions",
                  },
                ],
              },
              {
                label: "组件",
                value: "zujian",
                children: [
                  {
                    label: "布局",
                    value: "buju",
                    children: [
                      {
                        label: "Page 页面",
                        value: "page",
                      },
                      {
                        label: "Container 容器",
                        value: "container",
                      },
                      {
                        label: "Collapse 折叠器",
                        value: "Collapse",
                      },
                    ],
                  },
                  {
                    label: "功能",
                    value: "gongneng",
                    children: [
                      {
                        label: "Action 行为按钮",
                        value: "action-type",
                      },
                      {
                        label: "App 多页应用",
                        value: "app",
                      },
                      {
                        label: "Button 按钮",
                        value: "button",
                      },
                    ],
                  },
                  {
                    label: "数据输入",
                    value: "shujushuru",
                    children: [
                      {
                        label: "Form 表单",
                        value: "form",
                      },
                      {
                        label: "FormItem 表单项",
                        value: "formitem",
                      },
                      {
                        label: "Options 选择器表单项",
                        value: "options",
                      },
                    ],
                  },
                  {
                    label: "数据展示",
                    value: "shujuzhanshi",
                    children: [
                      {
                        label: "CRUD 增删改查",
                        value: "crud",
                      },
                      {
                        label: "Table 表格",
                        value: "table",
                      },
                      {
                        label: "Card 卡片",
                        value: "card",
                      },
                    ],
                  },
                  {
                    label: "反馈",
                    value: "fankui",
                  },
                ],
              },
            ],
          },
          {
            name: "select3",
            type: "chained-select",
            label: "链式下拉选择器",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4",
            value: "a,b",
          },
          {
            type: "divider",
          },
          {
            type: "matrix-checkboxes",
            name: "matrix",
            label: "矩阵开关",
            rowLabel: "行标题说明",
            value: [
              [
                {
                  label: "列1",
                  checked: true,
                },
                {
                  label: "列1",
                  checked: false,
                },
              ],
              [
                {
                  label: "列2",
                  checked: false,
                },
                {
                  label: "列2",
                  checked: true,
                },
              ],
            ],
            columns: [
              {
                label: "列1",
              },
              {
                label: "列2",
              },
            ],
            rows: [
              {
                label: "行1",
              },
              {
                label: "行2",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "combo",
            name: "combo",
            label: "组合单条",
            value: {
              "c-1": 1,
              "c-2": "a",
            },
            items: [
              {
                name: "c-1",
                label: "名称",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "c-2",
                label: "信息",
                type: "select",
                options: ["a", "b", "c"],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "combo",
            name: "combo2",
            label: "组合多条",
            multiple: true,
            value: [
              {
                a: 1,
                b: "a",
              },
              {
                a: 2,
                b: "b",
              },
            ],
            items: [
              {
                name: "a",
                label: "名称：",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "b",
                label: "信息：",
                type: "select",
                options: ["a", "b", "c"],
              },
            ],
          },
          {
            name: "array",
            label: "颜色集合",
            type: "input-array",
            value: ["red", "blue", "green"],
            inline: true,
            items: {
              type: "input-color",
              clearable: false,
            },
          },
          {
            type: "input-kv",
            name: "kv",
            label: "键值对",
            valueType: "input-number",
            value: {
              count1: 2,
              count2: 4,
            },
          },
          {
            type: "input-kvs",
            name: "dataModel",
            label: "可嵌套键值对象",
            addButtonText: "新增表",
            keyItem: {
              label: "表名",
              mode: "horizontal",
              type: "select",
              options: ["table1", "table2", "table3"],
            },
            valueItems: [
              {
                type: "input-kvs",
                addButtonText: "新增字段",
                name: "column",
                keyItem: {
                  label: "字段名",
                  mode: "horizontal",
                  type: "select",
                  options: ["id", "title", "content"],
                },
                valueItems: [
                  {
                    type: "switch",
                    name: "primary",
                    mode: "horizontal",
                    label: "是否是主键",
                  },
                  {
                    type: "select",
                    name: "type",
                    label: "字段类型",
                    mode: "horizontal",
                    options: ["text", "int", "float"],
                  },
                ],
              },
            ],
            value: {
              table1: {
                column: {
                  id: {
                    primary: false,
                    type: "text",
                  },
                  title: {
                    type: "text",
                  },
                },
              },
              table2: {
                column: {
                  title: {
                    type: "int",
                  },
                },
              },
            },
          },
          {
            type: "divider",
          },
          {
            type: "input-range",
            name: "range",
            label: "范围",
            value: 50,
          },
          {
            name: "city",
            type: "input-city",
            label: "城市",
            searchable: true,
            value: 210727,
          },
          {
            type: "location-picker",
            label: "地理位置",
            name: "location",
            ak: "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
          },
          {
            type: "divider",
          },
          {
            type: "chart-radios",
            label: "图表单选框",
            name: "main",
            chartValueField: "num",
            value: "a",
            options: [
              {
                label: "A",
                num: 100,
                value: "a",
              },
              {
                label: "B",
                num: 120,
                value: "b",
              },
              {
                label: "C",
                num: 30,
                value: "c",
              },
              {
                label: "D",
                num: 40,
                value: "d",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "切换为输入态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "nonstatic",
                        componentId: "myform",
                      },
                    ],
                  },
                },
              },
              {
                type: "button",
                label: "切换为展示态",
                level: "primary",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "static",
                        componentId: "myform",
                      },
                    ],
                  },
                },
              },
              {
                type: "button",
                label: "清空",
                onEvent: {
                  click: {
                    actions: [
                      {
                        actionType: "clear",
                        componentId: "myform",
                      },
                    ],
                  },
                },
              },
            ],
          },
        ],
        actions: [],
      },
    ],
  },
  "8": {
    title: "动态拉取选项",
    name: "page-form-remote",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "form",
        title: "动态表单元素示例",
        name: "demo-form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        mode: "horizontal",
        actions: [
          {
            type: "submit",
            label: "提交",
          },
        ],
        body: [
          {
            name: "select",
            type: "select",
            label: "动态选项",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            description: "通过接口一口气拉取选项",
            clearable: true,
            searchable: true,
          },
          {
            type: "divider",
          },
          {
            name: "select2",
            type: "select",
            label: "选项自动补全",
            autoComplete:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/autoComplete?term=$term",
            placeholder: "请输入",
            description: "通过接口自动补全",
          },
          {
            type: "divider",
          },
          {
            type: "input-text",
            name: "text",
            label: "文本提示",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            placeholder: "请选择",
            creatable: true,
          },
          {
            type: "divider",
          },
          {
            name: "text2",
            type: "input-text",
            label: "文本自动补全",
            clearable: true,
            autoComplete:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/autoComplete2?term=$term",
            description: "通过接口自动补全",
          },
          {
            name: "chained",
            type: "chained-select",
            label: "级联选项",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1",
            desc: "无限级别, 只要 api 返回数据就能继续往下选择. 当没有下级时请返回 null.",
            value: "a,b",
          },
          {
            type: "divider",
          },
          {
            name: "tree",
            showOutline: true,
            type: "input-tree",
            label: "动态树",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/tree?waitSeconds=1",
          },
          {
            type: "divider",
          },
          {
            name: "tree",
            type: "input-tree",
            label: "树懒加载",
            multiple: true,
            deferApi:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/deferOptions?label=${label}&waitSeconds=2",
            options: [
              {
                label: "法师",
                children: [
                  {
                    label: "诸葛亮",
                    value: "zhugeliang",
                  },
                ],
              },
              {
                label: "战士",
                defer: true,
              },
              {
                label: "打野",
                children: [
                  {
                    label: "李白",
                    value: "libai",
                  },
                  {
                    label: "韩信",
                    value: "hanxin",
                  },
                  {
                    label: "云中君",
                    value: "yunzhongjun",
                  },
                ],
              },
            ],
          },
          {
            type: "divider",
          },
          {
            name: "matrix",
            type: "matrix-checkboxes",
            label: "动态矩阵开关",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/matrix?waitSeconds=1",
          },
        ],
      },
    ],
  },
  "9": {
    type: "page",
    title: "选项卡示例",
    subTitle: "所有选项卡都在当前页面中，包括默认、line、card以及radio模式",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "tabs",
        tabs: [
          {
            title: "选项卡1",
            hash: "tab1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            hash: "tab2",
            body: {
              type: "form",
              panelClassName: "panel-primary",
              body: [
                {
                  type: "input-text",
                  name: "a",
                  label: "文本",
                },
              ],
            },
          },
          {
            title: "选项卡3",
            body: {
              type: "crud",
              api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
              filter: {
                title: "条件搜索",
                submitText: "",
                body: [
                  {
                    type: "input-text",
                    name: "keywords",
                    placeholder: "通过关键字搜索",
                    clearable: true,
                    addOn: {
                      label: "搜索",
                      type: "submit",
                    },
                  },
                  {
                    type: "plain",
                    text: "这里的表单项可以配置多个",
                  },
                ],
              },
              columns: [
                {
                  name: "id",
                  label: "ID",
                  width: 20,
                },
                {
                  name: "engine",
                  label: "Rendering engine",
                },
                {
                  name: "browser",
                  label: "Browser",
                },
                {
                  name: "platform",
                  label: "Platform(s)",
                },
                {
                  name: "version",
                  label: "Engine version",
                },
                {
                  name: "grade",
                  label: "CSS grade",
                },
                {
                  type: "operation",
                  label: "操作",
                  width: 100,
                  buttons: [],
                },
              ],
            },
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "line",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: "选项卡内容2",
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "card",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: "选项卡内容2",
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "chrome",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: "选项卡内容2",
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "radio",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: "选项卡内容2",
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "tiled",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: "选项卡内容2",
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
          {
            title: "选项卡4",
            body: "选项卡内容4",
            icon: "fa fa-flag",
            iconPosition: "right",
          },
        ],
      },
      {
        type: "divider",
      },
      {
        type: "tabs",
        mode: "vertical",
        tabs: [
          {
            title: "选项卡1",
            body: "选项卡内容1",
          },
          {
            title: "选项卡2",
            body: [
              {
                type: "service",
                api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/crud/table?perPage=5",
                body: [
                  {
                    type: "table",
                    title: "表格1",
                    source: "$rows",
                    columns: [
                      {
                        name: "id",
                        label: "ID",
                      },
                      {
                        name: "engine",
                        label: "Rendering engine",
                        width: 300,
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "browser",
                        label: "Browser",
                      },
                      {
                        name: "platform",
                        label: "Platform(s)",
                      },
                      {
                        name: "version",
                        label: "Engine version",
                      },
                      {
                        name: "grade",
                        label: "CSS grade",
                      },
                      {
                        type: "operation",
                        label: "操作",
                        buttons: [
                          {
                            label: "详情",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            dialog: {
                              title: "查看详情",
                              body: {
                                type: "form",
                                body: [
                                  {
                                    type: "input-text",
                                    name: "engine",
                                    label: "Engine",
                                  },
                                  {
                                    type: "input-text",
                                    name: "browser",
                                    label: "Browser",
                                  },
                                  {
                                    type: "input-text",
                                    name: "platform",
                                    label: "platform",
                                  },
                                  {
                                    type: "input-text",
                                    name: "version",
                                    label: "version",
                                  },
                                  {
                                    type: "control",
                                    label: "grade",
                                    body: {
                                      type: "tag",
                                      label: "${grade}",
                                      displayMode: "normal",
                                      color: "active",
                                    },
                                  },
                                ],
                              },
                            },
                          },
                          {
                            label: "删除",
                            type: "button",
                            level: "link",
                            className: "text-danger",
                            disabledOn: "this.grade === 'A'",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "form",
                debug: true,
                body: [
                  {
                    type: "input-text",
                    name: "text",
                    label: "text",
                  },
                ],
              },
            ],
          },
          {
            title: "选项卡3",
            body: "选项卡内容3",
          },
          {
            title: "选项卡4",
            body: "选项卡内容4",
          },
          {
            title: "选项卡5",
            body: "选项卡内容5",
          },
        ],
      },
    ],
  },
  "10": {
    title: "图表示例",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [
      {
        type: "grid",
        columns: [
          {
            type: "panel",
            title: "本地配置示例 支持交互",
            name: "chart-local",
            body: [
              {
                type: "chart",
                config: {
                  title: {
                    text: "极坐标双数值轴",
                  },
                  legend: {
                    data: ["line"],
                  },
                  polar: {
                    center: ["50%", "54%"],
                  },
                  tooltip: {
                    trigger: "axis",
                    axisPointer: {
                      type: "cross",
                    },
                  },
                  angleAxis: {
                    type: "value",
                    startAngle: 0,
                  },
                  radiusAxis: {
                    min: 0,
                  },
                  series: [
                    {
                      coordinateSystem: "polar",
                      name: "line",
                      type: "line",
                      showSymbol: false,
                      data: [
                        [0, 0],
                        [0.03487823687206265, 1],
                        [0.06958655048003272, 2],
                        [0.10395584540887964, 3],
                        [0.13781867790849958, 4],
                        [0.17101007166283433, 5],
                        [0.2033683215379001, 6],
                        [0.2347357813929454, 7],
                        [0.26495963211660245, 8],
                        [0.2938926261462365, 9],
                        [0.3213938048432697, 10],
                      ],
                    },
                  ],
                  animationDuration: 2000,
                },
                clickAction: {
                  actionType: "dialog",
                  dialog: {
                    title: "详情",
                    body: [
                      {
                        type: "tpl",
                        tpl: "<span>当前选中值 ${value|json}<span>",
                      },
                      {
                        type: "chart",
                        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chart1",
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            type: "panel",
            title: "远程图表示例(返回值带function)",
            name: "chart-remote",
            body: [
              {
                type: "chart",
                api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chart1",
              },
            ],
          },
        ],
      },
      {
        type: "panel",
        title: "Form+chart组合",
        body: [
          {
            type: "form",
            title: "过滤条件",
            target: "chart1,chart2",
            submitOnInit: true,
            className: "m-b",
            wrapWithPanel: false,
            mode: "inline",
            body: [
              {
                type: "input-date",
                label: "开始日期",
                name: "starttime",
                value: "-8days",
                maxDate: "${endtime}",
              },
              {
                type: "input-date",
                label: "结束日期",
                name: "endtime",
                value: "-1days",
                minDate: "${starttime}",
              },
              {
                type: "input-text",
                label: "条件",
                name: "name",
                addOn: {
                  type: "submit",
                  label: "搜索",
                  level: "primary",
                },
              },
            ],
            actions: [],
          },
          {
            type: "divider",
          },
          {
            type: "grid",
            className: "m-t-lg",
            columns: [
              {
                type: "chart",
                name: "chart1",
                initFetch: false,
                api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chart?name=$name&starttime=${starttime}&endtime=${endtime}",
              },
              {
                type: "chart",
                name: "chart2",
                initFetch: false,
                api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/chart/chart2?name=$name",
              },
            ],
          },
        ],
      },
      {
        type: "chart",
        mapURL: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/map/HK",
        mapName: "HK",
        height: 600,
        config: {
          title: {
            text: "Population Density of Hong Kong （2011）",
            subtext: "Data from Wikipedia",
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>{c} (p / km2)",
          },
          toolbox: {
            show: true,
            orient: "vertical",
            left: "right",
            top: "center",
            feature: {
              dataView: {
                readOnly: false,
              },
              restore: {},
              saveAsImage: {},
            },
          },
          visualMap: {
            min: 800,
            max: 50000,
            text: ["High", "Low"],
            realtime: false,
            calculable: true,
            inRange: {
              color: ["lightskyblue", "yellow", "orangered"],
            },
          },
          series: [
            {
              name: "香港18区人口密度",
              type: "map",
              map: "HK",
              label: {
                show: true,
              },
              data: [
                {
                  name: "中西区",
                  value: 20057.34,
                },
                {
                  name: "湾仔",
                  value: 15477.48,
                },
                {
                  name: "东区",
                  value: 31686.1,
                },
                {
                  name: "南区",
                  value: 6992.6,
                },
                {
                  name: "油尖旺",
                  value: 44045.49,
                },
                {
                  name: "深水埗",
                  value: 40689.64,
                },
                {
                  name: "九龙城",
                  value: 37659.78,
                },
                {
                  name: "黄大仙",
                  value: 45180.97,
                },
                {
                  name: "观塘",
                  value: 55204.26,
                },
                {
                  name: "葵青",
                  value: 21900.9,
                },
                {
                  name: "荃湾",
                  value: 4918.26,
                },
                {
                  name: "屯门",
                  value: 5881.84,
                },
                {
                  name: "元朗",
                  value: 4178.01,
                },
                {
                  name: "北区",
                  value: 2227.92,
                },
                {
                  name: "大埔",
                  value: 2180.98,
                },
                {
                  name: "沙田",
                  value: 9172.94,
                },
                {
                  name: "西贡",
                  value: 3368,
                },
                {
                  name: "离岛",
                  value: 806.98,
                },
              ],
              nameMap: {
                "Central and Western": "中西区",
                Eastern: "东区",
                Islands: "离岛",
                "Kowloon City": "九龙城",
                "Kwai Tsing": "葵青",
                "Kwun Tong": "观塘",
                North: "北区",
                "Sai Kung": "西贡",
                "Sha Tin": "沙田",
                "Sham Shui Po": "深水埗",
                Southern: "南区",
                "Tai Po": "大埔",
                "Tsuen Wan": "荃湾",
                "Tuen Mun": "屯门",
                "Wan Chai": "湾仔",
                "Wong Tai Sin": "黄大仙",
                "Yau Tsim Mong": "油尖旺",
                "Yuen Long": "元朗",
              },
            },
          ],
        },
      },
      {
        type: "chart",
        loadBaiduMap: true,
        ak: "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
        config: {
          bmap: {
            center: [116.414, 39.915],
            zoom: 14,
            roam: true,
          },
        },
      },
    ],
  },
  "11": {
    type: "page",
    regions: ["body", "toolbar"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    definitions: {},
    cssVars: {
      "--Form-input-paddingY": "0.25rem",
    },
    title:
      "ECharts 图表可视化编辑，用于演示如何基于 amis 将任意 json 配置改造成可视化编辑，这个例子无法复制配置，实现方式请在源码中寻找",
    data: {
      config: {
        title: {
          text: "未来一周气温变化",
          subtext: "纯属虚构",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["最高气温", "最低气温"],
        },
        toolbox: {
          show: true,
          feature: {
            mark: {
              show: true,
            },
            dataView: {
              show: true,
              readOnly: true,
            },
            magicType: {
              show: false,
              type: ["line", "bar"],
            },
            restore: {
              show: true,
            },
            saveAsImage: {
              show: true,
            },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "°C",
          },
        ],
        series: [
          {
            name: "最高气温",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
          },
          {
            name: "最低气温",
            type: "line",
            data: [1, -2, 2, 5, 3, 2, 0],
          },
        ],
      },
    },
    body: [
      {
        type: "form",
        title: "",
        controls: [
          {
            type: "grid",
            columns: [
              {
                sm: 12,
                md: 5,
                columnClassName: "pl-1 pr-0.5",
                controls: [
                  {
                    type: "chart",
                    source: "${config}",
                    replaceChartOption: true,
                    unMountOnHidden: false,
                  },
                  {
                    type: "editor",
                    name: "config",
                    language: "json",
                    disabled: true,
                    options: {
                      lineNumbers: "off",
                    },
                    source: "${config}",
                  },
                ],
              },
              {
                sm: 12,
                md: 7,
                columnClassName: "pl-0.5 pr-1",
                controls: [{}],
              },
            ],
          },
        ],
      },
    ],
  },
  "0": {
    type: "page",
    title: "New",
    toolbar: [],
    regions: ["body"],
    asideResizor: false,
    aside: [],
    asideSticky: false,
    data: {},
    definitions: {},
    body: [],
  },
}

export const getPageById = (id: string) => {
  return data(id)
}

export const data = (id: string) => {
  return datasets[id as keyof typeof datasets] || null
}
