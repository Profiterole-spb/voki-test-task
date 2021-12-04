import image from '@rollup/plugin-image';

export default {
  input: 'src/js/game/preloadPack.js',
  output: {file: 'src/js/game/bundle.preloadPack.js'},
  plugins: [image()],
};
