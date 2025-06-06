import { Accessor, createSignal, JSXElement, Setter, Show } from "solid-js"
import type { Setting } from "./Generator"
import html2canvas from "html2canvas"

export default function Setting(props: {
  setting: Accessor<Setting>
  setSetting: Setter<Setting>
  clear: any
  reAnswer: any
}) {
  const [shown, setShown] = createSignal(false)
  return (
    <div class="text-sm text-slate-7 dark:text-slate mb-2">
      <Show when={shown()}>
        <SettingItem icon="i-carbon:api" label="xAI API Key">
          <input
            type="password"
            value={props.setting().xaiAPIKey}
            class="max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                xaiAPIKey: (e.target as HTMLInputElement).value
              })
            }}
          />
        </SettingItem>
        <SettingItem icon="i-carbon:user-online" label="系统角色指令">
          <input
            type="text"
            value={props.setting().systemRule}
            class="text-ellipsis max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:bg-op-20 focus:ring-0 focus:outline-none"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                systemRule: (e.target as HTMLInputElement).value
              })
            }}
          />
        </SettingItem>
        <SettingItem icon="i-carbon:data-enrichment" label="思维发散程度">
          <input
            type="range"
            min={0}
            max={100}
            value={String(props.setting().xaiAPITemperature)}
            class="max-w-150px w-full h-2 bg-slate bg-op-15 rounded-lg appearance-none cursor-pointer accent-slate"
            onInput={e => {
              props.setSetting({
                ...props.setting(),
                xaiAPITemperature: Number(
                  (e.target as HTMLInputElement).value
                )
              })
            }}
          />
        </SettingItem>
        <SettingItem
          icon="i-carbon:save-image"
          label="记录对话内容，刷新不会消失"
        >
          <label class="relative inline-flex items-center cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={props.setting().archiveSession}
              class="sr-only peer"
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  archiveSession: (e.target as HTMLInputElement).checked
                })
              }}
            />
            <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
          </label>
        </SettingItem>
        <SettingItem
          icon="i-carbon:3d-curve-auto-colon"
          label="开启连续对话，将加倍消耗 Token"
        >
          <label class="relative inline-flex items-center cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={props.setting().continuousDialogue}
              class="sr-only peer"
              onChange={e => {
                props.setSetting({
                  ...props.setting(),
                  continuousDialogue: (e.target as HTMLInputElement).checked
                })
              }}
            />
            <div class="w-9 h-5 bg-slate bg-op-15 peer-focus:outline-none peer-focus:ring-0  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate"></div>
          </label>
        </SettingItem>
        <hr class="mt-2 bg-slate-5 bg-op-15 border-none h-1px"></hr>
      </Show>
      <div class="mt-2 flex items-center justify-between">
        <ButtonItem
          onClick={() => {
            setShown(!shown())
          }}
          icon="i-carbon:settings"
          label="设置"
        />
        <div class="flex">
          <ButtonItem
            onClick={() => {
              html2canvas(
                document.querySelector("#message-container") as HTMLElement
              ).then(canvas => {
                const a = document.createElement("a")
                a.href = canvas.toDataURL("image/png")
                a.download = "chat.png"
                a.click()
              })
            }}
            icon="i-carbon:image"
            label="导出图片"
          />
          <ButtonItem
            onClick={props.reAnswer}
            icon="i-carbon:reset"
            label="重新回答"
          />
          <ButtonItem
            onClick={props.clear}
            icon="i-carbon:trash-can"
            label="清空对话"
          />
        </div>
      </div>
    </div>
  )
}

function SettingItem(props: {
  children: JSXElement
  icon: string
  label: string
}) {
  return (
    <div class="flex items-center p-1 justify-between hover:bg-slate hover:bg-op-10 rounded">
      <div class="flex items-center">
        <button class={props.icon} />
        <span ml-1>{props.label}</span>
      </div>
      {props.children}
    </div>
  )
}

function ButtonItem(props: { onClick: any; icon: string; label: string }) {
  return (
    <div
      class="flex items-center cursor-pointer p-1 hover:bg-slate hover:bg-op-10 rounded"
      onClick={props.onClick}
    >
      <button class={props.icon} />
      <span ml-1>{props.label}</span>
    </div>
  )
}
