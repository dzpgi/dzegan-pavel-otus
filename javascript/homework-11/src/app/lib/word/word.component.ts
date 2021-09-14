import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ValidatorFn, ValidationErrors, AbstractControl  } from '@angular/forms';

@Component({
    selector: 'app-word',
    templateUrl: './word.component.html',
    styleUrls: ['./word.component.css']
})
export class WordComponent implements OnInit {

    @Input() value: string = ''
    @Output() valueChange = new EventEmitter<string>()

    input = new FormControl('', [
            this.checkType(),
            this.checkSingleWord()
        ]
    )

    constructor() {
        const cmp = this
        cmp.input.valueChanges.subscribe(function(value) {
            cmp.valueChange.emit(value)
        })
    }

    ngOnInit(): void { }

    checkType (): ValidatorFn {
        return function (ctrl: AbstractControl): ValidationErrors|null {
            const value = ctrl.value.trim()
            const valid = !value || /^([a-zа-яё]+)$/i.test(value)
            return !valid? {typeError: 'Разрешено вводить только буквы!'}: null
        }
    }
    checkSingleWord (): ValidatorFn {
        return function (ctrl: AbstractControl): ValidationErrors|null {
            const value = ctrl.value.trim()
            const valid = !value || !/\s/g.test(value)
            return !valid? {singleWordError: 'Ввод нескольких слов запрещен!'}: null
        }
    }

}