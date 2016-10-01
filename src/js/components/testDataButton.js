import React, { PropTypes } from 'react';
import classNames from 'classnames'

function TestDataButton(props) {
  return (
    <button className={classNames("test-button", { active: props.active })} disabled={props.active} onClick={props.onClick} >
      {props.text}
    </button>
  );
}

TestDataButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string
};

export default TestDataButton;
