import { configure, addParameters } from '@storybook/react';
import { create } from '@storybook/theming';
import 'bulma/css/bulma.css'

const theme = create({ colorPrimary: '#FF4785', colorSecondary: '#1EA7FD' });
addParameters({ options: { theme } });

// automatically import all files ending in *.stories.js
const req = require.context('../src/', true, /.*\.(stories|story)\.(js|jsx|ts|tsx)?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
