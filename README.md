[![npm version](https://badge.fury.io/js/react-router-role-authorization.svg)](https://badge.fury.io/js/react-router-role-authorization)
[![GitHub issues](https://img.shields.io/github/issues/burczu/react-router-role-authorization.svg)](https://github.com/burczu/react-router-role-authorization/issues)
[![GitHub forks](https://img.shields.io/github/forks/burczu/react-router-role-authorization.svg)](https://github.com/burczu/react-router-role-authorization/network)
[![GitHub stars](https://img.shields.io/github/stars/burczu/react-router-role-authorization.svg)](https://github.com/burczu/react-router-role-authorization/stargazers)

# Role-based authorization for react-router

React-Router Role Authorization is a library which can help you in controlling the access to specific routes depending on given user roles.

*This is an implementation of the approach I previously described in my blog post: [Role-based authorization using React-Router](http://frontendinsights.com/role-based-authorization-using-react-router/)*

## Installation

This library is available as a NPM package, so you can install it as you would any other package:

```
npm install --save-dev react-router-role-authorization
```

## Usage

React-Router Role Authorization library provides two React components: `AuthorizedComponent` and `RoleAwareComponent`. Please see below their purpose and how to utilize them in your application.

### AuthorizedComponent

Thanks to `AuthorizedComponent` you can handle access to the route only for specific user roles. To do that, first you have to configure your routes:

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

As you can see, all you have to do is to add the `authorize` attribute to the main routes of your application. By passing an array of user role names to this attribute, you can define which user roles make this route available.

Additionally you should define a "not found" route which is not restricted by any user role. This will be the place where the user will be redirected to if he will try to access an unavailable route.

The second thing you have to do is to use the `AuthorizedComponent`. As an example, let's take a look at the sample route configuration above and consider the `RestrictedContainer` component which is related to the `/restricted` route path. As you can see it is restricted by the `admin` user role:

```JavaScript
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

Ok, so all you have to do to make it work is to inherit the `RestrictedContainer` component from `AuthorizedComponent` and set up two properties inside the constructor of the component.

The `this.userRoles` property should hold an array of user role names (array of strings - e.g. `['admin', 'mod']`) which are usually obtained during the authentication process and are usually held in a suitable cookie (`Cookies.get('user').roles` is only an example - you can handle it however you like but basically it should return an array of user role names).

The `this.notAuthorizedPath` property is intended to be set to the path name of the route where the user will be redirected in case of no access.

And that's it - from now on, all child routes of the `RestrictedContainer` component will be restricted by the `admin` user role.

#### Custom handling of unauthorized access

By default when a user with insufficient roles tries to access a component he is redirected to `notAuthorizedPath` 
defined in `AuthorizedComponent`. Sometimes you may want to, for example, log it to console etc.

You can achieve it by overriding method `handleUnauthorizedRole(routeRoles, userRoles)` from 
`AuthorizedComponent`. 

```JavaScript
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
  
  handleUnauthorizedRole(routeRoles, userRoles){
    // handle unsuccessful authorization somehow
    console.log(`Route is available for roles: ${routeRoles}, but your roles are: ${userRoles}...`);
    
    // you should still redirect somewhere else if you want to prevent from accessing the restricted route ...
    // ... or just use the default behaviour by calling `super.handleUnauthorizedRole()`
    const { router } = this.context;
    router.push('/');
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

**WARNING!** Be careful - if you override the `handleUnauthorizedRole` method, it will stop redirecting to the `notAuthorizedPath` path. Instead, it will allow access to the restricted route so you have to prevent it on your own (by redirecting somewhere manually or calling `super.handleUnauthorizedRole()` to use the default behaviour).

### RoleAwareComponent

The `RoleAwareComponent` component gives you the ability to show or hide the component depending on given user roles.

Its usage is very simple and similar to the `AuthorizedComponent` component:

```JavaScript
import React from 'react';
import { RoleAwareComponent } from 'react-router-role-authorization';
import Cookies from 'js-cookie';

class BoxOne extends RoleAwareComponent {
  constructor(props) {
    super(props);

    this.allowedRoles = ['user'];
    this.userRoles = Cookies.get('user').roles;
  }

  render() {
    const jsx = (
      <div>
        Box One
      </div>
    );

    return this.rolesMatched() ? jsx : null;
  }
}

export default BoxOne;
```

The `BoxOne` component inherits from the `RoleAwareComponent` component. And again, the whole setup is done inside the constructor - `this.allowedRoles` is an array of user role names which make this component visible; `this.userRoles` is an array of user role names which the user has.

But this is not all. The component provides two methods: `this.rolesMatched` and `this.rolesMatchedExact` which can be used inside the `render` method of the component:

- `this.rolesMatched` finds the intersection of the two arrays and returns `true` if at least one of the user roles is present among the available roles.
- `this.rolesMatchedExact` checks if the available roles array has exactly the same items as the user roles array.

As you can see in the example above, you can use one of these methods to return the markup of the component or just `null`.

