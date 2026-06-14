declare module 'draco3dgltf' {
  const draco3d: {
    createEncoderModule(options?: object): Promise<object>;
    createDecoderModule(options?: object): Promise<object>;
  };
  export default draco3d;
}
