import * as React from 'react';
import renderer from 'react-test-renderer';

import { ExternalLink } from '../common/ExternalLink';

it(`renders correctly`, () => {
  const tree = renderer.create(<ExternalLink href="http://u3.xyz">U3</ExternalLink>).toJSON();

  expect(tree).toMatchSnapshot();
});
