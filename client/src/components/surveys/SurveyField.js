// SurveyField contains logic to render a single label and text input
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {/* if touched is true then show the error*/}
        {touched && error}
      </div>
      <input {...input} style={{ marginBottom: '5px' }} />
    </div>
  );
};
