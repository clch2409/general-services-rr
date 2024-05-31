class Patterns{

  static NAME_PATTERN = new Patterns(/^[\p{L}\s]+$/um);
  static DESCRIPTION_PATTERN = new Patterns(/^[\p{L}\s\p{P}]+$/um);
  static DIRECTION_PATTERN = new Patterns(/^[\p{L}\p{P}\d\s]+$/um);
  static PHONE_PATTERN = new Patterns(/^9\d{8}$/);
  static DNI_PATTERN = new Patterns(/^\d{8,9}$/);
  static PASSWORD_PATTERN = new Patterns(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,16}$/);

  constructor(pattern){
    this.pattern = new RegExp(pattern);
  }

}

module.exports = Patterns;
