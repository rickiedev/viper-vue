export interface ITestView {
  showMessage(msg: string): void;
}

export class TestPresenter {
  private view: ITestView;

  constructor(view: ITestView) {
    console.log(view)
    this.view = view;
  }

  async showData() {
    const value = "value test";
    this.view.showMessage(value);
  }
}
