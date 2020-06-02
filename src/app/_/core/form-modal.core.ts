export class FormModalCore {
  isLoading: boolean = false;

  startLoading() {
  	if (!this.isLoading) {
  		this.isLoading = true;
	  	let timer = setTimeout(() => {
	  		this.isLoading = false;
	  		clearTimeout(timer);
	  	}, 2000);
  	}
  }
}
