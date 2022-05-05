import { ajax } from 'rxjs/ajax';
import { EMPTY, map, catchError, of, switchMap, interval, tap } from 'rxjs';

import Message from './components/message';
import formatTime from './utils/formatTime';
import formatSubject from './utils/formatSubject';

import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../css/style.scss';

window.onload = () => {
  const listGroup = document.getElementById('list-group');
  listGroup.addEventListener('click', (evt) => {
    const parent = evt.target.closest('.list-group-item');
    if (parent.classList.contains('active')) parent.classList.remove('active');
  });

  const intervalStream$ = interval(5000).pipe(
    tap((v) => console.log(v)),
    switchMap((v) => {
      return ajax.getJSON('http://localhost:7070/messages/unread').pipe(
        catchError((error) => {
          console.log('error: ', error.message);
          return EMPTY;
        })
      );
    }),
    map((response) => {
      console.log(response);
      return response.messages;
    })
  );

  intervalStream$.subscribe({
    next: (messages) => addMessages(messages),
    error: (err) => console.log('err', err),
  });

  function addMessages(messages) {
    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach((message) => {
        const newMessage = new Message({
          ...message,
          received: formatTime(message.received),
          subject: formatSubject(message.subject),
        });
        listGroup.insertAdjacentHTML('afterbegin', newMessage.render());
      });
    }
  }
};
