/* eslint-disable */
import * as roleMatcher from '../lib/utils/roleMatcher';

describe('roleMatcher', function() {

  it('should flatten roles properly', () => {
    const flattenRoles = roleMatcher.getFlatterRoles([
      { authorize: ['admin', 'mod', 'user'] },
      { authorize: ['admin', 'user'] },
      { authorize: ['admin'] },
      { authorize: ['mod', 'user'] },
      { authorize: ['user'] }
    ]);
    expect(flattenRoles).toEqual(['admin', 'mod', 'user']);
  });

  it('should return true if roles matching', () => {
    expect(roleMatcher.rolesMatched(['admin'], ['mod', 'admin'])).toBe(true);
  });

  it('should return false if roles not matching', () => {
    expect(roleMatcher.rolesMatched(['admin'], ['mod', 'user'])).toBe(false);
  });

  it('should return true if roles matching exact', () => {
    expect(roleMatcher.rolesMatchedExact(['admin'], ['admin'])).toBe(true);
  });

  it('should return false if roles not matching exact', () => {
    expect(roleMatcher.rolesMatchedExact(['admin'], ['admin', 'mod'])).toBe(false);
  });

});
