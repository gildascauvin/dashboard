export class FormCore {
  errorMessage: string = '';
  isErrorMessage: boolean = false;

  isLoading: boolean = false;

  showErrorMessage() {
    this.isErrorMessage = true;
  }

  hideErrorMessage() {
    this.isErrorMessage = false;
  }
}
