// Convert glob patterns to json projection

const projectionEngine = (globPatterns) => {
  const jsonProjection = {};
  globPatterns.forEach((globPattern) => {
    const path = globPattern.split('.')[0];
    const paths = path.split('/');
    let jsonProjectionKey = jsonProjection;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) {
        jsonProjectionKey[path] = 0;
      } else {
        jsonProjectionKey[path] = jsonProjectionKey[path] || {};
        jsonProjectionKey = jsonProjectionKey[path];
      }
    });
  });
  return jsonProjection;
};

/*

Each rule is a glob pattern like string that can be evaluated by the content rule engine and then converted to a json projection.
The json projection is used to filter the content and if a rule is matched, the content is filtered.

The projection is a json object where each key is a path and each value is either a 0 or a json object.

EXAMPLE:

const globs = [
  'profile/name',
  'profile/email',
  'profile/phone',
  'profile/address/street',
  'profile/address/city',
  'profile/address/state',
  'indexes/collaboration',
  'closes'
];

or

const globs2 = [
  'profile
]

or

const globs3 = [
  'profile/address/city'
]

console.log(projectionEngine(globs)); => {
  profile: {
    name: 0,
    email: 0,
    phone: 0,
    address: {
      street: 0,
      city: 0,
      state: 0
    }
  },
  indexes: {
    collaboration: 0
  },
  closes: 0
}
*/

// CreateFilter is a function that takes a jsonProjection and returns a function that van be reused and takes content to return the filtered content.

const createFilter = (jsonProjection) => {
  return (content) => {
    const contentProjection = {};
    const keys = Object.keys(content);
    keys.forEach((key) => {
      if (jsonProjection[key] !== 0) {
        if (typeof jsonProjection[key] === 'object') {
          // scan all subkeys
          if (Array.isArray(content[key])) {
            contentProjection[key] = [];
            content[key].forEach((subKey, i) => {
              if (jsonProjection[key][i] !== 0) {
                contentProjection[key].push(subKey);
                if (typeof jsonProjection[key][i] === 'object') {
                  contentProjection[key][i] = createFilter(jsonProjection[key][i])(subKey);
                }
              }
            });
          } else {
            contentProjection[key] = {};
            const subKeysProjection = createFilter(jsonProjection[key]);
            contentProjection[key] = subKeysProjection(content[key]);
          }
        } else {
          contentProjection[key] = content[key];
        }
      }
    });
    return contentProjection;
  };
};

// Since all content is public the principle is that the content is filtered by rules, and the user can choose what to hide.
// CreateFilter is used to create a filter from a json projection tha can hide fields of the content.
//It is meant to be used with a projection generated from the projectionEngine function with a user given input and the final output will hide field based on binary representation where 0 is used to hide and 1 or undefined will stay.

// Content rules middleware

export const contentRulesMiddleware = (req, res, next) => {
  const { content } = req.payload;
  const { rules } = content.config;
  if (!rules) {
    return next();
  }
  const jsonProjection = projectionEngine(rules);
  const filter = createFilter(jsonProjection);
  req.payload.content = filter(content);
  return next();
};
