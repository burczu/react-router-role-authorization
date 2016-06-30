import React  from 'react';
import _ from 'lodash';

class RoleAwareComponent extends React.Component {
  constructor(props) {
    super(props);

    // roles for which the component should be visible
    this.authorize = undefined;

    // roles of the user - usually fetched during authentication
    this.userRoles = undefined;
  }

  shouldBeVisible() {
    return _.intersection(this.authorize, this.userRoles).length > 0;
  }

  shouldBeVisibleExact() {
    return _.isEqual(this.authorize, this.userRoles);
  }
}

export default RoleAwareComponent;
