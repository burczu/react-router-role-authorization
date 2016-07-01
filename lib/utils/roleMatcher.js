import _ from 'lodash';

// gets all roles assigned to the current route (passed to the 'authorize' attribute in routing config)
export function getFlatterRoles(routeObjects) {
  return _.chain(routeObjects)
    .filter(item => item.authorize)
    .map(item => item.authorize)
    .flattenDeep()
    .union()
    .value();
}

// check if any user role matches any allowed role
export function rolesMatched(allowedRoles, userRoles) {
  return _.intersection(allowedRoles, userRoles).length > 0;
}

// checks if allowed roles are exactly the same as user roles
export function rolesMatchedExact(allowedRoles, userRoles) {
  return _.isEqual(allowedRoles, userRoles);
}