import React from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';

const TabNavigation = ({ tabs, activeTab, setTab }) => {
  const makeTab = (key) => {
    const tab = tabs[key];
    return (<Tab
      key={key} isActive={activeTab === tab.id}
      tab={tab} setViewer={setTab}
    />);
  };

  const resolveactiveTab = () => tabs[activeTab].view;

  return (
    <div className="si-tab-navigation flex-column">
      <div className="si-nav">
        <div className="si-group" role="tablist">
          {Object.keys(tabs).map(makeTab)}
        </div>
      </div>
      <div className="si-tab-content flex-column">
        {resolveactiveTab()}
      </div>
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  tabs: PropTypes.objectOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    view: PropTypes.element.isRequired,
  })).isRequired,
  setTab: PropTypes.func.isRequired,
};

export default TabNavigation;
