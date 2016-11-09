import React, { PropTypes } from 'react';
import * as roleMatcher from '../utils/roleMatcher';

class AuthorizedComponent extends React.Component {
  static propTypes = {
    routes: PropTypes.array.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    // this is placeholder for user roles (should be get during authentication)
    this.userRoles = undefined;

    // default path where to redirect when roles not match
    this.notAuthorizedPath = undefined;
  }

  componentWillMount() {
    // validate properties first
    this.validate();

    // when you use react-router, these should be set
    const {routes} = this.props;

    // check roles
    const routeRoles = roleMatcher.getFlatterRoles(routes);
    if (roleMatcher.rolesMatched(routeRoles, this.userRoles) === false) {
        this.handleUnauthorizedRole(routeRoles, this.userRoles);
    }
  }


    /**
     * The default implementation redirects user with inappropriate roles to {@link AuthorizedComponent.notAuthorizedPath}
     * @param routeRoles roles defending the route requested
     * @param userRoles roles of the user accessing the component
     */
    //noinspection JSUnusedLocalSymbols - the parameters may be used by subclasses
  handleUnauthorizedRole(routeRoles, userRoles){
    const {router} = this.context;
    router.push(this.notAuthorizedPath);
  }

  // validates required properties
  validate() {
    if (this.userRoles === undefined) {
      throw new Error('AuthorizedComponent: No user roles defined! Please define them in the constructor of your component.');
    }

    if (this.notAuthorizedPath === undefined) {
      throw new Error('AuthorizedComponent: No not authorized path defined! Please define it in the constructor of your component.');
    }
  }
}

export default AuthorizedComponent;
