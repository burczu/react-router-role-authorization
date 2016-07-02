# Role-based authorization component for react-router

React-Router Role Authorization is a library which can help you in controlling access to specific routes depending on given user roles.

## Installation

This library is available as a NPM package, so you can install it as any other package:

```
npm install --save-dev react-router-role-authorization
```

## Usage

React-Router Role Authorization library provides two React components: `AuthorizedComponent` and `RoleAwareComponent`. Please see below what is their purpose and how to utilize them in your application.

### AuthorizedComponent

Thanks to `AuthorizedComponent` you can handle access to the route only for specific user roles. To do that, at first you have to configure your routes:

```JSX
ReactDOM.render((
  <Router history={browserHistory}>
    <Route component={AppContainer} path="/">
      <IndexRoute authorize={['user', 'admin']} component={HomeComponent} />
      <Route authorize={['admin']} component={RestrictedContainer}>
        <Route component={RestrictedPageComponent} path="/restricted" />
      </Route>
    </Route>
    <Route component={NotFoundComponent} path="/not-found" />
  </Router>
), document.getElementById('app'));
```

As you can see, all you have to do is to add the `authorize` attribute to the main routes of your application. By using passing an array of user role names to this attribute, you can define which user roles make this route available.

Additionally you should define a "not found" route which is not restricted by any user role. This will be the place where the user will be redirected if he would try to access an unavailable route.

The second thing you have to do is the use of the `AuthorizedComponent`. As an example, let's take a look on the sample route configuration above and consider the `RestrictedContainer` component which is related to the `/restricted` route path. As you can see it is restricted by the `admin` user role:

```JSX
import React from 'react';
import RouteHandler from './RouteHandler';
import { AuthorizedComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class RestrictedContainer extends AuthorizedComponent {
  constructor(props) {
    super(props);

    this.userRoles = Cookies.get('user').roles;
    this.notAuthorizedPath = '/not-found';
  }

  render() {
    return (
      <div>
        <RouteHandler {...this.props} />
      </div>
    );
  }
}

export default RestrictedContainer;
```

Ok, so make everything working, all you have to do is to inherit the `RestrictedContainer` component from `AuthorizedComponent` and set up two properties inside the constructor of the component.

The `this.userRoles` property should hold user roles which are usually obtained during the authentication process and are usually hold in the suitable cookie (`Cookies.get('user').roles` is only the example - you can handle it whatever you like, but basically it should return an array of user role names).

The `this.notAuthorizedPath` property is intended to be set to the path name of the route where the user should be redirected in case of no access.

And that's it - from now on, all child routes of the `RestrictedContainer` component will be restricted by the `admin` user role.