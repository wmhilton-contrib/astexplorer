import defaultParserInterface from './utils/defaultPHPParserInterface';
import pkg from 'php-parser/package.json';
import React from 'react';
import SettingsRenderer from '../utils/SettingsRenderer';

const ID = 'php-parser';

const formatOptions = (opts) => ({
  parser: {
    debug: opts.debug,
    extractDoc: opts.extractDoc,
    suppressErrors: opts.suppressErrors,
  },
  lexer: {
    asp_tags: opts.asp_tags,
    short_tags: opts.short_tags,
  },
  ast: {
    withPositions: opts.withPositions,
    withSource: opts.withSource,
  }
});

const defaultOptions = {
  debug: false,
  extractDoc: true,
  suppressErrors: false,
  asp_tags: false,
  short_tags: false,
  withPositions: true,
  withSource: true,
};

const settingsConfiguration = {
  fields: [
    'debug',
    'extractDoc',
    'suppressErrors',
    'asp_tags',
    'short_tags',
    'withPositions',
    'withSource',
  ],
};


export default {
  ...defaultParserInterface,

  id: ID,
  displayName: ID,
  version: pkg.version,
  homepage: pkg.homepage || 'https://www.npmjs.com/package/php-parser',
  locationProps: new Set(['loc', 'start', 'end']),

  loadParser(callback) {
    require(['php-parser'], callback);
  },

  parse(PhpParser, code, parserSettings) {
    let options = formatOptions({...defaultOptions, ...parserSettings})
    let parser = new PhpParser(options)
    return parser.parseCode(code)
  },

  nodeToRange(node) {
    let loc = node.loc
    if (!loc) return;
    return [loc.start.offset, loc.end.offset];
  },

  opensByDefault(node, key) {
    return (
      node.kind === 'program' ||
      key === 'what' ||
      key === 'children' ||
      key === 'body'
    );
  },

  _ignoredProperties: new Set([]),

  renderSettings(parserSettings, onChange) {
    return (
      <div>
        <p>
          <a
            href="https://github.com/glayzzle/php-parser/wiki/Options"
            target="_blank">
            Option descriptions
          </a>
        </p>
        <SettingsRenderer
          settingsConfiguration={settingsConfiguration}
          parserSettings={{...defaultOptions, ...parserSettings}}
          onChange={onChange}
        />
      </div>
    );
  },
};
