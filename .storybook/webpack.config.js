const path = require('path');

const SRC_PATH = path.join(__dirname, '../src');

module.exports = ({ config, mode }) => {

  config.module.rules.push(...[
    {
      test: /\.tsx?$/,
      loader: ['babel-loader', 'ts-loader'],
      include: [
        SRC_PATH,
      ]
    },
    {
      test: /\.story\.tsx?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/addon-storysource/loader'),
          options: { parser: 'typescript' }
        }
      ],
      enforce: 'pre',
    },
    {
      test: /\.sass$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'scss-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ])

  config.resolve = {
    ...config.resolve,
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    enforceExtension: false
  }

  return config
};
