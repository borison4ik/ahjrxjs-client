export default function formatSubject(subject) {
  return `${String(subject).trim().slice(0, 15)}...`;
}
