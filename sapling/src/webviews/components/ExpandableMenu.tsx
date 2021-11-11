import * as React from 'react';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const ExpandableMenu = ({controlName, children, initState}: {controlName: string, children: any, initState: boolean}) => {
  const [isExpanded, setExpanded] = useState(initState);

  if (!isExpanded) {
    return (
      <>
        <div className='expand-control' onClick={() => setExpanded(true)}>
          <FontAwesomeIcon className='expand-chevron' icon={faChevronRight}/>
          {controlName}
        </div>
        <hr className="line_break"/>
      </>
    );
  }

  return (
    <>
      <div className='expand-control' onClick={() => setExpanded(false)}>
        <FontAwesomeIcon className='expand-chevron' icon={faChevronDown}/>
        {controlName}
      </div>
      {children}
      <hr className="line_break"/>
    </>
  );

};

export default ExpandableMenu;
