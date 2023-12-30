export type TooltipDirection = 'top' | 'left' | 'bottom' | 'right'
export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
export type Nullable<T extends object> = { [P in keyof T]: T[P] | null }
