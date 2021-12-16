

// Database validations ------------------------------------------------------------------------

// This must be used on every database query that returns a user document, please extend with more sensitive data

const projectionDefaults = {
  _id: 1, 
  publicKey: 0,
}

const extendDefaultProjections = (projection) => ({ ...projection, _id: 1, publicKey: 0 });

// Visibility Validations -----------------------------------------------------------------------

/*
A visibility rule is an array of objects that creates a filter for queries that returns a DevLand Post.
It has the following structure:
[
  {
    field: 'fieldName',
    validation: 'validationFunction' | 'inlineConditional' | default: is field value Equal to value,
    value: 'fieldValue'
  }
]
*/

class Rule {
  constructor(rules) {
    this.rules = rules;
    if (!rules.length) throw new Error('Rule must have at least one rule');
    this.rules.forEach(rule => this.ensureRuleSchema(rule));
  }

  *validate(doc) {
    for (let rule of this.rules) {
      let value = rule.value;
      if (!rule.validation) yield doc[rule.field] === value;
      if (typeof rule.validation === 'function') yield rule.validation(doc[rule.field], value);
      if (typeof rule.validation === 'string') yield rule.validation === doc[rule.field];
    }
  }
  
  updateRules(rules) {
    this.rules = rules;
    this.rules.forEach(rule => this.ensureRuleSchema(rule));
  }

  ensureRuleSchema(rule) {
    if (!rule.field) throw new Error('Rule must have a field');
    if (!rule.validation) throw new Error('Rule must have a validation');
    if (!rule.value) throw new Error('Rule must have a value');
  }
}
