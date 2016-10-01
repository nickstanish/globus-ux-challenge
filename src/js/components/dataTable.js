import React, { PropTypes } from 'react';
import filesize from 'filesize';
import { formatDateTimeString, formatStatus, highlight } from 'utils';

function DataTable(props) {
  if (!props.data) {
    return null;
  }
  return (
    <div className="data-table">
      <div className="row">
        <div className="rc">Status</div>
        <div className="rc">Progress</div>
        <div className="rc">User</div>
        <div className="rc">Request Date</div>
      </div>
      {props.data.DATA.map((item, index) => {
        return (
          <div key={item.id} className={`row-wrapper ${index % 2 === 0 ? 'highlight' : ''}`}>
            <div className="row">
              <div className="rc">{formatStatus(item)}</div>
              <div className="rc">{filesize(item.processed || 0)} / {filesize(item.total)}</div>
              <div className="rc"><a href={`mailto:${item.email}`}>{item.fullname}</a></div>
              <div className="rc">{formatDateTimeString(item.request_date)}</div>
            </div>
            <div className="rc" dangerouslySetInnerHTML={{__html: highlight(item.status)}} />

          </div>
        )
      })}
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.object
};

export default DataTable;
