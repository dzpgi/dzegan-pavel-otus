import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    records: Record<string, string>[] = []

    @Input() set data(value: Record<string, string>[]) {
        if (value) this.records = value
    }
    @Input() value: string = ''
    @Output() valueChange = new EventEmitter<string>()
    @Output('changed') changeEmitter = new EventEmitter<string>()

    constructor() { }

    ngOnInit(): void { }

    onChangeValue(event: Event): void {
        if (!event || !event.target) return
        const value = (event.target as HTMLInputElement).value
        // Сокращенное объявление компонента (двусторонее связывание)
        this.valueChange.emit(value)
        // Развернутое объявление для кастомного обработчика события "changed"
        console.log('fffffffff')
        this.changeEmitter.emit((event.target as HTMLInputElement).value)
    }

}