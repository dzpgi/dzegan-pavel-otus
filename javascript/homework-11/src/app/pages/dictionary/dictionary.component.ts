import { Component, OnInit } from '@angular/core'
import { from } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators'
import { FormControl } from '@angular/forms'

import { ContextService } from '../../context.service'
import { LanguageService } from '../../language.service'


interface AppState {
  count: number;
}

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {

  constructor(private service: LanguageService, private ctx: ContextService) { }

  languages: Record<string, string>[] = []
  newSysLanguage: string = 'eng'
  newUserLanguage: string = 'rus'
  newSysText: string = ''
  newUserText: string = ''
  similarDictionary: any[] = []
  loading = true
  newSysTextFC: FormControl = new FormControl('')
  newUserTextFC: FormControl = new FormControl('')

  ngOnInit(): void {
    const me = this
    me.loadLanguages()
    me.loadSimilarDictionary() // Словарь с похожими словами на вверенные

    // Отслеживаем поток входных символов "левого" слова на вкладке "Добавление слов"
    me.newSysTextFC.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // В фильтре нет смысла, просто пример
      filter(function(text) {return text.length > -1}),
      switchMap(function(text: string) {
        return from(me.service.getSimilarDictionary(me.newSysLanguage, text, me.newUserLanguage, me.newUserText))
      })
    )
    .subscribe(function(result) {
      me.similarDictionary = result
    })

    // Отслеживаем поток входных символов "правого" слова на вкладке "Добавление слов"
    me.newUserTextFC.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // В фильтре нет смысла, просто пример
      filter(function(text) {return text.length > -1}),
      switchMap(function(text: string) {
          return from(me.service.getSimilarDictionary(me.newSysLanguage, me.newSysText, me.newUserLanguage, text))
      })
    )
    .subscribe(function(result) {
      me.similarDictionary = result
    })
  }

  // Загрузка доступных языков
  async loadLanguages(): Promise<void> {
    const result = this.ctx.languages && this.ctx.languages.length > 0 ? this.ctx.languages : await this.service.getLanguages()
    this.languages = result
    this.ctx.languages = result
    this.loading = false
  }

  // Загрузка списка похожих слов
  async loadSimilarDictionary(): Promise<void> {
    const result = await this.service.getSimilarDictionary(this.newSysLanguage, this.newSysText, this.newUserLanguage, this.newUserText)
    this.similarDictionary = result
  }

  // Добавление нового слова в общий словарь
  async applyNewText(): Promise<void> {
    const result = await this.service.applyNewText(this.newSysLanguage, this.newSysText, this.newUserLanguage, this.newUserText)
    if (!result) alert('Не удалось сохранить слово в справочнике!')
    this.loadSimilarDictionary()
  }


}
