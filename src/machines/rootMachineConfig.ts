
export const initialContext = {

  global: {
    navigationItems: [
      { type: "link", text: "home", href: "/" },
      { type: "link", text: "Stories", href: "/stories" },
      { type: "link", text: "Button", href: "/stories/render/button" },
      { type: "link", text: "Right Panel", href: "/stories/components/right-panel" },
      { type: "link", text: "Renderers Panel", href: "/stories/components/renderers-panel" },
      { type: "link", text: "AI Ant", href: "/stories/components/ai-ant" },
      { type: "link", text: "Amis Docs Intro", href: "/stories/components/amis-docs-intro" },
      { type: "link", text: "Amis Get Renderers", href: "/stories/components/amis-get-renderers" },
      { type: "link", text: "Core Editor", href: "/stories/components/core-editor" },
      { type: "link", text: "Dynamic1", href: "/stories/components/dynamic-id-1" },
      { type: "link", text: "Dynamic2", href: "/stories/components/dynamic-id-2" },
    ],
  },

  components: {
    'aiAnt': {
      'internal': {
        activeKey: null,
        headerOpen: false,
        attachedFiles: [],
      },
      'welcome': {
        variant: "borderless",
        title: "Hello, I'm Ant Design X",
        description: "Base on Ant Design, AGI product interface solution, create a better intelligent vision~",
        icon:""
      },
      'promptsItems': {
        items: [
          {
            key: "1",
            description: "Hot Topics",
          },
          {
            key: "2",
            description: "Design Guide",
          },
        ]
      },
      'promptsGroupped': {
        title: "Do you want?",
        items: [
          {
            key: "1",
            label: "Hot Topics",
            description: "What are you interested in?",
            children: [
              {
                key: "1-1",
                description: `What's new in X?`,
              },
              {
                key: "1-2",
                description: `What's AGI?`,
              },
              {
                key: "1-3",
                description: `Where is the doc?`,
              },
            ],
          },
          {
            key: "2",
            label: "Design Guide",
            description: "How to design a good product?",
            children: [
              {
                key: "2-1",
                description: `Know the well`,
              },
              {
                key: "2-2",
                description: `Set the AI role`,
              },
              {
                key: "2-3",
                description: `Express the feeling`,
              },
            ],
          },
        ]
      },
      'conversationList': {
        items: [
          {
            key: "0",
            label: "What is Ant Design X?",
          },
          {
            key: "1",
            label: "Conversation 1",
            disabled: false,
          },
          {
            key: "2",
            label: "Conversation 2",
            disabled: false,
          },
          {
            key: "3",
            label: "Conversation 3",
            disabled: false,
          },
        ],
        menu: {
          items: [
            {
              label: "Operation 1",
              key: "operation1",
            },
            {
              label: "Operation 2",
              key: "operation2",
              disabled: true,
            },
            {
              label: "Operation 3",
              key: "operation3",
              danger: true,
            },
          ],
          onClick: (conversation: any) => (menuInfo: any) => {
            console.log(`Click ${conversation.key} - ${menuInfo.key}`)
          },
        },

      },
      'roles': {
        ai: {
          placement: "start",
          typing: { step: 5, interval: 20 },
          styles: {
            content: {
              borderRadius: 16,
            },
          },
        },
        local: {
          placement: "end",
          variant: "shadow",
        },
      },
      'throughChain': {
        items: [
          {
            title: "Hello Ant Design X!",
            status: "success",
            description: "status: success",
            content: "Ant Design X help you build AI chat/platform app as ready-to-use 📦.",
          },
          {
            title: "Hello World!",
            status: "success",
            description: "status: success",
          },
          {
            title: "Pending...",
            status: "pending",
            description: "status: pending",
          },
        ]
      }
    }
  }
}
