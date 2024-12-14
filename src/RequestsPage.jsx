import React from 'react';
import './RequestsPage.css'
import Request_Page_List from "../Request_Page_List"

const RequestsPage = () => {
  return (
    <div className="requests-page-container">
      <h1>Your Requests Dashboard</h1>
      <Request_Page_List />
    </div>
  );
};

export default RequestsPage;
