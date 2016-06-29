import React from 'react/addons';
import RoleAwareComponent from '../lib/RoleAwareComponent.react';

describe('ReactRouterRoleAuthorization', function() {
  var component;

  beforeEach(function() {
    component = React.addons.TestUtils.renderIntoDocument(
      <RoleAwareComponent />
    );
  });

  it('should render', function() {
    expect(component.getDOMNode().className).toEqual('role-aware-component');
  });
});
