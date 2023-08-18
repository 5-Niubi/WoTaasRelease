import React from 'react';

import TableTree from '@atlaskit/table-tree';


const items = [
  {
    id: 'item1',
    content: {
      title: 'Item 1',
      description: 'First top-level item',
    },
    hasChildren: false,
    children: [],
  },
  {
    id: 'item2',
    content: {
      title: 'Item 2',
      description: 'Second top-level item',
    },
    hasChildren: true,
    children: [
      {
        id: 'child2.1',
        content: {
          title: 'Child item',
          description: 'A child item',
        },
        hasChildren: false,
      },
    ],
  },
  {
    id: 'item3',
    content: {
      title: 'Đây là Item 3',
      description: 'SECOND TOP LEVEL',
    },
    hasChildren: false,
    children: [],
  },
];

const Title = (props) => <span>{props.title}</span>;
const Description = (props) => <span>{props.description}</span>;

export default () => (
  <TableTree
    columns={[Title, Description]}
    headers={['Title', 'Description']}
    columnWidths={['120px', '300px']}
    items={items}
  />
);