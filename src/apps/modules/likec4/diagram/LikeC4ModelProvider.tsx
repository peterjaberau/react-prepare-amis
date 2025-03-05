import { type PropsWithChildren, createContext } from 'react'

export const LikeC4ModelContext = createContext<any | null>(null)

export type LikeC4ModelProviderProps = PropsWithChildren<{
  children: any
  likec4model: any
  [key: string]: any
}>

export function LikeC4ModelProvider(props: LikeC4ModelProviderProps) {
  const { children, likec4model} = props
  return (
    <LikeC4ModelContext.Provider value={likec4model}>
      {children}
    </LikeC4ModelContext.Provider>
  )
}
