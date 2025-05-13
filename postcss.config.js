module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss‐custom‐properties')({
      preserve: false,      // replace var(...) with static values
    }),
  ],
}
