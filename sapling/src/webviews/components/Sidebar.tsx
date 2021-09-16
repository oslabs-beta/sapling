import * as React from 'react';
import Navbar from './Navbar';
import Tree from './Tree';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Tree />
    </div>
  );
};

export default Sidebar;