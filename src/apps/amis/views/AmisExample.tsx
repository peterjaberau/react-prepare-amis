import "@/amis/styles/editor.scss"
import "amis-editor-core/lib/style.css"
import "@/amis/styles/antd.css"
import "@/amis/styles/lib/helper.css"
import "@/amis/styles/lib/iconfont.css"

import React, { useEffect, useState } from "react"
import { Flex, Card, ConfigProvider } from "antd"
import { alert, confirm, SchemaObject } from "amis"
import { copy, fetcher, notify } from "@/amis/amisEnvUtils"
import { createStyles } from "antd-style"

import { MiniEditor } from "amis-editor"
import { getPageById } from "@/amis/db/pages.ts"

const amisEnv = {
  fetcher,
  notify,
  alert,
  copy,
  confirm,
}

const AmisExample: React.FC = () => {
  const { styles, cx } = useStyles()
  const curLanguage = "en-US"

  const [preview, setPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [schema, setSchema] = useState({})
  const [value, setValue] = React.useState({ type: "table" } as any)

  useEffect(() => {
    async function fetchSchema() {
      const schema = await getPageById("0")
      setSchema(schema)
    }
    fetchSchema()
  }, [])

  async function save() {
    // Call the save interface
  }

  function onChange(value: SchemaObject) {
    setSchema(value)
  }

  const handleChange = (e: any) => {
    setValue(e)
    console.log("value changed:", e)
  }

  return (
    <ConfigProvider>
      <Flex className="w-100 justify-center gap-6 items-stretch">
        <Card title="BaseControl" className={cx(styles.card)}>
          <MiniEditor onChange={handleChange} value={value} amisEnv={amisEnv} />
        </Card>
      </Flex>
    </ConfigProvider>
  )
}

const useStyles = createStyles(({ token }) => ({
  card: {
    borderRadius: token.borderRadius,
    boxShadow: `0 4px 8px ${token.colorPrimaryBgHover}`,
    ".ant-card-head-title": {
      fontSize: token.fontSizeLG,
    },
  },
  button: {
    marginRight: 8,
    borderRadius: token.borderRadius,
    "&:hover": {
      backgroundColor: token.colorPrimaryHover,
      color: token.colorTextLightSolid,
    },
  },
}))

export default AmisExample
