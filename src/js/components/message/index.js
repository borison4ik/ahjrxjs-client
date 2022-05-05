export default class Message {
  constructor(object) {
    if (!typeof object === 'object') throw new Error('props can be object');
    this.id = object.id;
    this.from = object.from;
    this.subject = object.subject;
    this.body = object.body;
    this.received = object.received;
  }

  render() {
    return `<a href="#" id="${this.id}" class="list-group-item list-group-item-action active" aria-current="true">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${this.subject}</h5>
                <small>${this.received}</small>
              </div>
              <p class="mb-1">${this.body}</p>
              <small>от: ${this.from}</small>
            </a>`;
  }
}
