/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {loadClientModules} from '../clientModules';
import type {LoadedPlugin} from '@docusaurus/types';

const pluginEmpty: LoadedPlugin = {
  name: 'plugin-empty',
  path: __dirname,
};

const pluginFooBar: LoadedPlugin = {
  name: 'plugin-foo-bar',
  path: __dirname,
  getClientModules() {
    return ['foo', 'bar'];
  },
};

const pluginHelloWorld: LoadedPlugin = {
  plugin: 'plugin-hello-world',
  path: __dirname,
  getClientModules() {
    return [
      // Absolute path
      '/hello',
      'world',
    ];
  },
};

describe('loadClientModules', () => {
  it('loads an empty plugin', () => {
    const clientModules = loadClientModules([pluginEmpty]);
    expect(clientModules).toMatchInlineSnapshot(`[]`);
  });

  it('loads a non-empty plugin', () => {
    const clientModules = loadClientModules([pluginFooBar]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/bar",
      ]
    `);
  });

  it('loads multiple non-empty plugins', () => {
    const clientModules = loadClientModules([pluginFooBar, pluginHelloWorld]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/bar",
        "/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/world",
      ]
    `);
  });

  it('loads multiple non-empty plugins in different order', () => {
    const clientModules = loadClientModules([pluginHelloWorld, pluginFooBar]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/bar",
      ]
    `);
  });

  it('loads both empty and non-empty plugins', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld,
      pluginEmpty,
      pluginFooBar,
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/bar",
      ]
    `);
  });

  it('loads empty and non-empty in a different order', () => {
    const clientModules = loadClientModules([
      pluginHelloWorld,
      pluginFooBar,
      pluginEmpty,
    ]);
    expect(clientModules).toMatchInlineSnapshot(`
      [
        "/hello",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/world",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/foo",
        "<PROJECT_ROOT>/packages/docusaurus/src/server/__tests__/bar",
      ]
    `);
  });
});
