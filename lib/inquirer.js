const emptyStringValidate = function (input) {
  const done = this.async();
  if (typeof input === 'string') {
    if (input === '') {
      done(`input should not be empty !!!`);
    }
  }

  done(null, true);
};

const init_questions = [
  {
    type: 'string',
    name: 'region',
    validate: emptyStringValidate,
  },
  {
    type: 'string',
    name: 'accessKeyId',
    validate: emptyStringValidate,
  },
  {
    type: 'string',
    name: 'accessKeySecret',
    validate: emptyStringValidate,
  },
  {
    type: 'string',
    name: 'bucket',
    validate: emptyStringValidate,
  },
  {
    type: 'string',
    name: 'prefix',
    validate: emptyStringValidate,
  },
  {
    type: 'string',
    name: 'url_prefix',
    validate: emptyStringValidate,
  },
];

module.exports = {
  init_questions,
};
