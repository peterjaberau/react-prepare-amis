import React from "react"
import {Flex, Card, Button, ConfigProvider } from "antd"
import { createStyles } from "antd-style"

const AntdPageExample: React.FC = () => {
  const { styles, cx } = useStyles()

  return (
    <ConfigProvider>
      <Flex className="w-100 justify-center gap-6 items-stretch">
        <Card title="Welcome to Ant Design + Styled Components" className={cx(styles.card)}>
          <p>Here are some actions you can take:</p>
          <Button className="bg-primary text-primary-foreground">Tailwind Primary</Button>
          <Button type="primary" className={cx(styles.button)}>
            Primary Action
          </Button>
          <Button className={cx(styles.button)}>Secondary Action</Button>
          <Button danger className={cx(styles.button)}>
            Danger Action
          </Button>
        </Card>

        <Card title="Flexbox" className={cx(styles.card)}>

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

export default AntdPageExample
