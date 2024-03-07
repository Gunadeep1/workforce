import { Tooltip } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';



function ToolTip(props) {

  const { title, placement, children } = props;

  /**
   * placement types:-
   * based on placement tooltip will take positions
   * ===========
   * top,top-start,top-end
   * right,right-start,right-end
   * left,left-start,left-end
   * bottom,bottom-start,bottom-end
   * ===========
   */

  /**
   * @parem placement :- based on placement Tooltip takes position excepted `string`
   * 
   * @parem title :- title excepted type `string`
   * 
   * @parem children :- excepted type `node` 
   * */

  return (
    <div>
      <Tooltip placement={placement} title={title} arrow {...props}>
        {children}
      </Tooltip>
    </div>
  )
}

export default ToolTip;


ToolTip.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.any,
  children: PropTypes.node,
}