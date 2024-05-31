
export class Patterns{
  private pattern : RegExp;
  static DNI_PATTERN = new Patterns(/^\d{8,9}$/);
  static NAME_PATTERN = new Patterns(/^[\p{Letter}\s]+$/um);
  static DESCRIPTION_PATTERN = new Patterns(/^[\p{Letter}\s\p{P}]+$/um);
  static DIRECTION_PATTERN = new Patterns(/^[\p{Letter}\s\p{P}\d]+$/um);
  static PHONE_PATTERN = new Patterns(/^9\d{8}$/);
  static PASSWORD_PATTERN = new Patterns(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,16}$/);

  constructor(pattern: RegExp){
    this.pattern = pattern;
  }

  getPattern(){
    return this.pattern;
  }
}
