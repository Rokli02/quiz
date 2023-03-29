export type SnackbarType = 'success' | 'error' | '';

let timerId: NodeJS.Timeout | undefined;
export const setMessage = (text: string, type: SnackbarType = '') => {
  var x = document.getElementById("snackbar");

  if (x === null) return;

  x.className = `show ${type}`;
  x.textContent = text;

  if (timerId) {
    clearTimeout(timerId);
    timerId = undefined;
  }
  timerId = setTimeout(function(){ x!.className = x!.className.replace('show', ''); }, 3000);
}