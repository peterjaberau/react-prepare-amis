import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { DesktopOutlined, MobileOutlined } from "@ant-design/icons"
import { alert, AlertComponent, confirm, SchemaObject, ToastComponent } from "amis"
import { Editor, ShortcutKey } from "amis-editor-core"
import { copy, fetcher, notify } from "./amisEnvUtils"
import "@/amis/styles/editor.scss"
import "amis-editor-core/lib/style.css";

import "@/amis/styles/cxd.css"
import "@/amis/styles/lib/helper.css"
import "@/amis/styles/lib/iconfont.css"
import { getPageById } from "./db/pages.ts";


export const DynamicEditor: React.FC = () => {

  const { id } = useParams<{ id: string }>();


  const [preview, setPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [schema, setSchema] = useState({})

  useEffect(() => {
    async function fetchSchema() {
      const schema = await getPageById(id as string);
      setSchema(schema);
    }
    fetchSchema()
  }, [id])

  // Current language
  const curLanguage = "en-US"

  async function save() {
    // Call the save interface
  }

  function onChange(value: SchemaObject) {
    setSchema(value)
  }

  return (
    <div className="Editor">
      <div className="Editor-header">
        <div className="Editor-title">Editor ({id}) </div>
        <div className="Editor-view-mode-group-container">
          <div className="Editor-view-mode-group">
            <div
              className={`Editor-view-mode-btn editor-header-icon ${!isMobile ? "is-active" : ""}`}
              onClick={() => {
                setIsMobile(false)
              }}
            >
              {/* PC mode */}
              <DesktopOutlined />
            </div>
            <div
              className={`Editor-view-mode-btn editor-header-icon ${isMobile ? "is-active" : ""}`}
              onClick={() => {
                setIsMobile(true)
              }}
            >
              {/*Mobile mode */}
              <MobileOutlined />
            </div>
          </div>
        </div>

        <div className="Editor-header-actions">
          {/* shortcut key */}
          <div className="shortcut-box">
            <ShortcutKey />
          </div>

          {/* Internationalization */}
          {/* <SelectLang key="SelectLang" /> */}

          <div
            className={`header-action-btn m-1 ${preview ? "primary" : ""}`}
            onClick={() => {
              setPreview(!preview)
            }}
          >
            {preview ? "Edit" : "Preview"}
          </div>
          {/* save */}
          {!preview && (
            <div className={`header-action-btn exit-btn`} onClick={save}>
              save
            </div>
          )}
        </div>
      </div>
      <ToastComponent theme={"cxd"} key="toast" position={"top-center"} locale={curLanguage} />
      <AlertComponent theme={"cxd"} key="alert" locale={curLanguage} />
      <div className="Editor-inner">
        <Editor
          theme={"cxd"}
          preview={preview}
          isMobile={isMobile}
          value={schema as SchemaObject}
          onChange={onChange}
          onPreview={() => {
            setPreview(true)
          }}
          onSave={save}
          className="is-fixed"
          showCustomRenderersPanel={true}
          disablePluginList={[]}
          amisEnv={{
            fetcher,
            notify,
            alert,
            copy,
            confirm,
          }}
        />
      </div>
    </div>
  )
}

