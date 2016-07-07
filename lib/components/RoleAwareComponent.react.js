import React  from 'react';
import * as roleMatcher from '../utils/roleMatcher';

class RoleAwareComponent extends React.Component {
  constructor(props) {
    super(props);

    // roles for which the component should be visible
    this.allowedRoles = undefined;

    // roles of the user - usually fetched during authentication
    this.userRoles = undefined;
  }

  // checks if allowed roles and user roles have any common part
  rolesMatched() {
    this.validate();
    return roleMatcher.rolesMatched(this.allowedRoles, this.userRoles);
  }

  // checks if allowed roles are exactly the same as user roles
  rolesMatchedExact() {
    this.validate();
    return roleMatcher.rolesMatchedExact(this.allowedRoles, this.userRoles);
  }

  validate() {
    if (this.allowedRoles === undefined) {
      throw new Error('RoleAwareComponent: No allowed roles defined! Please define them in the constructor of your component.');
    }

    if (this.userRoles === undefined) {
      throw new Error('RoleAwareComponent: No user roles defined! Please define them in the constructor of your component.');
    }
  }
}

export default RoleAwareComponent;
