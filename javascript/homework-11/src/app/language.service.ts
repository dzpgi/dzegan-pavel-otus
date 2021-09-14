import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

// Имитация сервера

export class LanguageService {

    constructor() { }
    languages: Record<string, string>[] = [
        { code: 'rus', name: 'Русский'},
        { code: 'eng', name: 'English'}
    ]
    dictionary: Record<string, string>[] = [
        { rus: 'привет',     eng: 'hello'},
        { rus: 'мир',        eng: 'word'},
        { rus: 'кот',        eng: 'cat'},
        { rus: 'собака',     eng: 'dog'},
        { rus: 'попугай',    eng: 'parrot'},
        { rus: 'категория',  eng: 'category'},
        { rus: 'привидение', eng: 'ghost'},
        { rus: 'древесина',  eng: 'wood'},
        { rus: 'собрание',   eng: 'meeting'},
        { rus: 'карта',      eng: 'map'},
    ]

    // Задержка ответа сервера
    private rnd (): number {
        return Math.floor((Math.random()*2000 + 0))
    }
    // Добавляет новое слово в общий список
    applyNewText(sysLanguage: string, sysText: string, userLanguage: string, userText: string): Promise<any>{
        const me = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function(sysLanguage: string, sysText: string, userLanguage: string, userText: string, dictionary: Record<string, string>[]) {
                if (!sysLanguage || !sysText || !userLanguage || !userText) {
                    resolve(false)
                    return
                }
                let word: Record<string, string>|undefined = dictionary.find(function(record) {
                    return (record[sysLanguage] as string).toLocaleLowerCase().trim() === sysText.toLocaleLowerCase().trim()? true: false
                })
                if (word) {
                    (word as Record<string, string>)[userLanguage] = userText
                } else {
                    word = {}
                    word[sysLanguage] = sysText
                    word[userLanguage] = userText
                    dictionary.push(word)
                }
                resolve(true)
            }, 0, sysLanguage, sysText, userLanguage, userText, me.dictionary)
        })
        return request
    }
    // Проверяет есть ли в словаре необходимое слово
    checkText(sysLanguage: string, sysText: string, userLanguage: string, userText: string): Promise<any> {
        const me = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function() {
                const word: Record<string, string>|undefined = me.dictionary.find(function(record) {
                    return (record[sysLanguage] as string).toLocaleLowerCase().trim() === sysText.toLocaleLowerCase().trim()
                })
                const result = word && (word[userLanguage] as string).toLocaleLowerCase().trim() === userText.toLocaleLowerCase().trim()? true: false
                resolve(result)
            }, me.rnd())
        })
        return request
    }
    // Возвращает полный список известных слов
    getDictionary(): Promise<any> {
        const me = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(me.dictionary)
            }, me.rnd())
        })
        return request
    }
    // Возвращает список возможных языков
    getLanguages(): Promise<any> {
        const service = this
        const request = new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(service.languages)
            }, service.rnd())
        })
        return request
    }
    // Возвращает список похожил слов
    getSimilarDictionary(sysLanguage: string, sysText: string, userLanguage: string, userText?: string): Promise<any> {
        const me = this
        const wait = me.rnd()
        const request = new Promise(function(resolve, reject) {
            setTimeout(function() {
                if ((!sysLanguage && sysText) || (!userLanguage && userText)) {
                    resolve(false)
                    return
                }
                const result = me.dictionary.filter(function(word) {
                    const similarSys  = !sysText  || word[sysLanguage ].toLocaleLowerCase().trim().indexOf(sysText.toLocaleLowerCase( ).trim()) > -1? true: false
                    const similarUser = !userText || word[userLanguage].toLocaleLowerCase().trim().indexOf(userText.toLocaleLowerCase().trim()) > -1? true: false
                    return similarSys && similarUser
                })
                resolve(result)
            }, 0) // Отправляем ответ сразу, для удобства демонстранции rxjs
        })
        return request
    }
}