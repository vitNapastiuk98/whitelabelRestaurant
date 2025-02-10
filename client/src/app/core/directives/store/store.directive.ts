import {Directive, inject, input, InputSignal, OnInit, Signal, TemplateRef, ViewContainerRef} from '@angular/core';

export interface StoreContext<T> {
  $implicit: Signal<T>;
  appStore: Signal<T>
}

@Directive({
  selector: '[appStore]'
})
export class StoreDirective<T> implements OnInit {

  readonly appStore = input<T>();

  context: StoreContext<T> = {
    $implicit: this.appStore as InputSignal<T>,
    appStore: this.appStore as InputSignal<T>
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<StoreContext<T>>
  ) {}

  ngOnInit() {
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);
  }

}
