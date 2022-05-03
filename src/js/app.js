import { ajax } from 'rxjs/ajax';
import { map, catchError, of, switchMap, interval } from 'rxjs';

import Message from './components/message';
import formatTime from './utils/formatTime';
import formatSubject from './utils/formatSubject';

import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../css/style.scss';

window.onload = () => {
  const listGroup = document.getElementById('list-group');

  // const intervalStream$ = ajax('http://localhost:7070/messages/unread').pipe(
  //   map((response) => {
  //     console.log('response: ', response.response);
  //     const { messages, status, timestamp } = response.response;
  //     if (status === 'ok') {
  //       const newMessage = new Message({
  //         id: '1',
  //         from: 'mail@mail.ru',
  //         subject: 'Тема письма',
  //         body: 'lorem ipsum dolor sit am',
  //         received: '18:40 03.20.2018',
  //       });
  //       listGroup.insertAdjacentHTML('afterbegin', newMessage.render());
  //     }
  //   }),
  //   catchError((error) => {
  //     console.log('error: ', error);
  //     return of(error);
  //   })
  // );

  const intervalStream$ = interval(5000).pipe(
    switchMap((v) => ajax('http://localhost:7070/messages/unread')),
    map((response) => response.response.messages),
    catchError((error) => {
      console.log('error: ', error);
      return of(error);
    })
  );

  intervalStream$.subscribe({
    next: (messages) => addMessages(messages),
    error: (err) => console.log(err),
  });

  function addMessages(messages) {
    listGroup.innerHTML = '';
    messages.forEach((message) => {
      const newMessage = new Message({
        ...message,
        received: formatTime(message.received),
        subject: formatSubject(message.subject),
      });
      listGroup.insertAdjacentHTML('afterbegin', newMessage.render());
    });
  }
};
