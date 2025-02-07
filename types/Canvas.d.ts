// canvas.d.ts
declare module 'canvas' {
  interface Options {
    family: string
    weight?: string
    style?: string
  }

  export function createCanvas(width: number, height: number): HTMLCanvasElement
  export function registerFont(fontPath: string, options?: Options): void
  // Add other exports as needed
}
