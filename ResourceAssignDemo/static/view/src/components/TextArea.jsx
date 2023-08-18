import React from 'react';

import TextArea from '@atlaskit/textarea';

export default () => (
  <div>
    <TextArea
      resize="auto"
      maxHeight="20vh"
      name="area"
      defaultValue="Them tin nhan vao day"
    />
  </div>
);