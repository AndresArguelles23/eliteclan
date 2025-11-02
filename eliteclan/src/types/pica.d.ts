declare module 'pica' {
  interface PicaInstance {
    resize(source: HTMLCanvasElement, target: HTMLCanvasElement, options?: { quality?: number }): Promise<HTMLCanvasElement>;
    toBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob>;
  }

  function pica(): PicaInstance;

  export default pica;
}
