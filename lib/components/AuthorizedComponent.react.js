import React, { PropTypes } from 'react';
import _ from 'lodash';

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
    if (this.userRoles === undefined) {
      throw new Error('AuthorizedComponent: No user roles defined! Please define them in the constructor of your component.');
    }
    
    if (this.notAuthorizedPath === undefined) {
      throw new Error('AuthorizedComponent: No not authorized path defined! Please define it in the constructor of your component.');
    }

    // when you use react-router, these should be set
    const { routes } = this.props;
    const { router } = this.context;

    // check roles
    const routeRoles = _.chain(routes)
      .filter(item => item.authorize)
      .map(item => item.authorize)
      .flattenDeep()
      .value();

    if (_.intersection(routeRoles, this.userRoles).length === 0) {
      router.push(this.notAuthorizedPath);
    }
  }
}

export default AuthorizedComponent;