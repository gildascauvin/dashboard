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

  startLoading() {
  	if (!this.isLoading) {
  		this.isLoading = true;
	  	let timer = setTimeout(() => {
	  		this.isLoading = false;
	  		clearTimeout(timer);
	  	}, 3000);
  	}
  }
}
