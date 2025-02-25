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
    title: "Dashboard",
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
      title: "Title",
      body: "This is a description problem. Have you noticed it? You can also set the title. And it will pop up only if you click.",
      icon: "question-mark",
      placement: "right",
      trigger: "click",
      rootClose: true,
    },
    body: "Content part. You can use \\${var} to get variables. For example: `\\$date`: ${date}",
    aside: "sidebar part",
    toolbar: "toolbar",
    initApi: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
  },
  "3": {
    type: "page",
    title: "Heading",
    remark: "提示 Tip",
   body: [
      "\n <p>`initApi` When the pull fails, the corresponding error message will be displayed in the content area of the page.</p>\n\n <p>Other prompt examples</p>\n ",
      {
        type: "alert",
        level: "success",
        body: "Warm reminder: a prompt description for page functions, green is a positive message prompt",
      },
      {
        type: "alert",
        level: "warning",
        body: "Your private network has reached the quota. If you need more private networks, you can apply through <a>work order</a>",
      },
    ],
    aside: "Sidebar",
    toolbar: "Toolbar",
    initApi: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initDataError",
  },
  "4": {
    type: "page",
    title: "Form",
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
            placeholder: "Please enter your email address",
            name: "email",
          },
        ],
      },
    ],
  },
  "5": {
    title: "Form display modes",
    subTitle: "Summary of various display modes of forms",
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
    title: "Forms Edit & Preview",
    subTitle: "Forms and form items switch to input state and display state",
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
        title: "The entire form state switch",
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
            label: "Input Box",
            value: "text",
          },
          {
            type: "input-color",
            name: "var2",
            label: "Color selection",
            value: "#F0F",
          },
          {
            type: "switch",
            name: "switch",
            label: "switch",
            option: "Switch description",
            value: true,
          },
          {
            type: "checkboxes",
            name: "checkboxes",
            label: "Multiple selection box",
            value: "0,1,2,3,4,5,6,7,8,9,10,11",
            multiple: true,
            options: [
              {
                label: "Option 0",
                value: 0,
              },
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
              {
                label: "Option 4",
                value: 4,
              },
              {
                label: "Option 5",
                value: 5,
              },
              {
                label: "Option 6",
                value: 6,
              },
             {
                label: "Option 7",
                value: 7,
              },
              {
                label: "Option 8",
                value: 8,
              },
              {
                label: "Option 9",
                value: 9,
              },
              {
                label: "Option 10",
                value: 10,
              },
              {
                label: "Option 11",
                value: 11,
              },
            ],
          },
          {
            type: "input-tag",
            name: "select11",
            label: "Tag selection",
            inline: true,
            value: "0,1,2,3,4,5,6,7,8,9,10,11",
         options: [
              {
                label: "Option 0",
                value: 0,
              },
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
              {
                label: "Option 4",
                value: 4,
              },
              {
                label: "Option 5",
                value: 5,
              },
              {
                label: "Option 6",
                value: 6,
              },
              {
                label: "Option 7",
                value: 7,
              },
              {
                label: "Option 8",
                value: 8,
              },
              {
                label: "Option 9",
                value: 9,
              },
              {
                label: "Option 10",
                value: 10,
              },
              {
                label: "Option 11",
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
                label: "Submit",
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
                label: "Edit",
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
       title: "Single form item status switching",
        mode: "horizontal",
        labelWidth: 150,
        body: [
          {
            type: "input-text",
            id: "formItemSwitch",
            name: "var1",
            label: "Use event action status switching",
            value: "text",
          },
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "Input state",
                level: "primary",
                onEvent: {
                  Click: {
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
                label: "display state",
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
      title: "Form item display status attribute",
        mode: "horizontal",
        labelWidth: 150,
        body: [
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var1",
            label: "Input state<br />not set<br /> or static: false",
            value: "text",
            static: false,
            desc: "Use staticOn to support expression control, and the usage is similar",
          },
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var1",
            label: "Display<br />static: true",
            value: "text",
            static: true,
          },
          {
            type: "input-text",
            id: "formItemInputText",
            name: "var2",
            label: "Stateholder for empty value",
            staticPlaceholder: "Null value placeholder, default is -",
            static: true,
          },
          {
            type: "input-text",
            name: "var3",
            label: "custom display schema",
            value: "form item value",
            static: true,
            staticSchema: [
              "Custom prefix |",
              {
                type: "tpl",
                tpl: "${var3}",
              },
              " | Custom suffix",
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
        title: "Currently, the form item that supports input state display state switching",
        labelWidth: 150,
        staticClassName: "now-is-static",
        body: [
          {
            type: "button-toolbar",
            name: "button-toolbar",
            buttons: [
              {
                type: "button",
                label: "Switch to input state",
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
                label: "Switch to display",
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
            label: "text",
            value: "text",
            desc: "This is a descriptive text",
            id: "my-input-text",
          },
          {
            type: "input-password",
            name: "password",
            label: "password",
            inline: true,
            value: "123456",
          },
          {
            type: "input-email",
            validations: "isEmail",
            label: "email",
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
            label: "number",
            placeholder: "",
            inline: true,
            value: 99999,
            min: 1,
            max: 1000000,
            kilobitSeparator: true,
            prefix: "prefix",
            suffix: "suffix",
          },
          {
            type: "divider",
          },
          {
            type: "native-date",
            name: "native-date",
            label: "native date selection",
            value: "2022-08-18",
          },
          {
            type: "native-time",
            name: "native-time",
            label: "native time selection",
            value: "16:10",
          },
          {
            type: "native-number",
            name: "native-number",
            label: "native digital input",
            value: "6",
          },
          {
            type: "divider",
          },
          {
            type: "input-tag",
            name: "tag",
            label: "label",
            placeholder: "",
            clearable: true,
            value: "zhugeliang,caocao",
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
                label: "wild core",
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
                    label: "Yunzhongjun",
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
            label: "Multiple selection box",
            value: "1,2",
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
            name: "radios",
            label: "Single choice",
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
            label: "Button Group",
            description: "Similar to a single-choice effect",
            value: 1,
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
            name: "List",
            label: "List",
            desc: "It's almost the same, but the display method is different",
            value: 3,
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
            desc: "multiple choice",
            multiple: true,
            value: "0,1",
            options: [
              {
                label: "Option 0",
                value: 0,
              },
              {
                label: "Option 1",
                value: 1,
              },
              {
                label: "Option 2",
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
            desc: "Support pictures",
            value: "0,1",
            options: [
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 0,
                label: "Picture 0",
              },
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 1,
                label: "Picture 1",
              },
              {
                image: "/examples/static/photo/3893101144.jpg",
                value: 2,
                label: "Picture 2",
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
            desc: "Support text type-type",
            multiple: true,
            value: 1,
            options: [
              {
                value: 0,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C01</div >\n <div class="text-sm">CPU: 22 cores</div>\n <div class="text-sm">Memory: 10GB</div>\n <div class="text-sm ">SSD disk: 1024GB</div>\n </div>',
              },
              {
                value: 1,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C01</div >\n <div class="text-sm">CPU: 22 cores</div>\n <div class="text-sm">Memory: 10GB</div>\n <div class="text-sm ">SSD disk: 1024GB</div>\n </div>',
              },
              {
                value: 2,
                body: '<div class="m-l-sm m-r-sm m-b-sm m-t-xs">\n <div class="text-md p-b-xs b-inherit b-b m-b-xs">Package: C01</div >\n <div class="text-sm">CPU: 22 cores</div>\n <div class="text-sm">Memory: 10GB</div>\n <div class="text-sm ">SSD disk: 1024GB</div>\n </div>',
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
            label: "rating",
            name: "rating",
            half: false,
          },
          {
            type: "divider",
          },
          {
            type: "switch",
            name: "switch",
            label: "switch",
            value: true,
          },
          {
            type: "switch",
            name: "switch4",
            value: true,
            onText: "Open",
            offText: "Close",
            label: "Switch text",
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
          label: "switch icon",
          },
          {
            type: "divider",
          },
          {
            type: "checkbox",
            name: "checkbox",
            label: "Tick box",
            option: "Agree to Agreement",
            value: true,
          },
          {
            type: "divider",
          },
          {
            type: "select",
            name: "type",
            label: "Drop-down single choice",
            inline: true,
            value: 1,
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
                label: "The content is very long and long options, the content is very long and long options",
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
            label: "Multiple choice",
            multiple: true,
            inline: true,
            value: "1,2",
            options: [
              {
                label: "Option 1",
                value: 1,
              },
              {
                label: "Option 2",
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
            label: "date",
            value: "1591326307",
          },
          {
            type: "input-datetime",
            name: "datetime",
            label: "Date + Time",
            value: "1591326307",
          },
          {
            type: "input-time",
            name: "time",
            label: "time",
            value: "1591326307",
          },
          {
            type: "input-month",
            name: "year-month",
            label: "year and month",
            value: "1591326307",
          },
          {
            type: "input-month",
            name: "month",
          label: "month",
            value: "1591326307",
          },
          {
            type: "input-year",
            name: "year",
            label: "Year",
            value: "1591326307",
          },
          {
            type: "input-quarter",
            name: "quarter",
          label: "Quarter",
            value: "1591326307",
          },
          {
            type: "divider",
          },
          {
          type: "input-date-range",
            name: "input-date-range",
            label: "date range",
            value: "1661961600,1664553599",
          },
          {
            type: "input-datetime-range",
            name: "input-datetime-range",
            label: "date time range",
            value: "1659283200,1661961599",
          },
          {
            type: "input-time-range",
            name: "input-time-range",
            label: "Time range",
            value: "15:00,23:27",
          },
          {
            type: "input-month-range",
            name: "input-month-range",
           label: "month range",
            value: "1643644800,1651420799",
          },
          {
            type: "input-year-range",
            name: "input-year-range",
            label: "Year range",
            value: "1693497600,1790870399",
          },
          {
            type: "input-quarter-range",
            name: "input-quarter-range",
            label: "Quarterly Range",
            value: "1640966400,1664639999",
          },
          {
            type: "divider",
          },
          {
            type: "input-group",
            size: "sm",
            inline: true,
            label: "combination",
            body: [
             {
                type: "input-text",
                placeholder: "Search Job ID/Name",
                inputClassName: "b-l-none p-l-none",
                name: "jobName",
                value: "Homework",
              },
              {
                type: "input-text",
                placeholder: "Search Job ID/Name",
                inputClassName: "b-l-none p-l-none",
                name: "jobName",
                value: "Homework",
              },
            ],
          },
          {
            type: "input-group",
            label: "various combinations",
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
            label: "multiple lines of text",
            value: "This is a multi-line text word\nThe second line of content\n2222\n333",
            staticSchema: {
              limit: 3,
            },
          },
          {
            type: "divider",
          },
          {
            label: "Shuttle",
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
            label: "Combination shuttle",
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
                label: "member",
                selectMode: "tree",
                searchable: true,
               children: [
                  {
                    label: "Master",
                    children: [
                      {
                        label: "Zhuge Liang",
                        value: "zhugeliang",
                      },
                    ],
                  },
                  {
                    label: "warrior",
                    children: [
                      {
                        label: "Cao Cao",
                        value: "caocao",
                      },
                      {
                        label: "Zhong Wuyan",
                        value: "zhongwuyan",
                      },
                    ],
                  },
                  {
                    label: "Jungle",
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
                        label: "Yunzhongjun",
                        value: "yunzhongjun",
                      },
                    ],
                  },
                ],
              },
              {
                label: "user",
                selectMode: "chained",
                children: [
                  {
                    label: "Master",
                    children: [
                      {
                        label: "Zhuge Liang",
                        value: "zhugeliang2",
                      },
                    ],
                  },
                  {
                    label: "warrior",
                    children: [
                      {
                        label: "Cao Cao",
                        value: "caocao2",
                      },
                      {
                        label: "Zhong Wuyan",
                        value: "zhongwuyan2",
                      },
                    ],
                  },
                  {
                    label: "Jungle",
                    children: [
                      {
                        label: "Li Bai",
                        value: "libai2",
                      },
                      {
                        label: "Han Xin",
                        value: "hanxin2",
                      },
                      {
                        label: "Yunzhongjun",
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
            label: "Shuttle picker",
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
                label: "Master",
                children: [
                  {
                    label: "Zhuge Liang",
                    value: "zhugeliang",
                  },
                ],
              },
              {
                label: "warrior",
                children: [
                  {
                    label: "Cao Cao",
                    value: "caocao",
                  },
                  {
                    label: "Zhong Wuyan",
                    value: "zhongwuyan",
                  },
                ],
              },
              {
                label: "Jungle",
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
                    label: "Yunzhongjun",
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
            label: "Combined shuttle picker",
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
                label: "member",
                selectMode: "tree",
                searchable: true,
                children: [
                  {
                    label: "Master",
                    children: [
                      {
                        label: "Zhuge Liang",
                        value: "zhugeliang",
                        email: "zhugeliang@timi.com",
                        phone: 131111111111,
                      },
                    ],
                  },
                  {
                    label: "warrior",
                    children: [
                      {
                        label: "Cao Cao",
                        value: "caocao",
                        email: "caocao@timi.com",
                        phone: 131111111111,
                      },
                      {
                        label: "Zhong Wuyan",
                        value: "zhongwuyan",
                        email: "zhongwuyan@timi.com",
                        phone: 131111111111,
                      },
                    ],
                  },
                  {
                    label: "Jungle",
                    children: [
                      {
                        label: "Li Bai",
                        value: "libai",
                        email: "libai@timi.com",
                        phone: 131111111111,
                      },
                      {
                        label: "Han Xin",
                        value: "hanxin",
                        email: "hanxin@timi.com",
                        phone: 131111111111,
                      },
                      {
                        label: "Yunzhongjun",
                        value: "yunzhongjun",
                        email: "yunzhongjun@timi.com",
                        phone: 131111111111,
                      },
                    ],
                  },
                ],
              },
              {
                label: "role",
                selectMode: "list",
                children: [
                  {
                    label: "Role 1",
                    value: "role1",
                  },
                  {
                    label: "Role 2",
                    value: "role2",
                  },
                  {
                    label: "Role 3",
                    value: "role3",
                  },
                  {
                    label: "Role 4",
                    value: "role4",
                  },
                ],
              },
              {
                label: "department",
                selectMode: "tree",
                children: [
                  {
                    label: "Headquarters",
                    value: "dep0",
                    children: [
                      {
                        label: "Department 1",
                        value: "dep1",
                        children: [
                          {
                            label: "Department 4",
                            value: "dep4",
                          },
                          {
                            label: "Department 5",
                            value: "dep5",
                          },
                        ],
                      },
                      {
                        label: "Department 2",
                        value: "dep2",
                      },
                      {
                        label: "Department 3",
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
            label: "tree",
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
            label: "trees",
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
            label: "selecttree",
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
            label: "selecttrees",
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
            label: "nestedSelect",
            value: "definitions",
            options: [
           {
                label: "concept",
                value: "concepts",
                children: [
                  {
                    label: "Configuration and Components",
                    value: "schema",
                  },
                  {
                    label: "Data domain and data link",
                    value: "scope",
                  },
                  {
                    label: "Template",
                    value: "template",
                  },
                  {
                    label: "data mapping",
                    value: "data-mapping",
                  },
                  {
                    label: "expression",
                    value: "expression",
                  },
                  {
                    label: "linkage",
                    value: "linkage",
                  },
                  {
                    label: "behavior",
                    value: "action",
                  },
                  {
                    label: "style",
                    value: "style",
                  },
                ],
              },
              {
                label: "type",
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
                label: "component",
                value: "zujian",
                children: [
                  {
                    label: "Layout",
                    value: "buju",
                    children: [
                      {
                        label: "Page page",
                        value: "page",
                      },
                      {
                        label: "Container container",
                        value: "container",
                      },
                      {
                        label: "Collapse folder",
                        value: "Collapse",
                      },
                    ],
                  },
                 {
                    label: "Function",
                    value: "gongneng",
                    children: [
                      {
                        label: "Action behavior button",
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
                        label: "CRUD add, delete, modify and check",
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
                    label: "feedback",
                    value: "fankui",
                  },
                ],
              },
            ],
          },
          {
            type: "nested-select",
            name: "nestedSelectMul",
            label: "Cassociation selector multiple selection",
            multiple: true,
            checkAll: false,
            value: "definitions",
            options: [
            {
                label: "concept",
                value: "concepts",
                children: [
                  {
                    label: "Configuration and Components",
                    value: "schema",
                  },
                  {
                    label: "Data domain and data link",
                    value: "scope",
                  },
                  {
                    label: "Template",
                    value: "template",
                  },
                  {
                    label: "data mapping",
                    value: "data-mapping",
                  },
                  {
                    label: "expression",
                    value: "expression",
                  },
                  {
                    label: "linkage",
                    value: "linkage",
                  },
                  {
                    label: "behavior",
                    value: "action",
                  },
                  {
                    label: "style",
                    value: "style",
                  },
                ],
              },
              {
                label: "type",
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
                label: "component",
                value: "zujian",
                children: [
                  {
                    label: "Layout",
                    value: "buju",
                    children: [
                      {
                        label: "Page page",
                        value: "page",
                      },
                      {
                        label: "Container container",
                        value: "container",
                      },
                      {
                        label: "Collapse folder",
                        value: "Collapse",
                      },
                    ],
                  },
                  {
                    label: "Function",
                    value: "gongneng",
                    children: [
                      {
                        label: "Action behavior button",
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
                        label: "CRUD add, delete, modify and check",
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
                    label: "feedback",
                    value: "fankui",
                  },
                ],
              },
            ],
          },
          {
            name: "select3",
            type: "chained-select",
            label: "chain pull-down selector",
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
            label: "Matrix switch",
            rowLabel: "Line Title Description",
            value: [
              [
                {
                  label: "Column 1",
                  checked: true,
                },
                {
                  label: "Column 1",
                  checked: false,
                },
              ],
              [
                {
                  label: "Column 2",
                  checked: false,
                },
                {
                  label: "Column 2",
                  checked: true,
                },
              ],
            ],
            columns: [
              {
                label: "Column 1",
              },
              {
                label: "Column 2",
              },
            ],
            rows: [
              {
                label: "Rules 1",
              },
              {
                label: "Rules 2",
              },
            ],
          },
          {
            type: "divider",
          },
          {
           type: "combo",
            name: "combo",
            label: "Combination single strip",
            value: {
              "c-1": 1,
              "c-2": "a",
            },
            Items: [
              {
                name: "c-1",
                label: "name",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "c-2",
                label: "Information",
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
            label: "Combining multiple strips",
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
           Items: [
              {
                name: "a",
                label: "Name:",
                type: "input-text",
                placeholder: "A",
              },
              {
                name: "b",
                label: "Information:",
                type: "select",
                options: ["a", "b", "c"],
              },
            ],
          },
          {
            name: "array",
            label: "Color Collection",
            type: "input-array",
            value: ["red", "blue", "green"],
            inline: true,
            Items: {
              type: "input-color",
              clearable: false,
            },
          },
          {
            type: "input-kv",
            name: "kv",
            label: "key value pair",
            valueType: "input-number",
            value: {
              count1: 2,
              count2: 4,
            },
          },
          {
            type: "input-kvs",
            name: "dataModel",
            label: "Nestable key-value objects",
            addButtonText: "Add table",
            keyItem: {
              label: "table name",
              mode: "horizontal",
              type: "select",
              options: ["table1", "table2", "table3"],
            },
            valueItems: [
              {
                type: "input-kvs",
                addButtonText: "Add a field",
                name: "column",
                keyItem: {
                  label: "field name",
                  mode: "horizontal",
                  type: "select",
                  options: ["id", "title", "content"],
                },
                valueItems: [
                 {
                    type: "switch",
                    name: "primary",
                    mode: "horizontal",
                    label: "Is it a primary key?"
                  },
                  {
                    type: "select",
                    name: "type",
                    label: "field type",
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
            label: "Scope",
            value: 50,
          },
          {
            name: "city",
            type: "input-city",
            label: "city",
            searchable: true,
            value: 210727,
          },
          {
            type: "location-picker",
            label: "geographic location",
            name: "location",
            ak: "LiZT5dVbGTsPI91tFGcOlSpe5FDehpf7",
          },
          {
            type: "divider",
          },
          {
            type: "chart-radios",
            label: "Chart checkbox",
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
               label: "Switch to input state",
                level: "primary",
                onEvent: {
                  Click: {
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
                label: "Switch to display",
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
                label: "Clear",
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
    title: "Load from remote",
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
        title: "Dynamic Form Element Example",
        name: "demo-form",
        api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2",
        mode: "horizontal",
        actions: [
          {
            type: "submit",
            label: "Submit",
          },
        ],
        body: [
          {
            name: "select",
            type: "select",
            label: "Dynamic Options",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            Description: "Pull options through the interface in one breath",
            clearable: true,
            searchable: true,
          },
          {
            type: "divider",
          },
          {
            name: "select2",
            type: "select",
            label: "Options are automatically completed",
            autoComplete:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/autoComplete?term=$term",
            placeholder: "Please enter",
            Description: "Automatic completion through interface",
          },
          {
            type: "divider",
          },
          {
            type: "input-text",
            name: "text",
            label: "Text prompt",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/getOptions?waitSeconds=1",
            placeholder: "Please select",
            creatable: true,
          },
          {
            type: "divider",
          },
          {
            name: "text2",
            type: "input-text",
            label: "Automatic text completion",
            clearable: true,
            autoComplete:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/autoComplete2?term=$term",
            Description: "Automatic completion through interface",
          },
          {
            name: "chained",
            type: "chained-select",
            label: "Cascade options",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1",
            desc: "Infinite level, as long as the API returns data, you can continue to select downwards. Please return null when there is no lower level.",
            value: "a,b",
          },
          {
            type: "divider",
          },
          {
            name: "tree",
            showOutline: true,
            type: "input-tree",
            label: "dynamic tree",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/tree?waitSeconds=1",
          },
          {
            type: "divider",
          },
          {
            name: "tree",
            type: "input-tree",
            label: "Slot Loading",
            multiple: true,
            deferApi:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/deferOptions?label=${label}&waitSeconds=2",
            options: [
              {
                label: "Master",
                children: [
                  {
                    label: "Zhuge Liang",
                    value: "zhugeliang",
                  },
                ],
              },
              {
                label: "warrior",
                defer: true,
              },
              {
                label: "Jungle",
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
                    label: "Yunzhongjun",
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
            label: "dynamic matrix switch",
            source:
              "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/matrix?waitSeconds=1",
          },
        ],
      },
    ],
  },
  "9": {
    type: "page",
    title: "Tabs",
    subTitle: "All tabs are in the current page, including default, line, card and radio mode",
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
            title: "Tab 1",
            hash: "tab1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            hash: "tab2",
            body: {
              type: "form",
              panelClassName: "panel-primary",
              body: [
                {
                  type: "input-text",
                  name: "a",
                  label: "text",
                },
              ],
            },
          },
          {
            title: "Tab 3",
            body: {
              type: "crud",
              api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample",
              filter: {
                title: "conditional search",
                submitText: "",
                body: [
                  {
                    type: "input-text",
                    name: "keywords",
                    placeholder: "Search by keyword",
                    clearable: true,
                    addOn: {
                      label: "Search",
                      type: "submit",
                    },
                  },
                  {
                    type: "plain",
                    text: "The form items here can be configured with multiple types",
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
                  label: "Operation",
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
            title: "Tab 1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            body: "Tab Content 2",
          },
          {
            title: "Tab 3",
            body: "Tab Content 3",
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
            title: "Tab 1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            body: "Tab Content 2",
          },
          {
            title: "Tab 3",
            body: "Tab Content 3",
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
            title: "Tab 1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            body: "Tab Content 2",
          },
          {
            title: "Tab 3",
            body: "Tab Content 3",
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
            title: "Tab 1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            body: "Tab Content 2",
          },
          {
            title: "Tab 3",
            body: "Tab Content 3",
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
            title: "Tab 1",
            body: "Tab Content 1",
          },
          {
            title: "Tab 2",
            body: "Tab Content 2",
          },
          {
            title: "Tab 3",
            body: "Tab Content 3",
          },
          {
            title: "Tab 4",
            body: "Tab Content 4",
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
            title: "Tab 2",
            body: [
              {
                type: "service",
                api: "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/crud/table?perPage=5",
                body: [
                  {
                    type: "table",
                   title: "Table1",
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
                       label: "Operation",
                        buttons: [
                          {
                            label: "Details",
                            type: "button",
                            level: "link",
                            actionType: "dialog",
                            dialog: {
                              title: "View details",
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
                        label: "Delete",
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
            title: "Tab 3",
            body: "Tab Content 3",
          },
          {
            title: "Tab 4",
            body: "Tab Content 4",
          },
          {
            title: "Tab 5",
            body: "Tab Content 5",
          },
        ],
      },
    ],
  },
  "10": {
    title: "Image View",
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
            title: "Native configuration example supports interaction",
            name: "chart-local",
            body: [
              {
                type: "chart",
                config: {
                  title: {
                    text: "Polar coordinates even value axes",
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
                    title: "Details",
                    body: [
                      {
                        type: "tpl",
                        tpl: "<span>Currently selected value ${value|json}<span>",
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
            title: "Remote graph representation example (return value with function)",
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
        title: "Form+chart combination",
        body: [
          {
            type: "form",
            title: "Filter Condition",
            target: "chart1,chart2",
            submitOnInit: true,
            className: "m-b",
            wrapWithPanel: false,
            mode: "inline",
            body: [
              {
                type: "input-date",
                label: "start date",
                name: "starttime",
                value: "-8days",
                maxDate: "${endtime}",
              },
              {
                type: "input-date",
                label: "end date",
                name: "endtime",
                value: "-1days",
                minDate: "${starttime}",
              },
              {
                type: "input-text",
                label: "condition",
                name: "name",
                addOn: {
                  type: "submit",
                  label: "Search",
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
              name: "Population density in 18 districts of Hong Kong",
              type: "map",
              map: "HK",
              label: {
                show: true,
              },
              data: [
                {
                  name: "Central and Western District",
                  value: 20057.34,
                },
                {
                  name: "Wan Chai",
                  value: 15477.48,
                },
                {
                  name: "East District",
                  value: 31686.1,
                },
                {
                  name: "South District",
                  value: 6992.6,
                },
                {
                  name: "Yao Tsim Mong",
                  value: 44045.49,
                },
                {
                  name: "Sham Shui Po",
                  value: 40689.64,
                },
                {
                  name: "Kowloon City",
                  value: 37659.78,
                },
                {
                  name: "Wang Tai Sin",
                  value: 45180.97,
                },
                {
                  name: "Kuang Tong",
                  value: 55204.26,
                },
                {
                  name: "Kwai Tsing",
                  value: 21900.9,
                },
                {
                  name: "Tsuen Wan",
                  value: 4918.26,
                },
                {
                  name: "Tuen Mun",
                  value: 5881.84,
                },
                {
                  name: "Yuen Long",
                  value: 4178.01,
                },
                {
                  name: "North District",
                  value: 2227.92,
                },
                {
                  name: "Tai Po",
                  value: 2180.98,
                },
                {
                  name: "Shatin",
                  value: 9172.94,
                },
                {
                  name: "Saigong",
                  value: 3368,
                },
                {
                  name: "Out island",
                  value: 806.98,
                },
              ],
             nameMap: {
                "Central and Western": "Central and Western",
                Eastern: "Eastern District",
                Islands: "Out island",
                "Kowloon City": "Kowloon City",
                "Kwai Tsing": "Kowtsing",
                "Kwun Tong": "Kuang Tong",
                North: "North District",
                "Sai Kung": "Sai Kung",
                "Sha Tin": "Sha Tin",
                "Sham Shui Po": "Sham Shui Po",
                Southern: "South District",
                "Tai Po": "Tai Po",
                "Tsuen Wan": "Tsuen Wan",
                "Tuen Mun": "Tuen Mun",
                "Wan Chai": "Wan Chai",
                "Wong Tai Sin": "Wong Tai Sin",
                "Yau Tsim Mong": "Yau Tsim Mong",
                "Yuen Long": "Yuen Long",
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
            Center: [116.414, 39.915],
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
    title: "ECharts",
    data: {
      config: {
        title: {
          text: "The temperature changes in the next week",
          subtext: "Pure fiction",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["Maximum temperature", "Minimum temperature"],
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
       calculate: true,
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
            name: "Maximum temperature",
            type: "line",
            data: [11, 11, 15, 13, 12, 13, 10],
          },
          {
            name: "Minimum temperature",
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
